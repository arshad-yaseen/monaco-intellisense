import {NestedOptions} from '../../types/object/nested';

export const DEFAULT_OPTIONS: Required<NestedOptions> = {
  triggerCharacters: ['.'],
  templateExpressionDelimiters: [],
  maxDepth: Infinity,
  excludePrototype: true,
};
