import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const languageAndConsultationSupplements = defineLocalGuidanceSupplements([
  {
    id: "chiyoda-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13101", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Chiyoda", summary: "Chiyoda shares living information for foreign residents in plain Japanese and points to Tokyo's multilingual consultation services and to Japanese classes; it does not run its own multilingual consultation desk.",
    applicability: "For foreign residents of Chiyoda. The consultation services listed are run by Tokyo or national bodies.", responsibleBody: "Chiyoda City",
    actions: [
      { title: "Use the multilingual services the ward lists", description: "Chiyoda's page for foreign residents, in plain Japanese, links to Tokyo's multilingual consultation navigation service (TMC Navi), an English-language life-support adviser run by Tokyo, and a foreign workers' consultation corner. Its page on consultation in foreign languages lists phone lines for daily-life worries, work problems, and human-rights issues." },
      { title: "Find a Japanese class", description: "The ward's International Exchange and Cooperation Volunteer Bank and Tokyo's Japanese class website list classes, and national sites offer Japanese for work and daily life online." },
    ],
    sourceIds: ["chiyoda-foreign-residents","chiyoda-foreign-language-consultation"], sourceFormatNote: "Chiyoda's pages are in plain Japanese with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "chuo-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13102", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Chuo", summary: "Chuo runs a free interpretation call center that connects foreign residents to ward departments in 13 languages, and offers video interpreting at ward counters.",
    applicability: "For foreign residents of Chuo. Interpretation helps you deal with ward procedures; it is not general life consultation.", responsibleBody: "Chuo City", receivingOffice: "Chuo foreign-language interpretation call center, or video interpreting at ward counters",
    actions: [
      { title: "Call the interpretation call center", description: "The call center's operator connects you to the right ward department and interprets the conversation, on weekdays from 8:30 a.m. to 5 p.m. It covers English, Chinese, Korean, Portuguese, Spanish, Vietnamese, Tagalog, Nepali, Indonesian, Thai, Russian, Hindi, and French. You can also start a call from a QR code or web page. Interpretation is free, but call charges apply." },
      { title: "Ask for video interpreting at the counter", description: "At ward counters, including the tax, insurance and pension, and child-support sections and the special branch offices, staff can connect a video interpreter on a tablet free of charge; ask at the counter." },
    ],
    sourceIds: ["chuo-interpretation-services"], sourceFormatNote: "Chuo's interpretation page is in Japanese, with leaflets in Easy Japanese and English. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "minato-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13103", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Minato", summary: "Minato offers free consultation for foreign residents in 14 languages on weekdays without a reservation, and the Minato International Association offers volunteer consultation by appointment.",
    applicability: "For foreigners who live or are active in Minato. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Minato City", receivingOffice: "Minato City consultation services for foreign residents (Global Community Planning Subsection)",
    actions: [
      { title: "Use Minato's consultation service", description: "Call or visit on weekdays from 9 a.m. to noon and 1 to 5 p.m. (closed on holidays and December 29 to January 3); no reservation is needed. It covers Japanese, English, Chinese, Korean, Portuguese, Spanish, Thai, Russian, Tagalog, Nepali, Vietnamese, Indonesian, Hindi, and French, and gives information on ward procedures and daily life." },
      { title: "Or talk to a volunteer, or use Tokyo's services", description: "The Minato International Association offers volunteer consultation in English, Chinese, Korean, Spanish, and French, Monday to Saturday, by appointment. Tokyo's consultation line for foreigners and its Multilingual Consultation Navi (TMC Navi) are also available to Minato residents." },
    ],
    sourceIds: ["minato-foreign-resident-consultation"], sourceFormatNote: undefined,
  },
  {
    id: "shinjuku-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "shinjuku", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Shinjuku", summary: "Shinjuku offers free consultation for foreign residents in English, Chinese, and Korean at the ward office and in Nepali, Thai, and Burmese at the Shinjuku Multicultural Plaza, with video interpreting for other languages, and lists free and paid Japanese classes.",
    applicability: "For foreign residents of Shinjuku. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Shinjuku City", receivingOffice: "Foreign resident consultation desk on the first floor of the ward office, or the consultation corner at the Shinjuku Multicultural Plaza (Hygeia 11th floor, Kabukicho)",
    actions: [
      { title: "Use a free consultation desk", description: "The ward office desk takes questions in English, Chinese, and Korean on weekdays from 9:30 a.m. to noon and 1 to 5 p.m., in person or by phone. The Shinjuku Multicultural Plaza corner is open on weekdays from 10 a.m. to noon and 1 to 5 p.m. (closed on the second and fourth Wednesdays and December 29 to January 3), with Nepali on Mondays, Thai on Tuesdays, and Burmese on Thursdays. Other languages are handled in person through a video interpreting system, not by phone." },
      { title: "Choose a Japanese class", description: "Shinjuku lists the Shinjuku Japanese Class (paid), Nihongo Hiroba (free), a free class for children, and a free first-conversation class." },
    ],
    sourceIds: ["shinjuku-foreign-resident-consultation-desks","shinjuku-japanese-classes-directory","shinjuku-foreign-resident-consultation","shinjuku-japanese-language-classes"], sourceFormatNote: "Shinjuku's current consultation and class pages are in Japanese; its English pages give an overview. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "bunkyo-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13105", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Bunkyo", summary: "Bunkyo gives new foreign residents a living guidebook in Easy Japanese, English, Chinese, and Korean, and points to Tokyo's consultation line for foreigners; it does not run its own multilingual consultation desk.",
    applicability: "For foreign residents of Bunkyo. The consultation services listed are run by Tokyo.", responsibleBody: "Bunkyo City", receivingOffice: "Diversity Promotion desk, Bunkyo Civic Center 14th floor (guidebook)",
    actions: [
      { title: "Get the living guidebook", description: "Bunkyo's living guidebook for foreign residents explains the rules and manners of daily life in Japan. It is handed to foreign nationals when they register their move at the Family Register and Resident Section, is available at the Diversity Promotion desk on the 14th floor of the Bunkyo Civic Center, and can be downloaded in Easy Japanese, English, Chinese, and Korean." },
      { title: "Use Tokyo's consultation line for foreigners", description: "Bunkyo's list of consultation services includes Tokyo's consultation for foreign residents, in English from Monday to Friday, Chinese on Tuesdays and Fridays, and Korean on Wednesdays." },
    ],
    sourceIds: ["bunkyo-foreign-resident-guidebook","bunkyo-consultation-other"], sourceFormatNote: "Bunkyo's pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "taito-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13106", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Taito", summary: "Taito opens a consultation desk for foreign residents in more than 13 languages at the Lifelong Learning Center from November 15, 2026, and offers tablet interpreting at ward counters.",
    applicability: "For foreign residents of Taito. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Taito City", receivingOffice: "Foreign resident consultation desk, Taito Lifelong Learning Center 4th floor (Nishi-Asakusa), from November 15, 2026",
    actions: [
      { title: "Use the new consultation desk", description: "From November 15, 2026, the desk at the Taito Lifelong Learning Center takes questions about work, school, hospitals, child-raising, residence status, tax, and daily life, in person with tablet interpreting or by phone with a three-way interpreter call. It is open from 9 a.m. to noon and 1 to 4 p.m., except the first, third, and fifth Mondays and December 29 to January 3. Languages include English, Chinese, Korean, Portuguese, Spanish, Vietnamese, Filipino, Nepali, Thai, Indonesian, Hindi, French, and Russian. Until then, the ward office offers Chinese, English, and Korean consultation on set Thursday mornings or afternoons." },
      { title: "Ask for tablet interpreting at ward counters", description: "When doing a procedure at the ward office, ask to use the tablet interpreter. It is available on weekdays and the second Sunday in English, Chinese, Korean, Portuguese, Spanish, and many other languages." },
    ],
    sourceIds: ["taito-foreign-resident-consultation-center","taito-foreign-resident-consultation-ward-office"], sourceFormatNote: "Taito's consultation pages are in Japanese, one with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sumida-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13107", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Sumida", summary: "Sumida's Resident Consultation Room offers free consultation in Chinese and English on Wednesdays without a reservation, and the ward lists volunteer Japanese classes.",
    applicability: "For people who live, work, or study in Sumida. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Sumida City", receivingOffice: "Sumida Resident Consultation Room, first floor of the ward office (Azumabashi)",
    actions: [
      { title: "Use the Wednesday consultation, or Tokyo's lines", description: "The Resident Consultation Room offers free consultation about problems in daily life in Chinese on Wednesdays from 10 a.m. to noon and in English on Wednesdays from 1 to 3 p.m.; no reservation is needed. For other days and languages, use Tokyo's consultation line for foreigners or the Multilingual Consultation Navi (TMC Navi), which covers many languages including Easy Japanese." },
      { title: "Join a volunteer Japanese class", description: "Sumida lists volunteer Japanese classes at the Sumida Volunteer Center and other places, including an online class. Call the class before you go." },
    ],
    sourceIds: ["sumida-foreign-language-consultation","sumida-japanese-volunteer-classes"], sourceFormatNote: "Sumida's pages for foreign residents are in Easy Japanese with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "koto-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13108", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Koto", summary: "Koto offers free consultation for foreign residents in Chinese on Thursday afternoons without a reservation, and a monthly free consultation with administrative scriveners on residence status and related matters.",
    applicability: "For foreign residents of Koto. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Koto City", receivingOffice: "Resident consultation corner, window 22 on the second floor of the ward office",
    actions: [
      { title: "Use the ward's consultation", description: "Koto's consultation on daily life and work is in Chinese, on Thursdays from 1 to 4 p.m., without a reservation, at the ward office's consultation corner; it can be combined with a lawyer's consultation by appointment. Administrative scriveners hold a free consultation on residence status, international marriage, permanent residence, and naturalization on the first Monday of each month from 1 to 4 p.m. (not on holidays, or in January and May), in Japanese and English, with translation devices for other languages." },
      { title: "Or use Tokyo's consultation for foreigners", description: "For other languages and days, Tokyo's consultation service for foreign residents answers questions about daily life, mainly by phone." },
    ],
    sourceIds: ["koto-foreign-resident-consultation"], sourceFormatNote: "Koto's consultation page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinagawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13109", lastCheckedAt: "2026-09-24",
    title: "Language and local support in Shinagawa", summary: "Shinagawa shares information for foreigners in several languages and its website can be machine-translated into 131 languages; the Shinagawa International Friendship Association runs Japanese classes.",
    applicability: "For foreign residents of Shinagawa. Shinagawa's pages checked in this batch do not describe a ward-run multilingual consultation desk.", responsibleBody: "Shinagawa City",
    actions: [
      { title: "Use the multilingual information", description: "Shinagawa's page for foreigners, in Japanese, Easy Japanese, and English, links to information in foreign languages, and the ward website can be viewed in 131 languages through automatic translation." },
      { title: "Join a Japanese class", description: "The Shinagawa International Friendship Association runs Japanese classes for foreign residents of the ward; see its website for details." },
    ],
    sourceIds: ["shinagawa-foreign-residents","shinagawa-international-friendship-association"], sourceFormatNote: "Shinagawa's pages are in Japanese, with Easy Japanese and English on the page for foreigners. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "meguro-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13110", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Meguro", summary: "Meguro offers consultation for foreign residents in English and Chinese on weekdays, in person at a dedicated desk.",
    applicability: "For foreign residents of Meguro. Consultation covers ward services, facilities, events, and simple daily-life questions.", responsibleBody: "Meguro City", receivingOffice: "Meguro foreign resident consultation desk",
    actions: [
      { title: "Use the English or Chinese desk", description: "Consultants who speak English or Chinese answer questions about ward services, facilities, events, and daily life in face-to-face consultations. English is available on weekdays from 9 a.m. to noon and 1 to 5 p.m.; Chinese on weekdays from 10 a.m. to noon and 1 to 5 p.m. Each language has its own phone number." },
    ],
    sourceIds: ["meguro-foreign-resident-consultation"], sourceFormatNote: "Meguro's consultation page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "ota-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13111", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Ota", summary: "Ota's multilingual consultation desk at the Ota International Exchange Center (Minto Ota) in Kamata answers daily-life questions in English, Chinese, Tagalog, Vietnamese, and Nepali, with more languages by appointment; volunteer Japanese classes are listed in six languages.",
    applicability: "For foreign residents of Ota. Consultation covers residence status, marriage, nationality, work, and daily life, and may refer you to another office.", responsibleBody: "Ota City", receivingOffice: "Ota Multilingual Consultation Desk, Ota International Exchange Center (Minto Ota), 2nd floor, Kamata",
    actions: [
      { title: "Use the multilingual consultation desk", description: "The desk handles English, Chinese, Tagalog, Vietnamese, and Nepali, depending on the day and time; Korean, Spanish, Portuguese, Thai, Russian, French, Hindi, Indonesian, and other languages are available by appointment. Tokyo's consultation line for foreigners and the Multilingual Consultation Navi (TMC Navi) are also available." },
      { title: "Find a volunteer Japanese class", description: "Ota lists its volunteer Japanese classes by language in Japanese, English, Chinese, Tagalog, Nepali, and Vietnamese, with a map. Contact each class about visits and applications." },
    ],
    sourceIds: ["ota-foreign-resident-consultation","ota-japanese-volunteer-classes"], sourceFormatNote: "Ota's pages are in Japanese, one with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "setagaya-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13112", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Setagaya", summary: "Setagaya's foreign resident consultation offers staff in English and Chinese, tablet interpreting in more languages, and phone interpreting, and the ward lists volunteer Japanese classes.",
    applicability: "For foreign residents of Setagaya. Consultation covers daily life and ward services and may refer you to another office.", responsibleBody: "Setagaya City", receivingOffice: "Foreign resident consultation, Setagaya General Branch Office",
    actions: [
      { title: "Use Setagaya's foreign resident consultation", description: "Consultants speak English (Monday to Friday) and Chinese (Monday, Tuesday, and Thursday); tablet interpreting covers Korean, Portuguese, Spanish, and other languages, and phone interpreting many more. The Setagaya International Exchange Center (Crossing Setagaya) also answers daily-life questions in English, and the ward's page lists Tokyo and national consultation services by topic." },
      { title: "Find a volunteer Japanese class", description: "Setagaya lists volunteer Japanese classes in the ward; contact each group through its website." },
    ],
    sourceIds: ["setagaya-foreign-resident-consultation","setagaya-japanese-volunteer-classes"], sourceFormatNote: "Setagaya's pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shibuya-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13113", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Shibuya", summary: "Shibuya runs free Japanese classes for foreign residents who live or work in the ward, and its English living guide lists Tokyo and national consultation services in foreign languages.",
    applicability: "For foreign residents of Shibuya. The consultation services listed are run by Tokyo and national bodies.", responsibleBody: "Shibuya City",
    actions: [
      { title: "Join a free Japanese class", description: "Shibuya's Japanese classes for foreign residents of high-school age and older who live or work in the ward are free apart from the textbook: a starter course in person on Tuesday and Thursday mornings or online on Wednesday and Friday evenings, and an elementary course online on Tuesday evenings. Apply in the application period and attend an orientation with a short level check." },
      { title: "Use Tokyo and national consultation services", description: "Shibuya's English living guide lists the Tokyo Metropolitan Foreign Residents' Advisory Center (English on weekdays, Chinese on Tuesdays and Fridays, Korean on Wednesdays), the Immigration Information Center, and human rights counseling for foreigners." },
    ],
    sourceIds: ["shibuya-japanese-classes","shibuya-foreign-language-counseling"], sourceFormatNote: "Shibuya's class page is in Japanese; its counseling guide is in English. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nakano-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13114", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Nakano", summary: "Nakano's free, confidential consultation desk for foreign residents answers questions in English and Chinese, and in more languages by tablet interpreting; the ward and the Nakano International Association run Japanese classes.",
    applicability: "For foreign residents of Nakano. The desk explains ward letters and procedures, guides you to the right department, and may refer you to specialist help.", responsibleBody: "Nakano City", receivingOffice: "Foreign resident consultation desk, Residents' Services Section, 4th floor of Nakano City Office",
    actions: [
      { title: "Use the foreign resident consultation desk", description: "The desk is open on weekdays from 10 a.m. to noon and 1 to 5 p.m. (try to arrive by 4:30 p.m.), in person or by phone, in English, Chinese, and Japanese. Tablet interpreting covers 13 languages with a live interpreter and about 30 by machine. At ward counters, you can also ask for free tablet interpreting without a reservation." },
      { title: "Study Japanese", description: "Nakano runs an online Japanese class for foreign residents, and the Nakano International Association (ANIC) runs adult and children's classes, including classes in Saginomiya and Yayoi; people studying at a Japanese language school cannot join ANIC's classes." },
    ],
    sourceIds: ["nakano-foreign-resident-consultation","nakano-tablet-interpreting","nakano-japanese-classes"], sourceFormatNote: "Nakano's pages for foreign residents are in Japanese, some with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "suginami-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13115", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Suginami", summary: "Suginami offers foreign-language consultation on daily life and administration at the ward office and a free interpreter call service in 13 languages for contacting the ward.",
    applicability: "For foreign residents of Suginami. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Suginami City", receivingOffice: "Suginami City Foreign Language Consultation, Public Hearing Section (East Wing 1F), Suginami City Office",
    actions: [
      { title: "Use the ward's consultation and interpreter service", description: "Suginami City Foreign Language Consultation covers daily life and public administration in English, Chinese, Nepali, Korean, and other languages, on weekdays. The Multilingual Interpreter Call Service lets you talk to ward staff through a professional interpreter on weekdays from 8:30 a.m. to 5 p.m., in English, Chinese, Nepali, Vietnamese, Korean, Indonesian, Spanish, Thai, Tagalog, Hindi, French, Portuguese, and Russian; it is free apart from call charges." },
      { title: "Find a Japanese class", description: "The Suginami Association for Cultural Exchange keeps a list of volunteer Japanese classes in the ward, and the Tokyo Nihongo Volunteer Network helps you find classes." },
    ],
    sourceIds: ["suginami-foreign-resident-consultation","suginami-interpreter-call-service","suginami-learning-japanese"], sourceFormatNote: undefined,
  },
  {
    id: "toshima-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13116", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Toshima", summary: "Toshima's City Resident Consultation Counter takes daily-life questions in 22 languages through tablet video interpreting, and volunteer Japanese classes run near Ikebukuro, Otsuka, and Mejiro, mostly free.",
    applicability: "For foreign residents of Toshima. The counter helps with daily-life problems and may refer you to specialist institutions.", responsibleBody: "Toshima City", receivingOffice: "City Resident Consultation Corner, 4th floor of the main building, Toshima City Office",
    actions: [
      { title: "Use the consultation counter", description: "The counter is open on weekdays from 8:30 a.m. to 5 p.m.; consultations are available in 22 languages through tablet video interpreting, with hours varying by language (for example, English, Chinese, and Korean from 8:30 a.m., Vietnamese and Nepali from 9 a.m., and French and Russian from 10 a.m.)." },
      { title: "Join a volunteer Japanese class", description: "Volunteer Japanese classes run in person in Toshima, several of them free, on Tuesdays and Thursdays near Ikebukuro, Otsuka, and Mejiro. Contact the class organizers directly, not the venues." },
    ],
    sourceIds: ["toshima-foreigner-support","toshima-japanese-language-club"], sourceFormatNote: undefined,
  },
  {
    id: "kita-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13117", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Kita", summary: "Kita lists low-cost Japanese classes in the ward, with maps in Easy Japanese, English, and Chinese, and points foreign residents to Tokyo's multilingual consultation navigation and other support centers.",
    applicability: "For foreign residents of Kita. The consultation services listed are run by Tokyo and national bodies.", responsibleBody: "Kita City",
    actions: [
      { title: "Join a Japanese class", description: "Kita's Japanese classes cost little, typically 100 yen a session or a small monthly fee, and meet on weekdays and weekends at places such as Hokutopia and the Akabane Culture Center; some are for children. Contact each class before going. Maps of the classes are available in Easy Japanese, English, and Chinese." },
      { title: "Use Tokyo's consultation services", description: "For consultation by phone, Kita points to Tokyo's Multilingual Consultation Navi (TMC Navi), the Foreign Residents Support Center (FRESC), and other services, with leaflets in several languages." },
    ],
    sourceIds: ["kita-japanese-classes","kita-foreign-resident-information"], sourceFormatNote: "Kita's pages for foreign residents are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "arakawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13118", lastCheckedAt: "2026-09-24",
    title: "Language and local support in Arakawa", summary: "Arakawa publishes living-guide videos for foreign residents on waste rules, smoking manners, and National Health Insurance, currently in Japanese, and asks foreign residents to contact the ward office with questions.",
    applicability: "For foreign residents of Arakawa. Arakawa's pages checked in this batch do not describe a ward-run multilingual consultation desk.", responsibleBody: "Arakawa City",
    actions: [
      { title: "Watch the living-guide videos", description: "Arakawa's videos introduce waste rules, smoking manners, National Health Insurance, and tourist manners; they are in Japanese for now, with other languages to follow. The Immigration Services Agency's videos on work, money, and daily life are linked alongside." },
      { title: "Ask the ward office", description: "If something is unclear, the ward asks you to consult the ward office." },
    ],
    sourceIds: ["arakawa-foreign-residents"], sourceFormatNote: "Arakawa's page for foreign residents is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "itabashi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13119", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Itabashi", summary: "The Itabashi Culture and International Exchange Foundation offers free legal consultation for foreign residents by phone or Zoom, and the ward points to Japan Legal Support Center's multilingual information service.",
    applicability: "For foreign residents of Itabashi. Itabashi's pages checked in this batch do not describe a ward-run multilingual daily-life desk.", responsibleBody: "Itabashi City",
    actions: [
      { title: "Book free legal consultation", description: "Experienced lawyers answer questions about residence status, refugee recognition, divorce, inheritance, work, and other problems, by phone or Zoom (Zoom only for languages other than Japanese and English). It is free and by reservation through the foundation's website." },
      { title: "Use Houterasu's multilingual line", description: "Japan Legal Support Center (Houterasu) introduces Japan's legal system and consultation services through an interpreter in English, Chinese, Korean, Spanish, Portuguese, Vietnamese, and Tagalog." },
    ],
    sourceIds: ["itabashi-multilingual-consultation"], sourceFormatNote: "Itabashi's consultation page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nerima-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13120", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Nerima", summary: "Nerima's foreign-language consultation at the ward office answers questions without a reservation on weekday afternoons, and the ward runs a beginners' Japanese course three times a year with free childcare.",
    applicability: "For foreign residents of Nerima. Consultants give advice and may refer you to another office.", responsibleBody: "Nerima City", receivingOffice: "Community Promotion Section, 9th floor of the Nerima City Office main building",
    actions: [
      { title: "Use the foreign-language consultation", description: "Consultants advise on your problems in English, Chinese, Korean, and Tagalog, in person or by phone, on weekdays from 1 to 5 p.m. (Korean on Fridays and Tagalog on Mondays only); no reservation is needed." },
      { title: "Join the beginners' Japanese course", description: "Nerima's beginners' Japanese course for people who live, work, or study in the ward runs on Tuesday and Friday mornings in three terms a year at the Culture Exchange Plaza in Hikarigaoka, with free childcare for children aged one and over. Apply by phone to the foreign-language consultation desk during the application period." },
    ],
    sourceIds: ["nerima-foreign-language-consultation","nerima-japanese-classes"], sourceFormatNote: "Nerima's pages for foreign residents are in Japanese with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "adachi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13121", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Adachi", summary: "Adachi's foreign resident desk offers consultation and interpreting in English, Chinese, and Korean, and tablet interpreting in 16 languages, for ward procedures and daily problems.",
    applicability: "For foreign residents of Adachi. The desk helps with ward procedures and worries and interprets for procedures in the main building.", responsibleBody: "Adachi City", receivingOffice: "Multicultural Coexistence Section, Community Coordination Division, 3rd floor of the South Building, Adachi City Office",
    actions: [
      { title: "Use the foreign resident desk", description: "Consultants speak English, Chinese, and Korean on weekdays from 9:30 a.m. to noon and 1 to 4 p.m.; call ahead, as they are sometimes away. Tablet interpreting covers 16 languages, including Vietnamese, Filipino, Spanish, Portuguese, Nepali, and Burmese, on weekdays, with hours depending on the language." },
      { title: "Find a Japanese class", description: "Adachi publishes a list of volunteer Japanese classes in the ward in Japanese, English, Chinese, and Korean, and supports Japanese study for children with roots abroad." },
    ],
    sourceIds: ["adachi-foreign-resident-consultation"], sourceFormatNote: "Adachi's consultation page is in Japanese, with a leaflet in English, Chinese, and Korean. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "katsushika-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13122", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Katsushika", summary: "Katsushika's free daily-life consultation for foreign residents runs on Monday afternoons at the ward office in English and Chinese, in person, by phone, or online, and the ward runs Japanese classes for daily life.",
    applicability: "For foreign residents of Katsushika. Consultation covers registration, health insurance, pension, schools, family matters, and tax.", responsibleBody: "Katsushika City", receivingOffice: "Resident Consultation Room (window 209), 2nd floor of Katsushika City Office",
    actions: [
      { title: "Use the Monday consultation", description: "Consultation in English, Chinese, and Japanese is on Mondays from 12:30 to 5 p.m. (last entry 4:30 p.m.) at the ward office, in person, by phone, or online by FaceTime or Google Meet (call to arrange); no reservation is needed and it is free. A Chinese consultation booth at Ekinikowa in Shin-Koiwa opens on the third Wednesday of each month." },
      { title: "Join the ward's Japanese class", description: "The ward's Japanese classes teach simple Japanese for daily life, not the JLPT, at beginner and elementary levels, with a level check after applying. They are for people aged 15 and over (not junior high school students) who live, work, or study in the ward, or whose children attend school or nursery there." },
    ],
    sourceIds: ["katsushika-foreign-resident-consultation","katsushika-japanese-classes"], sourceFormatNote: "Katsushika's pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "edogawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13123", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Edogawa", summary: "Edogawa's consultation desk for foreign residents at the Multicultural Center in Funabori answers daily-life questions from Tuesday to Saturday by phone, in person, or online, and the ward runs free Japanese classes for beginners twice a week.",
    applicability: "For foreign residents of Edogawa. The languages available depend on the day of the week.", responsibleBody: "Edogawa City", receivingOffice: "Edogawa Multicultural Center, 3rd floor of Tower Hall Funabori",
    actions: [
      { title: "Use the consultation desk", description: "The desk is open Tuesday to Saturday, 10 a.m. to 4:30 p.m. (except holidays and the New Year period, with some other closed days). By phone, you are connected to an interpreter call center; in person, consultants interpret with a tablet; online consultation is in plain Japanese. Languages from Tuesday to Saturday include English, Chinese, Korean, Portuguese, Spanish, Vietnamese, Tagalog, Nepali, and Thai; ask about others." },
      { title: "Join the Edogawa Japanese class", description: "The free Edogawa Japanese class teaches everyday Japanese and ward information to first-time learners, twice a week in Kasai or Koiwa, for people who live or work in the ward and can attend all 20 sessions. Apply by visiting the Multicultural Center for an interview. Volunteer circles also run low-cost community classes once or twice a week." },
    ],
    sourceIds: ["edogawa-foreign-resident-consultation","edogawa-japanese-classes"], sourceFormatNote: "Edogawa's pages for foreign residents are in plain Japanese, with English, Chinese, and Korean versions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "hachioji-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13201", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Hachioji", summary: "Hachioji's Foreign Resident Support Desk offers free, confidential consultation for foreign residents, and local international exchange groups run Japanese classes.",
    applicability: "For foreign residents of Hachioji. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Hachioji City", receivingOffice: "Hachioji Foreign Resident Support Desk, in the Gakuen Toshi Center (11th floor of the Hachioji Square Building, Asahicho)",
    actions: [
      { title: "Use the Foreign Resident Support Desk", description: "The support desk, run by the Hachioji International Association, takes questions about daily life, visas, work, and school. It is free and confidential, and open Monday to Wednesday, Friday, and Saturday from 10 a.m. to 5 p.m. It is closed on Thursdays, Sundays, holidays, December 29 to January 3, and days the Gakuen Toshi Center is closed." },
      { title: "Contact a Japanese class directly", description: "Several international exchange groups in Hachioji run Japanese classes; the city lists them with their contact details. Ask each group directly about schedules and fees." },
    ],
    sourceIds: ["hachioji-foreign-resident-consultation","hachioji-japanese-classes"], sourceFormatNote: "Hachioji's consultation and class pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "tachikawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13202", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Tachikawa", summary: "Tachikawa's free consultation for foreign residents, run by the Tachikawa Multicultural Center, meets in person on Saturdays and online on Wednesdays, and a free Japanese class runs twice a week.",
    applicability: "For foreign residents of Tachikawa. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Tachikawa City", receivingOffice: "Tachikawa Multicultural Center (TMC), at the Women's General Center \"Aim\" in Akebonocho or online",
    actions: [
      { title: "Use the free consultation", description: "Advisers, including an administrative scrivener, take confidential questions about visas and residence status, social insurance, work, education, daily life, marriage, divorce, and domestic violence. Consultation is on Saturdays from 1 to 4 p.m. at the Women's General Center \"Aim\" without an appointment, and on Wednesdays from 10 a.m. to 4 p.m. online by Zoom, booked by phone. Chinese and English interpreting is available; ask by phone about other languages." },
      { title: "Join a free Japanese class", description: "The Tachikawa International Friendship Association runs a free Japanese class for people who live or work in Tachikawa, on Thursday mornings and Saturday evenings. New students go directly to the class; from December 2026 to February 2027, it does not take new students and meets at different places." },
    ],
    sourceIds: ["tachikawa-foreign-resident-consultation","tachikawa-japanese-classes"], sourceFormatNote: "Tachikawa's consultation and class pages are in simple Japanese with some English. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "fuchu-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13206", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Fuchu", summary: "Fuchu Multicultural Center DIVE runs a consultation desk and information in plain Japanese and English, and the Fuchu International Exchange Salon offers free Japanese study sessions.",
    applicability: "For foreign residents of Fuchu. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Fuchu City", receivingOffice: "Fuchu Multicultural Center DIVE, in the Plats civic activity center (Le Signe 5th floor, Miyamachi)",
    actions: [
      { title: "Use DIVE's consultation desk", description: "DIVE is open Monday to Saturday from 10 a.m. to 5 p.m.; its consultation desk for foreign residents operates from 11 a.m. to 3 p.m. It also shares information foreign residents need in plain Japanese, English, and other languages." },
      { title: "Join a free Japanese study session", description: "The Fuchu International Exchange Salon supports Japanese study for free, for foreign residents of high-school age and older who live, work, or study in Fuchu. Sessions run on several weekdays and Saturday afternoons at the Fuchur gender equality center. Apply at that center's reception." },
    ],
    sourceIds: ["fuchu-multicultural-center-dive","fuchu-japanese-classes"], sourceFormatNote: "Fuchu's pages are in Japanese, with DIVE's page in Japanese with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "machida-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-13209", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Machida", summary: "Machida's consultation corner for foreign residents, staffed by volunteers from the Machida International Center, helps with daily-life questions and procedures at public offices, by appointment.",
    applicability: "For foreign residents of Machida. Consultation gives information and help with procedures; it does not decide a case for another authority.", responsibleBody: "Machida City", receivingOffice: "Machida International Center, Machida Shimin Forum 4th floor (Haramachida)",
    actions: [
      { title: "Book the consultation corner five days ahead", description: "Consultation is on Tuesdays, Thursdays, and Saturdays from 1:30 p.m. to 3:30 p.m. Volunteers can speak English, Chinese, Korean, French, Spanish, and Tagalog, and can help with procedures at City Hall and other public offices. Book by phone, fax, or e-mail with the Machida International Center at least five days before the day you want." },
    ],
    sourceIds: ["machida-foreign-resident-consultation"], sourceFormatNote: "Machida's consultation page is in Japanese with readings. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nagoya-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "nagoya", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Nagoya", summary: "Nagoya International Center's Information Service Counter answers questions about life in Nagoya in 11 languages, by phone, e-mail, LINE, or in person, and lists Japanese classes.",
    applicability: "For foreign residents of Nagoya. The Center gives information and referrals; it does not decide a case for the ward office or another authority.", responsibleBody: "Nagoya International Center", receivingOffice: "Information Service Counter, Nagoya International Center, 3rd floor",
    actions: [
      { title: "Contact the Information Service Counter", description: "The counter handles questions about Japanese schools and classes, residence status, tax, health insurance, work, and hospitals with foreign-language service. Japanese and English are available from 9:00 to 19:00, Tuesday to Sunday; Portuguese, Spanish, Chinese, Korean, Filipino, Vietnamese, Nepali, Indonesian, and Thai on set days. You can also add the Center on LINE and consult by voice call. Specialist consultations, such as free legal consultation and immigration consultation, run on their own days." },
      { title: "Find a Japanese class", description: "The Center runs its own Japanese classes, including classes for children and high-school students, and a search site for Japanese classes across Nagoya." },
    ],
    sourceIds: ["nagoya-international-center-counter","nagoya-international-center"],
  },
  {
    id: "osaka-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-27100", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Osaka", summary: "Osaka City offers free consultation for foreign residents in five languages at a city desk, City Hall, and every ward office.",
    applicability: "For foreign residents living in Osaka City. Consultation gives information and referrals; it does not decide a case for another authority.", responsibleBody: "Osaka City", receivingOffice: "Foreign Resident Consultation desk, the City Hall Citizen Consultation Room, or the foreign-resident consultation line of your ward office",
    actions: [
      { title: "Use the city's consultation desk", description: "Osaka City offers free consultation in English, Chinese, Korean, Vietnamese, and Filipino, by phone or in person and without an appointment. The main desk has moved temporarily, with changed hours, while the Osaka International House is renovated, so check the city's page for the current location. The City Hall Citizen Consultation Room also takes consultations on weekdays from 9 a.m. to 5:30 p.m." },
      { title: "Call your ward office's line", description: "Each ward office also offers foreign-resident consultation through its own dedicated phone number, listed on the city's page. It is the place to start for questions about ward procedures." },
    ],
    sourceIds: ["osaka-foreign-resident-consultation"], sourceFormatNote: "Osaka City's consultation page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sakai-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "jp-27140", lastCheckedAt: "2026-09-24",
    title: "Language and consultation support in Sakai", summary: "Sakai's Multicultural Exchange Plaza offers free living consultation for foreign residents in up to 11 languages, and the city runs Japanese classes for beginners.",
    applicability: "For foreign residents who live, work, or study in Sakai. Consultation gives information and advice and may refer you to another office.", responsibleBody: "Sakai City", receivingOffice: "Multicultural Exchange Plaza Sakai (POME Sakai)",
    actions: [
      { title: "Use the living consultation desk", description: "Counselors at the Multicultural Exchange Plaza give living and administrative information, in person in 11 languages using translation devices, or by phone in 8 languages through three-way calls. Both run on weekdays from 10 a.m. to noon and 1 p.m. to 4 p.m., except holidays and the New Year period. The Osaka Foundation of International Exchange also offers consultation in more languages." },
      { title: "Join a Japanese class", description: "Sakai runs Japanese classes for foreign residents, including classes for complete beginners, and publishes free beginner materials. Check the city's page for the current classes." },
    ],
    sourceIds: ["sakai-foreign-resident-consultation","sakai-japanese-classes"], sourceFormatNote: "Sakai's consultation and class pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
]);
