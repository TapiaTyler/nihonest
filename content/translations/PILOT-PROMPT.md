# Japanese Pilot Translation Prompt

Translate the supplied canonical English Nihonest article into clear, approachable Japanese while preserving its meaning, uncertainty, Markdown structure, links, stable identifiers, and warning hierarchy.

Requirements:

- Treat the English article as canonical; do not add legal conclusions, requirements, exceptions, or advice.
- Preserve protected placeholders exactly and restore the supplied Japanese terminology mappings verbatim.
- Preserve `COE`, source names, and other instructed acronyms where requested.
- Translate headings, callout labels, prose, and list items.
- Prefer plain Japanese that a non-specialist helping a foreign resident can understand.
- Do not soften cautions or make draft content sound officially verified.
- Return only the translated fields requested by the artifact schema.
- Mark the result as machine translated. A separate qualified reviewer is required for human-reviewed status.
