# Step 1 specification review, revision 1

This report summarizes the separate review responses received in the active conversation from `/root/step1_readiness_review` and `/root/step1_fixture_audit`. The coordinator records their findings here. Neither reviewer authored the assessed package, edited product files, or executed the proposed verification command. This is planning evidence, not a product-format approval record.

The assessed package is the four files under `../revisions/1/`, identified by `../revisions/1-manifest.json`. Both reviewers found changes necessary before technical approval. User approval was pending throughout the review.

| Finding | Reviewer source | Correction proposed for revision 2 |
| --- | --- | --- |
| Workspace and record-store roots were conflated | Readiness review | Distinguish workspace-relative paths, approved external locations, and record-store paths |
| Later reviewers assessed their own earlier authored evidence | Both reviews | Use three distinct phase reviewers and complete transitive author inventories |
| Preserved specification tasks already claimed implementation completion | Readiness review | Preserve the original unfinished task definition; record progress separately |
| Amendment omitted affected contract and work artifacts | Both reviews | Enumerate eight new revision paths while preserving historical contents |
| Incomplete presented drafts lacked explicit preservation semantics | Readiness review | Preserve exact draft bytes without declaring completeness; increment the next editable revision |
| Intermediate state meanings lacked explicit evidence requirements | Readiness review | Define every state, current-step constraints, dependency references, and applicable evidence |
| Paired correctness results lacked run association | Readiness review | Bind correctness groups to run references and comparison rules to check identities |
| Interview path depended on the wrong directory depth | Both reviews and coordinator | Use a repository-relative path |
| Verification checked final files but not ancestor symbolic links | Fixture audit | Check each ancestor directory before reading a file |

The reviewers confirmed twenty product files, twelve JSON templates, sixteen cases, and twenty-nine virtual fixture artifacts. These counts do not establish approval or implementation readiness. Revision 1 remains unchanged. The corrected package is preserved separately for another assessment.
