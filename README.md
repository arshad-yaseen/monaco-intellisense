# Monaco Intellisense

Monaco Intellisense is a library that provides custom IntelliSense (code completion) for the Monaco Editor, enabling rich code completion experiences within the Monaco Editor.

## Features

- 🛠️ Customizable IntelliSense for nested objects.
- 📊 Supports various data types including functions, arrays, objects, and more.
- ⚙️ Configurable options for template expression delimiters and maximum depth of suggestions.

## Installation

```bash
npm install monaco-intellisense
```

## `object`

The `object` module provides methods to register custom IntelliSense for objects within the Monaco Editor.

### `object.nested`

https://github.com/user-attachments/assets/a1e41f97-aacc-44bb-94a4-c17ed85ad062

The `object.nested` method registers a completion item provider for nested object properties.

#### Parameters

- `items` (ObjectNestedCompletionItems): The items to be used for completion suggestions.
- `options` (NestedOptions, optional): Additional options for the completion provider.

#### Example

```typescript
import * as monaco from 'monaco-editor';
import {object} from 'monaco-intellisense';

const editor = monaco.editor.create(document.getElementById('editor'), {
  value: '',
  language: 'javascript',
});

const objectIntellisense = object(monaco).nested(
  {
    user: {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zip: '12345',
      },
    },
    settings: {
      theme: 'dark',
      notifications: true,
    },
  },
  {
    templateExpressionDelimiters: ['{{', '}}'],
  },
);

editor.onDidDispose(() => {
  objectIntellisense.dispose();
});
```

### Options

The `object.nested` method accepts an optional `options` parameter to configure the nested completion provider. The available options are:

- `templateExpressionDelimiters` (string[]): Delimiters used to trigger completion suggestions within template expressions.
  - **Example**: `["{{", "}}"]`
  - This will allow to show completions even when the cursor is inside the {{}}.
- `maxDepth` (number): Maximum depth to traverse when generating completion suggestions.
  - **Default**: `Infinity`
- `excludePrototype` (boolean): Whether to exclude prototype properties from completion suggestions.
  - **Default**: `true`

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/arshad-yaseen/monaco-intellisence/blob/main/LICENSE) file for details.
