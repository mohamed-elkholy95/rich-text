/**
 * DOM manipulation utilities
 * Migrated from: old text/src/js/util.js
 *
 * Modernized DOM utilities based on legacy code
 */

/**
 * Block-level element names
 * Reference: util.js lines 109-117
 */
export const blockContainerElementNames = [
  // elements our editor generates
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'ul',
  'li',
  'ol',
  // all other known block elements
  'address',
  'article',
  'aside',
  'audio',
  'canvas',
  'dd',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'header',
  'hgroup',
  'main',
  'nav',
  'noscript',
  'output',
  'section',
  'video',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
];

/**
 * Self-closing/empty element names
 * Reference: util.js line 119
 */
export const emptyElementNames = [
  'br',
  'col',
  'colgroup',
  'hr',
  'img',
  'input',
  'source',
  'wbr',
];

/**
 * Check if element is a block-level element
 */
export function isBlockContainer(element: Element): boolean {
  return (
    blockContainerElementNames.indexOf(element.tagName.toLowerCase()) !== -1
  );
}

/**
 * Check if node is descendant of parent
 * Reference: util.js isDescendant
 *
 * Uses native contains() with fallback for text nodes
 */
export function isDescendant(parent: Node, child: Node | null): boolean {
  if (!child) return false;

  // Try native contains first
  if (parent.nodeType === Node.ELEMENT_NODE) {
    return (parent as Element).contains(child);
  }

  // Fallback for non-element parents
  let node: Node | null = child;
  while (node) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

/**
 * Find closest ancestor matching tag name
 * Reference: util.js getClosestTag
 */
export function getClosestTag(
  element: Node | null,
  tagName: string
): Element | null {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  let current = element as Element;
  const tag = tagName.toUpperCase();

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    if (current.tagName === tag) {
      return current;
    }
    if (!current.parentElement) break;
    current = current.parentElement;
  }

  return null;
}

/**
 * Get top block container element
 * Reference: util.js getTopBlockContainer
 */
export function getTopBlockContainer(
  element: Element,
  root?: Element
): Element | null {
  const blockTags = new Set(
    blockContainerElementNames.map(tag => tag.toUpperCase())
  );

  let current: Element | null = element;
  let lastBlock: Element | null = null;

  while (current && current.parentElement) {
    if (blockTags.has(current.tagName)) {
      lastBlock = current;
    }

    // Stop at contentEditable boundary or root
    if (
      (current as HTMLElement).contentEditable === 'true' ||
      current === root
    ) {
      break;
    }

    current = current.parentElement;
  }

  return lastBlock;
}

/**
 * Insert HTML at current selection
 * Reference: util.js insertHTMLCommand
 */
export function insertHTML(
  html: string,
  document: Document = window.document
): boolean {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const fragment = range.createContextualFragment(html);
  range.insertNode(fragment);

  // Move cursor to end of inserted content
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  return true;
}

/**
 * Create element with attributes and content
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  content?: string | Node
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  if (content) {
    if (typeof content === 'string') {
      element.textContent = content;
    } else {
      element.appendChild(content);
    }
  }

  return element;
}

/**
 * Create a link element around text nodes
 * Reference: util.js createLink (lines 136-147)
 */
export function createLink(
  document: Document,
  textNodes: Node[],
  href: string,
  target?: string
): HTMLAnchorElement {
  const anchor = document.createElement('a');

  // Move text range into anchor
  if (textNodes.length > 0) {
    moveTextRangeIntoElement(
      textNodes[0],
      textNodes[textNodes.length - 1],
      anchor
    );
  }

  anchor.setAttribute('href', href);

  if (target) {
    if (target === '_blank') {
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
    anchor.setAttribute('target', target);
  }

  return anchor;
}

/**
 * Move text range into element
 * Referenced by createLink function
 */
export function moveTextRangeIntoElement(
  startNode: Node,
  endNode: Node,
  element: Element
): void {
  const range = document.createRange();
  range.setStartBefore(startNode);
  range.setEndAfter(endNode);

  const contents = range.extractContents();
  element.appendChild(contents);

  range.insertNode(element);
}

/**
 * Get first block element ancestor
 */
export function getFirstBlockParent(node: Node | null): Element | null {
  if (!node) return null;

  let current =
    node.nodeType === Node.TEXT_NODE
      ? node.parentElement
      : (node as Element | null);
  const blockTags = new Set(
    blockContainerElementNames.map(tag => tag.toUpperCase())
  );

  while (current) {
    if (blockTags.has(current.tagName)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

/**
 * Check if element is empty (no text content)
 */
export function isEmpty(element: Element): boolean {
  const text = element.textContent || '';
  return text.trim().length === 0;
}

/**
 * Unwrap element (replace element with its contents)
 */
export function unwrap(element: Element): void {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}

/**
 * Wrap node with element
 */
export function wrap(node: Node, wrapper: Element): Element {
  const parent = node.parentNode;
  if (!parent) {
    wrapper.appendChild(node);
    return wrapper;
  }

  parent.insertBefore(wrapper, node);
  wrapper.appendChild(node);

  return wrapper;
}
