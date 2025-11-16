/**
 * Core type definitions for Modern Rich Text Editor
 */

import type { Editor } from '../core/Editor';
import type { Plugin } from '../core/PluginManager';

export interface EditorOptions {
  // Element configuration
  placeholder?: string;
  disableReturn?: boolean;
  disableDoubleReturn?: boolean;
  spellcheck?: boolean;

  // Toolbar configuration
  toolbar?: ToolbarOptions | false;

  // Extensions
  extensions?: Record<string, Plugin>;

  // Event handlers
  onChange?: (content: string) => void;
  onSelectionChange?: (selection: Selection | null) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
}

export interface ToolbarOptions {
  buttons?: string[];
  static?: boolean;
  sticky?: boolean;
  align?: 'left' | 'center' | 'right';
  updateOnEmptySelection?: boolean;
}

export interface EditorElement {
  element: Element;
  original: Element;
  isTextarea: boolean;
}

export interface SerializedSelection {
  start: number;
  end: number;
  startContainer?: Node;
  endContainer?: Node;
  collapsed: boolean;
}

export interface Command {
  name: string;
  execute: (editor: Editor, ...args: any[]) => boolean;
  canExecute?: (editor: Editor) => boolean;
  isActive?: (editor: Editor) => boolean;
}

export interface KeyBinding {
  key: string;
  command: string;
  args?: any[];
}

export interface StateChange {
  type: string;
  data: any;
}
