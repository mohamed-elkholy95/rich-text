# Contributing to Modern Rich Text Editor

Thank you for your interest in contributing to Modern Rich Text Editor! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🐛 Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

### How to Submit a Bug Report

1. Use the bug report template when creating a new issue
2. Provide a clear and descriptive title
3. Include detailed steps to reproduce the problem
4. Specify your environment (OS, browser, Node version, etc.)
5. Include code examples and error messages if applicable
6. Add screenshots or videos if they help illustrate the issue

## ✨ Suggesting Features

Feature requests are welcome! Please:

1. Use the feature request template
2. Clearly describe the problem you're trying to solve
3. Provide examples of how the feature would be used
4. Explain why this feature would be useful to most users

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ (we recommend using Node 20)
- npm or compatible package manager
- Git

### Setup Instructions

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rich-text.git
   cd rich-text
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/mohamed-elkholy95/rich-text.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Workflow

### Available Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm test             # Run tests
npm run test:coverage # Run tests with coverage
```

### Code Style

- We use **TypeScript** with strict mode enabled
- Code style is enforced by **ESLint** and **Prettier**
- Run `npm run lint:fix` and `npm run format` before committing

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**
```
feat(editor): add auto-save functionality
fix(selection): correct cursor position after paste
docs(readme): update installation instructions
```

## 🧪 Testing

### Writing Tests

- All new features must include tests
- Bug fixes should include regression tests
- Tests are written using Vitest
- Test files should be named `*.spec.ts`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- Aim for >80% code coverage
- All new code should be covered by tests
- Coverage reports are generated in the `coverage/` directory

## 📦 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all checks pass**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

3. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments to new functions
   - Update GETTING_STARTED.md for new features

### Submitting a Pull Request

1. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Use the PR template
   - Link related issues
   - Provide a clear description of changes
   - Add screenshots/videos if applicable

3. **Address Review Feedback**
   - Respond to comments
   - Make requested changes
   - Push additional commits

### PR Requirements

- ✅ All CI checks must pass
- ✅ Code must be reviewed and approved
- ✅ Branch must be up-to-date with main
- ✅ No merge conflicts
- ✅ Tests must pass
- ✅ Code coverage must not decrease

## 🏗️ Project Structure

```
src/
├── core/              # Core editor functionality
│   ├── Editor.ts     # Main editor class
│   ├── EventEmitter.ts
│   ├── CommandManager.ts
│   └── PluginManager.ts
├── dom/               # DOM utilities
│   └── Selection.ts
├── extensions/        # Built-in extensions
│   ├── Extension.ts  # Base extension class
│   ├── PlaceholderExtension.ts
│   ├── KeyboardCommandsExtension.ts
│   └── AutoLinkExtension.ts
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── styles/            # CSS styles
```

## 🎯 Coding Guidelines

### TypeScript

- Use strict TypeScript (no `any` unless absolutely necessary)
- Prefer interfaces over types for public APIs
- Use type inference where possible
- Document complex types with comments

### Naming Conventions

- Classes: `PascalCase` (e.g., `Editor`, `PlaceholderExtension`)
- Functions/methods: `camelCase` (e.g., `getContent`, `saveSelection`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_LENGTH`)
- Private members: prefix with `_` (e.g., `_handleClick`)

### Code Organization

- One class per file
- Group related functionality together
- Keep functions small and focused
- Extract complex logic into separate functions

### Comments

- Use JSDoc for public APIs
- Explain "why", not "what"
- Keep comments up-to-date with code changes
- Remove commented-out code

## 🔍 Code Review

### What We Look For

- **Correctness**: Does the code work as intended?
- **Tests**: Are there adequate tests?
- **Documentation**: Is the code well-documented?
- **Style**: Does it follow our style guidelines?
- **Performance**: Are there any performance concerns?
- **Security**: Are there any security implications?

### Review Process

1. Automated checks run first (CI/CD)
2. Manual code review by maintainers
3. Feedback and requested changes
4. Approval and merge

## 📚 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [ESLint Rules](https://eslint.org/docs/rules/)

## ❓ Questions?

If you have questions:

1. Check existing issues and discussions
2. Read the documentation
3. Create a new discussion or issue
4. Reach out to maintainers

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
