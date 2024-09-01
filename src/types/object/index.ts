import {Disposable} from '../common';
import {NestedOptions, ObjectNestedCompletionItems} from './nested';

/**
 * Represents the return type of the object module.
 */
export type ObjectReturn = {
  /**
   * Registers a completion item provider for nested object properties.
   *
   * @param {ObjectNestedCompletionItems} items - The items to be used for completion suggestions.
   * @param {NestedOptions} options - Additional options for the completion provider.
   * @returns {Disposable} A disposable object that can be used to unregister the provider.
   */
  nested: (
    items: ObjectNestedCompletionItems,
    options?: NestedOptions,
  ) => Disposable;
};
