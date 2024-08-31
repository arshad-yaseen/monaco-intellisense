import {MonacoContext, Position, Range} from '../types/common';

/**
 * Retrieves the text content up to the current cursor position.
 * @param {MonacoContext} context - The Monaco editor context.
 * @returns {string} The text content from the start of the line to the cursor position.
 */
export const getTextUpToPosition = (context: MonacoContext): string => {
  const {model, position} = context;
  return model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });
};

/**
 * Gets the number of columns in a text.
 * @param {string} text - The text content.
 * @returns {number} The number of columns in the text.
 */
export const getColumnCount = (text: string): number => {
  const lines = text.split('\n');
  return lines[lines.length - 1].length + 1;
};

/**
 * Computes the range for inserting text at a given position.
 * @param {Position} position - The position where the text will be inserted.
 * @param {string} text - The text to be inserted.
 * @returns {Range} The range object representing the insertion area.
 */
export const computeInsertRange = (position: Position, text: string): Range => {
  return {
    startLineNumber: position.lineNumber,
    startColumn: position.column,
    endLineNumber: position.lineNumber,
    endColumn: position.column - 1 + getColumnCount(text),
  };
};