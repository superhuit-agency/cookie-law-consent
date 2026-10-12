# Dependency security is handled differently on master and master-v1

Dependabot only reads its config from the default branch (`master`), computes alerts from `master`'s dependency graph, and opens security updates against `master` only, so the two active branches can't be covered the same way. `master` (2.x) gets Dependabot security updates, grouped into one PR per ecosystem, with version updates turned off until its build tools are modernized. `master-v1` (1.x) gets weekly Dependabot version updates through `target-branch` (the fixes) plus a scheduled OSV-Scanner audit of its lockfiles, run from `master`, that keeps a `v1` issue open while known vulnerabilities remain (the detection). Both live in `.github/` on `master`, so the coverage for `master-v1` must never be moved to that branch.

## Consequences

- Dependabot PR titles carry the version as a prefix (`chore(1.x): ⬆️ …`) instead of the usual `(1.x)` suffix, because Dependabot can't add a suffix.
- Version updates don't touch transitive dependencies, so vulnerabilities the audit reports in indirect packages on `master-v1` have to be fixed by hand (for example with `yarn upgrade <pkg>` or a `resolutions` entry).
