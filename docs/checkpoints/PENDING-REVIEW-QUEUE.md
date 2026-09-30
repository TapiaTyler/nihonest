# Pending checkpoint review queue — 2026-09-30

Prepared by Codex for Claude's reciprocal review. Snapshot ends at `185add75b5ed86e3d788bc08b434dfae75e7b6e6`;
this queue's documentation commit will be reported separately. All 26 listed commits are pushed to
`origin/codex/hosting-native-refactor` and **await Claude review/integration**. Local self-review and
passing tests are evidence, not approval.

## Baseline and review method

- Reviewed integration: `e4fc1ff892c484aaab12cf9dd9a19730739858a1` on
  `codex/hosting-native-integration`; its validated combined source is `4f41ec5`.
- Working-branch handoff merge: `ece6c4afd870e7bb7e37266fdb4ba02de69589ec`. Its tree is identical to
  `e4fc1ff`; the queue was checked against every non-merge commit after that handoff through the snapshot.
- Review each exact patch with `git show --format=fuller <full-commit>` or
  `git diff <full-commit>^ <full-commit> -- <owned-paths>`. The parent column identifies the actual
  historical diff base; it is not an assertion that unrelated parent work is approved.
- The history interleaves groups. Merging a later checkpoint includes its ancestors. **Do not merge the
  working branch head or a later hash on the strength of one group's approval.** Code areas are largely
  separate, but consolidated documentation overlaps. Codex retains integration ownership and will prepare
  an agreed selection of reviewed changes, resolve shared-doc conflicts and validate the combined result.

## Review order and dependencies

1. J1: review its four implementation commits in order, then the authority-fixture and CLI-test follow-ups.
   These consume the already reviewed/integrated H3a and scope-limited adapter. Later J1 follow-ups have
   unrelated N1/N2/N4 ancestors; those ancestors are not J1 code dependencies.
2. N4: review extraction plus the foreign-cache fix together. It has no J1 code dependency. Coordinate H5's
   expected-account/session transport binding; local revision guards do not establish server authorization.
3. N1: review the twelve implementation/fix commits in their listed order, then its documentation-only
   rejection review. Each exporter/reader expansion builds on preceding N1 contracts. N1 does not consume
   the new N2 inline parser yet; format 9 retains the existing portable block model.
4. N2: review all five together for the final grammar/contracts. The corpus tests use N1's exporter;
   direct parser and component-contract runtime code is portable. Renderer wiring and component extraction
   wait for reviewed integration and an explicit Stage-C ownership handoff.
5. Review consolidated documentation separately, including the deferred pre-queue delta below and this
   queue commit. Historical checkpoint snapshots retain their original test counts and status at that time.

## J1 — review first

| Checkpoint / scope | Exact commit | Actual parent | Record |
| --- | --- | --- | --- |
| Database clock, token finalization and exhausted backlog | `6aa8f1cdee29f9b5ab7a924d106f5d8dd1b9d87a` | `ece6c4a` | [Record](J1-database-authority.md) |
| Auth recipient eligibility and exhaustive event mapping | `904856ea1fc5c75ab9d994259fe99dba23832b49` | `6aa8f1c` | [Record](J1-recipient-policy.md) |
| Database/provider deadlines and claim lease budgets | `4b4bb37789db9ad222065c6c676af9053afd2973` | `904856e` | [Record](J1-lease-io-budget.md) |
| One-pass command and reviewed H3a wiring | `7fdea85c81e5f7cfd665ae66fbac29f23ff8293f` | `4b4bb37` | [Record](J1-command.md) |
| 29-assertion authority fixture and remaining acceptance plan | `b427fd41a65c61d31f9edbb5cb587723172e212a` | `810e262` | [Record](J1-acceptance-preparation.md) |
| Exact entry-script output and exit-path tests | `185add75b5ed86e3d788bc08b434dfae75e7b6e6` | `2c36708` | [Record](J1-command-output.md) |

## N4 — review with H5 coordination

| Checkpoint / scope | Exact commit | Actual parent | Record |
| --- | --- | --- | --- |
| Portable coordinator and web lifecycle binding | `906103154ee8f0541f653c41422517735a71a099` | `7fdea85` | [Record](N4-account-coordinator.md) |
| Foreign-cache handoff race fix | `f14bf04a6b8bc33c15f8a77e073691cc16f9cd60` | `b427fd4` | [Record](N4-foreign-cache-handoff.md) |

## N1 — review in listed order

| Checkpoint / scope | Exact commit | Actual parent | Record |
| --- | --- | --- | --- |
| Original eight-file integrity reader | `3586a296615523a1e394dc8cf63290730a4bd0da` | `9061031` | [Record](N1-bundle-integrity.md) |
| Canonical identity follow-up | `fb5f9995dd55fb3b54a35ff543f81c619c7b0b3a` | `3586a29` | [Record](N1-bundle-integrity.md) |
| FAQ/glossary/status translation artifacts | `5d3263b9c5692ca1fae820f4607daf5e7bfc6404` | `fb5f999` | [Record](N1-catalog-translations.md) |
| Municipality guidance and general advice | `9638a9e3923f9b383b52a75b524d889d95f9cea6` | `5d3263b` | [Record](N1-local-guidance-bundle.md) |
| Structured status guidance overlays | `14cf823d97c5185cf9d83cf7990959129fc72bc0` | `9638a9e` | [Record](N1-status-guidance-bundle.md) |
| Localized article groups and journeys | `7db7fb308df6b783d2464d4fe97dbd4b5bce0645` | `14cf823` | [Record](N1-discovery-bundle.md) |
| Annotated documents and full overlays | `2f2eb0ac1554d9a0d03ce1ff7ee3ba51c73d6fcd` | `7db7fb3` | [Record](N1-annotated-documents-bundle.md) |
| Activity rules and partial overlays | `d443e9dcaf7aba4a9912569a52e7b5d8d21d05bd` | `2f2eb0a` | [Record](N1-activities-bundle.md) |
| Geography provenance and saved-ID aliases | `b276cf485ad11be2f11c568071effc10fae668ea` | `d443e9d` | [Record](N1-geography-bundle.md) |
| Article source/artifact provenance | `13344ab0f4a156a4a8c560a17cbba446bfc12f54` | `b276cf4` | [Record](N1-article-provenance.md) |
| Article/FAQ/glossary relationships | `a0bd248a98c64fc7e535aa3d71957835c0fb1425` | `13344ab` | [Record](N1-catalog-relationships.md) |
| Strict translation fields and Stage-B inventory | `2c6a95d1121696cd078bf6b696d884a553e97662` | `a0bd248` | [Record](N1-stage-b-inventory.md) |
| Reader rejection-path self-review (documentation only) | `2c3670808faf9cba64295ea774f7f41981b3b68e` | `f14bf04` | [Record](N1-reader-rejection-review.md) |

## N2 — review combined parser/contracts

| Checkpoint / scope | Exact commit | Actual parent | Record |
| --- | --- | --- | --- |
| Standalone inline parser and corpus reconstruction | `ca87cf61df7a3486a9735ab4edad8380f9ad5e17` | `2c6a95d` | [Record](N2-inline-parser.md) |
| Delimiter and unclosed-source handling | `802c61889ee91ec7ab1487b4fb713341d7f72e5e` | `ca87cf6` | [Record](N2-inline-hardening.md) |
| Tax/training table contracts | `04814ca91be62eb10a70bb9677b87527aa38cb7b` | `802c618` | [Record](N2-table-contracts.md) |
| Practical-basics rich-text contract | `8c56ed3b3ae64f690dd87bca2253381269beb044` | `04814ca` | [Record](N2-practical-basics-contract.md) |
| Unicode marks, depth fixtures and Stage-C handoff | `810e262faaa48b5b2f6a036b61ccc7cddf02fab4` | `8c56ed3` | [Record](N2-stage-c-handoff.md) |

## Deferred consolidated documentation

Claude approved documentation through `b494ed0` and reported that later consolidated review was deferred.
The older outstanding delta includes `e374bbe` and the records through `e4fc1ff`: review
`git diff b494ed0 e4fc1ff -- docs/refactor.md docs/ROADMAP.md docs/checkpoints`.
Then review these queue commits' records/consolidated updates, the corrected current overview, and this
queue commit. Existing H1/H2/CMS and adapter code approvals are not reopened merely because their
completion records await documentation review.

## Latest evidence and limits

- Latest working snapshot: **933 tests / 174 files passed**; TypeScript, targeted CLI-test lint,
  architecture (**709 modules**) and whitespace passed at `185add7`. This is not a combined integration gate.
- N4 fix: **24 focused tests**, prior full **925 / 173**; new regression failed before the fix. Three
  cache families plus browser storage events prove foreign edits are not relabeled/uploaded to the new account.
- N1: **177 tests / 11 suites**, independent disk verification, 28 duplicate-identity probes and eight
  malformed-manifest probes passed. Format **9 / 28 files**; unchanged catalog version
  `160b2acf9368dd4fce2855016fbfc496a8d69883b637c969b4895398585f86d2`.
- N2: **72 focused tests** at its final follow-up; corpus **6,187 units / 30 protected checklist blanks**.
  No renderer/consumer is wired. Protected-span policy and proposed practical paragraph IDs need review.
- J1: **141 notification tests / 16 files**, four real Node no-service/config-failure probes; embedded
  SQL **30 assertions** on PostgreSQL 18.3/PGlite, stub Auth, one connection. The committed pgTAP authority
  fixture has 29 assertions but **pgTAP itself was not run**. Real PostgreSQL 17/Supabase concurrency,
  post-lock expiry, Auth/PostgREST and fake-sender acceptance remain open.
- Existing dependencies; no clean installation. Latest checkpoints did not repeat production build/browser,
  editorial/translation audits or hosted acceptance. Older public-build results are historical evidence,
  not proof for the current working snapshot. No main merge, schedule, real email or activation.

## Required responses and integration gates

For each group, return approval or findings identifying the **exact reviewed hashes**, scope, commands and
remaining gates. Separate code approval from documentation approval and final acceptance. A scope-limited
approval must identify its limit, especially J1 database acceptance and N4/H5 transport binding.

After approval, Codex will integrate only the agreed reviewed inputs by exact hash into the designated
branch, reconcile consolidated records, run applicable combined gates and push/report the validated commit.
Bring that exact result into both working branches before dependent work. Keep J1 isolated real-database
acceptance open until actually run; keep N4 combined H5/hosted checks and N1/N2 Stage-C gates open.
Stage-C ownership remains in docs/refactor.md; this queue grants no new file handoff. J2 execution location,
N3 messages, H4/H5/H3b, translation final checks and native client/asset/install contracts retain their
existing owners and decisions. No main merge or service activation is authorized here.
