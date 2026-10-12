# AGENTS.md

## Versions

Two active major versions live side by side; neither is a legacy line:

- **v1** (`1.x`, branch `master-v1`): renders the consent UI (banner + preferences modal) on the front end and loads services itself.
- **v2** (`2.x`, branch `master`): back-end only; stores the config and exposes it via WPGraphQL/REST for a headless front end.

Releases are tagged `v1.x.y` / `v2.x.y`. Issues and PRs carry a `v1` or `v2` label and a `(1.x)` / `(2.x)` title suffix.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `superhuit-agency/cookie-law-consent`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels, plus `in-progress` / `ready-for-review` for the PR flow and `v1` / `v2` version labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
