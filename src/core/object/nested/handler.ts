import {
  DEFAULT_OPTIONS,
  NESTED_COMPLETION_TRIGGER_EXPRESSIONS,
} from '../../../constants/object/nested';
import {
  CompletionItem,
  CompletionResult,
  MonacoContext,
} from '../../../types/common';
import {
  NestedOptions,
  ObjectNestedCompletionItems,
} from '../../../types/object/nested';
import {getTextUpToPosition} from '../../../utils/editor';
import {
  createCompletionItem,
  getActiveTyping,
  getCurrentNestedDepth,
  getCurrentToken,
} from '../../../utils/object/nested';

export const objectNestedHandler = (
  items: ObjectNestedCompletionItems,
  options: NestedOptions = {},
): ((context: MonacoContext) => CompletionResult) => {
  const {maxDepth, excludePrototype, templateExpressionDelimiters} = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (context: MonacoContext): CompletionResult => {
    const text = getTextUpToPosition(context);
    const activeTyping = getActiveTyping(text, templateExpressionDelimiters);
    const isMember = NESTED_COMPLETION_TRIGGER_EXPRESSIONS.some(expression =>
      activeTyping.includes(expression),
    );
    const currentToken = getCurrentToken(items, activeTyping, isMember);
    const currentDepth = getCurrentNestedDepth(activeTyping);

    if (!currentToken || Object.keys(currentToken).length === 0)
      return {suggestions: []};

    const suggestions: CompletionItem[] = [];

    const addSuggestions = (
      token: ObjectNestedCompletionItems,
      depth: number = 0,
    ) => {
      if (depth > maxDepth) return;

      Object.entries(token).forEach(([property, value]) => {
        if (
          (excludePrototype &&
            Object.prototype.hasOwnProperty.call(token, property)) ||
          (!excludePrototype && !property.startsWith('__'))
        ) {
          suggestions.push(
            createCompletionItem(property, value, isMember, context),
          );
        }
      });
    };

    addSuggestions(currentToken, currentDepth);

    return {suggestions};
  };
};
