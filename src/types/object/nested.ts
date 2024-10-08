/**
 * Represents an object with dynamic properties for completion suggestions.
 */
export interface ObjectNestedCompletionItems {
  [key: string]: any;
}

/**
 * Configuration options for nested object completion.
 */
export interface NestedOptions {
  /**
   * Delimiters used to trigger completion suggestions within template expressions.
   * @example
   * ["{{", "}}"]
   * This will allow to show completions even when the cursor is inside the {{}}.
   */
  templateExpressionDelimiters?: string[];

  /**
   * Maximum depth to traverse when generating completion suggestions.
   * @default Infinity
   */
  maxDepth?: number;

  /**
   * Whether to exclude prototype properties from completion suggestions.
   * @default true
   */
  excludePrototype?: boolean;
}
