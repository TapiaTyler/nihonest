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

A second bounded pass reviewed seven connected arrival-and-settlement guides rather than mechanically editing unrelated status articles. Address registration, My Number, National Health Insurance, National Pension, housing, mobile service, and banking now introduce every declared term in the explanatory prose. The conservative queue is now 36 articles with 91 unmatched references. These counts identify review candidates, not instructions to force every remaining metadata term into an article.

A third bounded pass reviewed six student-entry and school-transition guides. School arrival, documents received at entry, pre-departure preparation, short-term study, the Student visa and COE sequence, and part-time work now introduce their declared route, document, permission, and residence terms where those distinctions matter. The conservative queue is now 30 articles with 70 unmatched references.

A fourth bounded pass reviewed six professional-work guides: Engineer/Specialist in Humanities/International Services, Instructor, Professor, Researcher, Intra-company Transferee, and Legal/Accounting Services. Each now introduces Status of Residence and Certificate of Eligibility in the relevant route or evidence explanation; the three guides that declare extension terminology also introduce it in their renewal sections. The conservative queue is now 24 articles with 55 unmatched references.

A fifth bounded pass reviewed the Designated Activities route family and the connected post-employment sequence. The umbrella, Digital Nomad, J-Find, Long Stay, Medical Stay, and Working Holiday guides now teach their declared status, period, permission, visa, change, and residence-card terms in the passages where those distinctions matter. The three job-ending and immigration-transition guides now introduce both Designated Activities and Employment Continuation Support in Japanese rather than linking an unexplained English label. After accounting for the new post-employment terminology added during this pass, the conservative queue is now 18 articles with 41 unmatched references.

A sixth bounded pass reviewed five family and personal-status guides: Dependent, Long-Term Resident, Permanent Residence, Spouse or Child of Japanese National, and Spouse or Child of Permanent Resident. Each now introduces its declared Status of Residence, Certificate of Eligibility, Permanent Resident, or Residence Card terminology at the point where the route, entry evidence, or continuing documentation is explained. The conservative queue is now 13 articles with 31 unmatched references.

A seventh bounded pass reviewed the connected Training, Technical Intern Training, Employment for Skill Development, and Specified Skilled Worker routes. Each now introduces Status of Residence and Certificate of Eligibility where it explains the route or entry process. The Specified Skilled Worker guide also introduces Technical Intern Training and Employment for Skill Development in Japanese where it distinguishes the two transition paths. The conservative queue is now 9 articles with 21 unmatched references.

An eighth bounded pass reviewed Business Manager, Start-up, Highly Skilled Professional, Cultural Activities, Religious Activities, and Skilled Labor. Each now introduces Status of Residence and Certificate of Eligibility within its route and evidence explanations, while Start-up also distinguishes the consular Visa term from the COE and residence permission. The conservative queue is now 3 articles with 8 unmatched references.

A route-field terminology supplement adds glossary-backed Japanese, kana, and romaji for all nineteen distinct fields appearing across the current Specified Skilled Worker and Employment for Skill Development lists and all nine Skilled Labor occupational categories. The implementation reuses shared field records across the two workforce systems while preserving their different field coverage and rules. Training and Cultural Activities now link every named neighboring route directly from their comparison sections. These additions do not change the remaining conservative queue because each new declared term is introduced in its article prose.

A ninth and final bounded pass reviewed Diplomatic, Official, and Consumption Tax and the Invoice System. The official-assignment guides now distinguish Status of Residence, Visa, and Landing Permission in Japanese within their application sequence. The tax guide introduces Taxable Business and Licensed Tax Accountant where those concepts affect registration and professional advice. The conservative static queue is now empty: every declared glossary term across the article catalog has a visible contextual glossary link in its article prose.

## Sources

[^1]: Immigration Services Agency of Japan, [Status of Residence: Medical Services](https://www.moj.go.jp/isa/applications/status/medicalservices), accessed September 14, 2026.
[^2]: Ministry of Health, Labour and Welfare, [Certified Public Psychologist examination-eligibility recognition](https://www.mhlw.go.jp/stf/newpage_02912.html), accessed September 14, 2026.
[^3]: Ministry of Health, Labour and Welfare, [Certified Social Workers and Certified Care Workers](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/seikatsuhogo/shakai-kaigo-fukushi1/index.html), accessed September 14, 2026.
[^4]: Ministry of Health, Labour and Welfare, [Childcare worker examination and registration](https://www.mhlw.go.jp/kouseiroudoushou/shikaku_shiken/hoikushi/index.html), accessed September 14, 2026.
[^5]: Ministry of Land, Infrastructure, Transport and Tourism, [First-class architects](https://www.mlit.go.jp/jutakukentiku/build/architect.html), accessed September 14, 2026.
