# Profession retrieval and terminology closure

Prepared September 14, 2026 for the first bounded pass of Iteration 16B-2.

## Finding

The sampled common professions already have substantial retrieval coverage: software and engineering, design and media, teaching, translation and business work, research, licensed medical and care work, hospitality, manufacturing, construction, agriculture, fisheries, transport, and the closed Skilled Labor categories.

The meaningful remaining issue is not a missing universal profession list. It is safe routing for titles whose actual duties or Japanese qualification layer can change the analysis. Veterinary, psychology and counseling, social work, childcare, architecture, electrical work, and laboratory work should enter through comparison guidance until deeper research justifies a standalone guide.

Current official material confirms separate Japanese qualification or registration layers for Certified Public Psychologists, Certified Social Workers, childcare workers, and architects. ISA separately defines Medical Services around covered legally qualified medical work. Those facts do not by themselves select a residence status, so the implementation adds retrieval language and questions rather than conclusions.[^1][^2][^3][^4][^5]

## Implementation boundary

- Add ordinary-language profession aliases to the work-status chooser.
- Add veterinary, mental-health, welfare, and childcare comparisons to the medical/care chooser.
- Add architect and engineering variants to professional-work retrieval without treating electricians as engineers.
- Do not create thin standalone articles unless later research identifies a distinct decision process that cannot remain scannable in a comparison guide.

## Terminology repair progress

The conservative static check originally flagged 55 articles where at least one declared glossary term lacked a visible `/glossary/…` link in prose. This pass repaired 12 single-term mismatches where the existing explanation already used the concept. The remaining 43 articles require contextual review; their 115 unmatched references must not be bulk-inserted without checking relevance.

## Sources

[^1]: Immigration Services Agency of Japan, [Status of Residence: Medical Services](https://www.moj.go.jp/isa/applications/status/medicalservices), accessed September 14, 2026.
[^2]: Ministry of Health, Labour and Welfare, [Certified Public Psychologist examination-eligibility recognition](https://www.mhlw.go.jp/stf/newpage_02912.html), accessed September 14, 2026.
[^3]: Ministry of Health, Labour and Welfare, [Certified Social Workers and Certified Care Workers](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/seikatsuhogo/shakai-kaigo-fukushi1/index.html), accessed September 14, 2026.
[^4]: Ministry of Health, Labour and Welfare, [Childcare worker examination and registration](https://www.mhlw.go.jp/kouseiroudoushou/shikaku_shiken/hoikushi/index.html), accessed September 14, 2026.
[^5]: Ministry of Land, Infrastructure, Transport and Tourism, [First-class architects](https://www.mlit.go.jp/jutakukentiku/build/architect.html), accessed September 14, 2026.
