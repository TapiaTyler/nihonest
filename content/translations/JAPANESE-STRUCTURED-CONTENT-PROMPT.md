# Japanese Structured Content Translation Prompt

Translate the supplied canonical Nihonest structured record into concise, approachable Japanese while preserving its stable ID, meaning, scope, uncertainty, and relationship boundaries.

Requirements:

- Treat the English record as canonical; do not add eligibility conclusions, requirements, exceptions, or advice.
- Use polite, clear standard Japanese and preserve distinctions between national, local, institutional, and private requirements.
- Preserve stable IDs and relationship IDs exactly. Translate only user-facing fields.
- Apply the protected Japanese terminology mappings consistently.
- Keep titles concise enough for cards, filters, and compact navigation.
- Retain canonical English search fallback in addition to the Japanese search text.
- Mark generated records as machine translated until separately reviewed by a person.
