/**
 * Base extension class
 *
 * Reference: old text/src/js/extension.js (273 lines)
 * Changes: TypeScript, modern event system, cleaner lifecycle
 */

import type { Editor } from '../core/Editor';
import type { Plugin } from '../core/PluginManager';
import type { StateChange } from '../types';

/**
 * Abstract base class for all extensions
 *
 * Extensions can add functionality to the editor by:
 * - Registering commands
 * - Adding UI elements (buttons, forms, etc.)
 * - Handling events
 * - Modifying editor behavior
 *
 * Reference: old text/src/js/extension.js Extension class
 */
export abstract class Extension implements Plugin {
  public readonly name: string;
  public readonly version?: string;
  protected editor!: Editor;
  protected options: any;

  constructor(name: string, options: any = {}) {
    this.name = name;
    this.options = options;
  }

  // ==================== Lifecycle Methods ====================

  /**
   * Initialize extension
   * Reference: extension.js init()
   *
   * Called when extension is registered with the editor.
   * Override this to set up your extension.
   */
  public init(editor: Editor): void {
    this.editor = editor;
    this.onCreate();
  }

  /**
   * Destroy extension
   * Reference: extension.js destroy()
   *
   * Called when editor is destroyed or extension is unregistered.
   * Override this to clean up resources.
   */
  public destroy(): void {
    this.onDestroy();
  }

  /**
   * Update extension state
   * Reference: extension.js checkState()
   *
   * Called when editor state changes.
   * Override this to react to state changes.
   */
  public update(changes: StateChange): void {
    this.onUpdate(changes);
  }

  // ==================== Extension-specific Lifecycle ====================

  /**
   * Called during init, after editor is set
   * Override this instead of init() for extension logic
   */
  protected onCreate(): void {
    // Override in subclass
  }

  /**
   * Called during destroy
   * Override this instead of destroy() for cleanup
   */
  protected onDestroy(): void {
    // Override in subclass
  }

  /**
   * Called during update
   * Override this to handle state changes
   */
  protected onUpdate(_changes: StateChange): void {
    // Override in subclass
  }

  // ==================== Helper Methods ====================

  /**
   * Get the currently focused editor element
   */
  protected getEditorElement(): Element | null {
    return this.editor.getFocusedElement();
  }

  /**
   * Execute a command on the editor
   */
  protected execCommand(command: string, value?: any): boolean {
    return this.editor.execCommand(command, value);
  }

  /**
   * Emit an event through the editor's event system
   */
  protected emit(event: string, data?: any): void {
    this.editor.events.emit(event as any, data);
  }

  /**
   * Subscribe to an event from the editor
   */
  protected on(event: string, handler: Function): () => void {
    return this.editor.events.on(event as any, handler as any);
  }

  /**
   * Get current selection
   */
  protected getSelection(): Selection | null {
    return this.editor.selection.getSelection();
  }

  /**
   * Save current selection
   */
  protected saveSelection() {
    return this.editor.saveSelection();
  }

  /**
   * Restore saved selection
   */
  protected restoreSelection(): boolean {
    return this.editor.restoreSelection();
  }

  /**
   * Get option value with fallback
   */
  protected getOption<T>(key: string, defaultValue: T): T {
    return this.options[key] !== undefined ? this.options[key] : defaultValue;
  }
}
