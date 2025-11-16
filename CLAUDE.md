# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Modern Rich Text Editor** is a complete modernization of the legacy medium-editor library. We are building a new, modern rich text editing solution using contemporary web technologies while preserving the core functionality and extensibility of the original editor.

## Migration Status

### ✅ Migration Complete

The migration from the legacy medium-editor codebase is **COMPLETE**. All legacy files have been removed and functionality has been modernized.

### Legacy Stack (medium-editor) - MIGRATED:

**Legacy Stack (medium-editor):**
- Vanilla JavaScript (ES5)
- Grunt build system
- Bower/npm package management
- SCSS with custom build pipeline
- Jasmine/Karma testing
- contentEditable-based editing
- Manual DOM manipulation
- jQuery-style patterns

**Modern Stack (Target):**
- TypeScript for type safety
- Modern build tools (Vite/Rollup/esbuild)
- npm/pnpm/bun package management
- Modern CSS (CSS Modules/Tailwind/styled-components)
- Modern testing (Vitest/Jest)
- React/Vue/Web Components (framework-agnostic core)
- Virtual DOM or efficient DOM diffing
- Functional/declarative patterns

### Core Features to Preserve

From the legacy medium-editor, we maintain these essential features:

1. **WYSIWYG Editing** - contentEditable-based rich text editing
2. **Toolbar System** - Floating/inline toolbar with formatting controls
3. **Extensibility** - Plugin/extension architecture for custom functionality
4. **Theming** - Customizable appearance and styling
5. **Keyboard Commands** - Keyboard shortcuts for common operations
6. **Paste Handling** - Clean paste from various sources
7. **Link Management** - Anchor creation and preview
8. **Auto-linking** - Automatic URL detection
9. **Placeholder Support** - Placeholder text for empty editors
10. **Multi-instance Support** - Multiple editors on same page
11. **Custom Buttons** - Ability to add custom toolbar buttons
12. **File Handling** - Drag and drop file support

### Modernization Principles

**Architecture:**
- Convert from imperative to declarative patterns
- Implement proper state management
- Use composition over inheritance
- Create framework-agnostic core with framework adapters
- Implement proper TypeScript types throughout

**Code Quality:**
- Full TypeScript coverage with strict mode
- Comprehensive unit and integration tests
- Modern ESM modules
- Tree-shakeable exports
- Proper error handling with typed errors

**Developer Experience:**
- Clear, intuitive API
- Comprehensive documentation
- Interactive examples and playground
- Strong typing for autocomplete
- Migration guide from legacy medium-editor

**Performance:**
- Efficient rendering with minimal reflows
- Lazy loading for extensions
- Small bundle size (tree-shakeable)
- Optimized for modern browsers (no IE11)
- Proper event delegation

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management

## Development Commands
```bash
# Development
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run type-check   # TypeScript type checking

# Quality
npm run lint         # ESLint
npm run format       # Prettier
npm run validate     # Full validation (type-check + lint + test)

# Documentation
npm run docs:dev     # Start documentation site
npm run docs:build   # Build documentation
```

## Project Structure

```
src/
├── core/                    # Framework-agnostic core
│   ├── editor.ts           # Main editor class
│   ├── selection.ts        # Selection management
│   ├── commands.ts         # Editing commands
│   └── events.ts           # Event system
├── extensions/             # Extension system
│   ├── toolbar/           # Toolbar extension
│   ├── link/              # Link handling
│   ├── paste/             # Paste handling
│   └── placeholder/       # Placeholder support
├── adapters/              # Framework adapters
│   ├── react/            # React components
│   ├── vue/              # Vue components
│   └── web-components/   # Web Components
├── utils/                # Utilities
│   ├── dom.ts           # DOM helpers
│   ├── validation.ts    # Input validation
│   └── sanitization.ts  # XSS prevention
└── types/               # TypeScript definitions
    └── index.ts         # Public API types
```

## Migration Reference

**Legacy files have been removed.** The migration is documented in:
- `MIGRATION_COMPLETE.md` - Summary of migration, removed files, and file mappings

All modern code includes comments referencing the original implementation for traceability.

## Key Development Patterns

### TypeScript First
- Use strict TypeScript with no `any` types
- Export clear, typed public APIs
- Provide IntelliSense-friendly interfaces
- Use discriminated unions for command/event types

### Testing Strategy
- Unit tests for all core functionality
- Integration tests for extension system
- E2E tests for user interactions (Playwright disabled per user preference)
- Visual regression tests for UI components

### State Management
- Immutable state updates
- Clear state ownership (editor instance vs. extensions)
- Event-driven updates
- Predictable state transitions

### Security
- XSS prevention through content sanitization
- CSP-compatible implementation
- No eval() or similar patterns
- Safe HTML parsing and rendering

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support
- Use native APIs where available
- Progressive enhancement where applicable

## Migration from Legacy medium-editor

For users migrating from medium-editor:

**API Compatibility:**
- Provide compatibility layer (optional import)
- Clear migration guide with examples
- Highlight breaking changes
- Automated migration tooling where possible

**Feature Parity:**
- Ensure all documented medium-editor features work
- Extensions have modern equivalents
- Theme migration support
- Event system compatibility mapping

## Important Notes

- **Migration complete** - All legacy files have been removed
- **Modern standards** - Uses latest ECMAScript features (ES2020+)
- **Type safety** - Full TypeScript strict mode throughout
- **Documentation** - See GETTING_STARTED.md for usage guide
- **Migration details** - See MIGRATION_COMPLETE.md for complete migration summary

## Design Philosophy

We aim to create a rich text editor that is:

1. **Modern** - Uses current best practices and technologies
2. **Performant** - Fast, efficient, small bundle size
3. **Extensible** - Plugin architecture for customization
4. **Accessible** - WCAG compliant, keyboard navigable
5. **Developer-friendly** - Great DX with TypeScript and clear APIs
6. **Framework-agnostic** - Works anywhere, adapters for popular frameworks
7. **Well-tested** - Comprehensive test coverage
8. **Secure** - XSS prevention, content sanitization

## Getting Started

See `GETTING_STARTED.md` for detailed setup and usage instructions.

**Quick Start:**
```bash
npm install
npm run build
npm run dev
```

Then open `http://localhost:5173/demo/advanced.html` to see the editor in action.
