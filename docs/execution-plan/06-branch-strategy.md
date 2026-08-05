# Branch Strategy

- **Git Flow**: Trunk-based development.
- **Main Branch**: `main` (Always deployable to Production).
- **Branch Naming**: `{type}/{issue-number}-{short-description}` (e.g., `feat/TSK-201-ledger-migrations`).
- **Commit Convention**: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`).
- **Merge Rules**: Squash and Merge. Require linear history. CI must pass. 1 Approval required.
- **Hotfix**: Branch off `main` as `hotfix/...`. Merge back to `main`.
