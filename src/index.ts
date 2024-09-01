import {nested} from './core/object';
import {Monaco} from './types/common';
import {Object} from './types/object';

export const object = (monaco: Monaco, language: string): Object => {
  return {
    nested: nested(monaco, language),
  };
};
