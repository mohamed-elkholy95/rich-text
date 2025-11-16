/**
 * Modern Rich Text Editor
 *
 * A modern, framework-agnostic rich text editor built with TypeScript
 * Modernized from medium-editor with contemporary web standards
 */

// Core exports
export { Editor } from './core/Editor';
export { EventEmitter } from './core/EventEmitter';
export { CommandManager } from './core/CommandManager';
export { PluginManager } from './core/PluginManager';

// DOM utilities
export { SelectionManager } from './dom/Selection';

// Utilities
export * from './utils';

// Extensions
export * from './extensions';

// Types
export type {
  EditorOptions,
  EditorElement,
  SerializedSelection,
  Command,
  KeyBinding,
  StateChange,
  ToolbarOptions,
} from './types';

export type { Plugin } from './core/PluginManager';

// Default export
export { Editor as default } from './core/Editor';

// Styles - users can import this separately
// import 'modern-rich-text-editor/styles';
