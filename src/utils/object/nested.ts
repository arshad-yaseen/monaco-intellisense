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
  if (item === null) return monaco.languages.CompletionItemKind.Value;
  if (typeof item === 'object')
    return monaco.languages.CompletionItemKind.Class;
  if (typeof item === 'function')
    return isMember
      ? monaco.languages.CompletionItemKind.Method
      : monaco.languages.CompletionItemKind.Function;
  return monaco.languages.CompletionItemKind.Variable;
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
  const activeTyping = text.split(' ').pop() || '';
  const lastDelimiterIndex = Math.max(
    ...templateExpressionDelimiters.map(d => activeTyping.lastIndexOf(d)),
  );
  return lastDelimiterIndex >= 0
    ? activeTyping.substring(lastDelimiterIndex + 1)
    : activeTyping;
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
  return objectHierarchy.reduce(
    (current, key) =>
      current && Object.hasOwn(current, key) ? current[key] : {},
    items,
  );
};

/**
 * Parses the active typing string and returns an array representing the object hierarchy.
 * Handles different types of delimiters used in the active typing.
 *
 * @param {string} activeTyping - The current active typing string.
 * @returns {string[]} An array representing the object hierarchy.
 */
export const getObjectHierarchy = (activeTyping: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inBracket = false;

  for (let i = 0; i < activeTyping.length - 1; i++) {
    const char = activeTyping[i];
    if (char === '[' && activeTyping[i + 1] === "'") {
      if (current) {
        result.push(current);
        current = '';
      }
      inBracket = true;
      i++;
    } else if (inBracket && char === "'" && activeTyping[i + 1] === ']') {
      result.push(current);
      current = '';
      inBracket = false;
      i++;
    } else if (!inBracket && char === '.') {
      if (current) {
        result.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
};

/**
 * Retrieves the current nested depth from the active typing.
 * @param {string} activeTyping - The current active typing.
 * @returns {number} The current nested depth.
 * @example
 * getCurrentNestedDepth('hello.world.super.nack.adipoli') // 4
 */
export const getCurrentNestedDepth = (activeTyping: string): number => {
  return (activeTyping.match(/\./g) || []).length;
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
  const detailType = value?.constructor?.name || typeof value;

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
