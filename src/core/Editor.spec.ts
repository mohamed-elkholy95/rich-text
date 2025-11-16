/**
 * Editor tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from './Editor';

describe('Editor', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a container for each test
    container = document.createElement('div');
    container.innerHTML = '<div class="editable"></div>';
    document.body.appendChild(container);
  });

  it('should create an editor instance', () => {
    const editor = new Editor('.editable');
    expect(editor).toBeDefined();
    expect(editor).toBeInstanceOf(Editor);
  });

  it('should make element contenteditable', () => {
    new Editor('.editable');
    const element = container.querySelector('.editable') as HTMLElement;
    expect(element.getAttribute('contenteditable')).toBe('true');
  });

  it('should set placeholder attribute', () => {
    new Editor('.editable', { placeholder: 'Type here...' });
    const element = container.querySelector('.editable') as HTMLElement;
    expect(element.getAttribute('data-placeholder')).toBe('Type here...');
  });

  it('should get and set content', () => {
    const editor = new Editor('.editable');
    editor.setContent('<p>Hello World</p>');

    const content = editor.getContent();
    // getContent returns an array for multiple elements
    const contentString = Array.isArray(content) ? content[0] : content;
    expect(contentString).toContain('Hello World');
  });

  it('should execute commands', () => {
    const editor = new Editor('.editable');
    editor.setContent('<p>Test</p>');

    const result = editor.execCommand('bold');
    expect(result).toBe(true);
  });

  it('should emit events', async () => {
    const editor = new Editor('.editable');

    const promise = new Promise((resolve) => {
      editor.on('change', (content) => {
        expect(content).toBeDefined();
        resolve(true);
      });
    });

    editor.setContent('<p>Changed</p>');
    await promise;
  });

  it('should support multiple elements', () => {
    container.innerHTML = '<div class="editable"></div><div class="editable"></div>';
    const editor = new Editor('.editable');

    const elements = editor.getElements();
    expect(elements).toHaveLength(2);
  });

  it('should destroy cleanly', () => {
    const editor = new Editor('.editable');
    const element = container.querySelector('.editable') as HTMLElement;

    editor.destroy();

    expect(element.getAttribute('contenteditable')).toBeNull();
  });
});
