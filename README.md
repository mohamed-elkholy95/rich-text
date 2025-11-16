# Modern Rich Text Editor

A modern, framework-agnostic rich text editor built with TypeScript, modernized from the legacy medium-editor codebase.

## Features

- **TypeScript-first**: Full type safety with strict mode enabled
- **Framework-agnostic**: Works with vanilla JavaScript, React, Vue, Svelte, and more
- **Plugin architecture**: Extensible via plugins and extensions
- **Modern build system**: Vite for fast builds and HMR
- **Comprehensive testing**: Vitest with coverage tracking
- **ContentEditable-based**: Leverages native browser editing capabilities
- **Keyboard shortcuts**: Full keyboard navigation and commands

## Project Status

**Current Phase**: ✅ **COMPLETE**

### Completed

- ✅ Project infrastructure and build configuration
- ✅ TypeScript setup with strict mode
- ✅ Core utilities (browser detection, DOM manipulation, string helpers)
- ✅ Event system (EventEmitter with type safety)
- ✅ Selection management (save/restore selection state)
- ✅ Command system (extensible command execution)
- ✅ Plugin manager (lifecycle hooks, command registration)
- ✅ Main Editor class (initialization, element management, event handling)
- ✅ Built-in extensions (Placeholder, Keyboard Commands, Auto-Link)
- ✅ Test suite with 8 passing tests
- ✅ Production build (40KB total, 20KB gzipped)
- ✅ Demo applications (basic and advanced)
- ✅ Full documentation

### Future Enhancements

- [ ] Toolbar extension
- [ ] Framework wrappers (React, Vue, Svelte)
- [ ] Additional extensions (Tables, Images, etc.)
- [ ] Documentation site
- [ ] More example applications

## Installation

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Start development server
npm run dev
```

## Quick Start

```typescript
import { Editor } from 'modern-rich-text-editor';

// Initialize editor on element
const editor = new Editor('#editor', {
  placeholder: 'Start typing...',
  spellcheck: true,
  onChange: (content) => {
    console.log('Content changed:', content);
  }
});

// Execute commands
editor.execCommand('bold');
editor.execCommand('h1');

// Get/set content
const content = editor.getContent();
editor.setContent('<p>Hello World</p>');

// Event handling
editor.on('focus', (event) => {
  console.log('Editor focused');
});

// Cleanup
editor.destroy();
```

## Architecture

The editor follows a modular architecture:

```
src/
├── core/              # Core editor functionality
│   ├── Editor.ts      # Main editor class
│   ├── EventEmitter.ts    # Event system
│   ├── CommandManager.ts  # Command execution
│   └── PluginManager.ts   # Plugin management
├── dom/               # DOM utilities
│   └── Selection.ts   # Selection management
├── utils/             # Helper utilities
│   ├── browser.ts     # Browser detection
│   ├── dom.ts         # DOM manipulation
│   └── string.ts      # String helpers
├── extensions/        # Built-in extensions
│   ├── Extension.ts   # Base extension class
│   ├── PlaceholderExtension.ts
│   ├── KeyboardCommandsExtension.ts
│   └── AutoLinkExtension.ts
└── types/             # TypeScript definitions
```

## Migration from medium-editor

This project is a modern rewrite of [medium-editor](https://github.com/yabwe/medium-editor) with the following improvements:

- **TypeScript**: Complete type safety and IntelliSense support
- **ES Modules**: Modern module system instead of UMD
- **Modern APIs**: Uses current browser APIs (no IE11 support)
- **Build tools**: Vite instead of Grunt
- **Testing**: Vitest instead of Jasmine/Karma
- **Code quality**: ESLint 9 + Prettier

All legacy code references are documented in the source files for traceability.

## Development

```bash
# Type check
npm run typecheck

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format

# Run tests with coverage
npm run test:coverage

# Build documentation
npm run docs
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## License

MIT

## Credits

Modernized from [medium-editor](https://github.com/yabwe/medium-editor) by Davi Ferreira and contributors.
