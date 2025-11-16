# GitHub Configuration

This directory contains GitHub-specific configuration files for the Modern Rich Text Editor project.

## 📁 Directory Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # Continuous Integration
│   ├── release.yml        # Release automation
│   ├── codeql.yml         # Security analysis
│   ├── debug.yml          # Debug builds
│   └── auto-merge.yml     # Dependabot auto-merge
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.yml     # Bug report form
│   └── feature_request.yml # Feature request form
├── PULL_REQUEST_TEMPLATE/ # PR templates
│   └── pull_request_template.md
├── dependabot.yml         # Dependabot configuration
├── changelog-config.json  # Changelog generation config
├── CODEOWNERS             # Code ownership rules
└── CONTRIBUTING.md        # Contribution guidelines
```

## 🔄 CI/CD Workflows

### CI Workflow (`ci.yml`)
**Triggers**: Push to main/develop, Pull requests
- **Quality Checks**: TypeScript, ESLint, Prettier
- **Build**: Multi-version Node.js (18, 20, 22)
- **Tests**: Cross-platform (Ubuntu, Windows, macOS)
- **Security**: npm audit, Snyk scanning
- **Coverage**: Codecov integration

### Release Workflow (`release.yml`)
**Triggers**: Version tags (v*.*.*), Manual dispatch
- Build and test validation
- GitHub release creation with changelog
- npm package publishing
- Documentation deployment

### CodeQL Workflow (`codeql.yml`)
**Triggers**: Push, PR, Weekly schedule
- Automated security vulnerability scanning
- Code quality analysis
- JavaScript/TypeScript analysis

### Debug Workflow (`debug.yml`)
**Triggers**: Manual dispatch only
- Verbose logging for all steps
- Remote SSH debugging via tmate
- Comprehensive debug reports
- Build output analysis

### Auto-Merge Workflow (`auto-merge.yml`)
**Triggers**: Dependabot PRs
- Automatic approval for passing checks
- Auto-merge for dependency updates
- Version update automation

## 📝 Issue Templates

### Bug Report (`bug_report.yml`)
Structured form for reporting bugs:
- Description and reproduction steps
- Expected vs actual behavior
- Environment details (browser, OS, version)
- Code examples
- Screenshots/videos

### Feature Request (`feature_request.yml`)
Structured form for feature suggestions:
- Problem statement
- Proposed solution
- Alternative considerations
- Example usage
- Priority level

## 🔧 Configuration Files

### Dependabot (`dependabot.yml`)
- **npm packages**: Weekly updates (Mondays 6 AM UTC)
- **GitHub Actions**: Weekly updates
- Grouped updates for dev dependencies
- Auto-ignore major version updates
- Auto-assignment to maintainers

### Changelog Config (`changelog-config.json`)
Categories:
- 🚀 Features
- 🐛 Bug Fixes
- 📝 Documentation
- ♻️ Code Refactoring
- ⚡️ Performance
- ✅ Tests
- 🔧 Build & CI
- 📦 Dependencies
- 🔒 Security
- 💥 Breaking Changes

### Code Owners (`CODEOWNERS`)
Defines code ownership for automatic review requests:
- Core functionality: `@mohamed-elkholy95`
- Extensions: `@mohamed-elkholy95`
- Documentation: `@mohamed-elkholy95`
- Configuration: `@mohamed-elkholy95`

## 🎯 Workflow Best Practices

### For Contributors
1. All PRs must pass CI checks
2. Use conventional commit messages
3. Include tests for new features
4. Update documentation as needed
5. Follow the PR template

### For Maintainers
1. Review and approve PRs
2. Ensure CI passes before merge
3. Create releases with proper versioning
4. Monitor security alerts
5. Keep dependencies up-to-date

## 🔐 Secrets Required

For full CI/CD functionality, configure these secrets:

### Required
- `GITHUB_TOKEN` - Automatically provided by GitHub

### Optional (for enhanced features)
- `NPM_TOKEN` - For npm publishing
- `SNYK_TOKEN` - For Snyk security scanning
- `CODECOV_TOKEN` - For enhanced Codecov features

## 📊 Workflow Status

Monitor workflow status:
- [Actions Tab](https://github.com/mohamed-elkholy95/rich-text/actions)
- [Security Tab](https://github.com/mohamed-elkholy95/rich-text/security)
- [Insights > Dependency Graph](https://github.com/mohamed-elkholy95/rich-text/network/dependencies)

## 🛠️ Local Development

### Run Checks Locally
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm test

# All checks (what CI runs)
npm run prepublishOnly
```

### Test Workflows Locally
Use [act](https://github.com/nektos/act) to run workflows locally:
```bash
act -j quality
act -j build
act -j test
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Dependabot Documentation](https://docs.github.com/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Contributing Guidelines](./CONTRIBUTING.md)
