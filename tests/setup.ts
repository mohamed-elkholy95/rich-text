import { expect, afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  document.body.innerHTML = '';
});

// Custom matchers
expect.extend({
  toHaveSelection(element: Element, expected: { start: number; end: number }) {
    const selection = window.getSelection();
    // Implementation
    return { pass: true, message: () => '' };
  }
});

// Mock execCommand for tests
document.execCommand = vi.fn((command: string) => {
  return true;
});
