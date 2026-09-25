import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const disasterPreparationSupplements = defineLocalGuidanceSupplements([
  {
    id: "chiyoda-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13101", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Chiyoda", summary: "The whole of Chiyoda is a stay-in-district area, so after an earthquake you stay somewhere safe rather than evacuating to a wide-area evacuation place; the ward's hazard maps are available in English, Chinese, and Korean.",
    applicability: "For residents of Chiyoda. Commuters and students use the ward's temporary refuge places instead of residents' shelters.", responsibleBody: "Chiyoda City",
    actions: [
      { title: "Stay put after an earthquake unless you are in danger", description: "Tokyo judged the risk of large spreading fires in Chiyoda to be relatively low, so the ward has no wide-area evacuation places. After an earthquake, stay at home or in a safe building and assess the damage; if you feel in danger, residents go to their shelter, a ward school or similar facility assigned by neighborhood association." },
      { title: "Check the flood, storm-surge, and landslide maps", description: "Chiyoda's hazard maps cover flooding from the Kanda, Nihonbashi, and Sumida rivers, flooding from the Arakawa River, storm surge, and landslides, with evacuation methods. They are available in Japanese, English, Chinese, and Korean, online and at branch offices and the ward office." },
    ],
    sourceIds: ["chiyoda-disaster-stay-in-district","chiyoda-disaster-earthquake-shelters","chiyoda-disaster-hazard-maps"], sourceFormatNote: "Chiyoda's disaster pages are in Japanese; the hazard map has English, Chinese, and Korean editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "chuo-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13102", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Chuo", summary: "Chuo recommends staying at home after an earthquake if your apartment building is safe, and in floods considers the third floor and above of sturdy buildings relatively safe.",
    applicability: "Check your building's safety, your shelter, and the flood hazard maps ahead of time. During an event, follow the ward's evacuation information.", responsibleBody: "Chuo City",
    actions: [
      { title: "Prepare to shelter at home in your apartment", description: "Most apartment buildings are highly earthquake resistant, so Chuo recommends staying at home after an earthquake if it is safe. Expect power, gas, water, and elevators to stop: do not use elevators, open your front door to secure an exit, and store water, food, and portable toilets for at least three days, ideally a week. Areas designated as stay-in-district areas generally do not need to go to a wide-area evacuation place; the ward disaster map shows the place assigned to your area, and any evacuation instruction still applies." },
      { title: "Check the flood hazard maps", description: "Chuo's flood hazard maps cover the Arakawa River and the Sumida, Kanda, and Nihonbashi rivers. In the floods expected in Chuo, the third floor and above of a sturdy building is considered relatively safe, so if you are safe at home you can stay there, or move early to a safe relative's or friend's home. The Chuo Safety and Security Mail sends weather warnings and evacuation instructions." },
    ],
    sourceIds: ["chuo-disaster-apartments","chuo-disaster-wide-area-evacuation","chuo-disaster-storms"], sourceFormatNote: "Chuo's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "minato-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13103", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Minato", summary: "Minato reminds residents that people in a safe place do not need to go to an evacuation site, and offers a disaster prevention app, an e-mail service, and English preparedness information.",
    applicability: "Check flood, landslide, and storm-surge risks for your address before a disaster; during an event, follow the ward's information on which shelters are open.", responsibleBody: "Minato City",
    actions: [
      { title: "Evacuate only if you are in danger", description: "In a disaster, people in a dangerous place should evacuate, but people in a safe place do not need to go to an evacuation site; a safe relative's or friend's home is also an option. Moving outside in heavy rain, even by car, is dangerous. Shelters are opened depending on the scale of the disaster; the ward announces them on its website and by disaster information e-mail." },
      { title: "Use the app, e-mail, and English guides", description: "Minato's English living guide covers daily earthquake precautions, what to do in an earthquake, the disaster information e-mail service, drills, and the NTT disaster message service 171. The ward also provides the Minato City Disaster Prevention App and a disaster preparedness card." },
    ],
    sourceIds: ["minato-disaster-evacuation","minato-disaster-english"], sourceFormatNote: "Minato's evacuation page is in Japanese; its preparedness page is in English. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinjuku-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "shinjuku", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Shinjuku", summary: "Shinjuku distinguishes wide-area evacuation places, for escaping spreading fires after an earthquake, from shelters for people who cannot stay at home, and its flood hazard map covers river, rain, and storm-surge flooding.",
    applicability: "Check both your wide-area evacuation place and your shelters ahead of time; shelters for earthquakes and floods partly differ. During an event, follow instructions from the ward.", responsibleBody: "Shinjuku City",
    actions: [
      { title: "Know your evacuation place and your shelter", description: "Wide-area evacuation places are large parks and open spaces for escaping spreading fires after an earthquake. Shelters, mainly ward elementary and junior high schools, are for people who cannot live at home after a disaster, and the earthquake and flood shelter lists partly differ. The ward's evacuation map is available in English, Chinese, and Korean, and each special branch office district has its own disaster map." },
      { title: "Check the flood hazard map and your route", description: "The flood hazard map shows expected flooding from rivers and heavy rain, and on the back, storm surge, with an evacuation decision flow. Flood shelters are opened by the ward, which may issue evacuation instructions in heavy rain, so check the route from your home in advance. The map is available at the Crisis Management Division, special branch offices, and online, including an audio version." },
    ],
    sourceIds: ["shinjuku-disaster-evacuation-places","shinjuku-flood-current","shinjuku-flood-hazard-map"], sourceFormatNote: "Shinjuku's current disaster pages are in Japanese; its English page introduces the hazard map. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "bunkyo-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13105", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Bunkyo", summary: "Bunkyo assigns each neighborhood association an earthquake shelter, mostly ward schools, and publishes its flood hazard map in English, Chinese, and Korean.",
    applicability: "Check the shelter assigned to your neighborhood and your flood risk before a disaster; during an event, follow the ward's instructions.", responsibleBody: "Bunkyo City",
    actions: [
      { title: "Know your earthquake shelter", description: "If your home collapses, burns, or is at risk after an earthquake, go to your shelter (33 places, mainly ward elementary and junior high schools). If a large fire makes the shelter dangerous, go to an emergency evacuation place (7 in the ward). Shelters and evacuation places are assigned by neighborhood association." },
      { title: "Check the flood hazard map", description: "The flood hazard map shows expected flooding and shelters, based on the largest assumed rainfall. It is available in Japanese, English, Chinese, and Korean, and in a color-vision-accessible version. Check the route from home to your shelter and how you will contact your family." },
    ],
    sourceIds: ["bunkyo-disaster-shelters","bunkyo-disaster-flood-map"], sourceFormatNote: "Bunkyo's disaster pages are in Japanese; the flood hazard map has English, Chinese, and Korean editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "taito-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13106", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Taito", summary: "Taito tells residents not to evacuate right away after an earthquake if their home is safe, and explains when sheltering at home is possible; its evacuation places are Ueno Park, Yanaka Cemetery, and Sumida Park.",
    applicability: "Check your neighborhood's gathering place, shelter, and evacuation place on the disaster map or in the Taito Bosai app. During an event, follow the ward's instructions.", responsibleBody: "Taito City",
    actions: [
      { title: "Know when to stay and where to go", description: "After an earthquake, stay where you are if your home is not in danger. If your house may collapse or a fire is approaching, go to your neighborhood's temporary gathering place, then to a shelter (43 places, mainly ward schools and metropolitan high schools) or an evacuation place (Ueno Park, Yanaka Cemetery, and Sumida Park). Some areas are stay-in-district areas where a short move is enough. The Taito Bosai app shows your assigned places from your address." },
      { title: "Prepare to shelter at home", description: "Taito's flowchart for sheltering at home applies to both earthquakes and storms: if your home is not at risk of collapse, fire, or flooding and you can live there without help, you can stay. People sheltering at home can still use shelter facilities such as manhole toilets and food distribution. Stockpile supplies for this." },
    ],
    sourceIds: ["taito-disaster-earthquake-evacuation","taito-disaster-sheltering-at-home"], sourceFormatNote: "Taito's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sumida-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13107", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Sumida", summary: "After an earthquake, Sumida residents stay home if it is safe, or go first to their neighborhood's temporary gathering place; the ward asks everyone to check its flood hazard map before the June-to-October flood season.",
    applicability: "Check your gathering place, evacuation place, and shelter on the Sumida disaster map, and your flood risk, ahead of time.", responsibleBody: "Sumida City",
    actions: [
      { title: "Know your gathering place, evacuation place, and shelter", description: "After an earthquake you do not have to go to a shelter; staying at home can be safer if it is not in danger. Otherwise go first to your neighborhood association's temporary gathering place (a park or school), then to an evacuation place if spreading fire makes the area unsafe, or to a shelter (mainly schools) if you cannot return home. You do not have to use your own neighborhood's shelter. The ward's shelter list shows accessible toilets and elevators." },
      { title: "Check the flood hazard map before flood season", description: "Sumida asks residents to check its flood hazard map before the flood season, roughly June to October, and to prepare for large-scale flooding." },
    ],
    sourceIds: ["sumida-disaster-earthquake-evacuation","sumida-disaster-flood-map"], sourceFormatNote: "Sumida's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "koto-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13108", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Koto", summary: "Koto publishes three flood hazard maps, for Arakawa River flooding, heavy-rain flooding, and storm surge, each in Japanese, English, Chinese, and Korean.",
    applicability: "Check all three maps for your address before a disaster, and follow the ward's evacuation information during an event.", responsibleBody: "Koto City",
    actions: [
      { title: "Check all three flood maps", description: "Koto's river flood map shows flooding if the Arakawa River embankment breaks; its heavy-rain map shows flooding when drainage cannot keep up; and its storm-surge map shows flooding when Tokyo Bay rises over the seawalls in a typhoon. Each shows flood depth, how long the water stays, public facilities you can evacuate to, and evacuation information." },
      { title: "Use the version you can read", description: "Each map is available in Japanese, English, Chinese, and Korean, in a color-vision-accessible version, and as an audio version." },
    ],
    sourceIds: ["koto-disaster-flood-maps"], sourceFormatNote: "Koto's hazard map page is in Japanese; the maps have English, Chinese, and Korean editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinagawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13109", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Shinagawa", summary: "Shinagawa recommends sheltering at home after a disaster if your home is not at risk of collapse or spreading fire, and its disaster map includes flood hazard maps for heavy rain and the Tama River.",
    applicability: "Check your flood risk and shelters on the Shinagawa disaster map ahead of time; during heavy rain or typhoons, watch for evacuation information from the ward.", responsibleBody: "Shinagawa City",
    actions: [
      { title: "Prepare to shelter at home", description: "Shinagawa recommends staying at home after a large disaster if you are not worried about collapse or spreading fire. Prepare water, food, and toilets: when water is cut, toilets cannot be used normally. The ward's leaflet on sheltering at home and disaster toilets is available in English, Chinese, and Korean." },
      { title: "Check the flood hazard maps", description: "The Shinagawa disaster map includes a flood hazard map showing expected flooding from heavy rain, both river overflow and drainage overflow, with maximum depth and shelters, and a Tama River flood map. Low-lying land along rivers can flood deeply, but so can low ground away from rivers. For heavy rain and typhoons, the ward may issue evacuation information." },
    ],
    sourceIds: ["shinagawa-disaster-sheltering-at-home","shinagawa-disaster-flood-maps"], sourceFormatNote: "Shinagawa's disaster pages are in Japanese, with some leaflets in English, Chinese, and Korean. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "meguro-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13110", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Meguro", summary: "Meguro does not assign shelters by neighborhood, so you can go to any local shelter, and its flood hazard map is available in English and Chinese.",
    applicability: "Check shelters near your home and your flood risk before a disaster; during an event, follow the ward's instructions.", responsibleBody: "Meguro City",
    actions: [
      { title: "Know the shelters near you", description: "Local shelters are ward elementary and junior high schools, the Meguro School Support Center, Himonya Park, Meguro Kumin Campus, and metropolitan and private high schools in the ward. Meguro does not assign shelters by neighborhood. Some former school sites are no longer shelters, so check the current list." },
      { title: "Check the flood hazard map", description: "Meguro's flood hazard map shows flood areas, depths, and shelters for the largest assumed flood, and is available in Japanese, English, and Chinese. Check what to do and how to prepare before a disaster." },
    ],
    sourceIds: ["meguro-disaster-shelters","meguro-disaster-flood-map"], sourceFormatNote: "Meguro's disaster pages are in Japanese; the flood hazard map has English and Chinese editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "ota-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13111", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Ota", summary: "Ota's disaster hazard map covers earthquakes (including liquefaction, fire, building collapse, and tsunami) and floods (Tama River, storm surge, and heavy rain), and is available in Easy Japanese and in English with Chinese.",
    applicability: "Check the hazard map for your address before a disaster; during an event, follow the ward's evacuation information.", responsibleBody: "Ota City",
    actions: [
      { title: "Check the earthquake and flood maps", description: "The earthquake section shows liquefaction, fire, building collapse, and tsunami risk and a disaster map; the flood section shows expected flooding from the Tama River, storm surge, smaller rivers, landslides, and heavy rain; the preparedness section lists evacuation places and where to get information." },
      { title: "Use a version you can read", description: "The February 2026 map is available in Japanese, Easy Japanese, and an English and Chinese edition, online and at the Disaster Prevention and Crisis Management Division, the City Hall information corner, and special branch offices." },
    ],
    sourceIds: ["ota-disaster-hazard-map"], sourceFormatNote: "Ota's hazard map page is in Japanese; the map has Easy Japanese and English-Chinese editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "setagaya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13112", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Setagaya", summary: "Setagaya encourages sheltering at home after an earthquake if your home is safe, and publishes flood maps for the Tama River and for heavy rain and smaller rivers, plus a landslide map.",
    applicability: "Check your home's safety and your flood and landslide risk ahead of time; during an event, follow the ward's evacuation instructions.", responsibleBody: "Setagaya City",
    actions: [
      { title: "Shelter at home if it is safe", description: "Going to a shelter is not the only way to evacuate. After an earthquake, stay at home if it is safe, but evacuate when the ward orders it, when your neighborhood disaster group decides it is needed, or when fire nearby could spread. Stock food, water, portable toilets, and power for at least three days, ideally a week." },
      { title: "Check the flood and landslide maps", description: "Setagaya's flood and inland flooding hazard maps come in a Tama River edition and an edition for heavy rain and smaller rivers; there is also a landslide hazard map." },
    ],
    sourceIds: ["setagaya-disaster-sheltering-at-home","setagaya-disaster-hazard-maps"], sourceFormatNote: "Setagaya's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shibuya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13113", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Shibuya", summary: "Shibuya's disaster prevention portal and app work in 121 languages, and the ward lists temporary gathering places, evacuation places, and stay-in-district areas by district.",
    applicability: "Know your gathering place, evacuation place, and shelter before a disaster; during an event, follow the ward's information.", responsibleBody: "Shibuya City",
    actions: [
      { title: "Use the portal and app in your language", description: "The Shibuya City Disaster Prevention Portal Site and Disaster Prevention App are available in 121 languages; the app shows real-time information and works offline for the disaster map. Shibuya also subsidizes furniture-fixing equipment, up to ¥10,000 per household." },
      { title: "Know your gathering and evacuation places", description: "Temporary gathering places, mainly ward school grounds and parks, are where people gather to assess the situation before moving to an evacuation place; if an evacuation place is close, go there directly. Prepare at least three days of food, ideally a week, and agree meeting places with your family." },
    ],
    sourceIds: ["shibuya-disaster-earthquakes-english","shibuya-disaster-evacuation-places"], sourceFormatNote: "Shibuya's earthquake page is in English; its evacuation list is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nakano-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13114", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Nakano", summary: "Nakano's hazard map combines flood and landslide risk with everyday preparation in one booklet, and the ward lists earthquake shelters and wide-area evacuation places by neighborhood.",
    applicability: "Check your home's and workplace's risk and your neighborhood's shelter before a disaster; during an event, follow the ward's instructions.", responsibleBody: "Nakano City",
    actions: [
      { title: "Read the hazard map booklet", description: "The Nakano hazard map covers expected flood and landslide damage and everyday preparation in one booklet; check the risks near your home and workplace and plan how to evacuate safely." },
      { title: "Find your neighborhood's shelter", description: "Nakano lists earthquake shelters and wide-area evacuation places for each neighborhood, from Minamidai to Chuo." },
    ],
    sourceIds: ["nakano-disaster-hazard-map","nakano-disaster-earthquake-shelters"], sourceFormatNote: "Nakano's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "suginami-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13115", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Suginami", summary: "Suginami's flood hazard map, revised in March 2026, shows expected flooding and 23 flood shelters, which open in stages as rain becomes more dangerous, starting with the Nishi-Ogi and Ogikubo community centers.",
    applicability: "Check your flood risk and nearest flood shelter ahead of time; during heavy rain, follow the ward's information on which shelters are open.", responsibleBody: "Suginami City",
    actions: [
      { title: "Check the flood hazard map", description: "The map shows areas expected to flood and how deep, based on the largest assumed rainfall, and marks places that have flooded before; it is also available on the ward's digital map service and in a color-accessible version. Suginami does not publish a storm-surge map." },
      { title: "Know the order flood shelters open", description: "Flood shelters open in stages according to the rainfall danger, beginning with the Nishi-Ogi and Ogikubo community centers and then schools. From October 1, 2026, the Ogikubo community center is again the flood shelter for its area after renovation." },
    ],
    sourceIds: ["suginami-disaster-flood-map","suginami-disaster-flood-shelters"], sourceFormatNote: "Suginami's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "toshima-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13116", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Toshima", summary: "Toshima treats going to a shelter as a last resort: evacuate only if there is danger, such as spreading fire or collapse, going first to a temporary evacuation area and then, if needed, to a rescue center or evacuation area.",
    applicability: "Know your temporary evacuation area, rescue center, and evacuation area before a disaster; during an event, follow instructions from the city, police, and fire department.", responsibleBody: "Toshima City",
    actions: [
      { title: "Evacuate only when there is danger", description: "Evacuate if a fire cannot be put out and may spread, if the city, police, or fire department orders it, or if your building may collapse. Switch off the breaker, go on foot with essentials, and go to your temporary evacuation area (usually a park), then to the evacuation area your neighborhood is assigned, such as a university campus or cemetery. Rescue centers at elementary and junior high schools shelter people whose homes are unsafe. Part of Ikebukuro is a self-containment area where wide-area evacuation is not needed." },
      { title: "Prepare supplies for a week", description: "Prepare food, water (about 3 liters per person per day), and supplies for 7 days per person, secure furniture, and agree on meeting places and contact methods with your family. Disaster prevention leaflets are available in English, Chinese, and Korean at the ward's disaster prevention section." },
    ],
    sourceIds: ["toshima-disaster-evacuation-english","toshima-disaster-preparedness-english"], sourceFormatNote: undefined,
  },
  {
    id: "kita-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13117", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Kita", summary: "Kita assigns each neighborhood an evacuation place for major earthquake fires, and opens separate high-ground evacuation places when the Arakawa River may flood.",
    applicability: "Check your neighborhood's earthquake evacuation place and the flood evacuation places before a disaster; they are different. During an event, follow the ward's announcements.", responsibleBody: "Kita City",
    actions: [
      { title: "Know your earthquake evacuation place", description: "Evacuation places, designated by Tokyo, are where residents wait until fires after a major earthquake are out; each neighborhood is assigned one, such as Asukayama Park or the Arakawa riverbed. They are also shown on the Kita disaster map." },
      { title: "Know the flood evacuation places", description: "When a large typhoon threatens the Arakawa River, Kita opens high-ground flood evacuation places, mainly schools on higher ground; other flood evacuation places cover the Shakujii River and landslides. These differ from earthquake shelters. Opening information is posted on the ward website and sent by the Kita disaster weather e-mail." },
    ],
    sourceIds: ["kita-disaster-earthquake-evacuation","kita-disaster-flood-evacuation"], sourceFormatNote: "Kita's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "arakawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13118", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Arakawa", summary: "Almost all of Arakawa could flood if the Arakawa River embankments break, with water more than 5 meters deep in places, so evacuating from dangerous areas by alert level 4 is essential.",
    applicability: "Check your home's flood depth and evacuation place on the ward's flood maps ahead of time, and leave dangerous areas early when a typhoon approaches.", responsibleBody: "Arakawa City",
    actions: [
      { title: "Check the flood maps for your home", description: "The flood disaster map shows expected depths and evacuation places if the Arakawa River embankments break: almost the whole ward is in the expected flood area, up to about 5 meters or more. Separate maps cover Shakujii River flooding (parts of Nishi-Ogu) and storm surge (about half the ward). A map for flooding from heavy rain is being prepared." },
      { title: "Evacuate by alert level 4", description: "Since May 29, 2026, weather warnings carry alert levels. Leave dangerous places by level 4; level 5 means a disaster is already happening or imminent. Older people, people with disabilities, and others who need more time should move before level 3. The ward issues evacuation instructions based on these warnings." },
    ],
    sourceIds: ["arakawa-disaster-flood-maps","arakawa-disaster-evacuation-methods"], sourceFormatNote: "Arakawa's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "itabashi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13119", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Itabashi", summary: "Itabashi publishes flood hazard maps for Arakawa River flooding, how long the water would stay, and smaller rivers, plus storm-surge and landslide maps, with English, Chinese, and Korean editions.",
    applicability: "Check the maps for your address ahead of time; during an event, follow the ward's evacuation information.", responsibleBody: "Itabashi City",
    actions: [
      { title: "Check the flood maps", description: "The Arakawa flooding map (revised December 2025) shows expected flooding if the Arakawa River overflows, and a separate map shows how long the water would stay. The smaller-rivers map (revised August 2026) covers the Shakujii, Shingashi, and Shirako rivers." },
      { title: "Use the foreign-language maps", description: "The disaster map and the flood, storm-surge, and landslide hazard maps are available in English, Chinese, and Korean, along with a guide to preparing for floods." },
    ],
    sourceIds: ["itabashi-disaster-flood-maps","itabashi-disaster-maps-foreign-languages"], sourceFormatNote: "Itabashi's disaster pages are in Japanese; the maps have English, Chinese, and Korean editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nerima-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13120", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Nerima", summary: "Nerima uses different evacuation places for storms (community halls safe from flooding) and earthquakes (all ward elementary and junior high schools, its evacuation bases), and encourages staying at safe relatives' homes or indoors when safe.",
    applicability: "Check your nearest evacuation base and your flood risk ahead of time; during an event, follow the ward's evacuation information.", responsibleBody: "Nerima City",
    actions: [
      { title: "Know the two kinds of evacuation place", description: "In storms and floods, the ward's evacuation places are community halls and meeting places that are safe from flooding; in earthquakes, all ward elementary and junior high schools are evacuation bases. Evacuating also includes going to a safe relative's or friend's home, or staying safely indoors if the flood hazard map shows your home is safe." },
      { title: "Evacuate safely in a flood", description: "Avoid rivers, underpasses, and flooded streets; wear sneakers rather than boots, carry a backpack, move in pairs, and walk instead of driving. Download the Nerima disaster map, which shows evacuation bases, medical aid stations, and disaster wells, in case the internet goes down." },
    ],
    sourceIds: ["nerima-disaster-storm-evacuation","nerima-disaster-map"], sourceFormatNote: "Nerima's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "adachi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13121", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Adachi", summary: "After an earthquake, Adachi residents go first to their neighborhood's temporary gathering place, then to one of 32 evacuation places if fire spreads, and to a shelter if they cannot live at home; flood, inland flooding, and storm-surge hazard maps cover the ward.",
    applicability: "Check your gathering place, evacuation place, and shelter, and the flood maps, before a disaster.", responsibleBody: "Adachi City",
    actions: [
      { title: "Follow the earthquake evacuation steps", description: "Go first to your neighborhood's temporary gathering place (a local park or shrine). If a large fire makes the area dangerous, move as a group to your evacuation place, one of 32 assigned by address. When things calm down, return home, or go to your shelter (ward schools and metropolitan high schools) if your home is unlivable." },
      { title: "Check the flood hazard maps", description: "Adachi's flood, inland flooding, and storm-surge hazard map is also available in an audio version, with a record of past flooding." },
    ],
    sourceIds: ["adachi-disaster-earthquake-evacuation","adachi-disaster-flood-maps"], sourceFormatNote: "Adachi's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "katsushika-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13122", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Katsushika", summary: "Katsushika publishes a disaster map for foreign residents in English and Chinese, a flood hazard map explanation in 108 languages, and the Katsu-Rappa app for disaster radio announcements in four languages.",
    applicability: "Check your gathering place, evacuation place, and flood risk ahead of time; during an event, follow the ward's disaster radio and evacuation information.", responsibleBody: "Katsushika City",
    actions: [
      { title: "Use the maps and app for foreign residents", description: "The Katsushika disaster map for foreign residents shows where to evacuate and get water, in English and Chinese with Japanese. The Katsu-Rappa app shows the ward's disaster radio announcements as text and audio in Japanese, English, Simplified Chinese, and Korean." },
      { title: "Prepare for floods", description: "Check the flood hazard map (March 2025); its explanation can be read in 108 languages. The ward also publishes a guide to sheltering at home in a flood, how to collect disaster information, and evacuation methods. River cameras and water levels can be checked online." },
    ],
    sourceIds: ["katsushika-disaster-foreign-residents","katsushika-disaster-floods"], sourceFormatNote: "Katsushika's disaster pages are in Japanese, some in plain Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "edogawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13123", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Edogawa", summary: "In a major flood, water in Edogawa is expected to stay for more than two weeks, so the ward recommends evacuating early to relatives, friends, or hotels outside the flood area, and publishes its flood hazard map in English, Chinese, and plain Japanese.",
    applicability: "Check your flood risk and where you would go ahead of time; during an event, follow the ward's evacuation information.", responsibleBody: "Edogawa City",
    actions: [
      { title: "Check the flood hazard map", description: "Edogawa's flood hazard map, 2nd edition (July 2025), shows what would happen in a major flood and how to protect yourself. It is published in Japanese, English, Chinese, and plain Japanese, and the overview can be read in many languages; printed copies are available at the Disaster Prevention and Crisis Management Section and the ward's branch offices." },
      { title: "Plan wide-area evacuation", description: "Arrange in advance a place outside the ward that will not flood, such as a relative's or friend's home, and move there early, away from the typhoon's path. When choosing a hotel, avoid the other low-lying eastern wards. When the five eastern wards issue evacuation information, residents who stay at accommodation outside the ward can apply for a subsidy of 3,000 yen per night, up to three nights." },
    ],
    sourceIds: ["edogawa-disaster-flood-hazard-map","edogawa-disaster-wide-area-evacuation"], sourceFormatNote: "Edogawa's disaster pages are in Japanese; the hazard map has English, Chinese, and plain Japanese editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "hachioji-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13201", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Hachioji", summary: "Hachioji's main risks are floods and landslides in heavy rain and typhoons; its hazard map and disaster guidebook, available in English and Chinese, show danger zones and shelters.",
    applicability: "Check your exact address on the hazard map before the rainy and typhoon seasons; during an event, follow live instructions from the city.", responsibleBody: "Hachioji City",
    actions: [
      { title: "Check your home on the hazard map", description: "The hazard map shows landslide warning zones, expected flood areas, shelters, and emergency water stations. The comprehensive disaster guidebook containing it is available in English and Chinese, and the city lists separate shelters for earthquakes and for storms and floods. The city does not tell individuals whether their property lies in a warning zone; check the map yourself." },
      { title: "Decide how you will evacuate, and sign up for alerts", description: "Hachioji describes two ways to evacuate: moving to a safe room on an upper floor away from slopes and rivers, or leaving for a friend's safe home or an open shelter, keeping away from rivers and cliffs and taking food and water. The city's disaster e-mail and social media accounts are in Japanese; its Facebook pages in English and Chinese also carry heavy-rain and typhoon information." },
    ],
    sourceIds: ["hachioji-disaster-foreign-residents","hachioji-disaster-hazard-map"], sourceFormatNote: "Hachioji's hazard map page is in Japanese, and its page for foreign residents is in simple Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "tachikawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13202", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Tachikawa", summary: "Tachikawa asks residents to check its hazard maps to decide whether to leave home in a flood or landslide, and publishes a life safety handbook for foreign residents.",
    applicability: "Check your exact address on the hazard maps ahead of time; during an event, follow the evacuation levels announced by the city.", responsibleBody: "Tachikawa City",
    actions: [
      { title: "Check whether your home is in a colored area", description: "Tachikawa's maps show flooding from the Tama and Zanbori rivers, flooding from heavy rain and drainage overflow, landslide warning zones, and shelters. If your home is in a colored area, you should in principle evacuate outside it: older people and others who need time at alert level 3, and everyone at alert level 4. Staying with relatives or friends in a safe place also counts as evacuating, and if your home is safe you can stay there. New residents receive the maps when they register their address." },
      { title: "Use the handbook for foreign residents", description: "The city's Life Safety Handbook for Foreign Residents covers finding your nearest shelter (Tachikawa's 30 primary shelters are mainly elementary and junior high schools), preparing an evacuee registration card, what to do in an earthquake or heavy rain, and how to contact family after a disaster." },
    ],
    sourceIds: ["tachikawa-disaster-evacuation","tachikawa-disaster-hazard-maps","tachikawa-disaster-handbook-foreign-residents"], sourceFormatNote: "Tachikawa's evacuation and map pages are in Japanese; the handbook page links multilingual versions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "fuchu-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13206", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Fuchu", summary: "Fuchu publishes earthquake, flood, and landslide maps, including a flood hazard map in foreign languages, and designates school grounds and large open spaces as evacuation areas.",
    applicability: "Check the maps for your exact address before a disaster; during an event, follow instructions from the city, police, and fire department.", responsibleBody: "Fuchu City",
    actions: [
      { title: "Check the maps, including the foreign-language flood map", description: "The earthquake disaster map shows evacuation areas and shelters; the flood hazard map, also published in foreign languages, and the landslide hazard map show where water and landslides are expected." },
      { title: "Agree on an evacuation place with your family", description: "Fuchu distinguishes local evacuation places chosen by families and neighborhood associations (such as a nearby park), designated evacuation areas on the grounds of public elementary and junior high schools and metropolitan high schools, and wide-area evacuation areas for escaping large fires. Decide in advance where your family will meet so you can confirm everyone is safe." },
    ],
    sourceIds: ["fuchu-disaster-hazard-maps","fuchu-disaster-evacuation-areas"], sourceFormatNote: "Fuchu's disaster pages are in Japanese; the flood hazard map has foreign-language editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "machida-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-13209", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Machida", summary: "Machida publishes separate maps for earthquakes and for floods and landslides, and its shelters for each can differ.",
    applicability: "Check both maps for your district before a disaster; during an event, follow instructions from the city.", responsibleBody: "Machida City",
    actions: [
      { title: "Check both maps, because shelters differ", description: "The disaster map (earthquakes), in seven district editions, shows evacuation places, open spaces, and emergency water stations; in an earthquake you can go to any evacuation place that is open. The flood and landslide hazard map, in five district editions, shows expected flooding from rivers and from heavy rain, and landslide warning zones. Evacuation facilities for storms and floods can differ from those for earthquakes." },
      { title: "Use the updated hazard map", description: "Machida revised its flood and landslide hazard map in March 2026 and is delivering the map for each area to every household. Decide with your family in advance where you will evacuate." },
    ],
    sourceIds: ["machida-disaster-earthquake-map","machida-disaster-flood-landslide-map"], sourceFormatNote: "Machida's map pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nagoya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "nagoya", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Nagoya", summary: "Nagoya's hazard map covers floods, inland flooding, storm surge, earthquakes, tsunami, and reservoir failure for each ward, and some areas must evacuate in advance when a Nankai Trough earthquake advisory is issued.",
    applicability: "Check the map for your ward and address before a disaster; during an event, follow the city's evacuation information.", responsibleBody: "Nagoya City",
    actions: [
      { title: "Check your ward's hazard map and the disaster app", description: "The Nagoya hazard map shows every hazard the city assumes, with a map for each of the 16 wards. The Nagoya disaster app lets you check the risk at an address, receive alerts, and make an evacuation timeline. The disaster guidebook is published in Japanese and Easy Japanese." },
      { title: "Know your evacuation places, including tsunami buildings", description: "Check both the designated emergency evacuation places and the designated shelters near your home, and, near the coast, the tsunami evacuation buildings listed for your ward. Some areas are asked to evacuate in advance when a Nankai Trough earthquake advisory is issued." },
    ],
    sourceIds: ["nagoya-disaster-hazard-map","nagoya-disaster-evacuation-places","nagoya-disaster-guidebook","nagoya-disaster-information"], sourceFormatNote: "Nagoya's disaster pages are in Japanese, with some Easy Japanese material. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "osaka-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-27100", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Osaka", summary: "Osaka City separates evacuation places by type of disaster, and each of its 24 wards publishes its own disaster map.",
    applicability: "Check the evacuation places for your exact address and each kind of disaster ahead of time; during an event, follow live instructions from the city and your ward.", responsibleBody: "Osaka City",
    actions: [
      { title: "Learn which place to use for which disaster", description: "Osaka City distinguishes evacuation places, for escaping immediate danger, from shelters, for staying longer. Wide-area evacuation places are large parks that are safe from spreading fires; temporary evacuation places are parks and schoolyards for earthquakes; tsunami and flood evacuation buildings are the third floor and above of sturdy buildings. Shelters, often school gyms, are for people who cannot stay at home. Go to a place designated for the current disaster, not simply the nearest shelter; in a sturdy building, staying on the third floor or above during a tsunami or flood can also be a safe evacuation." },
      { title: "Use your ward's map and the city's alerts", description: "Each ward's disaster map is linked from the city's list of ward maps. The city announces evacuation instructions through loudspeakers at elementary schools and ward offices and through emergency alerts to mobile phones, television, and radio. Its citizen disaster manual explains what to do during an event." },
    ],
    sourceIds: ["osaka-disaster-evacuation-places","osaka-disaster-ward-maps"], sourceFormatNote: "Osaka City's evacuation and map pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sakai-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "jp-27140", lastCheckedAt: "2026-09-24",
    title: "Disaster information for Sakai", summary: "Sakai designates shelters for each type of disaster, listed by ward, and publishes a disaster handbook for foreign residents.",
    applicability: "Check the shelters near your exact address for both earthquakes and storms or floods; during an event, follow live instructions from the city.", responsibleBody: "Sakai City",
    actions: [
      { title: "Find your ward's shelters for each kind of disaster", description: "Sakai designates shelters separately for earthquakes and for storm and flood damage, and lists them for each of its seven wards. Check the nearest shelter for each kind of disaster before you need it." },
      { title: "Read the handbook for foreign residents", description: "The city's disaster handbook for foreign residents explains everyday preparation and what to do when a disaster happens. The city's International Division and the Multicultural Exchange Plaza (POME Sakai) are listed as contacts." },
    ],
    sourceIds: ["sakai-disaster-shelters","sakai-disaster-handbook-foreign-residents"], sourceFormatNote: "Sakai's shelter and handbook pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
]);
