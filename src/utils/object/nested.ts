import {
  CompletionItem,
  CompletionItemKind,
  Monaco,
  MonacoContext,
} from '../../types/common';
import {ObjectNestedCompletionItems} from '../../types/object/nested';

/**
 * Determines the CompletionItemKind based on the type of the item.
 * @param {unknown} item - The item to determine the type for.
 * @param {boolean} isMember - Whether the item is a member of an object.
 * @param {Monaco} monaco - The Monaco editor instance.
 * @returns {CompletionItemKind} The determined CompletionItemKind.
 */
export const getType = (
  item: unknown,
  isMember: boolean = false,
  monaco: Monaco,
): CompletionItemKind => {
  switch (typeof item) {
    case 'object':
      return item === null
        ? monaco.languages.CompletionItemKind.Value
        : monaco.languages.CompletionItemKind.Class;
    case 'function':
      return isMember
        ? monaco.languages.CompletionItemKind.Method
        : monaco.languages.CompletionItemKind.Function;
    default:
      return monaco.languages.CompletionItemKind.Variable;
  }
};

/**
 * Extracts the active typing from the given text, considering template expression delimiters.
 * @param {string} text - The text to extract the active typing from.
 * @param {string[]} templateExpressionDelimiters - Array of delimiters for template expressions.
 * @returns {string} The extracted active typing.
 */
export const getActiveTyping = (
  text: string,
  templateExpressionDelimiters: string[],
): string => {
  let activeTyping = text.split(' ').pop() || '';
  const possiblyInsideString = templateExpressionDelimiters.some(delimiter =>
    activeTyping.includes(delimiter),
  );

  if (possiblyInsideString) {
    let lastDelimiterIndex = -1;
    let lastDelimiterLength = 0;
    templateExpressionDelimiters.forEach(delimiter => {
      const index = activeTyping.lastIndexOf(delimiter);
      if (index > lastDelimiterIndex) {
        lastDelimiterIndex = index;
        lastDelimiterLength = delimiter.length;
      }
    });

    if (lastDelimiterIndex >= 0) {
      activeTyping = activeTyping.substring(
        lastDelimiterIndex + lastDelimiterLength,
      );
    }
  }

  return activeTyping;
};

/**
 * Retrieves the current token from the object based on the active typing.
 * @param {ObjectNestedCompletionItems} items - The object to search for the token.
 * @param {string} activeTyping - The current active typing.
 * @returns {ObjectNestedCompletionItems} The current token or an empty object if not found.
 */
export const getCurrentToken = (
  items: ObjectNestedCompletionItems,
  activeTyping: string,
  isMember: boolean,
): ObjectNestedCompletionItems => {
  if (!isMember) return items;

  const objectHierarchy = getObjectHierarchy(activeTyping);
  let currentToken = items[objectHierarchy[0]];

  if (objectHierarchy.length === 0) {
    return {};
  }

  for (let i = 1; i < objectHierarchy.length; i++) {
    if (Object.hasOwn(currentToken, objectHierarchy[i])) {
      currentToken = currentToken[objectHierarchy[i]];
    } else {
      return {};
    }
  }

  return currentToken;
};

/**
 * Parses the active typing string and returns an array representing the object hierarchy.
 * Handles different types of delimiters used in the active typing.
 *
 * @param {string} activeTyping - The current active typing string.
 * @returns {string[]} An array representing the object hierarchy.
 */
export const getObjectHierarchy = (activeTyping: string): string[] => {
  // Helper function to split and join the active typing string based on the provided delimiters
  const splitAndJoin = (
    str: string,
    delimiterStart: string,
    delimiterEnd: string,
  ): string[] => {
    return str
      .split(delimiterStart)
      .join('.')
      .split(delimiterEnd)
      .join('.')
      .split('.')
      .filter(Boolean);
  };

  // Check for single quote delimiters and process accordingly
  if (activeTyping.includes("['")) {
    return splitAndJoin(activeTyping, "['", "']");
  }

  // Check for double quote delimiters and process accordingly
  if (activeTyping.includes('["')) {
    return splitAndJoin(activeTyping, '["', '"]');
  }

  // Default case: split by dot and remove the last character if it's a dot
  return activeTyping.slice(0, -1).split('.').filter(Boolean);
};

/**
 * Retrieves the current nested depth from the active typing.
 * @param {string} activeTyping - The current active typing.
 * @returns {number} The current nested depth.
 * @example
 * getCurrentNestedDepth('hello.world.super.nack.adipoli') // 4
 */
export const getCurrentNestedDepth = (activeTyping: string): number => {
  return activeTyping.split('.').length;
};

/**
 * Creates a CompletionItem based on the given property and value.
 * @param {string} property - The property name.
 * @param {any} value - The value of the property.
 * @param {boolean} isMember - Whether the property is a member of an object.
 * @param {MonacoContext} context - The Monaco editor context.
 * @returns {CompletionItem} The created CompletionItem.
 */
export const createCompletionItem = (
  property: string,
  value: any,
  isMember: boolean,
  context: MonacoContext,
): CompletionItem => {
  const {monaco} = context;
  let detailType = '';
  try {
    detailType = value.__proto__.constructor.name;
  } catch (e) {
    detailType = typeof value;
  }

  const completionItem = {
    label: property,
    kind: getType(value, isMember, monaco),
    detail: detailType,
    insertText: property,
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  } as CompletionItem;

  if (detailType.toLowerCase() === 'function') {
    completionItem.insertText += '($1) {\n\t$0\n}';
    completionItem.documentation = value.toString().split('{')[0];
  }

  return completionItem;
};
