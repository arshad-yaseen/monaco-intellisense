import {Disposable, Monaco, MonacoContext} from '../../../types/common';
import {
  NestedOptions,
  ObjectNestedCompletionItems,
} from '../../../types/object/nested';
import {objectNestedHandler} from './handler';

/**
 * Creates a function that registers a completion item provider for nested object properties.
 */
export default (
  monaco: Monaco,
  language: string,
): ((
  items: ObjectNestedCompletionItems,
  options: NestedOptions,
) => Disposable) => {
  /**
   * Registers a completion item provider for nested object properties.
   *
   * @param {ObjectNestedCompletionItems} items - The items to be used for completion suggestions.
   * @param {NestedOptions} options - Additional options for the completion provider.
   * @returns {Disposable} A disposable object that can be used to unregister the provider.
   */
  return (
    items: ObjectNestedCompletionItems,
    options: NestedOptions,
  ): Disposable => {
    const provider = objectNestedHandler(items, options);

    return monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const context: MonacoContext = {
          monaco,
          model,
          position,
        };
        return provider(context);
      },
    });
  };
};
