/**
 * String manipulation utilities
 */

/**
 * Generate unique ID
 * Reference: util.js guid
 */
export function generateId(prefix = 'mrte'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Trim and normalize whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Ensure URL has protocol
 * Reference: util.js ensureUrlHasProtocol
 */
export function ensureUrlHasProtocol(url: string): string {
  if (!url) return url;

  // Check if already has protocol
  if (/^(https?|ftps?|mailto|tel):/.test(url)) {
    return url;
  }

  // Add http:// for URLs without protocol
  if (/^www\./.test(url) || /\.[a-z]{2,}/.test(url)) {
    return `http://${url}`;
  }

  return url;
}

/**
 * Escape HTML special characters
 */
export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Strip HTML tags
 */
export function stripTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

/**
 * Truncate string to max length
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix = '...'
): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
}
