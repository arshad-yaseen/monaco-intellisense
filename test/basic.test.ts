import {expect, test} from 'vitest';

import {object} from '../src';

test('object.nested is exported', () => {
  expect(object.nested).toBeDefined();
  expect(typeof object.nested).toBe('function');
});
