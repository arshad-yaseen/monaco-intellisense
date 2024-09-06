import {MonacoContext} from '../types/common';

/**
 * Retrieves the text content up to the current cursor position.
 * @param {MonacoContext} context - The Monaco editor context.
 * @returns {string} The text content from the start of the line to the cursor position.
 */
export const getTextUpToPosition = (context: MonacoContext): string => {
  const {model, position} = context;
  return model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);
};

/**
 * Gets the number of columns in a text.
 * @param {string} text - The text content.
 * @returns {number} The number of columns in the text.
 */
export const getColumnCount = (text: string): number => {
  const lastNewlineIndex = text.lastIndexOf('\n');
  return lastNewlineIndex === -1
    ? text.length + 1
    : text.length - lastNewlineIndex;
};
