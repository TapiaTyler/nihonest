# Document and Form Literacy Discovery

Prepared: 2026-09-13  
State: Proposed for scope approval  
Structured record: `content/editorial/discovery/document-and-form-literacy.json`

Approved architecture amendment: document-specific history was approved on 2026-09-13. The implementation must default to the current applicable document while allowing useful immutable historical versions to be selected inside the article.

## Recommendation

Build one reusable annotated-document system and validate it with six document families:

1. residence card under the design introduced June 14, 2026;
2. Certificate of Eligibility in paper and electronic context;
3. My Number Card and application or notification context;
4. notification of change in residence, using Shinjuku and Nagoya to show municipal variation;
5. Salary Income Withholding Tax Slip for a named tax year; and
6. municipal and prefectural resident-tax notice, using Nagoya's multilingual explanation as the bounded local example.

The default visual should be a Nihonest-created schematic containing obviously synthetic data, not a redacted real document. An official specimen can be used only when its exact reuse terms, excluded elements, attribution, modification disclosure, and version have been recorded.

The visual is supplementary. Every callout and field explanation must exist as semantic HTML outside the image so it can be read by assistive technology, searched, translated, printed, and understood when images do not load.

## Document-specific history

A document family may contain several immutable versions. The current applicable version is selected by default. When a historical version remains useful—for example, a 2025 withholding slip or a residence card issued before the 2026 redesign—the article may offer a compact selector such as `2026 — Current` and `2025 — Archived`.

Changing the selection must replace the whole versioned artifact together: schematic, field labels, semantic explanations, dates, warnings, source links, and review metadata. An older image must never inherit current annotations merely because the fields look similar.

Archived and editorial state are separate concepts. A version can be `current`, `superseded`, or `future` while independently being `needs-review`, `verified`, or `stale`. Archived versions must state their applicable period and explain that they help interpret an older record; they are not a recommendation to submit an obsolete form.

The pilot does not need a direct URL for each version and should not persist the selection to the account or device. History should be added only when users may realistically possess the older document or a material field or layout changed—not for every cosmetic revision.

## Why these six documents

The set exercises different risks without turning 13B into a document library:

- the residence card tests front-and-back relationships, identity and work-authority misunderstandings, security features, and a current design transition;
- the COE tests paper versus electronic presentation and a commonly confused immigration decision;
- My Number tests sensitive-number and electronic-credential boundaries;
- the moving form tests municipal variation and a form the user may need to complete;
- the withholding slip tests a dense annual employer-issued tax record; and
- the resident-tax notice tests delayed local taxation, collection methods, multilingual source material, and municipality-specific layout.

A full final income-tax return is not recommended for the first implementation. The form is annual, multi-page, conditional, and connected to numerous schedules. The NTA already publishes a field-by-field English guide and increasingly routes users through e-Tax. Nihonest should link that current material and revisit an annotated return only after the component works on simpler tax records.

## Presentation contract

Each example should render in this order:

1. document name, Japanese name, issuer, jurisdiction, version or tax year, and review state;
2. a prominent notice such as “Fictional educational example — not valid and not for submission”;
3. a responsive schematic with numbered controls, no functional barcode or QR code, and no realistic identity number;
4. a complete ordered HTML explanation using the same numbers;
5. “what to verify” and “do not confuse this with” sections;
6. the current official specimen, instructions, or service link, with source language and format; and
7. the last-checked date and any known replacement or transition warning.

Selecting a visual marker should focus or reveal the corresponding explanation. Selecting an explanation should be able to identify the visual region, but no information may depend on that visual response. Keyboard focus, screen-reader labels, headings, list order, and visible focus state are required. On mobile, the explanation follows the schematic rather than opening in a narrow overlay.

Translations apply to Nihonest's headings and explanations. Protected Japanese field labels remain available, and a translation must not silently replace the label found on the real document.

## Proposed data model

The implementation should keep document identity separate from a particular image:

- stable document and example IDs;
- canonical name, Japanese name, issuer, document family, jurisdiction, and associated article IDs;
- version label, valid-from date, valid-through date when known, or tax year;
- document lifecycle state (`current`, `superseded`, or `future`) kept separate from editorial review state;
- source ID, source language, source format, official-specimen URL, and recorded reuse basis;
- example type: Nihonest schematic, attributed modified official content, or direct official link only;
- synthetic-data statement and prohibited realistic elements;
- fields with stable IDs, Japanese label, concise meaning, longer explanation, warnings, and numbered callout;
- relationships between front and reverse sides or between a document and an attachment;
- review status, last checked, last reviewed, replacement document ID, and stale state; and
- an immutable version list whose selected entry replaces its visual, fields, warnings, dates, and sources atomically; and
- accessibility text that is complete independently of the visual.

The same field concept may appear in more than one document, but the rendered explanation should remain attached to the versioned example. This prevents a field change in one tax year or municipality from silently changing another document.

## Privacy and anti-misuse rules

- Never accept a real user's document as the starting asset for a public example.
- Use conspicuously fictional names such as `NIHONEST TARO` and non-deliverable example addresses.
- Do not generate a checksum-valid My Number, residence-card number, tax identifier, barcode, QR code, signature, seal, or machine-readable credential.
- Replace portraits and security designs with labeled placeholders rather than realistic substitutes.
- Do not reproduce government logos merely to make a schematic look authentic.
- Keep a permanent notice inside both the visual and accessible text that the example is invalid and non-submittable.
- Do not offer document upload, OCR, automatic redaction, account storage, form generation, or submission in this phase.

## Source and reuse findings

Government content is not automatically unrestricted. The [Digital Agency copyright policy](https://www.digital.go.jp/en/copyright-policy) applies the Public Data License unless otherwise stated, requires attribution, requires modification disclosure, prohibits presenting edited material as an unedited government product, and excludes items such as organizational symbols and separately governed content. The [Ministry of Justice terms](https://www.moj.go.jp/EN/hisho/kouhou/m_hisho06_termsofuse.html) also state that site content is copyright protected and directs reuse to its content-use rules. ISA separately states that its publicly released second-generation residence-card specifications are copyright protected and can be revised.

Therefore, “official source” and “safe to reproduce” must be separate metadata. The first pilot should link official specimens while drawing its own low-fidelity educational schematic. If an official image is later included, its recorded license decision must identify the exact asset—not merely the agency website.

## Document findings

### Residence card

ISA's [residence-card explanation](https://www.moj.go.jp/isa/applications/procedures/whatzairyu_00001.html) now distinguishes cards issued before and after June 14, 2026 and introduces the new residence-card and specified-residence-card context. The existing front and reverse side can communicate different parts of the work-authority picture: visible work restrictions, address updates, pending application notation, and outside-activity permission may need to be read together. A schematic must not reproduce anti-counterfeit design or suggest that viewing a card alone resolves every designated-activity or authenticity question.

### Certificate of Eligibility

ISA provides online-system material for [electronic COE receipt and residence applications](https://www.moj.go.jp/isa/applications/online/onlineshinsei.html). The example should emphasize what the COE identifies and the later steps it supports. It must repeat that the COE is not an entry visa, landing permission, residence card, or guarantee of either visa issuance or admission at the border.

### My Number

The Digital Agency publishes [official My Number resources](https://www.digital.go.jp/en/policies/mynumber_resources), while ISA provides multilingual card-application examples through its support portal. The educational artifact should focus on concepts and privacy: card identity use, the Individual Number, electronic certificates, expiry, address updates, and the newer residence-card integration context. It should never display a realistic full number or functional machine-readable element.

### Municipal change of residence

[Shinjuku's form directory](https://www.city.shinjuku.lg.jp/todokede/koseki03_000011.html) provides resident-record applications and moving-out forms in multiple languages. [Nagoya's resident-registration instructions](https://www.city.nagoya.jp/kurashi/todokede/1007833/1007834/1007835.html) state that ordinary moving-in and within-city forms are provided at ward or branch counters, while certain moving-out forms and examples can be downloaded. This supports a shared field-concept explanation with separately identified municipal examples; it does not support inventing one national moving form.

### Salary Income Withholding Tax Slip

The NTA's [2026 statutory-report instructions](https://www.nta.go.jp/publication/pamph/hotei/tebiki2026/index.htm) contain the current Salary Income Withholding Tax Slip and detailed field instructions. The artifact should explain gross payment, employment-income amount, deductions, withholding, social-insurance fields, dependants, payer details, and year-end-adjustment context. It must not call the slip take-home-pay evidence, a resident-tax notice, a final return, or proof that no separate return is required.

### Resident-tax notice

Nagoya publishes a [multilingual explanation of its municipal and prefectural resident-tax notice](https://www.city.nagoya.jp/kurashi/zeikin/1012135/1037357/1012136/1012137.html). This is a strong pilot because it provides an official local explanation and exposes the difference between assessed income, deductions, collection method, installments, and inquiry destination. The artifact must be labeled Nagoya-specific and cannot be used as the Shinjuku or nationwide layout.

### Final return and departure documents

The NTA's [English income-tax guide](https://www.nta.go.jp/english/taxes/individual/incometax_2025.htm) already explains the two-page return, earnings, deductions, tax calculations, resident-tax entries, attachments, payment, departure, and tax-agent matters. The guide is tied to a tax year, and current NTA notices indicate form changes around its September 2026 system renewal. Iteration 13B should link this material from the tax artifacts instead of freezing a large return into the pilot.

## Review triggers

A document example becomes stale when any of the following changes:

- the official form, card design, tax year, layout, field label, accepted submission channel, or issuer;
- a linked official specimen or instruction is replaced;
- a municipality changes its downloadable or counter-only form policy;
- an integration changes the relationship between the residence card and My Number Card;
- reuse terms or attribution requirements change; or
- a translated explanation no longer matches the canonical field model.

The stale state should remove unsupported field claims from normal presentation while keeping the source-review trail. Translation artifacts should be invalidated using the existing localization rules whenever canonical explanations change.

## Decisions requested before Iteration 13B

1. Approve the six document families listed in the recommendation.
2. Approve Nihonest-created schematics with synthetic data as the default and exact-asset reuse review before displaying official specimens.
3. Approve deferring a full annotated final income-tax return while linking current NTA instructions.
4. Approve one canonical article placement for each complete example, with glossary pages linking to that section rather than duplicating the artifact.

No Docker, Supabase, image-generation service, or active development server is required for this discovery checkpoint.
