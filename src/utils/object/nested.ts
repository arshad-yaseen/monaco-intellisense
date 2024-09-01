import {
  CompletionItem,
  CompletionItemKind,
  Monaco,
  MonacoContext,
} from '../../types/common';
import {ObjectNestedCompletionItems} from '../../types/object/nested';
import {computeInsertRange} from '../editor';

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
): ObjectNestedCompletionItems => {
  const isMember = activeTyping.charAt(activeTyping.length - 1) === '.';
  if (!isMember) return items;

  const objectHierarchy = activeTyping.slice(0, -1).split('.');
  let currentToken = items;

  for (const key of objectHierarchy) {
    if (Object.prototype.hasOwnProperty.call(currentToken, key)) {
      currentToken = currentToken[key];
    } else {
      return {};
    }
  }

  return currentToken;
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
  let detailType = '';
  try {
    detailType = value.__proto__.constructor.name;
  } catch (e) {
    detailType = typeof value;
  }

  const completionItem: CompletionItem = {
    label: property,
    kind: getType(value, isMember, context.monaco),
    detail: detailType,
    insertText: property,
    insertTextRules:
      context.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range: computeInsertRange(context.position, property),
  };

  if (detailType.toLowerCase() === 'function') {
    completionItem.insertText += '($0)';
    completionItem.documentation = value.toString().split('{')[0];
  }

  return completionItem;
};
