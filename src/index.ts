import {DEFAULT_NESTED_OBJECT_LANGUAGE} from './constants/object/nested';
import {nested} from './core/object';
import {Monaco} from './types/common';
import {ObjectReturn} from './types/object';

/**
 * Creates an object module that provides object intellisense methods.
 * @param {Monaco} monaco - The Monaco instance.
 * @param {string} [language] - The language to use for the object intellisense. Defaults to 'javascript'.
 */
export const object = (monaco: Monaco, language?: string): ObjectReturn => {
  return {
    nested: nested(monaco, language || DEFAULT_NESTED_OBJECT_LANGUAGE),
  };
};
