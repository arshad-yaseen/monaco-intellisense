import {Disposable} from '../common';
import {NestedOptions, ObjectNestedCompletionItems} from './nested';

export type ObjectReturn = {
  nested: (
    items: ObjectNestedCompletionItems,
    options: NestedOptions,
  ) => Disposable;
};
