import {Disposable, Monaco, MonacoContext} from '../../../types/common';
import {
  CompletionObjectItem,
  NestedOptions,
} from '../../../types/object/nested';
import {objectNestedHandler} from './handler';

/**
 * Register nested object autocompletion with the Monaco editor.
 *
 * @param {Monaco} monaco - The Monaco editor instance.
 * @param {Object} params - The parameters for the nested completion provider.
 * @param {string} params.language - The language ID.
 * @param {CompletionObjectItem} params.obj - The object to provide completions for.
 * @param {NestedOptions} params.options - The options for the nested completion provider.
 * @returns {Disposable} The disposable object to remove the provider.
 */
export default (
  monaco: Monaco,
  params: {
    obj: CompletionObjectItem;
    language: string;
    options: NestedOptions;
  },
): Disposable => {
  const {obj, language, options} = params;
  const provider = objectNestedHandler(obj, options);

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
