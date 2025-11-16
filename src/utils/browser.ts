/**
 * Browser detection utilities
 * Migrated from: old text/src/js/util.js
 *
 * Reference: Lines 39-75 of util.js
 * Modernized for current browser landscape (removed IE/Edge legacy checks)
 */

export const browser = {
  /**
   * Check if browser is Firefox
   * Reference: util.js line 46
   */
  isFirefox: /Firefox/i.test(navigator.userAgent),

  /**
   * Check if platform is Mac
   * Reference: util.js line 49
   */
  isMac: /Mac/.test(navigator.platform),

  /**
   * Get browser vendor
   */
  vendor: navigator.vendor || '',

  /**
   * Support for contentEditable
   */
  supportsContentEditable: 'contentEditable' in document.documentElement,

  /**
   * User agent string
   */
  userAgent: navigator.userAgent,
};

/**
 * Key codes for keyboard events
 * Reference: util.js lines 53-63
 */
export const keyCode = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  DELETE: 46,
  K: 75,
  M: 77,
  V: 86,
};

/**
 * Check if browser supports specific feature
 */
export function supportsFeature(feature: string): boolean {
  switch (feature) {
    case 'clipboard':
      return 'clipboard' in navigator;
    case 'execCommand':
      return typeof document.execCommand === 'function';
    case 'selection':
      return typeof window.getSelection === 'function';
    case 'queryCommandState':
      return typeof document.queryCommandState === 'function';
    default:
      return false;
  }
}

/**
 * Returns true if it's metaKey on Mac, or ctrlKey on non-Mac
 * Reference: util.js isMetaCtrlKey (lines 69-75)
 *
 * This is the modern "Mod" key used in keyboard shortcuts
 */
export function isModKey(event: KeyboardEvent): boolean {
  if (browser.isMac && event.metaKey) {
    return true;
  }

  if (!browser.isMac && event.ctrlKey) {
    return true;
  }

  return false;
}

/**
 * Check if event key matches any key in the keys array
 * Reference: util.js isKey (lines 83-96)
 */
export function isKey(event: KeyboardEvent, keys: number | number[]): boolean {
  const eventKeyCode = event.which || event.keyCode;

  if (!Array.isArray(keys)) {
    return eventKeyCode === keys;
  }

  return keys.indexOf(eventKeyCode) !== -1;
}

/**
 * Get key code from keyboard event
 * Reference: util.js getKeyCode (lines 98-100)
 */
export function getKeyCode(event: KeyboardEvent): number {
  return event.which || event.keyCode || 0;
}
