import {Disposable, Monaco, MonacoContext} from '../../../types/common';
import {
  NestedOptions,
  ObjectNestedCompletionItems,
} from '../../../types/object/nested';
import {objectNestedHandler} from './handler';

export default (
  monaco: Monaco,
  language: string,
): ((
  items: ObjectNestedCompletionItems,
  options?: NestedOptions,
) => Disposable) => {
  return (
    items: ObjectNestedCompletionItems,
    options?: NestedOptions,
  ): Disposable => {
    const provider = objectNestedHandler(items, options);

    return monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['.', "'"],
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
