# Getting Started with Modern Rich Text Editor

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Generate type definitions
- Bundle the editor into `dist/`

### 3. Run the Demo

```bash
npm run dev
```

Then open your browser to the URL shown (usually `http://localhost:5173`).

You can access:
- **Basic Demo**: `demo/index.html`
- **Advanced Demo**: `demo/advanced.html`

## Basic Usage

### Vanilla JavaScript

```typescript
import { Editor } from 'modern-rich-text-editor';

// Simple initialization
const editor = new Editor('#editor');

// With options
const editor = new Editor('#editor', {
  placeholder: 'Start typing...',
  spellcheck: true,
  onChange: (content) => {
    console.log('Content changed:', content);
  }
});
```

### With Extensions

```typescript
import {
  Editor,
  PlaceholderExtension,
  KeyboardCommandsExtension,
  AutoLinkExtension
} from 'modern-rich-text-editor';

const editor = new Editor('#editor', {
  extensions: {
    placeholder: new PlaceholderExtension({
      text: 'Type your text here...',
      hideOnClick: true
    }),
    keyboard: new KeyboardCommandsExtension(),
    autoLink: new AutoLinkExtension()
  }
});
```

## Available Extensions

### PlaceholderExtension

Shows placeholder text when editor is empty.

```typescript
new PlaceholderExtension({
  text: 'Your placeholder text',
  hideOnClick: true  // Hide on focus or on content
});
```

### KeyboardCommandsExtension

Adds keyboard shortcuts for formatting.

Default shortcuts:
- `Ctrl/Cmd+B` - Bold
- `Ctrl/Cmd+I` - Italic
- `Ctrl/Cmd+U` - Underline

```typescript
new KeyboardCommandsExtension({
  commands: [
    {
      command: 'bold',
      key: 'B',
      meta: true,
      shift: false
    }
    // Add more custom commands
  ]
});
```

### AutoLinkExtension

Automatically converts URLs to clickable links.

```typescript
new AutoLinkExtension();
```

## API Reference

### Editor Methods

```typescript
// Content management
editor.getContent()              // Get HTML content
editor.setContent('<p>...</p>')  // Set HTML content
editor.serialize()               // Serialize to JSON

// Commands
editor.execCommand('bold')
editor.execCommand('h1')
editor.execCommand('createLink', 'https://example.com')

// Selection
editor.saveSelection()
editor.restoreSelection()

// Elements
editor.addElements('#new-editor')
editor.removeElements(element)
editor.getElements()

// Events
editor.on('change', (content) => {})
editor.on('focus', (event) => {})
editor.on('blur', (event) => {})
editor.off('change', handler)

// Cleanup
editor.destroy()
```

### Available Commands

**Text Formatting:**
- `bold`, `italic`, `underline`, `strikeThrough`

**Block Formatting:**
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- `p`, `blockquote`, `pre`
- `insertOrderedList`, `insertUnorderedList`
- `indent`, `outdent`

**Alignment:**
- `justifyLeft`, `justifyCenter`, `justifyRight`, `justifyFull`

**Links:**
- `createLink`, `unlink`

**Other:**
- `removeFormat`, `insertHTML`, `delete`, `undo`, `redo`

## TypeScript Support

The editor is built with TypeScript and includes full type definitions:

```typescript
import { Editor, EditorOptions } from 'modern-rich-text-editor';

const options: EditorOptions = {
  placeholder: 'Type here...',
  spellcheck: true,
  onChange: (content: string) => {
    console.log(content);
  }
};

const editor = new Editor('#editor', options);
```

## Styling

Import the base styles:

```typescript
import 'modern-rich-text-editor/dist/styles/editor.css';
```

Or create your own custom styles targeting:
- `.mrte-editor` - Editor container
- `.mrte-placeholder` - Placeholder state

## Development

### Project Structure

```
src/
├── core/              # Core editor (Editor, EventEmitter, etc.)
├── dom/               # DOM utilities (Selection)
├── utils/             # Helper utilities
├── extensions/        # Built-in extensions
├── types/             # TypeScript definitions
└── styles/            # CSS styles
```

### Available Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run typecheck     # TypeScript type checking
npm run lint          # Lint code
npm run lint:fix      # Fix linting issues
npm run format        # Format with Prettier
npm test              # Run tests
npm run test:coverage # Test with coverage
```

## Next Steps

1. **Build Extensions**: Create custom extensions by extending the `Extension` base class
2. **Add Toolbar**: Implement a toolbar extension for visual formatting controls
3. **Framework Wrappers**: Create React/Vue/Svelte wrappers
4. **Advanced Features**: Add tables, media embedding, collaborative editing

## Examples

See the `demo/` folder for working examples:
- `demo/index.html` - Basic demo
- `demo/advanced.html` - Advanced demo with all extensions

## Need Help?

- Check the source code comments - they reference the original medium-editor implementation
- See `MIGRATION_COMPLETE.md` for migration details and file mappings
- See `CLAUDE.md` for project documentation
- Review the TypeScript types in `src/types/`

## Migration from medium-editor

This editor maintains conceptual compatibility with medium-editor while using modern APIs:

```javascript
// Old (medium-editor)
var editor = new MediumEditor('.editor', {
  toolbar: { buttons: ['bold', 'italic'] },
  placeholder: { text: 'Type here' }
});

// New (modern-rich-text-editor)
import { Editor, PlaceholderExtension } from 'modern-rich-text-editor';

const editor = new Editor('.editor', {
  extensions: {
    placeholder: new PlaceholderExtension({ text: 'Type here' })
  }
});
```

Key differences:
- TypeScript instead of vanilla JS
- Plugin/extension pattern instead of monolithic options
- Modern module system (ESM)
- No IE11 support (modern browsers only)
