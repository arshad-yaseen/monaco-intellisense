import * as monaco from 'monaco-editor';

export type Monaco = typeof monaco;
export type Model = monaco.editor.ITextModel;
export type Position = monaco.IPosition;
export type Range = monaco.IRange;
export type Disposable = monaco.IDisposable;
export type CompletionItem = monaco.languages.CompletionItem;
export type CompletionItemKind = monaco.languages.CompletionItemKind;

/**
 * Result object for completion suggestions.
 */
export interface CompletionResult {
  /**
   * The list of completion suggestions.
   */
  suggestions: CompletionItem[];
}

/**
 * Context object for Monaco editor operations.
 */
export interface MonacoContext {
  /**
   * The Monaco instance.
   */
  monaco: Monaco;

  /**
   * The model of the editor.
   */
  model: Model;

  /**
   * The position of the cursor.
   */
  position: Position;
}
