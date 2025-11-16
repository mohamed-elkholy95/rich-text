# Branch Protection Guide

This guide provides instructions for setting up branch protection rules for the Modern Rich Text Editor repository.

## 🔒 Why Branch Protection?

Branch protection ensures:
- ✅ Code quality through required reviews
- ✅ All tests pass before merging
- ✅ No force pushes to main branch
- ✅ No accidental deletions
- ✅ Consistent commit history
- ✅ Security and stability

## 🛡️ Recommended Protection Rules

### For `main` Branch

Follow these steps to protect the `main` branch:

## 📋 Step-by-Step Setup

### 1. Navigate to Settings

1. Go to your repository: https://github.com/mohamed-elkholy95/rich-text
2. Click **Settings** tab
3. Click **Branches** in left sidebar
4. Click **Add branch protection rule**

### 2. Configure Branch Name Pattern

```
Branch name pattern: main
```

### 3. Required Settings

#### ✅ Require a pull request before merging
- [x] **Require a pull request before merging**
  - [x] Require approvals: **1**
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners
  - [ ] Restrict who can dismiss pull request reviews (optional)
  - [x] Allow specified actors to bypass required pull requests (for emergencies)
    - Add: `mohamed-elkholy95`

#### ✅ Require status checks to pass before merging
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging

**Required Status Checks** (select these after first CI run):
- `quality / Code Quality`
- `build / Build (20)` (or all Node versions)
- `test / Test (ubuntu-latest, 20)` (recommended: all platforms)
- `security / Security Audit`
- `all-checks / All Checks Passed`

#### ✅ Require conversation resolution before merging
- [x] **Require conversation resolution before merging**

#### ✅ Require signed commits (Optional but Recommended)
- [x] **Require signed commits**

#### ✅ Require linear history
- [x] **Require linear history**
  - This enforces squash or rebase merging (no merge commits)

#### ✅ Require deployments to succeed before merging (Optional)
- [ ] Require deployments to succeed before merging

#### ✅ Lock branch (Optional - for release branches)
- [ ] Lock branch

#### ✅ Do not allow bypassing the above settings
- [x] **Do not allow bypassing the above settings**
  - Except for administrators in emergencies

#### ✅ Restrict who can push to matching branches
- [x] **Restrict who can push to matching branches**
  - Add: `mohamed-elkholy95`
  - This prevents direct pushes (all changes via PR)

#### ✅ Allow force pushes
- [ ] **Allow force pushes** (Keep UNCHECKED)

#### ✅ Allow deletions
- [ ] **Allow deletions** (Keep UNCHECKED)

### 4. Save Protection Rule

Click **Create** or **Save changes**

---

## 🎯 Quick Configuration (Copy-Paste Checklist)

Use this checklist when configuring:

```
Branch Protection Rule Configuration
====================================

Branch name pattern: main

☑ Require a pull request before merging
  ☑ Require approvals: 1
  ☑ Dismiss stale pull request approvals when new commits are pushed
  ☑ Require review from Code Owners

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  Required checks:
    ☑ quality / Code Quality
    ☑ build / Build (20)
    ☑ test / Test (ubuntu-latest, 20)
    ☑ security / Security Audit
    ☑ all-checks / All Checks Passed

☑ Require conversation resolution before merging

☑ Require signed commits (recommended)

☑ Require linear history

☑ Do not allow bypassing the above settings

☑ Restrict who can push to matching branches
  Allowed: mohamed-elkholy95

☐ Allow force pushes (UNCHECKED)

☐ Allow deletions (UNCHECKED)
```

---

## 🔐 Additional Security Settings

### Enable Additional Repository Settings

1. **Settings → General**
   - [ ] Allow merge commits (disable for clean history)
   - [x] Allow squash merging
   - [x] Allow rebase merging
   - [x] Always suggest updating pull request branches
   - [x] Automatically delete head branches

2. **Settings → Code security and analysis**
   - [x] Dependency graph (enabled by default)
   - [x] Dependabot alerts
   - [x] Dependabot security updates
   - [x] Dependabot version updates
   - [x] Code scanning (CodeQL already configured)
   - [x] Secret scanning

3. **Settings → Actions → General**
   - Workflow permissions: **Read and write permissions**
   - [x] Allow GitHub Actions to create and approve pull requests

---

## 📊 Protection Levels Comparison

### Minimal Protection (Not Recommended)
```
✅ Require pull request
✅ Require 1 approval
✅ No force pushes
✅ No deletions
```

### Standard Protection (Recommended)
```
✅ Require pull request
✅ Require 1 approval
✅ Require status checks
✅ Require conversation resolution
✅ No force pushes
✅ No deletions
✅ Restrict direct pushes
```

### Maximum Protection (Enterprise)
```
✅ Require pull request
✅ Require 2+ approvals
✅ Require all status checks
✅ Require signed commits
✅ Require linear history
✅ Require conversation resolution
✅ No force pushes
✅ No deletions
✅ Restrict direct pushes
✅ Require deployment success
✅ No bypass allowed
```

**Current Recommendation**: **Standard Protection** ⭐

---

## 🚀 Workflow Integration

### Status Checks Required

After setting up protection, these checks must pass:

1. **Code Quality** (`quality`)
   - TypeScript type checking
   - ESLint validation
   - Prettier formatting

2. **Build** (`build`)
   - Successful build on Node 20
   - Build artifacts created
   - No build errors

3. **Tests** (`test`)
   - All tests passing
   - Code coverage maintained
   - Cross-platform compatibility

4. **Security** (`security`)
   - No high/critical vulnerabilities
   - Dependency audit passed
   - Snyk scan clean

5. **All Checks** (`all-checks`)
   - Aggregate check ensuring all above passed

### How to Add Status Checks

**Note**: Status checks appear in the list only after they've run at least once.

1. Create a test PR to trigger CI
2. Wait for workflows to complete
3. Go to branch protection settings
4. Scroll to "Require status checks to pass"
5. Search for and select the checks listed above
6. Save changes

---

## 👥 For Team Collaborators

### Adding Team Members

1. **Settings → Collaborators and teams**
2. Click **Add people** or **Add teams**
3. Set appropriate permissions:
   - **Read**: Can view and comment
   - **Triage**: Can manage issues/PRs
   - **Write**: Can push to non-protected branches
   - **Maintain**: Can manage repository
   - **Admin**: Full access (use sparingly)

### Recommended Team Structure

```
Maintainers (Admin):
  - mohamed-elkholy95

Core Contributors (Write):
  - [Add trusted contributors]

Contributors (Write):
  - [Add regular contributors]

Triagers (Triage):
  - [Add community helpers]
```

---

## 🔧 Emergency Procedures

### Bypassing Protection (Admins Only)

In rare emergencies, admins can:

1. **Temporarily disable protection**:
   - Settings → Branches → Edit rule
   - Uncheck required checks
   - Make emergency fix
   - Re-enable protection immediately

2. **Use bypass permission**:
   - If configured, specified actors can bypass
   - Document reason in commit message
   - Notify team of emergency change

### Hotfix Process

```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix main

# Make fix
# ... changes ...

# Commit and push
git commit -m "fix: critical security issue"
git push origin hotfix/critical-fix

# Create PR (will trigger CI)
# If protection allows, admin can bypass reviews
# Merge immediately after CI passes
```

---

## 📝 Developer Workflow with Protection

### Standard Contribution Flow

```bash
# 1. Create feature branch
git checkout -b feat/my-feature main

# 2. Make changes
# ... code ...

# 3. Pre-commit checks (Husky runs automatically)
git add .
git commit -m "feat: add awesome feature"
# ✅ Type check, lint, tests run automatically

# 4. Push to remote
git push origin feat/my-feature

# 5. Create Pull Request on GitHub
# - Fill out PR template
# - Wait for CI to pass (required)
# - Request review (required)
# - Address feedback
# - Wait for approval (required)

# 6. Merge (only after all checks pass)
# - Squash and merge (recommended)
# - Delete branch automatically
```

---

## 🎯 Best Practices

### For Maintainers

✅ **Review PRs promptly** (within 24-48 hours)
✅ **Test locally** for complex changes
✅ **Require tests** for new features
✅ **Ensure documentation** is updated
✅ **Check security implications**
✅ **Verify no breaking changes** (or document them)

### For Contributors

✅ **Keep PRs small** and focused
✅ **Write clear descriptions**
✅ **Include tests**
✅ **Update documentation**
✅ **Respond to feedback**
✅ **Keep branch updated** with main
✅ **Follow conventional commits**

### For Everyone

✅ **Never force push** to main
✅ **Never delete** main branch
✅ **Always use PR** for changes
✅ **Let CI run** before review
✅ **Resolve conversations** before merge
✅ **Keep commit history** clean

---

## 📊 Monitoring Branch Protection

### Check Protection Status

1. **Repository Settings → Branches**
   - View active protection rules
   - See which branches are protected
   - Review bypass permissions

2. **Insights → Network**
   - Visualize branch history
   - Verify no direct commits to main
   - Ensure clean merge strategy

3. **Pull Requests Tab**
   - See protection checks in action
   - Review required reviews
   - Monitor merge status

---

## ✅ Verification Checklist

After setting up protection, verify:

- [ ] Cannot push directly to main
- [ ] Cannot delete main branch
- [ ] Cannot force push to main
- [ ] PR required for all changes
- [ ] At least 1 approval required
- [ ] All status checks must pass
- [ ] Conversations must be resolved
- [ ] Commits are signed (if enabled)
- [ ] Linear history enforced (if enabled)
- [ ] Code owners automatically added as reviewers

### Test Protection

```bash
# Try to push directly (should fail)
git checkout main
echo "test" >> README.md
git commit -am "test: direct push"
git push origin main
# ❌ Should be rejected!

# Correct way (should work)
git checkout -b test/protection
git push origin test/protection
# ✅ Create PR on GitHub
```

---

## 🆘 Troubleshooting

### Issue: Can't merge PR despite approvals

**Solution**: Check that all required status checks have passed

### Issue: Status checks not appearing in branch protection

**Solution**: Status checks only appear after running at least once. Create a test PR to trigger CI.

### Issue: Contributors can't push to their branches

**Solution**: They should be able to push to their own branches, just not main. Verify their repository permissions.

### Issue: Can't bypass protection in emergency

**Solution**: Ensure your GitHub account has admin permissions and bypass is configured.

---

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Required Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
- [Code Owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Signed Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

---

## 🎉 Summary

With branch protection enabled:

✅ **Quality**: All code reviewed and tested
✅ **Security**: Protected from unauthorized changes
✅ **Stability**: Main branch always in working state
✅ **Collaboration**: Clear contribution process
✅ **Confidence**: Can deploy main at any time

**Set up branch protection now to ensure repository integrity!** 🔒
