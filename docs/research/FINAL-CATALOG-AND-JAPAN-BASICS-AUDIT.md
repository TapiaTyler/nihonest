# Final catalog and Japan-basics audit

Prepared September 13, 2026 for Iteration 16A. The editor approved the recommended scope on September 14, 2026; this document does not itself publish or editorially approve new guidance.

## Executive finding

Nihonest now has broad procedural depth, but it lacks a small orientation layer explaining the geographic and administrative words used across that guidance. A standalone **Understanding Japan: geography, local government, and language** guide would solve that gap without becoming a journey or an artificial one-article group.

The structural inventory also confirms a previously recorded editorial issue. All 94 current articles declare at least one source, search term, glossary relationship, and content relationship, but a conservative static check found 55 articles where at least one declared glossary term is not visibly linked in the prose. That does not prove every term is absent, but it identifies the required 16B review set. A term belongs in metadata only when the article genuinely teaches or uses it.

All 94 articles remain `needs-review`. This is correct: research and implementation by Codex cannot confer human editorial approval.

The first automated coverage and editorial-script attempts failed before either audit loaded because Node reported `uv_os_get_passwd returned ENOMEM`. After the editor freed host resources, the editorial audit completed through a process-only fallback and passed across 408 content records with no blocking editorial-state inconsistencies. The coverage audit still belongs in the final 16B-2 closure pass after the remaining repairs.

## Recommended standalone guide

The guide should teach a useful mental model rather than assemble trivia.

### 1. An archipelago with meaningful regional variation

Explain the four large islands—Hokkaido, Honshu, Shikoku, and Kyushu—while acknowledging Japan's many smaller islands. Japan extends far enough north to south that climate, seasons, ecosystems, transport, and hazard exposure cannot be generalized from Tokyo. The Ministry of Foreign Affairs describes the four large islands, roughly 378,000 square kilometres of territory, extensive forest coverage, and broad subarctic-to-subtropical variation.[^1]

Use current statistical links instead of freezing population or economic figures. The Statistics Bureau publishes an annual English handbook with land, climate, population, economic, social, and administrative maps, along with archived editions.[^2]

### 2. Regions help orientation but do not identify one government

Common labels such as Hokkaido, Tohoku, Kanto, Chubu, Kansai or Kinki, Chugoku, Shikoku, Kyushu, and Okinawa can help readers organize geography. The article must warn that agencies define regions differently for their own purposes. MLIT materials, for example, publish purpose-specific regional definitions that do not always assign every prefecture identically.[^3]

This matters in Nihonest: a region name may help someone search, but a procedure usually requires the exact prefecture, municipality, responsible office, or national agency.

### 3. “Prefecture” is an English umbrella

Explain [都道府県](https://www.clair.or.jp/j/forum/pub/docs/jichi2024-en.pdf) (*todōfuken*) as the collective Japanese term for the 47 prefectural-level governments. The English word *prefecture* conveniently covers Tokyo-to, Hokkaido-do, Kyoto-fu and Osaka-fu, and the forty-three ken. Then distinguish municipalities—cities, towns, villages, and Tokyo's special wards—from prefectural government.[^4]

The guide should specifically explain that a Tokyo special ward and a ward inside a designated city such as Nagoya are not interchangeable structures. Readers need this distinction when selecting a tax office, residence counter, waste calendar, disaster map, or insurance procedure.

A compact 47-prefecture reference can be useful if it is collapsible, accessible, and grouped under clearly qualified common regions. It should not become a list of stereotypes or claims that every agency uses those exact regional boundaries.

### 4. Japanese varies across place and situation

Introduce [方言](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/seikatsusha/h24_nihongo_program_a/pdf/a_54_2.pdf) (*hōgen*, regional dialect) alongside [共通語](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/taikai/17_tokyo/bunkakai_2.html) (*kyōtsūgo*, common Japanese). A newcomer can generally begin with the broadly taught common variety and gradually learn local expressions needed in their community. Regional speech is not one uniform dialect per prefecture, and speakers vary by age, context, and identity.[^5]

Handle Ainu and Ryukyuan varieties carefully. The Agency for Cultural Affairs explains that UNESCO's endangered-language classification and common Japanese labels do not use the language-versus-dialect distinction identically.[^6] Nihonest should acknowledge this complexity rather than turn endangered languages into colorful dialect trivia.

### 5. Use the exact place and live authority

End with a small official-resource directory:

- ISA's Foreign Residents Support Portal and current multilingual Guidebook on Living and Working for national orientation;[^7]
- the exact prefecture, municipality, or international association for local procedures and language support;
- JMA's multilingual service for live weather, earthquake, tsunami, and volcano information;[^8]
- the Statistics Bureau for current national facts; and
- focused Nihonest guides for immigration, taxes, work, healthcare, municipal procedures, emergencies, and daily life.

The guide should link onward instead of duplicating each specialist guide.

## Discoverability recommendation

Do not add this article to a journey. It is optional orientation, not a sequential relocation task. Do not create a content group containing only this guide.

Recommended discovery surfaces:

1. a compact **New to Japan? Start with the country basics** link near the Explore introduction, visually subordinate to search and content groups;
2. a persistent **Japan basics** footer link;
3. FAQs for “What is a prefecture?” and “Do I need to speak the local dialect?”;
4. search aliases covering prefecture, prefectural government, municipality, ward, regions of Japan, Kanto, Kansai, Chubu, dialect, common Japanese, and local government; and
5. contextual links from local-support and municipal-orientation guidance.

This preserves the approved Explore hierarchy while making the standalone guide reachable without guessing its exact title.

## Final catalog repair priorities

### Priority 1 — Inline terminology integrity

Review the 55 flagged articles. For each unmatched metadata term:

- introduce it naturally alongside a clear English equivalent when it helps the task;
- retain the inline glossary interaction and understandable surrounding prose; or
- remove it from `termIds` when it is merely adjacent vocabulary.

Do not mechanically inject every listed term into a paragraph. This is an editorial consistency repair, not keyword stuffing.

### Priority 2 — Structural relationships

Audit every journey branch for route relevance; every standalone or concurrent guide for accidental journey-preference effects; article previous/next context; Continue exploring relationships; group membership; FAQ targets; residence-status category and guide links; and activity-check assertion gates. Resolve structural defects before factual rewrites so later localization receives stable relationships.

### Priority 3 — Search and question coverage

Use ordinary-language queries across professions, schools, family situations, documents, taxes, side work, local government, geography, and daily life. Add reviewed aliases or FAQs where vocabulary differs from canonical titles. Keep activity suggestions separate from legal conclusions and preserve the new indexed-search architecture.

### Priority 4 — Source and editorial closure

Rerun `npm run editorial:coverage:audit` and `npm run editorial:audit` after the host memory issue is cleared. Then run the source check/report workflow, resolve changed-source findings according to the documented editorial process, and leave substantive content `needs-review` until the editor explicitly approves it.

## Proposed Iteration 16B split

- **16B-1:** implement the Japan-basics article, glossary terms, FAQs, discovery links, coverage-plan assignment, and high-confidence structural relationship repairs.
- **16B-2:** repair inline terminology in bounded batches, address prioritized content/search gaps, rerun coverage/editorial/source audits, and record the final Phase 13 handoff to human editorial review.

## Approved scope decisions

The editor approved:

1. a collapsible 47-prefecture reference grouped by qualified common regions, with an explicit warning that region boundaries can vary by purpose;
2. both the compact Explore orientation link and footer link; and
3. a short practical-basics box for Japan Standard Time, yen, metric units, and links to the existing emergency guidance.

## Sources

[^1]: Ministry of Foreign Affairs of Japan, [Information about the Japanese Territory](https://www.mofa.go.jp/territory/page1we_000006.html), accessed September 13, 2026.
[^2]: Statistics Bureau of Japan, [Statistical Handbook of Japan](https://www.stat.go.jp/english/data/handbook/index.html), accessed September 13, 2026.
[^3]: Ministry of Land, Infrastructure, Transport and Tourism, [Definitions of uses and regions](https://www.mlit.go.jp/totikensangyo/H30kouji05.html), accessed September 13, 2026.
[^4]: Council of Local Authorities for International Relations, [Local Government in Japan 2024](https://www.clair.or.jp/j/forum/pub/docs/jichi2024-en.pdf), accessed September 13, 2026.
[^5]: Agency for Cultural Affairs, [Standard Japanese and Dialects learning material](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/seikatsusha/h24_nihongo_program_a/pdf/a_54_2.pdf) and [regional common language discussion](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/taikai/17_tokyo/bunkakai_2.html), accessed September 13, 2026.
[^6]: Agency for Cultural Affairs, [Languages and dialects in danger of extinction](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo_shisaku/kikigengo/index.html), accessed September 13, 2026.
[^7]: Immigration Services Agency of Japan, [Foreign Residents Support Portal](https://www.moj.go.jp/isa/support/portal/) and [Guidebook on Living and Working](https://www.moj.go.jp/isa/support/portal/guidebook_all.html?hl=en), accessed September 13, 2026.
[^8]: Japan Meteorological Agency, [Multilingual Information on Disaster Mitigation](https://www.jma.go.jp/jma/kokusai/m_multi.html), accessed September 13, 2026.
