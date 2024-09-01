import {Disposable} from '../common';
import {NestedOptions, ObjectNestedCompletionItems} from './nested';

export type Object = {
  nested: (
    items: ObjectNestedCompletionItems,
    options: NestedOptions,
  ) => Disposable;
};
