# N4 foreign-cache handoff follow-up

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `b427fd41a65c61d31f9edbb5cb587723172e212a`.
Status: implemented on the working branch; reciprocal review/integration and combined H5 acceptance pending.

## Confirmed defect and fix

The prior coordinator correctly sent an empty import for a cache owned by B when activating A. However,
if a family changed while that request was in flight, partial canonical application retained the newer
family and then assigned owner A. The next queued request uploaded B's retained edits to A. A regression
probe failed against the prior implementation, showing the foreign saved record in A's second payload.

The coordinator now compares all three current family snapshots with the request snapshot before applying
a successful foreign-cache response. If any changed, it queues a fresh pass without applying canonical
data or changing ownership. Each pass continues sending an empty import while the cache belongs to B.
Once the snapshot is unchanged, the existing adapter replaces the cache with A's canonical state and
assigns A. This retains the existing foreign-cache replacement policy: edits to a still-B-owned cache do
not become A's imports. It does not create per-account local caches or preserve B's cache after a completed
switch to A. Repeated edits can delay that handoff; a transport failure still pauses for a later retry.

Same-account and unowned-cache import behavior is unchanged. Same-account newer families retain their
existing partial-application and queued-upload behavior. Revision checks still reject obsolete successes
and failures before any canonical application. No RPC, auth/session, storage key, merge rule or provider
implementation change; the coordinator's injected contract remains unchanged.

## Verification

- Negative control: the new saved-family regression failed before the fix, exposing B's record in A's
  second upload. After the fix, each of saved content, glossary progress and checklist progress sends an
  empty second import, leaves B's ownership/data untouched until a stable response, then applies A's state.
- Browser provider regression exercises a real local storage write/subscription while the fixture request
  is pending; the second payload stays empty and ownership changes only after the stable second response.
- Focused coordinator/provider/transport suite: **24 tests / three files passed**.
- `npx tsc --noEmit`, targeted ESLint and architecture (**709 production modules**) passed.
- `npm test -- --maxWorkers=4`: **925 tests / 173 files passed**. The existing jsdom navigation
  diagnostic appeared without a test failure. `git diff --check` passed.

Existing dependencies, no clean installation. No production build/browser UI, hosted account, cross-device,
SQL, translation audit or service activation is claimed for this follow-up. The browser binding test uses
jsdom and a mocked transport; it does not establish authenticated request binding.

## Review and remaining gate

Review this exact delta together with original N4 extraction `9061031`. The H5 expected-account/session
transport binding remains open: coordinator revisions guard local responses, not server authorization.
Hosted cross-device and combined refresh/sign-out/navigation acceptance remain necessary. Reviewed
integration stays `e4fc1ff`; do not merge the working branch head with its other unreviewed checkpoints.
