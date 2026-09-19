# Nihonest external topic-discovery kit

This directory contains stable context for discovery performed outside the repository, including a ChatGPT web Project. The default purpose is to identify topics, user situations, edge cases, and source leads that Codex may not initially consider. Codex remains responsible for primary-source research, repository comparison, and implementation.

## Add these files to the ChatGPT Project

Keep the following files as Project context:

1. `NIHONEST-PROJECT-CONTEXT.md`
2. `RESEARCH-STANDARD.md`
3. `TOPIC-DISCOVERY.md`

Do not add every article or the entire repository as permanent Project context. Each bounded research brief supplies the relevant article IDs, current claims, questions, and exclusions.

## Run the default discovery workflow

1. Start a new chat in the Project.
2. Provide a short topic and the relevant product context or current coverage summary.
3. Ask ChatGPT to follow `TOPIC-DISCOVERY.md` and look especially for overlooked cases, affected audiences, adjacent processes, useful journeys, terminology, occupations, fees, forms, and geographic variables.
4. Request a concise response in the chat. Downloadable JSON and a formal research memo are not required.
5. Paste the useful suggestions back into Codex. Codex will deduplicate them against the repository, decide scope with the editor, and verify accepted claims against current primary sources.

This division avoids asking the external chat to reproduce the repository's full evidence workflow while retaining its value as a second perspective during discovery.

## Optional formal evidence return

`RESEARCH-STANDARD.md`, `EXTERNAL-RESEARCH-RETURN.md`, `external-research-result.schema.json`, and the completed fee brief are retained as an optional contract when a future workstream genuinely benefits from structured independent evidence. They are not the default workflow. A formal return must still be independently checked before publication.

## Authority boundary

External discovery is not publication approval. It must not:

- edit canonical articles;
- create repository IDs that were not supplied in the brief;
- mark an article or claim as editorially reviewed;
- decide an individual's eligibility, liability, or legal outcome; or
- silently expand the approved workstream; or
- be treated as authoritative evidence merely because it was produced with web access.

Suggestions may identify uncertainty, but Codex must resolve consequential facts through the strongest available sources before they enter canonical guidance.
