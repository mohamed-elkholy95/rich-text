/**
 * Selection management utilities
 * Migrated from: old text/src/js/selection.js (678 lines)
 *
 * This is one of the most complex modules - handles cross-browser
 * selection quirks and provides save/restore functionality
 */

import type { SerializedSelection } from '../types';
import { isBlockContainer } from '../utils/dom';

/**
 * Selection Manager for handling text selection and ranges
 *
 * Reference: old text/src/js/selection.js
 */
export class SelectionManager {
  private document: Document;

  constructor(doc: Document = document) {
    this.document = doc;
  }

  /**
   * Get current selection
   * Reference: selection.js getSelectionElement
   */
  public getSelection(): Selection | null {
    return this.document.getSelection();
  }

  /**
   * Get selection start node
   * Reference: selection.js getSelectionStart
   */
  public getSelectionStart(): Node | null {
    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    return range.startContainer;
  }

  /**
   * Get selection end node
   */
  public getSelectionEnd(): Node | null {
    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    return range.endContainer;
  }

  /**
   * Export selection to serializable format
   * Reference: selection.js exportSelection (lines 36-82)
   *
   * This is critical for maintaining selection across DOM changes.
   * Uses character offsets from root element.
   */
  public exportSelection(root: Element): SerializedSelection | null {
    if (!root) {
      return null;
    }

    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();

    preSelectionRange.selectNodeContents(root);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const start = preSelectionRange.toString().length;

    return {
      start,
      end: start + range.toString().length,
      startContainer: range.startContainer,
      endContainer: range.endContainer,
      collapsed: range.collapsed,
    };
  }

  /**
   * Restore selection from serialized format
   * Reference: selection.js importSelection (lines 94-217)
   *
   * Restores selection by walking the DOM tree and calculating
   * character offsets to find the correct position.
   */
  public importSelection(
    root: Element,
    selectionState: SerializedSelection
  ): boolean {
    if (!selectionState || !root) {
      return false;
    }

    try {
      const range = this.document.createRange();
      range.setStart(root, 0);
      range.collapse(true);

      let node: Node | null = root;
      const nodeStack: Node[] = [];
      let charIndex = 0;
      let foundStart = false;
      const foundEnd = false;
      let stop = false;
      let nextCharIndex: number;

      while (!stop && node) {
        // Only iterate over elements and text nodes
        if (node.nodeType > 3) {
          node = nodeStack.pop() || null;
          continue;
        }

        // If we hit a text node, add character count
        if (node.nodeType === Node.TEXT_NODE && !foundEnd) {
          nextCharIndex = charIndex + (node.textContent?.length || 0);

          // Check if we're at or beyond the start
          if (
            !foundStart &&
            selectionState.start >= charIndex &&
            selectionState.start <= nextCharIndex
          ) {
            range.setStart(node, selectionState.start - charIndex);
            foundStart = true;
          }

          // Check if we're at or beyond the end
          if (
            foundStart &&
            selectionState.end >= charIndex &&
            selectionState.end <= nextCharIndex
          ) {
            range.setEnd(node, selectionState.end - charIndex);
            stop = true;
          }

          charIndex = nextCharIndex;
        } else if (!stop && node.nodeType === Node.ELEMENT_NODE) {
          // Add all children to stack (in reverse order for depth-first)
          const children = Array.from(node.childNodes).reverse();
          nodeStack.push(...children);
        }

        if (!stop) {
          node = nodeStack.pop() || null;
        }
      }

      this.selectRange(range);
      return true;
    } catch (error) {
      console.error('Failed to restore selection:', error);
      return false;
    }
  }

  /**
   * Select a range
   * Reference: selection.js selectRange
   */
  public selectRange(range: Range): void {
    const selection = this.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Select entire node
   * Reference: selection.js selectNode
   */
  public selectNode(node: Node): boolean {
    try {
      const range = this.document.createRange();
      range.selectNodeContents(node);

      const selection = this.getSelection();
      if (!selection) return false;

      selection.removeAllRanges();
      selection.addRange(range);

      return true;
    } catch (error) {
      console.error('Failed to select node:', error);
      return false;
    }
  }

  /**
   * Clear selection
   * Reference: selection.js clearSelection
   */
  public clearSelection(): void {
    const selection = this.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  /**
   * Move cursor to end of element
   */
  public moveCursorToEnd(element: Node): void {
    const range = this.document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    const selection = this.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Move cursor to start of element
   */
  public moveCursorToStart(element: Node): void {
    const range = this.document.createRange();
    range.selectNodeContents(element);
    range.collapse(true);

    const selection = this.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Check if selection is at beginning of element
   */
  public isSelectionAtBeginning(element: Element): boolean {
    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return false;
    }

    const range = selection.getRangeAt(0);

    // Check if at start of element
    if (range.startContainer === element && range.startOffset === 0) {
      return true;
    }

    // Check if in first text node
    const firstTextNode = this.getFirstTextNode(element);
    if (firstTextNode === range.startContainer && range.startOffset === 0) {
      return true;
    }

    return false;
  }

  /**
   * Check if selection is at end of element
   */
  public isSelectionAtEnd(element: Element): boolean {
    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return false;
    }

    const range = selection.getRangeAt(0);

    // Check if at end of element
    if (
      range.endContainer === element &&
      range.endOffset === element.childNodes.length
    ) {
      return true;
    }

    // Check if in last text node
    const lastTextNode = this.getLastTextNode(element);
    if (
      lastTextNode === range.endContainer &&
      range.endOffset === (lastTextNode.textContent?.length || 0)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Get first text node in element
   */
  private getFirstTextNode(element: Node): Text | null {
    const walker = this.document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    return walker.nextNode() as Text | null;
  }

  /**
   * Get last text node in element
   */
  private getLastTextNode(element: Node): Text | null {
    const walker = this.document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let lastNode: Text | null = null;
    let currentNode: Node | null;

    while ((currentNode = walker.nextNode())) {
      lastNode = currentNode as Text;
    }

    return lastNode;
  }

  /**
   * Get selected text
   */
  public getSelectedText(): string {
    const selection = this.getSelection();
    return selection?.toString() || '';
  }

  /**
   * Check if there is a selection (not just cursor)
   */
  public hasSelection(): boolean {
    const selection = this.getSelection();
    return selection !== null && !selection.isCollapsed;
  }

  /**
   * Get common ancestor container of selection
   */
  public getSelectionParent(): Node | null {
    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    return range.commonAncestorContainer;
  }

  /**
   * Get closest block container to selection
   */
  public getSelectionBlockParent(): Element | null {
    const parent = this.getSelectionParent();
    if (!parent) return null;

    let current =
      parent.nodeType === Node.TEXT_NODE
        ? parent.parentElement
        : (parent as Element);

    while (current) {
      if (isBlockContainer(current)) {
        return current;
      }
      if (!current.parentElement) break;
      current = current.parentElement;
    }

    return null;
  }
}
