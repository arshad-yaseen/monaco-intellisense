import {nested} from './core/object';
import {Monaco} from './types/common';
import {ObjectReturn} from './types/object';

export const object = (monaco: Monaco, language: string): ObjectReturn => {
  return {
    nested: nested(monaco, language),
  };
};
