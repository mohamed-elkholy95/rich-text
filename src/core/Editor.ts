/**
 * Main Editor class
 * Migrated from: old text/src/js/core.js (1,305 lines)
 *
 * Major changes:
 * - TypeScript with full type safety
 * - ES6 class syntax
 * - Reactive state management
 * - Modern plugin system
 */

import { EventEmitter } from './EventEmitter';
import { SelectionManager } from '../dom/Selection';
import { CommandManager } from './CommandManager';
import { PluginManager } from './PluginManager';
import type {
  EditorOptions,
  EditorElement,
  SerializedSelection,
} from '../types';

/**
 * Main editor class that coordinates all functionality
 *
 * Reference: old text/src/js/core.js MediumEditor class
 */
export class Editor {
  // Configuration
  private options: Required<EditorOptions>;

  // Element management
  private elements: Map<Element, EditorElement>;
  private focusedElement: Element | null = null;

  // Core systems
  public readonly events: EventEmitter;
  public readonly selection: SelectionManager;
  public readonly commands: CommandManager;
  public readonly plugins: PluginManager;

  // State
  private isDestroyed = false;
  private initialContent: Map<Element, string>;
  private savedSelection: SerializedSelection | null = null;

  constructor(
    elements: string | Element | Element[],
    options: Partial<EditorOptions> = {}
  ) {
    // Normalize options with defaults
    this.options = this.normalizeOptions(options);

    // Initialize systems
    this.events = new EventEmitter();
    this.selection = new SelectionManager();
    this.commands = new CommandManager(this);
    this.plugins = new PluginManager(this);

    // Initialize collections
    this.elements = new Map();
    this.initialContent = new Map();

    // Setup editor
    this.setupElements(elements);
    this.setupEventListeners();
    this.plugins.init(this.options.extensions);

    // Mark as ready
    this.events.emit('ready', this);
  }

  /**
   * Setup editable elements
   * Reference: core.js setup method
   */
  private setupElements(elementsInput: string | Element | Element[]): void {
    let elements: Element[];

    // Convert input to array of elements
    if (typeof elementsInput === 'string') {
      elements = Array.from(document.querySelectorAll(elementsInput));
    } else if (Array.isArray(elementsInput)) {
      elements = elementsInput;
    } else {
      elements = [elementsInput];
    }

    if (elements.length === 0) {
      throw new Error('No elements found to initialize editor');
    }

    // Initialize each element
    elements.forEach(element => this.initElement(element));
  }

  /**
   * Initialize single editable element
   * Reference: core.js initElement
   */
  private initElement(element: Element): void {
    // Check if already initialized
    if (this.elements.has(element)) {
      return;
    }

    let editableElement = element;
    let isTextarea = false;

    // Handle textarea conversion
    if (element.tagName === 'TEXTAREA') {
      editableElement = this.convertTextarea(element as HTMLTextAreaElement);
      isTextarea = true;
    }

    // Make contenteditable
    editableElement.setAttribute('contenteditable', 'true');
    editableElement.setAttribute('data-mrte-element', 'true');

    // Apply spellcheck
    editableElement.setAttribute('spellcheck', String(this.options.spellcheck));

    // Apply placeholder if specified
    if (this.options.placeholder) {
      editableElement.setAttribute(
        'data-placeholder',
        this.options.placeholder
      );
    }

    // Store initial content
    this.initialContent.set(editableElement, editableElement.innerHTML);

    // Create element wrapper
    const editorElement: EditorElement = {
      element: editableElement,
      original: element,
      isTextarea,
    };

    this.elements.set(editableElement, editorElement);

    // Emit add event
    this.events.emit('addElement', editableElement);
  }

  /**
   * Convert textarea to editable div
   * Reference: core.js (textarea handling logic)
   */
  private convertTextarea(textarea: HTMLTextAreaElement): HTMLDivElement {
    const div = document.createElement('div');
    div.className = textarea.className;
    div.id = textarea.id || '';
    div.innerHTML = textarea.value;

    // Copy custom data attributes
    Array.from(textarea.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        div.setAttribute(attr.name, attr.value);
      }
    });

    // Hide textarea
    textarea.style.display = 'none';

    // Insert div after textarea
    textarea.parentNode?.insertBefore(div, textarea.nextSibling);

    return div;
  }

  /**
   * Setup event listeners
   * Reference: core.js setupEventListeners + events.js
   */
  private setupEventListeners(): void {
    this.elements.forEach((_, element) => {
      // Input events
      element.addEventListener('input', this.handleInput.bind(this));

      // Selection events
      element.addEventListener(
        'mouseup',
        this.handleSelectionChange.bind(this)
      );
      element.addEventListener('keyup', this.handleSelectionChange.bind(this));

      // Focus events
      element.addEventListener(
        'focus',
        this.handleFocus.bind(this) as EventListener
      );
      element.addEventListener(
        'blur',
        this.handleBlur.bind(this) as EventListener
      );

      // Keyboard events
      element.addEventListener(
        'keydown',
        this.handleKeydown.bind(this) as EventListener
      );

      // Paste events
      element.addEventListener(
        'paste',
        this.handlePaste.bind(this) as EventListener
      );
    });
  }

  /**
   * Handle input event
   */
  private handleInput(event: Event): void {
    const element = event.target as Element;
    this.events.emit('input', event as InputEvent);
    this.events.emit('change', element.innerHTML);

    // Call user callback
    this.options.onChange?.(element.innerHTML);
  }

  /**
   * Handle selection change
   */
  private handleSelectionChange(): void {
    const selection = this.selection.getSelection();
    this.events.emit('selectionChange', selection);

    // Call user callback
    this.options.onSelectionChange?.(selection);
  }

  /**
   * Handle focus
   */
  private handleFocus(event: FocusEvent): void {
    this.focusedElement = event.target as Element;
    this.events.emit('focus', event);

    // Call user callback
    this.options.onFocus?.(event);
  }

  /**
   * Handle blur
   */
  private handleBlur(event: FocusEvent): void {
    this.events.emit('blur', event);

    // Call user callback
    this.options.onBlur?.(event);
  }

  /**
   * Handle keydown
   * Reference: core.js handleDisabledEnterKeydown, handleTabKeydown
   */
  private handleKeydown(event: KeyboardEvent): void {
    this.events.emit('keydown', event);

    // Handle enter key
    if (event.key === 'Enter' && this.options.disableReturn) {
      event.preventDefault();
      return;
    }

    // Handle double return
    if (event.key === 'Enter' && this.options.disableDoubleReturn) {
      const node = this.selection.getSelectionStart();
      if (
        node &&
        node.textContent?.trim() === '' &&
        node.nodeName.toLowerCase() !== 'li'
      ) {
        event.preventDefault();
        return;
      }
    }
  }

  /**
   * Handle paste
   */
  private handlePaste(event: ClipboardEvent): void {
    this.events.emit('paste', event);
  }

  // ==================== Public API ====================

  /**
   * Get content from element(s)
   * Reference: core.js getContent
   */
  public getContent(elementIndex?: number): string | string[] {
    if (typeof elementIndex === 'number') {
      const element = Array.from(this.elements.keys())[elementIndex];
      return element?.innerHTML || '';
    }

    return Array.from(this.elements.keys()).map(el => el.innerHTML);
  }

  /**
   * Set content in element(s)
   * Reference: core.js setContent
   */
  public setContent(content: string, elementIndex?: number): void {
    if (typeof elementIndex === 'number') {
      const element = Array.from(this.elements.keys())[elementIndex];
      if (element) {
        element.innerHTML = content;
        this.events.emit('change', content);
      }
      return;
    }

    // Set all elements
    this.elements.forEach((_, element) => {
      element.innerHTML = content;
    });
    this.events.emit('change', content);
  }

  /**
   * Serialize editor state
   * Reference: core.js serialize
   */
  public serialize(): Record<string, { value: string }> {
    const result: Record<string, { value: string }> = {};

    Array.from(this.elements.entries()).forEach(([element], index) => {
      const key = element.id || `element-${index}`;
      result[key] = { value: element.innerHTML };
    });

    return result;
  }

  /**
   * Execute command
   * Reference: core.js execAction
   */
  public execCommand(command: string, value?: any): boolean {
    return this.commands.execute(command, value);
  }

  /**
   * Save current selection
   * Reference: core.js saveSelection
   */
  public saveSelection(): SerializedSelection | null {
    const element = this.focusedElement;
    if (!element) return null;

    this.savedSelection = this.selection.exportSelection(element);
    return this.savedSelection;
  }

  /**
   * Restore saved selection
   * Reference: core.js restoreSelection
   */
  public restoreSelection(): boolean {
    const element = this.focusedElement;
    if (!element || !this.savedSelection) return false;

    return this.selection.importSelection(element, this.savedSelection);
  }

  /**
   * Add new elements
   * Reference: core.js addElements
   */
  public addElements(elementsInput: string | Element | Element[]): void {
    this.setupElements(elementsInput);
  }

  /**
   * Remove elements
   * Reference: core.js removeElements
   */
  public removeElements(elementsToRemove: Element | Element[]): void {
    const elements = Array.isArray(elementsToRemove)
      ? elementsToRemove
      : [elementsToRemove];

    elements.forEach(element => {
      if (this.elements.has(element)) {
        element.removeAttribute('contenteditable');
        element.removeAttribute('data-mrte-element');
        element.removeAttribute('data-placeholder');

        this.elements.delete(element);
        this.initialContent.delete(element);

        this.events.emit('removeElement', element);
      }
    });
  }

  /**
   * Get focused element
   */
  public getFocusedElement(): Element | null {
    return this.focusedElement;
  }

  /**
   * Get all editor elements
   */
  public getElements(): Element[] {
    return Array.from(this.elements.keys());
  }

  /**
   * Subscribe to editor events
   */
  public on<K extends keyof import('./EventEmitter').EventMap>(
    event: K,
    listener: (...args: import('./EventEmitter').EventMap[K]) => void
  ): () => void {
    return this.events.on(event, listener);
  }

  /**
   * Unsubscribe from editor events
   */
  public off<K extends keyof import('./EventEmitter').EventMap>(
    event: K,
    listener: (...args: import('./EventEmitter').EventMap[K]) => void
  ): void {
    this.events.off(event, listener);
  }

  /**
   * Destroy editor
   * Reference: core.js destroy
   */
  public destroy(): void {
    if (this.isDestroyed) return;

    // Destroy plugins
    this.plugins.destroy();

    // Remove event listeners and cleanup elements
    this.elements.forEach((editorElement, element) => {
      element.removeAttribute('contenteditable');
      element.removeAttribute('data-mrte-element');
      element.removeAttribute('data-placeholder');

      // Restore textarea if applicable
      if (editorElement.isTextarea && editorElement.original) {
        const textarea = editorElement.original as HTMLTextAreaElement;
        textarea.value = element.innerHTML;
        textarea.style.display = '';
        element.remove();
      }
    });

    // Clear collections
    this.elements.clear();
    this.initialContent.clear();

    // Remove all event listeners
    this.events.removeAllListeners();

    // Mark as destroyed
    this.isDestroyed = true;

    this.events.emit('destroy', this);
  }

  /**
   * Normalize options with defaults
   */
  private normalizeOptions(
    options: Partial<EditorOptions>
  ): Required<EditorOptions> {
    return {
      placeholder: options.placeholder || '',
      disableReturn: options.disableReturn ?? false,
      disableDoubleReturn: options.disableDoubleReturn ?? false,
      spellcheck: options.spellcheck ?? true,
      toolbar:
        options.toolbar !== false
          ? {
              buttons: ['bold', 'italic', 'underline', 'anchor'],
              ...(typeof options.toolbar === 'object' ? options.toolbar : {}),
            }
          : false,
      extensions: options.extensions || {},
      onChange: options.onChange || (() => {}),
      onSelectionChange: options.onSelectionChange || (() => {}),
      onBlur: options.onBlur || (() => {}),
      onFocus: options.onFocus || (() => {}),
    } as Required<EditorOptions>;
  }
}
