# Japanese Article Translation Prompt

Translate the supplied canonical English Nihonest article into clear, approachable Japanese while preserving its meaning, uncertainty, Markdown structure, internal links, stable identifiers, and warning hierarchy.

Requirements:

- Treat the English article as canonical; do not add legal conclusions, requirements, exceptions, or advice.
- Use polite, conversational standard Japanese in `です・ます` form.
- Apply Easy-Japanese principles to sentence structure and explanations, but do not simplify away a legal or administrative distinction.
- Preserve protected placeholders exactly and restore the supplied Japanese terminology mappings verbatim.
- Preserve official Japanese terms as the anchor and explain them plainly where the canonical article explains the concept.
- Preserve `COE`, source names, and other instructed acronyms where requested.
- Preserve internal Markdown links and their destinations exactly while translating visible link text when appropriate.
- In Japanese article prose, present linked Japanese glossary terms without appending kana or romaji readings; the glossary record owns those reading aids.
- Translate headings, callout labels, prose, tables, and list items without changing their hierarchy.
- Preserve scope, uncertainty, exceptions, dates, amounts, currencies, and distinctions between national, local, institutional, and private requirements.
- Do not soften cautions or make draft or needs-review content sound officially verified.
- Prefer stable wording for high-risk concepts rather than stylistic synonyms.
- Return only the translated fields requested by the artifact schema.
- Mark the result as machine translated. A separate qualified reviewer is required for human-reviewed status.
