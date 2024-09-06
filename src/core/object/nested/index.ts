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
  const createProvider = (
    items: ObjectNestedCompletionItems,
    options?: NestedOptions,
  ) => {
    const provider = objectNestedHandler(items, options);
    return (model: any, position: any) => {
      const context: MonacoContext = {monaco, model, position};
      return provider(context);
    };
  };

  return (
    items: ObjectNestedCompletionItems,
    options?: NestedOptions,
  ): Disposable => {
    const provideCompletionItems = createProvider(items, options);

    return monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['.', "'"],
      provideCompletionItems,
    });
  };
};
