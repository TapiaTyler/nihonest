import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const householdWasteSupplements = defineLocalGuidanceSupplements([
  {
    id: "chiyoda-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13101", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Chiyoda", summary: "Chiyoda collects recyclables and waste every day except Sundays, at times that depend on your collection point, in lidded containers or see-through bags, and collects bulky waste by paid application.",
    applicability: "Collection days and burnable-waste times differ by address; check the address table, the sign at your collection point, or the Wakechiyo app.", responsibleBody: "Chiyoda City",
    actions: [
      { title: "Check your day and time, then use a see-through bag", description: "Chiyoda collects recyclables and waste every day except Sundays and the New Year period, with each type on its own days. Put burnable and non-burnable waste in a lidded container or a clear or translucent bag at your collection point by the time shown on the point's sign; recyclables and plastics go out by 8:30 a.m. Non-burnable waste is collected twice a month. Sorting posters and address tables are published in English, Chinese, French, and Korean, and the Wakechiyo app works in the same languages." },
      { title: "Book bulky waste in advance", description: "Household items of about 30 cm or more and up to 2 m long are bulky waste, up to 10 items at a time. Apply to the bulky waste reception center online, through the ward's chatbot, or by phone from Monday to Saturday, 8 a.m. to 7 p.m. (closed December 29 to January 3). Businesses cannot use this service." },
    ],
    sourceIds: ["chiyoda-household-waste-rules","chiyoda-household-waste-burnable","chiyoda-household-waste-bulky","chiyoda-household-waste-app"], sourceFormatNote: "Chiyoda's waste pages are in Japanese, with posters and address tables in other languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "chuo-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13102", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Chuo", summary: "Chuo publishes collection days for each town, collects burnable waste in see-through bags or lidded containers, and collects bulky waste by paid application, out by 8 a.m.",
    applicability: "Collection days differ by town and block; check Chuo's table for your address. In some central areas burnable waste is collected Monday to Saturday.", responsibleBody: "Chuo City",
    actions: [
      { title: "Check your town's days and use a see-through bag", description: "Chuo lists burnable waste, non-burnable waste, plastics marked for recycling, recyclables, and bulky waste collection days for each town and block. Put burnable waste out in a clear or translucent bag or a lidded container. Paper drink cartons, food trays, and cloth are also collected at drop-off points." },
      { title: "Book bulky waste and attach tickets", description: "Items with a side longer than 30 cm are bulky waste. Apply to the Chuo bulky waste reception center online, by chatbot, or by phone from Monday to Saturday, 8 a.m. to 7 p.m. Buy Chuo's bulky waste tickets for the quoted fee at a shop with the sign or the Chuo cleaning office, write the collection date and your name or reception number on them, and put the items at your entrance or property entrance by 8 a.m. on collection day." },
    ],
    sourceIds: ["chuo-household-waste-collection-days","chuo-household-waste-burnable","chuo-household-waste-bulky"], sourceFormatNote: "Chuo's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "minato-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13103", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Minato", summary: "Minato collects sorted waste at collection stations by 8 a.m. (7:30 a.m. in some areas) on set days, publishes its sorting guidebook in English, Chinese, and Korean, and collects bulky waste by application.",
    applicability: "Collection days differ by area. Ask your building manager or landlord where your collection station is.", responsibleBody: "Minato City",
    actions: [
      { title: "Sort waste and put it out by 8 a.m.", description: "Put sorted waste at your recycling and waste collection station by 8 a.m. (7:30 a.m. in special areas) on its collection day. The Waste Sorting Guidebook is available in English, Chinese, Korean, and Japanese, and the free Tokyo Minato City Waste Sorting App lets you search how to sort items, check collection days for your area, and set reminders. Recyclables can also go in collection boxes at city facilities." },
      { title: "Apply before putting out bulky waste", description: "Items with a longest side of 30 cm or more are bulky waste. Apply to the Minato bulky waste reception center first, buy paid waste tickets for the fee, and put the items out as instructed, or take them in yourself. Minato collects only household bulky waste; businesses must use a licensed collector. Beware of unlicensed collectors who charge high fees." },
    ],
    sourceIds: ["minato-household-waste-english","minato-household-waste-bulky"], sourceFormatNote: "Minato's bulky waste page is in Japanese; its waste rules page is in English. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinjuku-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "shinjuku", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Shinjuku", summary: "Shinjuku collects waste at shared collection points by 8 a.m. on your area's collection days, in lidded containers or see-through bags rather than designated bags, and collects bulky waste by paid application.",
    applicability: "Collection days differ by area; check them for your address in the ward's list or the Sanaru app.", responsibleBody: "Shinjuku City",
    actions: [
      { title: "Put waste out by 8 a.m. in a see-through bag", description: "Burnable waste is collected twice a week, including public holidays but not Sundays or the New Year period. Put it out by 8 a.m. on the collection day at your collection point, in a lidded container or a plastic bag you can see through. Recyclables such as paper, bottles, cans, PET bottles, and plastics are sorted separately. The free Sanaru app shows your collection days, a sorting dictionary, and, since April 2026, a chatbot that suggests how to sort an item from a photo or name." },
      { title: "Book bulky waste and buy a ticket", description: "Household items with a side longer than about 30 cm, such as furniture, bedding, and bicycles, are bulky waste. Apply to the bulky waste reception center by phone from Monday to Saturday, 8 a.m. to 7 p.m., or online at any time. Buy Shinjuku's bulky waste tickets for the fee at a shop showing the sign, a cleaning office, or a special branch office, attach them, and put the items out on the morning of collection at the place agreed. Air conditioners, TVs, refrigerators, washing machines, and computers are not collected." },
    ],
    sourceIds: ["shinjuku-household-waste-current","shinjuku-household-waste-burnable","shinjuku-household-waste-bulky","shinjuku-household-waste-app","shinjuku-waste-disposal"], sourceFormatNote: "Shinjuku's current waste pages are in Japanese; its English page covers the basics. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "bunkyo-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13105", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Bunkyo", summary: "Bunkyo publishes its waste sorting guide in English, Chinese, and Korean, and collects bulky waste of about 30 cm or more by paid application.",
    applicability: "Collection days differ by area; check the ward's sorting guide for your address.", responsibleBody: "Bunkyo City",
    actions: [
      { title: "Use the sorting guide in your language", description: "Bunkyo's guide to sorting and putting out waste and recyclables is published in Japanese, with foreign-language editions in English, Chinese, and Korean. It explains how to sort each type and when to put it out." },
      { title: "Book bulky waste early", description: "Household items of about 30 cm or more on a side are bulky waste. Apply to the bulky waste reception center by phone from Monday to Saturday, 8:00 to 19:00, or online or by chatbot at any time (closed December 28 to January 4); at year-end and in moving season, collection can take two to three weeks or more. Buy the quoted amount of Bunkyo bulky waste tickets at a shop with the sign. Appliances such as TVs, air conditioners, refrigerators, and washing machines, and computers, are not collected, and businesses cannot use the service." },
    ],
    sourceIds: ["bunkyo-household-waste-guide","bunkyo-household-waste-bulky"], sourceFormatNote: "Bunkyo's waste pages are in Japanese; its sorting guide has English, Chinese, and Korean editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "taito-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13106", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Taito", summary: "Taito collects burnable waste twice a week from each household, in see-through bags or lidded containers, by 8 a.m., and collects bulky waste over about 30 cm by paid application.",
    applicability: "Collection days differ by area; check Taito's list of collection days for your address.", responsibleBody: "Taito City",
    actions: [
      { title: "Put waste out by 8 a.m. in a see-through bag", description: "Burnable waste is collected twice a week on days that depend on your area. Put it out by 8 a.m. on the collection day, in a clear bag or lidded container with the bag tied, at the designated place; about three 45-liter bags at a time is the guideline. Since April 2025, plastics go out as plastics, not burnable waste. Taito's sorting booklet, which covers each category and the collection days by area, is available at the ward office, the Taito cleaning office, and other ward facilities, and as a PDF." },
      { title: "Book bulky waste by phone or online", description: "Household items with a longest side of more than about 30 cm are bulky waste, even if you take them apart. Apply to the bulky waste reception center by phone from Monday to Saturday, 8 a.m. to 7 p.m. (closed December 29 to January 3), or online at any time; the center tells you the collection day and which tickets to buy. From October 1, 2026, online applications can be paid electronically. A chatbot can identify the item and fee from a photo. Air conditioners, TVs, refrigerators, washing machines, dryers, and computers are not collected." },
    ],
    sourceIds: ["taito-household-waste-burnable","taito-household-waste-bulky","taito-household-waste-guide"], sourceFormatNote: "Taito's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sumida-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13107", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Sumida", summary: "Sumida collects burnable waste twice a week in see-through bags or lidded containers, out by 8 a.m. and not the night before, and collects bulky waste over 30 cm by paid application.",
    applicability: "Collection days differ by area; check Sumida's collection-day list or calendar for your address.", responsibleBody: "Sumida City",
    actions: [
      { title: "Put waste out by 8 a.m., not at night", description: "Put burnable waste in a see-through bag or lidded container at your designated place by 8 a.m. on the collection day, twice a week. Do not put it out at night, which attracts crows and arson, or after collection has passed. Cut small branches under 50 cm and tie them; large amounts are charged." },
      { title: "Book bulky waste online or by phone", description: "Household items with a side longer than 30 cm are bulky waste. Apply to the Sumida bulky waste reception center online at any time, where you can pay the fee by cashless payment, or by phone from Monday to Saturday, 8 a.m. to 7 p.m., including holidays but not the New Year period. If you do not pay online, buy Sumida's bulky waste tickets (other wards' tickets are not accepted). Put the items out by 8 a.m. on the collection day, not earlier. The chatbot Suminyaru can tell you whether an item is bulky and its fee. Businesses cannot use this service." },
    ],
    sourceIds: ["sumida-household-waste-burnable","sumida-household-waste-bulky"], sourceFormatNote: "Sumida's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "koto-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13108", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Koto", summary: "Koto collects recyclables and waste at collection points by 8 a.m. on collection day, with color-coded containers for bottles, cans, and PET bottles, publishes its sorting guide in English, Chinese, Korean, and Tagalog, and collects bulky waste by paid application.",
    applicability: "Collection days differ by district; check Koto's list of collection days by area.", responsibleBody: "Koto City",
    actions: [
      { title: "Put waste out by 8 a.m., using the containers", description: "Put recyclables and waste at your collection point by 8 a.m. on collection day; in strong wind or storms, keep them until the next collection day. Bottles, cans, and PET bottles go, rinsed and out of their bags, into the yellow, blue, and green containers set out at the point; paper is tied with string. Koto's sorting guide is available in English, Chinese and Korean, and Tagalog." },
      { title: "Book bulky waste", description: "Household items of about 30 cm or more on a side, such as furniture, futons, and bicycles, are bulky waste, collected by paid application through the bulky waste reception center. Business bulky waste is not collected." },
    ],
    sourceIds: ["koto-household-waste-rules","koto-household-waste-burnable","koto-household-waste-bulky"], sourceFormatNote: "Koto's waste pages are in Japanese; its sorting guide has English, Chinese and Korean, and Tagalog editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinagawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13109", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Shinagawa", summary: "Shinagawa collects burnable waste from each household in see-through bags by 8 a.m. (7:30 a.m. in early-collection areas), and collects bulky waste of about 30 cm or more by paid application.",
    applicability: "Collection days differ by area. New residents should contact the Shinagawa cleaning office.", responsibleBody: "Shinagawa City",
    actions: [
      { title: "Put burnable waste out by 8 a.m. in a see-through bag", description: "Shinagawa collects burnable waste from each household: at the designated place on the grounds for apartments, or at your entrance or gate for houses. Put it out by 8 a.m. on collection day (7:30 a.m. in early-collection areas) in a see-through bag, even if you also use a lidded container, and no more than four 45-liter bags at a time. Clean plastics go out as recyclables. New residents should contact the Shinagawa cleaning office." },
      { title: "Book bulky waste early", description: "Items of about 30 cm or more on a side are bulky waste. Apply to the Shinagawa bulky waste reception center online at any time or by phone from Monday to Saturday, including holidays, 8 a.m. to 7 p.m., leaving plenty of time. If you pay electronically online, you do not need tickets; write the reception number, collection date, item, and amount on paper and tape it to each item." },
    ],
    sourceIds: ["shinagawa-household-waste-burnable","shinagawa-household-waste-bulky"], sourceFormatNote: "Shinagawa's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "meguro-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13110", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Meguro", summary: "Meguro explains how to sort burnable waste, including branches and dirty plastics, and collects bulky waste of about 30 cm or more by paid application only; it does not accept bulky waste brought in.",
    applicability: "Collection days differ by area; check Meguro's sorting and collection search for your address.", responsibleBody: "Meguro City",
    actions: [
      { title: "Sort burnable waste carefully", description: "Burnable waste includes kitchen waste (drained), small amounts of branches and leaves, leather and rubber goods, plastics that cannot be cleaned, and paper that cannot be recycled. Cut branches to about 50 cm and bundle them within 30 cm across, up to four bundles at a time; thicker branches and trunks are bulky waste. Cooking oil and reusable clothing can also be taken to the Meguro Eco Plaza." },
      { title: "Book bulky waste by phone or online", description: "Items of about 30 cm or more on a side are bulky waste, collected for a fee by advance application only; Meguro does not accept bulky waste brought in, and businesses cannot use the service. Apply to the Meguro bulky waste reception center by phone from Monday to Saturday, 8 a.m. to 7 p.m., including holidays (closed Sundays and December 29 to January 3), or online at any time for most items. Collection can take about two weeks." },
    ],
    sourceIds: ["meguro-household-waste-burnable","meguro-household-waste-bulky"], sourceFormatNote: "Meguro's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "ota-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13111", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Ota", summary: "Ota collects burnable waste twice a week by 8 a.m., publishes its sorting guide in English, Chinese, Korean, Tagalog, Nepali, and Vietnamese, and collects bulky waste of about 30 cm or more by paid application.",
    applicability: "Collection days differ by area; check Ota's sorting guide or app for your address.", responsibleBody: "Ota City",
    actions: [
      { title: "Put burnable waste out by 8 a.m.", description: "Burnable waste, including plastics that cannot be rinsed clean, leather, rubber, and clothing, is collected twice a week; put it out by 8 a.m. on collection day. Cut branches to within 50 cm and 10 cm thick and tie them; four or more bundles at once are charged. Ota's guide to sorting and putting out waste, and its guide to plastics, are available in English, Chinese, Korean, Tagalog, Nepali, and Vietnamese, as is its sorting app." },
      { title: "Book bulky waste early", description: "Household furniture, bedding, appliances, and similar items of about 30 cm or more on a side are bulky waste. Apply to the Ota bulky waste reception center by phone from 8 a.m. to 7 p.m. or online at any time (up to 10 items per online application), leaving plenty of time, then buy bulky waste tickets for the fee." },
    ],
    sourceIds: ["ota-household-waste-burnable","ota-household-waste-bulky","ota-household-waste-foreign-languages"], sourceFormatNote: "Ota's waste pages are in Japanese; its sorting guides are in six other languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "setagaya-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13112", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Setagaya", summary: "Setagaya collects waste by 8 a.m. on your area's collection days, in see-through bags or lidded containers of up to 90 liters, and collects bulky waste by application, including online in English.",
    applicability: "Collection days differ by area; check Setagaya's collection-day list for your address.", responsibleBody: "Setagaya City",
    actions: [
      { title: "Put waste out by 8 a.m. in a see-through bag", description: "Put waste out by 8 a.m. on the collection day, in a lidded container of up to 90 liters or a clear or translucent bag, not a cardboard box. Up to three 45-liter bags at a time; larger amounts, such as when moving, are charged." },
      { title: "Book bulky waste online, by phone, or by chat", description: "Apply online at any time (English is supported), by phone, or by chatbot; you are told the collection day and fee. Pay online, or buy Setagaya's bulky waste tickets at a convenience store, write the collection day and your name or reception number on them, and put the items out by 8 a.m. on collection day. Apartment buildings may have a designated place. Waste from any business activity is not accepted." },
    ],
    sourceIds: ["setagaya-household-waste-rules","setagaya-household-waste-bulky"], sourceFormatNote: "Setagaya's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shibuya-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13113", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Shibuya", summary: "Shibuya collects burnable trash twice a week, non-burnable trash once a month, and recyclables once a week, in see-through bags or containers, and collects bulky waste over 30 cm by paid reservation.",
    applicability: "Collection days differ by area; Shibuya's English living guide explains the categories.", responsibleBody: "Shibuya City",
    actions: [
      { title: "Sort by type and use see-through bags", description: "Burnable trash is collected twice a week, non-burnable trash once a month, and recyclables once a week. Put burnable and non-burnable trash in a designated container or a transparent or semitransparent bag. Bundle newspapers, magazines, and cardboard without bags; rinse bottles and cans; remove caps and labels from PET bottles and crush them." },
      { title: "Reserve bulky waste", description: "Household items with a side over 30 cm are bulky waste (cut anything over 180 cm down). Reserve through the bulky waste reception center online, by LINE, or by phone, and pay by ticket or cashless payment; the item is collected from your residence, or from near the roadside on the first floor of an apartment building. Business waste and air conditioners, TVs, refrigerators, and washing machines are not collected." },
    ],
    sourceIds: ["shibuya-household-waste-english","shibuya-household-waste-bulky"], sourceFormatNote: "Shibuya's bulky waste page is in Japanese; its living guide is in English. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nakano-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13114", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Nakano", summary: "Nakano collects waste and recyclables by 8 a.m. on your area's collection days, waste in see-through bags or lidded containers, and collects bulky waste over 30 cm by paid application with English and Chinese support.",
    applicability: "Collection days differ by area; check Nakano's list of collection days by area.", responsibleBody: "Nakano City",
    actions: [
      { title: "Put waste and recyclables out by 8 a.m.", description: "Burnable waste, ceramic, glass, and metal waste, and plastics go to the waste collection point in a lidded container or clear or translucent bag by 8 a.m. on collection day. Bottles go in the yellow case, cans in the blue case, and PET bottles in the net at the recyclables point, rinsed. Paper is tied with string and clothes go in a plastic bag; clothes are not collected on rainy days." },
      { title: "Book bulky waste", description: "Furniture and appliances with a side over 30 cm are bulky waste. Apply to the Nakano bulky waste reception center by phone from Monday to Saturday, 8 a.m. to 7 p.m. (English and Chinese available), or online at any time; buy Nakano bulky waste tickets and put the items out at the designated place by 8 a.m. on the collection day. Business waste is not collected." },
    ],
    sourceIds: ["nakano-household-waste-basics","nakano-household-waste-bulky"], sourceFormatNote: "Nakano's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "suginami-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13115", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Suginami", summary: "Suginami explains how to sort burnable waste and collects bulky waste of about 30 cm to 220 cm by paid application, put out by 8 a.m. at your entrance or the building's bulky waste area.",
    applicability: "Collection days differ by area; check Suginami's sorting guide and calendar for your address.", responsibleBody: "Suginami City",
    actions: [
      { title: "Sort burnable waste", description: "Burnable waste includes kitchen waste (drained), sanitary products, clothing, oil soaked in paper or solidified, unrecyclable paper, plastics that cannot be cleaned, and rubber and leather goods. Tie pruned branches within 50 cm long and 10 cm across. Consult your cleaning office before putting out four or more bundles or 45-liter bags at once. Clean plastics go out as recyclables." },
      { title: "Book bulky waste", description: "Household items with a longest side of about 30 cm, up to 220 cm, are bulky waste. Apply online (24 hours), by chatbot, phone, or fax; buy Suginami bulky waste tickets and write the collection date and the last four digits of your reception number on them. Put items out by 8 a.m. on collection day at your entrance or property entrance facing the road, or at the building's bulky waste area; collection runs until about 3 p.m. Empty drawers and cases and remove batteries. Businesses cannot use the service." },
    ],
    sourceIds: ["suginami-household-waste-burnable","suginami-household-waste-bulky"], sourceFormatNote: "Suginami's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "toshima-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13116", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Toshima", summary: "Toshima collects sorted waste at shared collection sites by 8 a.m. (7:30 a.m. near Ikebukuro Station), in see-through bags with no designated bags, and leaves unsorted waste with a violation sticker.",
    applicability: "Ask your landlord or real estate agent where your collection site is; collection days differ by area.", responsibleBody: "Toshima City",
    actions: [
      { title: "Sort and put waste out by 8 a.m.", description: "Put sorted waste at the designated collection site by 8 a.m. on the collection day (7:30 a.m. in the Ikebukuro Station area); collection continues on rainy days and holidays. Burnable garbage (twice a week) and plastics (once a week) go in transparent or semitransparent bags; there are no designated bags, and black bags and boxes are not allowed. Metal, ceramics, and glass are collected twice a month. Unsorted waste is left with a violation sticker for you to re-sort." },
      { title: "Treat large items as bulky waste", description: "Furniture, household items, and futons with a side over 30 cm cannot go to the collection site and must be disposed of as bulky waste. For large amounts, such as when moving out, contact the Toshima Waste Collection Office." },
    ],
    sourceIds: ["toshima-household-waste-english"], sourceFormatNote: undefined,
  },
  {
    id: "kita-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13117", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Kita", summary: "Kita collects burnable waste on two set days a week, including holidays, by 8 a.m., in containers or see-through bags, and collects bulky waste over about 30 cm by application.",
    applicability: "Collection days differ by area and are shown in Kita's sorting leaflet. In areas with house-by-house collection, including all of Takinogawa, waste goes in front of your home.", responsibleBody: "Kita City",
    actions: [
      { title: "Put burnable waste out by 8 a.m.", description: "Burnable waste is collected on two set days a week between Monday and Saturday, including public holidays but not the New Year period. Put it out by 8 a.m. at the collection point (or in front of your home in house-by-house areas; apartments use their designated place), in a container or see-through bag. Waste mixed with recyclables is not collected; five or more 45-liter bags at once is charged, so consult the cleaning office first." },
      { title: "Book bulky waste", description: "Items with any side over about 30 cm are bulky waste, collected or brought in only by application to the bulky waste reception center: by phone from Monday to Saturday, 8 a.m. to 7 p.m. (except the New Year period), or online at any time. From October 1, 2026, online applications can be paid electronically." },
    ],
    sourceIds: ["kita-household-waste-burnable","kita-household-waste-bulky"], sourceFormatNote: "Kita's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "arakawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13118", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Arakawa", summary: "Arakawa publishes its collection days and sorting guide in English, Chinese, Taiwanese Mandarin, Korean, Vietnamese, Nepali, Mongolian, Uzbek, and Burmese, and collects bulky waste over 30 cm by paid application.",
    applicability: "Collection days differ by area; the ward's guide lists them.", responsibleBody: "Arakawa City",
    actions: [
      { title: "Use the sorting guide in your language", description: "Arakawa's guide to collection days and sorting is available in many languages. Put burnable and non-burnable waste in semi-transparent bags; drain kitchen waste and cut branches to 30 cm or less. Put empty spray cans, gas cartridges, and lighters in a separate bag marked as dangerous." },
      { title: "Book bulky waste and put it out by 8 a.m.", description: "Furniture and appliances with a side over 30 cm are bulky waste. Apply to the bulky waste reception center online at any time (up to 10 items) or by phone from Monday to Saturday, 8 a.m. to 7 p.m. Buy Arakawa bulky waste tickets at a shop with the sign (other wards' tickets are not accepted), write your name or reception number and the collection date on them, and put the items in front of your home by 8 a.m. on collection day." },
    ],
    sourceIds: ["arakawa-household-waste-rules","arakawa-household-waste-bulky"], sourceFormatNote: "Arakawa's waste pages are in Japanese; its sorting guide is available in nine other languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "itabashi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13119", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Itabashi", summary: "Itabashi collects recyclables and waste at collection points by 8 a.m. on collection day, not the night before, publishes its sorting leaflet in English, Chinese, and Korean, and collects bulky waste by application.",
    applicability: "Collection days differ by area; check Itabashi's sorting handbook for your address.", responsibleBody: "Itabashi City",
    actions: [
      { title: "Put waste out by 8 a.m., never at night", description: "Put recyclables and waste at the collection point by 8 a.m. on collection day; putting them out at night has led to arson. Recyclables, including plastics, paper, bottles, cans, and PET bottles, are collected once a week; plastics go in a clear or semitransparent bag, tied. The sorting leaflet is available in Japanese, English, Chinese, and Korean." },
      { title: "Book bulky waste", description: "Furniture, bedding, and other items with a longest side of about 30 cm or more are bulky waste, even if taken apart. Apply online or through the Itabashi bulky waste reception center; an AI chatbot can tell you fees and collection dates. Appliances covered by recycling law, computers, and business waste are not collected." },
    ],
    sourceIds: ["itabashi-household-waste-rules","itabashi-household-waste-timing","itabashi-household-waste-bulky"], sourceFormatNote: "Itabashi's waste pages are in Japanese; its sorting leaflet has English, Chinese, and Korean editions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nerima-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13120", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Nerima", summary: "Nerima collects waste by 8 a.m. on set days, not the night before, up to three 45-liter bags at a time, and collects bulky waste over about 30 cm by paid application with online payment.",
    applicability: "Collection days differ by area; check Nerima's collection schedule for your address.", responsibleBody: "Nerima City",
    actions: [
      { title: "Put waste out by 8 a.m. on the day", description: "Put waste out by 8 a.m. on the set collection day, never the night before, and sort it properly; waste that breaks the rules is not collected. Up to three 45-liter bags, or three bundles of branches, at a time. Items of about 30 cm or more on a side are bulky waste." },
      { title: "Book bulky waste online or by phone", description: "Apply online at any time, where you can also pay online (no receipt is issued), or by phone; otherwise buy Nerima bulky waste tickets." },
    ],
    sourceIds: ["nerima-household-waste-burnable","nerima-household-waste-bulky"], sourceFormatNote: "Nerima's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "adachi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13121", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Adachi", summary: "Adachi's waste rules page for foreign residents explains sorting and putting waste out by 8 a.m. on set days, and a sorting app works in English, Chinese, and Korean; bulky waste over 30 cm is collected by application.",
    applicability: "Collection days differ by area; check Adachi's collection schedule or app for your address.", responsibleBody: "Adachi City",
    actions: [
      { title: "Sort and put waste out by 8 a.m.", description: "Sort waste and put each type out by 8 a.m. on its set day; wrongly sorted waste, or waste put out after collection, is not collected. Burnable and non-burnable waste go in a lidded container or see-through bag (clear or semitransparent shopping bags are fine). The sorting app, in English, Chinese, and Korean, shows your area's schedule and how to sort items." },
      { title: "Book bulky waste", description: "Household items with a side longer than 30 cm are bulky waste. Apply to the bulky waste reception center online or by chatbot at any time, or by phone from Monday to Saturday, including holidays, 8 a.m. to 7 p.m. (except the New Year period); phones are busiest on Monday mornings." },
    ],
    sourceIds: ["adachi-household-waste-foreign-residents","adachi-household-waste-bulky"], sourceFormatNote: "Adachi's waste pages are in Japanese and can be machine-translated. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "katsushika-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13122", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Katsushika", summary: "Katsushika includes rubber and leather goods in burnable waste, and takes bulky waste applications online or by phone every day, including weekends and holidays.",
    applicability: "Collection days differ by area; check Katsushika's collection calendar for your address.", responsibleBody: "Katsushika City",
    actions: [
      { title: "Sort burnable waste", description: "Burnable waste includes kitchen waste (drained), cooking oil (solidified or soaked into cloth), leaves and short pruned branches, clothing, unrecyclable paper, and rubber and leather goods such as shoes, bags, belts, and hoses." },
      { title: "Book bulky waste", description: "Household items with any side over 30 cm, such as futons, furniture, and bicycles, are bulky waste. Apply to the Katsushika bulky waste reception center online, or by phone every day including weekends and holidays, 8 a.m. to 7 p.m. (except the New Year period); weekends are less busy than Mondays. Buy Katsushika bulky waste tickets for the quoted fee at a convenience store, supermarket, or other seller." },
    ],
    sourceIds: ["katsushika-household-waste-burnable","katsushika-household-waste-bulky"], sourceFormatNote: "Katsushika's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "edogawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13123", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Edogawa", summary: "Edogawa's waste page for foreign residents explains sorting into burnable waste, non-burnable waste, and weekly recyclables put out by 8 a.m. on set days, and bulky waste of 30 cm or more is collected by paid application, including on Sundays and holidays.",
    applicability: "Collection days differ by area; check Edogawa's collection schedule for your address.", responsibleBody: "Edogawa City",
    actions: [
      { title: "Sort and put waste out by 8 a.m.", description: "Put recyclables and waste out by 8 a.m. on the set day for your area. Burnable and non-burnable waste go in a container or a clear or semitransparent bag. Burnable waste includes kitchen waste, clothing, plastics without the plastic mark, and rubber and leather; spray cans and lighters go out empty and separate from other non-burnable waste. PET bottles go in the green net, bottles in the yellow container, and cans in the blue container. The basic rules are available in English, Chinese, and Korean." },
      { title: "Book bulky waste", description: "Items with a side of 30 cm or more, such as furniture, bedding, and bicycles, are bulky waste. Apply to the bulky waste reception center online, by chatbot, or by phone Monday to Saturday, 8 a.m. to 7 p.m. (except the New Year period), up to 10 items at a time. Buy Edogawa bulky waste tickets for the fee and write the collection date and your name or reception number on them; other wards' tickets cannot be used." },
    ],
    sourceIds: ["edogawa-household-waste-foreign-residents","edogawa-household-waste-bulky"], sourceFormatNote: "Edogawa's waste pages are in Japanese; the page for foreign residents also has English, Chinese, and Korean versions. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "hachioji-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13201", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Hachioji", summary: "Hachioji collects burnable and non-burnable waste only in its paid designated bags, by 8:30 a.m. on your area's collection day, and collects bulky waste by application.",
    applicability: "Use the collection calendar for your town name; new residents from another municipality receive it when they register their address.", responsibleBody: "Hachioji City",
    actions: [
      { title: "Use the designated bags and your area's calendar", description: "Put waste out by 8:30 a.m. on the collection day shown in the collection calendar for your town. Burnable waste goes in the blue designated bags and non-burnable waste in the yellow ones, sold in stores. Residents of detached houses put everything out on their own property facing the road; apartment residents use the building's designated collection point. Recyclables, hazardous waste, and plastic containers are sorted separately. The city also has a sorting dictionary for individual items." },
      { title: "Book bulky waste online or by phone", description: "Items that do not fit in a designated bag, or weigh 5 kg or more, are bulky waste. Apply online at any time or through the bulky waste call center on weekdays from 8:30 a.m. to 5:15 p.m.; up to 10 items per application. Pay online by the day before collection or with bulky waste tickets from a store, label each item with the reception number and collection date, and put them out by 8:30 a.m. on the collection day. Some appliances and computers cannot be handled by the city." },
    ],
    sourceIds: ["hachioji-household-waste-rules","hachioji-household-waste-bulky"], sourceFormatNote: "Hachioji's current waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "tachikawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13202", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Tachikawa", summary: "Tachikawa collects waste by 8 a.m. on the days in its collection calendar, which is available in several languages, and charges for burnable and non-burnable waste through designated bags.",
    applicability: "Use the collection calendar for your area; collection days differ by district.", responsibleBody: "Tachikawa City",
    actions: [
      { title: "Use the calendar and the designated bags", description: "Put recyclables and waste out by 8 a.m. on the collection day in the calendar, which the city publishes in English, Chinese, Korean, and several other languages. Burnable waste goes in the city's yellow designated bags and non-burnable waste in the green ones, both paid. Diapers and fallen leaves or weeds can go out on burnable waste days in clear or translucent bags of up to 45 liters without a designated bag. Plastics go out on the plastics collection day, not with non-burnable waste." },
      { title: "Book bulky waste and buy tickets afterwards", description: "Apply online at any time or through the bulky waste reception center on weekdays from 9 a.m. to 4 p.m. Collection can be booked from about seven days to two months ahead. Pay online when applying online, or buy processing tickets after applying (they are not refunded), attach them to the items, and put the items out by 8 a.m. on the collection day at your entrance or your building's collection point. Business waste is not accepted." },
    ],
    sourceIds: ["tachikawa-household-waste-calendar-foreign-residents","tachikawa-household-waste-burnable","tachikawa-household-waste-bulky"], sourceFormatNote: "Tachikawa's waste pages are in Japanese, with calendars in other languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "fuchu-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13206", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Fuchu", summary: "Fuchu collects waste by 8 a.m. on your area's collection day and charges for burnable waste, non-burnable waste, and plastic packaging through designated bags; its LINE waste menu is available in English, Chinese, and Korean.",
    applicability: "Use the collection calendar for your area; collection days differ by district.", responsibleBody: "Fuchu City",
    actions: [
      { title: "Use the three designated bags", description: "Put waste and recyclables out by 8 a.m. on the collection day. Burnable waste goes in green designated bags (twice a week), non-burnable waste in orange bags, and plastic packaging marked with the plastic symbol in pink bags (once a week); all three bags are paid. Magazines and mixed paper are tied with string. The city's LINE account has a waste menu in English, Chinese, and Korean." },
      { title: "Apply before putting out bulky waste", description: "Items with a longest side of 40 cm or more (30 cm for electrical products, 80 cm for rods) are bulky waste. Apply through the bulky waste call center from Monday to Saturday, 8 a.m. to 7 p.m., or online at any time. Pay online, or buy bulky waste stickers by the day before collection, label each item with the reception number and date, and put it out by 8 a.m. on the collection day. Up to 15 items a day; business waste is not accepted." },
    ],
    sourceIds: ["fuchu-household-waste-rules","fuchu-household-waste-bulky","fuchu-household-waste-line"], sourceFormatNote: "Fuchu's waste pages are in Japanese, with a multilingual LINE menu. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "machida-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-13209", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Machida", summary: "Machida collects burnable waste, non-burnable waste, and plastic packaging from each household by 8:30 a.m. in designated bags, and its free sorting app works in 11 languages.",
    applicability: "Use the collection calendar or the sorting app for your district; collection days differ by area.", responsibleBody: "Machida City",
    actions: [
      { title: "Use designated bags and the sorting app", description: "Put burnable waste, non-burnable waste, and plastic packaging out by 8:30 a.m. on the collection day, in designated bags with the opening tied: on your own land facing the road for a detached house, or at the building's waste area for an apartment. Cardboard boxes cannot be used as containers. The free Machida waste sorting app shows your district's collection calendar and how to sort each item, in 11 languages." },
      { title: "Book bulky waste and buy tickets afterwards", description: "Items that do not fit in a designated bag, or weigh over 10 kg, are bulky waste. Book online, or by phone from Monday to Saturday, 8:30 a.m. to 5 p.m.; bookings are busy, so apply early. After booking, buy processing tickets for the stated fee (they are not refundable), write the reception number and collection date on them, and put the items out by 8:30 a.m. on the collection day. Appliances covered by the recycling law and computers are not collected." },
    ],
    sourceIds: ["machida-household-waste-rules","machida-household-waste-app","machida-household-waste-bulky"], sourceFormatNote: "Machida's waste pages are in Japanese; the sorting app supports 11 languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nagoya-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "nagoya", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Nagoya", summary: "Nagoya collects burnable waste twice a week from in front of each home, in the city's designated bags, by 8 a.m. (7 a.m. in Naka Ward); from October 2026, anything that does not fit in a 45-liter designated bag is bulky waste.",
    applicability: "Collection days differ by area; check them with the city's collection-day search or the Sanaru app.", responsibleBody: "Nagoya City",
    actions: [
      { title: "Use designated bags and your area's days", description: "Burnable waste goes in the city's designated bags for burnable household waste (10, 20, or 45 liters), tied closed, out by 8 a.m. (7 a.m. in Naka Ward) on your collection day, twice a week, including public holidays but not the New Year period. Houses put it out at the roadside in front of the home; apartments use the building's designated place. Plastics and PET bottles are recyclables. The free Sanaru app shows collection days and how to sort items in English, Chinese, Korean, Portuguese, Spanish, Filipino, Vietnamese, and Nepali, and the city's sorting guide is published in nine foreign languages." },
      { title: "Know the new bulky waste rule", description: "From October 2026, household items that do not fit in a 45-liter designated bag, or whose bag cannot be tied properly, are bulky waste; until September 2026 the rule is items over 30 cm on a side. Apply to the bulky waste reception center by phone or online. Some heavy items such as concrete blocks and bricks are collected in limited numbers after applying." },
    ],
    sourceIds: ["nagoya-household-waste-burnable","nagoya-household-waste-bulky-change","nagoya-household-waste-app","nagoya-waste-guide"], sourceFormatNote: "Nagoya's waste pages are in Japanese; the sorting guide and app are available in other languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "osaka-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-27100", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Osaka", summary: "Osaka City sets collection days and approximate two-hour collection windows by address, leaves wrongly sorted waste uncollected, and collects bulky items by application and fee.",
    applicability: "Use the city's collection map for your exact address; some neighborhoods collect old paper and clothing through community collection instead of the city.", responsibleBody: "Osaka City",
    actions: [
      { title: "Check your address and sort carefully", description: "Look up your collection days and approximate two-hour collection window on the Osaka City waste collection map, and put waste out shortly before that window. The city collects ordinary waste, recyclable cans, bottles, and PET bottles, plastic resources, and old paper and clothing separately. Waste with recyclables mixed in, or recyclables with other items or dirt, is left with a warning sticker; take it back, sort it, and put it out again on the right day. In community-collection areas, the neighborhood's contracted recycler collects old paper and clothing." },
      { title: "Apply before putting out bulky waste", description: "Household items longer than 30 centimeters on any side, or rods longer than 1 meter, are bulky waste. Apply online at any time, or by phone to the bulky waste reception center Monday to Saturday from 9 a.m. to 5 p.m. (closed December 29 to January 3), pay the processing fee, and put the item out on the assigned day. Business waste is not accepted. The city also works with reuse services that may take usable items without a fee." },
    ],
    sourceIds: ["osaka-household-waste-collection","osaka-household-waste-bulky"], sourceFormatNote: "Osaka City's current collection and bulky-waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sakai-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "jp-27140", lastCheckedAt: "2026-09-24",
    title: "Sorting and disposing of waste in Sakai", summary: "Sakai collects household waste in clear or white translucent bags on fixed schedules by category, and residents moving into a detached house must apply for collection first.",
    applicability: "Use the city's sorting app or calendar for your exact address; collection days differ by area.", responsibleBody: "Sakai City",
    actions: [
      { title: "Apply if you live in a house, then sort and bag correctly", description: "If you move into a detached house, apply for waste collection before putting any out. Use clear or white translucent bags of 45 liters or less (shop bags are fine), tied closed; unbagged waste and cardboard boxes are not collected. Daily-life waste is collected twice a week, plastic containers and packaging once a week, and cans and bottles for food and drink and PET bottles twice a month. The city's sorting app shows each item's category and your area's collection calendar." },
      { title: "Apply for bulky waste and small non-combustibles", description: "Durable items longer than about 30 centimeters are bulky waste (with a fee); non-combustible items 30 centimeters or smaller are collected free. Both need an application, which can be made online at any time with cashless payment available, or by phone for items that need discussion. Televisions, air conditioners, and other specified appliances are not collected by the city." },
    ],
    sourceIds: ["sakai-household-waste-rules","sakai-household-waste-bulky"], sourceFormatNote: "Sakai's current waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
]);
