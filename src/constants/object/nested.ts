import {NestedOptions} from '../../types/object/nested';

export const NESTED_COMPLETION_TRIGGER_EXPRESSIONS = ['.', "['"];
export const DEFAULT_NESTED_OBJECT_LANGUAGE = 'javascript';

export const DEFAULT_OPTIONS: Required<NestedOptions> = {
  templateExpressionDelimiters: [],
  maxDepth: Infinity,
  excludePrototype: true,
};
