/**
 * Command execution system
 *
 * Reference: old text/src/js/core.js execAction method
 * Enhancement: Chainable, undoable, extensible commands
 */

import type { Editor } from './Editor';
import type { Command } from '../types';

/**
 * Manages command execution for the editor
 *
 * Commands are actions that can be executed on the editor content,
 * such as bold, italic, createLink, etc.
 */
export class CommandManager {
  private commands: Map<string, Command>;
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
    this.commands = new Map();
    this.registerDefaultCommands();
  }

  /**
   * Register a command
   */
  public register(command: Command): void {
    this.commands.set(command.name, command);
  }

  /**
   * Execute a command by name
   */
  public execute(name: string, ...args: any[]): boolean {
    const command = this.commands.get(name);

    if (!command) {
      console.warn(`Command '${name}' not found`);
      return false;
    }

    if (command.canExecute && !command.canExecute(this.editor)) {
      return false;
    }

    return command.execute(this.editor, ...args);
  }

  /**
   * Check if command is active (e.g., is bold currently applied)
   */
  public isActive(name: string): boolean {
    const command = this.commands.get(name);
    return command?.isActive?.(this.editor) ?? false;
  }

  /**
   * Check if command can be executed
   */
  public canExecute(name: string): boolean {
    const command = this.commands.get(name);
    if (!command) return false;
    return command.canExecute?.(this.editor) ?? true;
  }

  /**
   * Get all registered command names
   */
  public getCommandNames(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Check if command is registered
   */
  public hasCommand(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Unregister a command
   */
  public unregister(name: string): boolean {
    return this.commands.delete(name);
  }

  /**
   * Register default commands
   * Reference: old text/src/js/core.js execAction
   */
  private registerDefaultCommands(): void {
    // Text formatting commands
    this.register({
      name: 'bold',
      execute: () => document.execCommand('bold', false),
      isActive: () => document.queryCommandState('bold'),
    });

    this.register({
      name: 'italic',
      execute: () => document.execCommand('italic', false),
      isActive: () => document.queryCommandState('italic'),
    });

    this.register({
      name: 'underline',
      execute: () => document.execCommand('underline', false),
      isActive: () => document.queryCommandState('underline'),
    });

    this.register({
      name: 'strikeThrough',
      execute: () => document.execCommand('strikeThrough', false),
      isActive: () => document.queryCommandState('strikeThrough'),
    });

    // Block formatting commands
    this.register({
      name: 'insertOrderedList',
      execute: () => document.execCommand('insertOrderedList', false),
      isActive: () => document.queryCommandState('insertOrderedList'),
    });

    this.register({
      name: 'insertUnorderedList',
      execute: () => document.execCommand('insertUnorderedList', false),
      isActive: () => document.queryCommandState('insertUnorderedList'),
    });

    this.register({
      name: 'indent',
      execute: () => document.execCommand('indent', false),
    });

    this.register({
      name: 'outdent',
      execute: () => document.execCommand('outdent', false),
    });

    // Heading commands
    for (let i = 1; i <= 6; i++) {
      this.register({
        name: `h${i}`,
        execute: () => document.execCommand('formatBlock', false, `<h${i}>`),
        isActive: () => {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return false;
          const parent = selection.getRangeAt(0).commonAncestorContainer;
          const element =
            parent.nodeType === Node.TEXT_NODE
              ? parent.parentElement
              : (parent as Element);
          return element?.tagName?.toLowerCase() === `h${i}`;
        },
      });
    }

    // Paragraph and blockquote
    this.register({
      name: 'p',
      execute: () => document.execCommand('formatBlock', false, '<p>'),
    });

    this.register({
      name: 'blockquote',
      execute: () => document.execCommand('formatBlock', false, '<blockquote>'),
      isActive: () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;
        const parent = selection.getRangeAt(0).commonAncestorContainer;
        const element =
          parent.nodeType === Node.TEXT_NODE
            ? parent.parentElement
            : (parent as Element);
        return element?.tagName?.toLowerCase() === 'blockquote';
      },
    });

    this.register({
      name: 'pre',
      execute: () => document.execCommand('formatBlock', false, '<pre>'),
    });

    // Link commands
    this.register({
      name: 'createLink',
      execute: (_editor, url: string) =>
        document.execCommand('createLink', false, url),
    });

    this.register({
      name: 'unlink',
      execute: () => document.execCommand('unlink', false),
    });

    // Alignment commands
    this.register({
      name: 'justifyLeft',
      execute: () => document.execCommand('justifyLeft', false),
    });

    this.register({
      name: 'justifyCenter',
      execute: () => document.execCommand('justifyCenter', false),
    });

    this.register({
      name: 'justifyRight',
      execute: () => document.execCommand('justifyRight', false),
    });

    this.register({
      name: 'justifyFull',
      execute: () => document.execCommand('justifyFull', false),
    });

    // Other commands
    this.register({
      name: 'removeFormat',
      execute: () => document.execCommand('removeFormat', false),
    });

    this.register({
      name: 'insertHTML',
      execute: (_editor, html: string) =>
        document.execCommand('insertHTML', false, html),
    });

    this.register({
      name: 'delete',
      execute: () => document.execCommand('delete', false),
    });

    this.register({
      name: 'undo',
      execute: () => document.execCommand('undo', false),
    });

    this.register({
      name: 'redo',
      execute: () => document.execCommand('redo', false),
    });
  }
}
