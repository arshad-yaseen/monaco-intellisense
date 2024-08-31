import {DEFAULT_OPTIONS} from '../../../constants/object/nested';
import {
  CompletionItem,
  CompletionResult,
  MonacoContext,
} from '../../../types/common';
import {
  CompletionObjectItem,
  NestedOptions,
} from '../../../types/object/nested';
import {getTextUpToPosition} from '../../../utils/editor';
import {
  createCompletionItem,
  getActiveTyping,
  getCurrentToken,
} from '../../../utils/object/nested';

export const objectNestedHandler = (
  obj: CompletionObjectItem,
  options: NestedOptions = {},
): ((context: MonacoContext) => CompletionResult) => {
  const {maxDepth, excludePrototype, templateExpressionDelimiters} = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (context: MonacoContext): CompletionResult => {
    const text = getTextUpToPosition(context);
    const activeTyping = getActiveTyping(text, templateExpressionDelimiters);
    const currentToken = getCurrentToken(obj, activeTyping);
    const isMember = activeTyping.charAt(activeTyping.length - 1) === '.';

    const suggestions: CompletionItem[] = [];

    function addSuggestions(token: CompletionObjectItem, depth: number = 0) {
      if (depth >= maxDepth) return;

      for (const property in token) {
        if (
          Object.prototype.hasOwnProperty.call(token, property) &&
          !property.startsWith('__')
        ) {
          const value = token[property];
          if (
            excludePrototype &&
            !Object.prototype.hasOwnProperty.call(token, property)
          )
            continue;

          suggestions.push(
            createCompletionItem(property, value, isMember, context),
          );

          if (typeof value === 'object' && value !== null) {
            addSuggestions(value, depth + 1);
          }
        }
      }
    }

    addSuggestions(currentToken);

    return {suggestions};
  };
};
