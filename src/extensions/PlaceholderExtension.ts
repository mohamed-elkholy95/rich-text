/**
 * Placeholder extension
 *
 * Reference: old text/src/js/extensions/placeholder.js
 * Displays placeholder text when editor is empty
 */

import { Extension } from './Extension';
import { browser } from '../utils/browser';

export interface PlaceholderOptions {
  text?: string;
  hideOnClick?: boolean;
}

/**
 * Placeholder extension
 *
 * Shows placeholder text in empty editor elements
 * Reference: old text/src/js/extensions/placeholder.js
 */
export class PlaceholderExtension extends Extension {
  private text: string;
  private hideOnClick: boolean;

  constructor(options: PlaceholderOptions = {}) {
    super('placeholder', options);
    this.text = options.text || 'Type your text';
    this.hideOnClick = options.hideOnClick !== false;
  }

  /**
   * Initialize placeholder
   * Reference: placeholder.js init()
   */
  protected override onCreate(): void {
    this.initPlaceholders();
    this.attachEventHandlers();
  }

  /**
   * Initialize placeholders on all elements
   * Reference: placeholder.js initPlaceholders()
   */
  private initPlaceholders(): void {
    const elements = this.editor.getElements();
    elements.forEach(el => this.initElement(el));
  }

  /**
   * Initialize placeholder on single element
   * Reference: placeholder.js initElement()
   */
  private initElement(el: Element): void {
    if (!el.getAttribute('data-placeholder')) {
      el.setAttribute('data-placeholder', this.text);
    }
    this.updatePlaceholder(el);
  }

  /**
   * Cleanup placeholder from element
   * Reference: placeholder.js cleanupElement()
   */
  private cleanupElement(el: Element): void {
    if (el.getAttribute('data-placeholder') === this.text) {
      el.removeAttribute('data-placeholder');
    }
    this.hidePlaceholder(el);
  }

  /**
   * Show placeholder on element
   * Reference: placeholder.js showPlaceholder()
   */
  private showPlaceholder(el: Element): void {
    if (!el) return;

    // In Firefox, styling the placeholder with an absolutely positioned
    // pseudo element causes the cursor to appear in a bad location
    // when the element is completely empty, so apply a different class
    // Reference: placeholder.js lines 61-67
    if (browser.isFirefox && el.childNodes.length === 0) {
      el.classList.add('mrte-placeholder-relative');
      el.classList.remove('mrte-placeholder');
    } else {
      el.classList.add('mrte-placeholder');
      el.classList.remove('mrte-placeholder-relative');
    }
  }

  /**
   * Hide placeholder on element
   * Reference: placeholder.js hidePlaceholder()
   */
  private hidePlaceholder(el: Element): void {
    if (!el) return;

    el.classList.remove('mrte-placeholder');
    el.classList.remove('mrte-placeholder-relative');
  }

  /**
   * Update placeholder visibility
   * Reference: placeholder.js updatePlaceholder()
   */
  private updatePlaceholder(el: Element, dontShow = false): void {
    // If the element has content, hide the placeholder
    const hasBlockElements = el.querySelector('img, blockquote, ul, ol, table');
    const hasText = (el.textContent || '').replace(/^\s+|\s+$/g, '') !== '';

    if (hasBlockElements || hasText) {
      return this.hidePlaceholder(el);
    }

    if (!dontShow) {
      this.showPlaceholder(el);
    }
  }

  /**
   * Attach event handlers
   * Reference: placeholder.js attachEventHandlers()
   */
  private attachEventHandlers(): void {
    if (this.hideOnClick) {
      // Hide placeholder on focus
      this.on('focus', this.handleFocus.bind(this));
    }

    // Hide placeholder when content is added
    this.on('input', this.handleInput.bind(this));

    // Show placeholder when editor loses focus (if empty)
    this.on('blur', this.handleBlur.bind(this));

    // Handle element add/remove
    this.on('addElement', this.handleAddElement.bind(this));
    this.on('removeElement', this.handleRemoveElement.bind(this));
  }

  /**
   * Handle input event
   * Reference: placeholder.js handleInput()
   */
  private handleInput(_event: InputEvent, element?: Element): void {
    if (!element) return;

    // If hideOnClick and element has focus, don't show placeholder
    const dontShow =
      this.hideOnClick && element === this.editor.getFocusedElement();

    this.updatePlaceholder(element, dontShow);
  }

  /**
   * Handle focus event
   * Reference: placeholder.js handleFocus()
   */
  private handleFocus(_event: FocusEvent, element?: Element): void {
    if (!element) return;
    this.hidePlaceholder(element);
  }

  /**
   * Handle blur event
   * Reference: placeholder.js handleBlur()
   */
  private handleBlur(_event: FocusEvent, element?: Element): void {
    if (!element) return;
    this.updatePlaceholder(element);
  }

  /**
   * Handle element added
   * Reference: placeholder.js handleAddElement()
   */
  private handleAddElement(element: Element): void {
    this.initElement(element);
  }

  /**
   * Handle element removed
   * Reference: placeholder.js handleRemoveElement()
   */
  private handleRemoveElement(element: Element): void {
    this.cleanupElement(element);
  }

  /**
   * Destroy placeholder
   * Reference: placeholder.js destroy()
   */
  protected override onDestroy(): void {
    const elements = this.editor.getElements();
    elements.forEach(el => this.cleanupElement(el));
  }
}
