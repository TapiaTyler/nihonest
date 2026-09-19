# Nihonest external research kit

This directory contains the stable context and output contract for research performed outside the repository, including research conducted in a ChatGPT web Project.

## Add these files to the ChatGPT Project

Keep the following files as Project context:

1. `NIHONEST-PROJECT-CONTEXT.md`
2. `RESEARCH-STANDARD.md`
3. `EXTERNAL-RESEARCH-RETURN.md`
4. `external-research-result.schema.json`

Do not add every article or the entire repository as permanent Project context. Each bounded research brief supplies the relevant article IDs, current claims, questions, and exclusions.

## Run a research workstream

1. Start a new chat in the Project.
2. Attach or paste the workstream brief, such as `briefs/OFFICIAL-FEES-AND-COSTS.md`.
3. Ask ChatGPT to follow the brief and the Project research standard.
4. Request two downloadable UTF-8 files:
   - `<research-id>.json`, conforming to `external-research-result.schema.json`;
   - `<research-id>.md`, containing the concise human-readable memo.
5. Return both files to Codex without manually merging or rewriting their contents.

Codex will validate identifiers and structure, compare the evidence with current repository content, spot-check consequential or conflicting claims, and implement only the approved scope.

## Authority boundary

External research is evidence collection, not publication approval. It must not:

- edit canonical articles;
- create repository IDs that were not supplied in the brief;
- mark an article or claim as editorially reviewed;
- decide an individual's eligibility, liability, or legal outcome; or
- silently expand the approved workstream.

When the requested evidence cannot be established, the correct result is an explicit unresolved question—not a plausible-sounding answer.
