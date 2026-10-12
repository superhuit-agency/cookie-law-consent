# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Work-in-progress labels

Not triage roles; they track an issue after it has been picked up:

| Label              | Meaning                                                  |
| ------------------ | -------------------------------------------------------- |
| `in-progress`      | An agent is working on it                                |
| `ready-for-review` | A PR is open and ready for human review                  |

Flow: `ready-for-agent` → `in-progress` → `ready-for-review` → closed by the merged PR. Swap the previous label out when moving to the next one.

## Version labels

Every issue and PR gets exactly one version label, matching the `(1.x)` / `(2.x)` suffix in its title:

| Label | Version | Branch      | Scope                                                                  |
| ----- | ------- | ----------- | ---------------------------------------------------------------------- |
| `v1`  | `1.x`   | `master-v1` | Renders the consent banner/modal on the front end and loads services   |
| `v2`  | `2.x`   | `master`    | Back-end only: config exposed via WPGraphQL/REST for a headless front end |

A bug that affects both versions gets one issue per version (e.g. #19 for v1 and #12 for v2), each with its own label, since the fixes land on different branches.
