import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const residentTaxSupplements = defineLocalGuidanceSupplements([
  {
    id: "chiyoda-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13101", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Chiyoda", summary: "Chiyoda explains that foreign residents with an address in Japan on January 1 and enough income owe resident tax even if they leave Japan later that year, and that unpaid tax can affect a residence-status renewal.",
    applicability: "Use Chiyoda's route when you were registered in Chiyoda City on January 1 of the tax year.", responsibleBody: "Chiyoda City", receivingOffice: "Taxation Division, second floor of the ward office",
    actions: [
      { title: "Know how you will pay", description: "The tax is based on income from the previous January to December. Employees normally have it deducted from salary by the employer. Otherwise, a tax notice arrives in mid-June to pay at a bank or convenience store, or by account transfer. If you leave a job, pay the rest yourself or ask the employer to deduct it all at once; from January to May the employer must deduct it in full. Unpaid resident tax can lead to a residence-status renewal being refused." },
      { title: "File if needed, and appoint a tax agent before leaving", description: "File a return if you were registered in Chiyoda on January 1 with income, unless your employer reports your salary, you have only public pension income with no changes, or you file an income-tax return. Returns go by post or to the Taxation Division, or online. If you leave Japan before paying, appoint a tax agent (nozei kanrinin) living in Japan before you leave and submit the form at the counter or by post." },
    ],
    sourceIds: ["chiyoda-resident-tax-foreign-residents","chiyoda-resident-tax-filing","chiyoda-resident-tax-agent"], sourceFormatNote: "Chiyoda's tax pages are in Japanese, with a leaflet for foreign workers in several languages. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "chuo-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13102", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Chuo", summary: "Chuo charges special ward inhabitant tax to people living in the ward with income on January 1; moving abroad later that year does not change the tax, and you must name a tax agent.",
    applicability: "Use Chuo's route when you lived in Chuo City on January 1 of the tax year.", responsibleBody: "Chuo City", receivingOffice: "Taxation Section, Taxation Division, second floor of the ward office (window 2-2)",
    actions: [
      { title: "Know how the tax is billed and paid", description: "People who are not taxed through their salary file a return by March 15 and receive a tax notice around mid-June, paying in four installments due at the end of June, August, October, and the following January. Employees have the tax deducted from salary." },
      { title: "Name a tax agent before moving abroad", description: "If you move abroad, submit a tax agent (nozei kanrinin) declaration, by post or at the Taxation Section; the agent can be a person or a company and receives your tax notices. If you cannot name one, ask the Taxation Section about notices by airmail. If your salary deduction stops, the rest is taken from your last salary or billed to your agent. Without a declaration, the notice may be served by public posting and late charges can follow." },
    ],
    sourceIds: ["chuo-resident-tax-filing-payment","chuo-resident-tax-leaving-japan"], sourceFormatNote: "Chuo's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "minato-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13103", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Minato", summary: "Minato charges special ward inhabitant tax to people registered in the ward on January 1 with income above a set level the previous year, and takes returns at the counter or by post.",
    applicability: "Use Minato's route when you were registered in Minato City on January 1 of the tax year.", responsibleBody: "Minato City", receivingOffice: "Taxation Section, Tax Division, Minato City Office",
    actions: [
      { title: "Know who is taxed", description: "The tax is based on your registered address on January 1 and your income from the previous January to December. It has a flat per-person part and an income-based part, and Minato collects the Tokyo metropolitan part together with the ward part. People with only a business office or second home in Minato pay the per-person part there." },
      { title: "File by the deadline, at the counter or by post", description: "For the 2026 tax year, the filing deadline was March 16, 2026. Minato accepts returns at the counter or by post, and will send a form and return envelope on request; it also answers filing questions by phone. Filing late can delay your tax notice and your tax certificate." },
    ],
    sourceIds: ["minato-resident-tax-overview","minato-resident-tax-filing-2026"], sourceFormatNote: "Minato's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinjuku-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "shinjuku", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Shinjuku", summary: "Shinjuku charges special ward inhabitant tax to people living in the ward on January 1, based on the previous year's income; moving later in the year does not change where you pay, and leaving Japan requires a tax agent.",
    applicability: "Use Shinjuku's route when you lived in Shinjuku City on January 1 of the tax year.", responsibleBody: "Shinjuku City", receivingOffice: "Taxation Division, sixth floor of the ward office main building",
    actions: [
      { title: "Pay by notice or through your salary", description: "If the tax is not deducted from your salary, you receive a tax notice and pay in four installments due at the end of June, August, October, and the following January, at a bank, post office, the ward office, a special branch office, a convenience store, by account transfer, or with a smartphone payment app. Employees have it deducted from salary from June to the following May; if you leave the job, the remainder is billed to you unless it was collected in full when you left." },
      { title: "File if needed, and appoint a tax agent before leaving Japan", description: "The ward mails return forms in February to people who filed the previous year; file by post where possible, or online with a My Number Card from the 2026 tax year. People who file an income-tax return do not need to file separately. If you leave Japan and cannot receive the tax notice or pay, appoint a tax agent (nozei kanrinin); the form is signed by you and the agent and can be sent to the Taxation Division by post." },
    ],
    sourceIds: ["shinjuku-resident-tax-payment","shinjuku-resident-tax-filing","shinjuku-resident-tax-agent","shinjuku-resident-tax"], sourceFormatNote: "Shinjuku's current tax pages are in Japanese; its English page gives an overview. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "bunkyo-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13105", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Bunkyo", summary: "Bunkyo charges special ward inhabitant tax at your January 1 address on the previous year's income; if you move abroad after January 1, you still owe it and should name a tax agent.",
    applicability: "Use Bunkyo's route when you lived in Bunkyo City on January 1 of the tax year.", responsibleBody: "Bunkyo City",
    actions: [
      { title: "Know who is taxed and file if needed", description: "The tax is charged where you lived on January 1, on income from the previous January to December, with a flat per-person part and an income-based part; Bunkyo collects the Tokyo part with the ward part. People with only a business office or family residence in Bunkyo pay the per-person part. The ward asks for returns online (from the 2026 tax year) or by post rather than at the counter." },
      { title: "Name a tax agent before moving abroad", description: "Moving abroad on or after January 2 does not change that year's tax, which is still charged by the municipality where you lived on January 1. Submit a tax agent (nozei kanrinin) declaration before you leave. To have the tax deducted from your salary, ask your employer to notify the ward." },
    ],
    sourceIds: ["bunkyo-resident-tax-overview","bunkyo-resident-tax-filing","bunkyo-tax-faq"], sourceFormatNote: "Bunkyo's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "taito-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13106", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Taito", summary: "Taito charges special ward inhabitant tax, regardless of nationality, where you were registered on January 1, on the previous year's income, and hands out a pamphlet on the 23 wards' resident tax in English, Chinese, and Korean.",
    applicability: "Use Taito's route when you were registered in Taito City on January 1 of the tax year.", responsibleBody: "Taito City", receivingOffice: "Taxation Division, Taito City Office",
    actions: [
      { title: "Know who is taxed and who files", description: "Regardless of nationality, the tax is charged where you were registered on January 1, on income from the previous January to December, with a flat per-person part and an income-based part. You file with the ward if you were registered in Taito on January 1 with income, unless your income was only salary reported by your employer or public pension with no added deductions, you file an income-tax return, or your income was below the tax-free level." },
      { title: "Read the multilingual pamphlet", description: "The pamphlet on Tokyo's 23 wards' resident tax, in Japanese, English, Chinese, and Korean, is available at the ward office's Taxation Division counter while stocks last and as a PDF." },
    ],
    sourceIds: ["taito-resident-tax-overview","taito-resident-tax-pamphlet"], sourceFormatNote: "Taito's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sumida-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13107", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Sumida", summary: "Sumida charges special ward inhabitant tax to people living in the ward on January 1 with income; moving later does not change the tax, and you must submit a tax agent declaration at least 10 days before leaving Japan.",
    applicability: "Use Sumida's route when you lived in Sumida City on January 1 of the tax year.", responsibleBody: "Sumida City", receivingOffice: "Taxation Section, Taxation Division, Sumida City Office",
    actions: [
      { title: "File by March 15 if you need to", description: "If you lived in Sumida on January 1 and had income the previous year, file a return by March 15, unless you filed an income-tax return or your salary or public pension was reported to the ward. Even without that obligation, file if you need a non-taxation certificate or want deductions not on your withholding slip." },
      { title: "Name a tax agent 10 days before leaving Japan", description: "Moving out during the year does not change that year's tax. If you leave Japan, submit a tax agent (nozei kanrinin) declaration to the Taxation Division at least 10 days before you leave. The agent handles your tax papers and payments and need not be a relative; a friend or a company is also possible." },
    ],
    sourceIds: ["sumida-resident-tax-filing","sumida-resident-tax-agent"], sourceFormatNote: "Sumida's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "koto-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13108", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Koto", summary: "Koto explains its tax notices to foreign residents in English, keeps the January 1 rule even for people who move away later, and requires a tax agent declaration before you leave Japan.",
    applicability: "Use Koto's route when you lived in Koto City on January 1 of the tax year, including if you moved out on or after January 2.", responsibleBody: "Koto City", receivingOffice: "Taxation Division, Koto City Office",
    actions: [
      { title: "Pay your tax notice on time and keep the receipts", description: "The tax is calculated on the previous year's income and billed from June, in four installments due at the end of June, August, October, and the following January. Pay with the payment slips at a convenience store, the ward office's Tax Collection Division or a branch office, or by credit card; convenience stores cannot take a slip more than a month past its deadline. Keep your receipts, which cannot be reissued, because you may need them when renewing or changing your residence status. Koto publishes guidance on its tax notices in English." },
      { title: "Name a tax agent before leaving Japan", description: "If you cannot receive the notice or pay after leaving Japan, submit a tax agent (nozei kanrinin) declaration before you leave, at the Taxation Division, by post, or online, with copies of your and the agent's identity documents. People leaving between January 2 and June usually also owe the next year's tax, so they still need an agent after finishing current payments. After you return, cancel the agent with the same form." },
    ],
    sourceIds: ["koto-resident-tax-notice-guidance","koto-resident-tax-filing","koto-resident-tax-agent"], sourceFormatNote: "Koto's tax pages are in Japanese, with English guidance on tax notices. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shinagawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13109", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Shinagawa", summary: "Shinagawa charges special ward inhabitant tax at your January 1 address; if you leave Japan with tax still to pay, you pay in full, set up account transfer, or name a tax agent.",
    applicability: "Use Shinagawa's route when you lived in Shinagawa City on January 1 of the tax year.", responsibleBody: "Shinagawa City", receivingOffice: "Taxation Section, Tax Division, Shinagawa City Office",
    actions: [
      { title: "File if your income was not reported", description: "If you lived in Shinagawa on January 1 and had income the previous year, file with the ward unless you file an income-tax return. This includes employees whose employer did not send a salary report to the ward and people claiming deductions such as medical expenses. File before the tax notice is delivered, or the return may not be reflected in the tax." },
      { title: "Settle the tax before leaving Japan", description: "If you leave Japan and still owe tax, pay it in full, set up account transfer, or name a tax agent (nozei kanrinin) who pays for you. If you leave between January and June, the notice for the previous year's income arrives in early June, so name a tax agent before you leave. If you leave a job and salary deduction stops, you pay the rest yourself. Leaving without filing a moving-out notice means you are still treated as living in the ward." },
    ],
    sourceIds: ["shinagawa-resident-tax-filing","shinagawa-resident-tax-leaving-japan"], sourceFormatNote: "Shinagawa's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "meguro-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13110", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Meguro", summary: "Meguro charges special ward inhabitant tax at your January 1 address; people with little or no income may still need to file if they use National Health Insurance or other ward services, and anyone leaving Japan with tax to pay must name a tax agent.",
    applicability: "Use Meguro's route when you lived in Meguro City on January 1 of the tax year; moving later does not change that year's tax.", responsibleBody: "Meguro City", receivingOffice: "Tax Division, Meguro City Office",
    actions: [
      { title: "File if you need to", description: "File with the ward if you lived in Meguro on January 1 and had income the previous year, unless you file an income-tax return or your employer sends a salary report. Even with no income, or low income, file if you are in National Pension, National Health Insurance, or long-term care insurance, receive child allowances or other ward support, or need a tax certificate. The ward asks for completed returns by post where possible." },
      { title: "Name a tax agent before leaving Japan", description: "If you leave Japan between January 2 and receiving your tax notice, or with unpaid tax, submit a tax agent (nozei kanrinin) declaration to the Tax Division before you leave, by post or in person, with a copy of the submitter's identity document. If salary deduction stops when you leave, the rest is billed to you, so an agent is needed to receive it." },
    ],
    sourceIds: ["meguro-resident-tax-filing","meguro-resident-tax-agent"], sourceFormatNote: "Meguro's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "ota-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13111", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Ota", summary: "Ota charges special ward inhabitant tax at your January 1 address; leaving Japan later does not cancel it, so name a tax agent before you go.",
    applicability: "Use Ota's route when you lived in Ota City on January 1 of the tax year.", responsibleBody: "Ota City", receivingOffice: "Taxation Division, Ota City Office",
    actions: [
      { title: "File between February 16 and March 15 if needed", description: "File a special ward inhabitant tax return with the municipality where you lived on January 1, between February 16 and March 15. If you file an income-tax return, it counts as your resident tax return. Bring or enclose proof of My Number and identity." },
      { title: "Name a tax agent before moving abroad", description: "Moving away during the year does not change that year's tax, and tax notices are sent in June. If you move abroad before or after the notice, or salary deduction stops when you leave a job, submit a tax agent (nozei kanrinin) declaration to the Taxation Division with copies of your My Number and identity documents and the agent's identity document. Because resident tax is charged a year late, you may still owe next year's tax even if the rest was deducted from your last salary. Account transfer is convenient, but an agent is still needed to receive notices; cancel the agent after you return." },
    ],
    sourceIds: ["ota-resident-tax-filing","ota-resident-tax-leaving-japan"], sourceFormatNote: "Ota's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "setagaya-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13112", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Setagaya", summary: "Setagaya explains resident tax to foreign residents moving in: it is set each June and charged where you lived on January 1, and anyone leaving Japan with tax to pay settles it or names a tax agent.",
    applicability: "Use Setagaya's route when you lived in Setagaya City on January 1 of the tax year.", responsibleBody: "Setagaya City", receivingOffice: "Tax Division, Setagaya City Office",
    actions: [
      { title: "Know when the tax is set", description: "The tax is decided each June: a flat per-person part plus an income-based part on the previous year's income. It is charged where you lived on January 1, and you still pay that municipality if you move away on or after January 2. The pamphlet on the 23 wards' resident tax explains the system in Japanese, English, Chinese, and Korean." },
      { title: "Settle the tax or name a tax agent before leaving Japan", description: "If you leave Japan with tax to pay, pay the full notice, set up account transfer, or name a tax agent (nozei kanrinin) who pays for you. If you leave between January and June, the notice for the previous year's income is sent in early June, so name a tax agent before you leave. If salary deduction stops when you leave your job, the rest is billed to you. Setagaya also explains how to pay from abroad." },
    ],
    sourceIds: ["setagaya-resident-tax-foreign-residents","setagaya-resident-tax-after-moving"], sourceFormatNote: "Setagaya's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "shibuya-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13113", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Shibuya", summary: "Shibuya's English guide explains that anyone living in Shibuya on January 1 with income the previous year owes resident tax there for the whole year, and that people leaving Japan before early June must name someone to pay it.",
    applicability: "Use Shibuya's route when you lived in Shibuya City on January 1 of the tax year.", responsibleBody: "Shibuya City", receivingOffice: "Taxation Division, Shibuya City Office",
    actions: [
      { title: "File and pay", description: "File a return with the Taxation Division by March 15, unless you filed a final income-tax return or have only salary reported by your employer. Tax notices arrive in early June; individuals pay in four installments, and employees have the tax deducted from salary in 12 installments from June to the following May. Pay at the city office, branch offices, banks, post offices, convenience stores, electronically, or by automatic bank transfer." },
      { title: "Name someone to pay before leaving Japan", description: "Even if you move during the year, you pay the full year's tax to the municipality where you lived on January 1. If you leave Japan before the tax is finalized in early June, appoint someone to be responsible for paying it." },
    ],
    sourceIds: ["shibuya-resident-tax-english"], sourceFormatNote: undefined,
  },
  {
    id: "nakano-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13114", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Nakano", summary: "Nakano bases resident tax on your income-tax return or your employer's salary report, asks people with no or low income to file too, and requires a tax agent when you leave Japan.",
    applicability: "Use Nakano's route when you lived in Nakano City on January 1 of the tax year.", responsibleBody: "Nakano City", receivingOffice: "Taxation Section, Tax Division, Nakano City Office",
    actions: [
      { title: "File if your income was not reported", description: "If you file an income-tax return, or your employer sends a salary report, you do not need to file separately; notices come in mid-June by post, or through your employer around the end of May. File a resident tax return if you had no income, low income, were a dependent, or moved in during the previous year, because it is used for certificates and for health insurance, pension, and other charges." },
      { title: "Name a tax agent before leaving Japan", description: "If you leave Japan and can no longer handle your tax, name a tax agent (nozei kanrinin). Use the tax agent declaration for an agent living in Nakano, or the approval application for one living elsewhere; both can be filed online, in person, or by post. Use the approval application again to end the arrangement when you return." },
    ],
    sourceIds: ["nakano-resident-tax-filing","nakano-resident-tax-agent"], sourceFormatNote: "Nakano's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "suginami-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13115", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Suginami", summary: "Suginami takes resident tax returns by March 15 and bills individual payers in four installments; anyone leaving Japan must name a tax agent before leaving, or the notice is served by public posting.",
    applicability: "Use Suginami's route when you lived in Suginami City on January 1 of the tax year.", responsibleBody: "Suginami City", receivingOffice: "Tax Collection Division (tax agents), Suginami City Office",
    actions: [
      { title: "Know the filing and payment schedule", description: "Resident tax returns are filed in February and March, by March 15. People paying for themselves pay in four installments, in June, August, October, and January; employees have it deducted from salary monthly." },
      { title: "Name a tax agent before leaving Japan", description: "If you leave Japan before receiving your tax notice, with unpaid installments, or when salary deduction stops, submit a tax agent (nozei kanrinin) declaration to the Tax Collection Division before you leave, with My Number and identity checks. If the agent lives outside Suginami, the ward must approve them. Without an agent, the notice may be served by public posting. Account transfer can be used for current-year installments, but an agent is still needed to receive notices. Cancel the agent after you return." },
    ],
    sourceIds: ["suginami-resident-tax-schedule","suginami-resident-tax-agent"], sourceFormatNote: "Suginami's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "toshima-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13116", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Toshima", summary: "Toshima's English tax page explains that everyone living in the city on January 1 files a declaration, with or without income, unless covered by a tax return or salary withholding, and that people leaving Japan before paying must pay in full or appoint an agent.",
    applicability: "Use Toshima's route when you lived in Toshima City on January 1 of the tax year; moving out during the year does not change where you pay.", responsibleBody: "Toshima City", receivingOffice: "City Tax Section, Toshima City Office",
    actions: [
      { title: "Declare your income and pay", description: "If you lived in Toshima on January 1, file a declaration of the previous year's income between February 16 and March 15, even with no income, unless you filed an income-tax return or your only income was salary with tax withheld. Payment slips for four installments come by mail; pay at banks, the city office (3rd floor), residents offices, convenience stores, by smartphone payment app, or by account transfer, or have it deducted from salary." },
      { title: "Pay in full or appoint an agent before leaving Japan", description: "If you leave Japan before your resident tax is due, pay it in full or appoint an agent to pay for you. Toshima's resident tax information for foreign residents is available in Japanese, Chinese, Korean, English, Vietnamese, Burmese, and Nepali." },
    ],
    sourceIds: ["toshima-resident-tax-english"], sourceFormatNote: undefined,
  },
  {
    id: "kita-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13117", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Kita", summary: "Kita asks everyone living in the ward on January 1 to file a resident tax return by March 15, even with no income, unless an income-tax return, salary report, or pension withholding covers them; leaving Japan requires a tax agent.",
    applicability: "Use Kita's route when you lived in Kita City on January 1 of the tax year.", responsibleBody: "Kita City", receivingOffice: "Taxation Division, 2nd floor of Kita City Office Building 1",
    actions: [
      { title: "File by March 15, even with no income", description: "File with the municipality where you lived on January 1, by March 15, unless you filed an income-tax return, your employer reports your salary and you have no other income, or you have only public pension with no changes to deductions. People with no income should also file, because without it the ward cannot issue tax certificates and may calculate health insurance and other premiums too high." },
      { title: "Name a tax agent before leaving Japan", description: "If you move abroad and cannot receive tax notices or pay, name a tax agent (nozei kanrinin); the form is signed by you and the agent and can also be filed online." },
    ],
    sourceIds: ["kita-resident-tax-filing","kita-resident-tax-agent"], sourceFormatNote: "Kita's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "arakawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13118", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Arakawa", summary: "Arakawa asks everyone living in the ward on January 1 to file a resident tax return, even with no income, unless covered by an income-tax return, salary report, or Japanese public pension, and requires a tax agent when you leave Japan.",
    applicability: "Use Arakawa's route when you lived in Arakawa City on January 1 of the tax year.", responsibleBody: "Arakawa City", receivingOffice: "Taxation Section, Taxation Division, 2nd floor of Arakawa City Office",
    actions: [
      { title: "File even with no income", description: "If you lived in Arakawa on January 1, file a return, unless you file an income-tax return, have only salary reported by your employer, or have only Japanese public pension (people receiving a foreign public pension must file). People with no income should also file, because it is needed for tax certificates, health and long-term care insurance premiums, and child allowances. Online filing is available." },
      { title: "Name a tax agent before leaving Japan", description: "If you leave Japan before or after receiving your tax notice with tax still to pay, submit a tax agent (nozei kanrinin) declaration at the Taxation Section or by post before you leave. After leaving, the agent pays, or you can register an account for automatic payment. If you leave a job with salary deduction, the rest switches to payment by notice." },
    ],
    sourceIds: ["arakawa-resident-tax-filing","arakawa-resident-tax-agent"], sourceFormatNote: "Arakawa's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "itabashi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13119", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Itabashi", summary: "Itabashi asks for resident tax returns mainly by post or online, including from people with no income who use National Health Insurance or pension, and requires a tax agent when you move abroad before the June notice.",
    applicability: "Use Itabashi's route when you lived in Itabashi City on January 1 of the tax year; moving abroad later in the year does not change the tax.", responsibleBody: "Itabashi City", receivingOffice: "Taxation Division, Itabashi City Office",
    actions: [
      { title: "File by post or online", description: "File if you lived in Itabashi on January 1 and had income the previous year, unless your salary or public pension was reported without added deductions or you file an income-tax return. People with no income should file too if they need a tax certificate or are in National Health Insurance, National Pension, or long-term care insurance. The ward asks for returns by post, and online filing is available; forms are mailed to past filers." },
      { title: "Name a tax agent before moving abroad", description: "If you move abroad between January 1 and when the tax notice is sent, name a tax agent (nozei kanrinin) in Japan to receive it and pay; the form can be posted. If the notice has already arrived, pay in full before leaving or name an agent. If salary or pension deduction stops, the rest switches to payment by notice." },
    ],
    sourceIds: ["itabashi-resident-tax-filing","itabashi-resident-tax-leaving-japan"], sourceFormatNote: "Itabashi's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nerima-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13120", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Nerima", summary: "Nerima sends tax notices in mid-June for payment in four installments, or through salary deduction from June to May, and provides a tax agent declaration form for people who leave Japan.",
    applicability: "Use Nerima's route when you lived in Nerima City on January 1 of the tax year.", responsibleBody: "Nerima City", receivingOffice: "Tax Division, Nerima City Office",
    actions: [
      { title: "Know how the tax is paid", description: "People paying for themselves receive a tax notice and payment slips in mid-June and pay in four installments, in June, August, October, and the following January, at the ward office, banks, convenience stores, electronically, or by account transfer. Employees have the tax deducted from salary from June to the following May; if you leave a job mid-year, the rest is billed to you unless it is deducted in one go from your last pay." },
      { title: "Name a tax agent before leaving Japan", description: "If you leave Japan and cannot receive notices or pay, submit a tax agent (nozei kanrinin) declaration; the form is on the ward's tax forms page." },
    ],
    sourceIds: ["nerima-resident-tax-overview","nerima-tax-forms"], sourceFormatNote: "Nerima's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "adachi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13121", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Adachi", summary: "Adachi takes resident tax returns mainly by post, and requires a tax agent declaration within 10 days of the reason arising, such as moving abroad.",
    applicability: "Use Adachi's route when you lived in Adachi City on January 1 of the tax year.", responsibleBody: "Adachi City", receivingOffice: "Taxation Division, Adachi City Office",
    actions: [
      { title: "File by post if needed", description: "File if you lived in Adachi on January 1 with income, including salary or pension, unless you are covered by the exceptions. People with no income may also need to file for tax certificates, insurance premiums, or allowances. Returns are accepted mainly by post to the Taxation Division, at its counter, or online." },
      { title: "Name a tax agent within 10 days", description: "If you move abroad and cannot pay yourself, name a tax agent (nozei kanrinin) within 10 days of the reason arising: the declaration for an agent living in Adachi, or the approval application for one living elsewhere. Submit it at the counter, by post, or online, with copies of your and the agent's identity documents." },
    ],
    sourceIds: ["adachi-resident-tax-filing","adachi-resident-tax-agent"], sourceFormatNote: "Adachi's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "katsushika-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13122", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Katsushika", summary: "Katsushika asks for resident tax returns by post where possible, including from people with no income who use National Health Insurance or allowances, and requires a tax agent when you move abroad.",
    applicability: "Use Katsushika's route when you lived in Katsushika City on January 1 of the tax year; moving abroad later that year does not change where you pay.", responsibleBody: "Katsushika City", receivingOffice: "Taxation Section, Tax Division, Katsushika City Office",
    actions: [
      { title: "File by post where possible", description: "File if you lived in Katsushika on January 1 and had income the previous year, unless you filed an income-tax return or your salary or pension was reported to the ward. People with no income should file if they need a certificate or are in National Health Insurance, long-term care insurance, or receive child allowances. The ward asks for returns by post, with copies of your My Number and identity documents." },
      { title: "Name a tax agent before moving abroad", description: "If paying becomes difficult after moving abroad, name a tax agent (nozei kanrinin) to receive notices and pay: an individual with their own livelihood (not necessarily a relative) or a company. Submit the form at window 321 on the 3rd floor or by post, with copies of your and the agent's identity documents, such as a residence card." },
    ],
    sourceIds: ["katsushika-resident-tax-filing","katsushika-resident-tax-agent"], sourceFormatNote: "Katsushika's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "edogawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13123", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Edogawa", summary: "Edogawa's tax page for foreign residents explains filing by March 15 and the mid-June tax notice, and people who leave Japan must name a tax agent before departure.",
    applicability: "Use Edogawa's route when you lived in Edogawa City on January 1 of the tax year; you still pay Edogawa after moving out.", responsibleBody: "Edogawa City", receivingOffice: "Taxation Division, Edogawa City Office",
    actions: [
      { title: "File by March 15 if needed", description: "If you did not file an income-tax return and your employer did not pay your resident tax for the previous year, report your previous year's income to the ward office by March 15 (the next weekday if it falls on a weekend or holiday). The ward sends tax notices in mid-June; people paying for themselves can pay at convenience stores, banks, post offices, or the ward office, cashless, or by account transfer." },
      { title: "Name a tax agent before leaving Japan", description: "If you leave Japan, you need to name a tax agent (nozei kanrinin) to receive the tax notice and pay for you; complete the procedure before departure. Ask the Taxation Division on the 4th floor of the ward office." },
    ],
    sourceIds: ["edogawa-resident-tax-foreign-residents","edogawa-resident-tax-moving-out"], sourceFormatNote: "Edogawa's tax pages are in Japanese, with English, Chinese, and Vietnamese leaflets on moving out. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "hachioji-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13201", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Hachioji", summary: "Hachioji charges municipal and metropolitan inhabitant tax to people with an address in the city on January 1, and explains what to do about the remaining tax before leaving Japan.",
    applicability: "Use Hachioji's route when you lived in Hachioji City on January 1 of the tax year; moving away later in the year does not change that year's tax.", responsibleBody: "Hachioji City", receivingOffice: "Hachioji City Resident Tax Division",
    actions: [
      { title: "Know how the tax is paid and filed", description: "People paying for themselves receive a tax notice and pay in four installments due at the end of June, August, October, and the following January. Employees have the tax deducted from salary from June to the following May. If you need to file a return, the city asks you to file online or by post to the Resident Tax Division; the Citizens Department offices accept completed returns but cannot help you fill them in." },
      { title: "Settle the tax or appoint a tax agent before leaving Japan", description: "If you leave Japan after the tax notice has been sent, pay the full amount before you leave or appoint a tax agent (nozei kanrinin) to pay it for you. If you leave between January 1 and the notice, appoint a tax agent to receive it. If salary deduction stops when you leave your job, the remainder becomes payable by notice. The tax agent form can be sent by post." },
    ],
    sourceIds: ["hachioji-resident-tax-payment","hachioji-resident-tax-filing","hachioji-resident-tax-leaving-japan"], sourceFormatNote: "Hachioji's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "tachikawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13202", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Tachikawa", summary: "Tachikawa charges municipal and metropolitan inhabitant tax to people with an address in the city on January 1, based on the previous year's income, and explains it for foreign residents in plain Japanese.",
    applicability: "Use Tachikawa's route when you lived in Tachikawa City on January 1 of the tax year.", responsibleBody: "Tachikawa City", receivingOffice: "Municipal Tax Section of the Taxation Division, Tachikawa City Hall",
    actions: [
      { title: "Know how the tax is paid", description: "The tax has a flat per-person part and an income-based part, calculated on the previous calendar year's income. People paying for themselves pay by payment slip or account transfer in four installments, in June, August, October, and the following January. Employees have it deducted from salary over 12 months from June to the following May. The city's plain-Japanese guide for foreign residents also covers the procedures when you leave Japan." },
      { title: "File a return by March 15 if you need to", description: "People living in the city on January 1 generally file a return by March 15, unless they file an income-tax return or their employer reports their salary to the city. Filing can still reduce your tax if you have deductions not on your withholding slip. Returns go to the Taxation Division by post or at its counter; the Window Service Center does not accept them. The form is not online; request it by phone or at the counter." },
    ],
    sourceIds: ["tachikawa-resident-tax-overview","tachikawa-resident-tax-filing","tachikawa-resident-tax-foreign-residents"], sourceFormatNote: "Tachikawa's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "fuchu-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13206", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Fuchu", summary: "Fuchu charges municipal and metropolitan inhabitant tax to people living in the city on January 1 with income in the previous year, and requires a tax agent if you leave Japan with tax still to pay.",
    applicability: "Use Fuchu's route when you lived in Fuchu City on January 1 of the tax year; moving away later does not change that year's tax or where it is paid.", responsibleBody: "Fuchu City", receivingOffice: "Fuchu City Municipal Tax Division",
    actions: [
      { title: "File by March 15 if you need to", description: "If you need to file (for example, your employer does not deduct the tax from your salary and you do not file an income-tax return), file with the city by March 15; filing later may miss the June tax calculation. People who file an income-tax return do not need to file separately. Bring your My Number Card or proof of My Number and identity, and income and deduction records. The city asks for returns by post where possible, and online filing is available from the 2026 tax year." },
      { title: "Appoint a tax agent before leaving Japan", description: "If you leave Japan with inhabitant tax still to pay, or before a tax notice arrives, appoint a tax agent (nozei kanrinin) before you leave and submit the tax agent form online, at the Municipal Tax Division, or by post. This also applies when salary deduction stops because you leave your job. Without a tax agent, the notice is served by public posting and late charges can follow." },
    ],
    sourceIds: ["fuchu-resident-tax-overview","fuchu-resident-tax-filing","fuchu-resident-tax-leaving-japan"], sourceFormatNote: "Fuchu's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "machida-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-13209", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Machida", summary: "Machida requires people living in the city on January 1 to file a resident-tax return by March 15, even with no income, unless an income-tax return or an employer or pension report covers them.",
    applicability: "Use Machida's route when you lived in Machida City on January 1 of the tax year.", responsibleBody: "Machida City", receivingOffice: "Machida City Municipal Tax Division",
    actions: [
      { title: "File by March 15 unless you are covered", description: "Everyone with an address in Machida on January 1 files by March 15, including people with no income, unless they file an income-tax return, their employer or pension payer reports their income to the city, or they are a dependent of a resident. Without a return, you may not be able to get a tax certificate. Bring identity documents for My Number checks and income and deduction records. Online filing is available, and the city asks for paper returns by post." },
      { title: "Know how the tax is collected", description: "People paying for themselves receive a tax notice and pay in four installments due at the end of June, August, October, and the following January; the notice cannot be reissued. Employees generally have the tax deducted from salary over 12 months from June to the following May." },
    ],
    sourceIds: ["machida-resident-tax-filing","machida-resident-tax-payment"], sourceFormatNote: "Machida's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "nagoya-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "nagoya", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Nagoya", summary: "Nagoya charges municipal and prefectural inhabitant tax to people living in the city on January 1, and a person leaving Japan later that year still owes it and must pay in advance or appoint a tax agent.",
    applicability: "Use Nagoya's route when you lived in Nagoya City on January 1 of the tax year.", responsibleBody: "Nagoya City", receivingOffice: "Municipal Tax Section of the city tax office responsible for your ward",
    actions: [
      { title: "File by mid-March if you need to, and know how you pay", description: "If you lived in Nagoya on January 1 and had income the previous year, file a return by mid-March, unless you filed an income-tax return, had only salary with year-end adjustment, or had only public pension income. File on paper at a city tax office or ward filing venue, by post, or online. People paying for themselves pay in four installments, in June, August, October, and the following January; employees have it deducted from salary from June to the following May." },
      { title: "Pay in advance or appoint a tax agent before leaving Japan", description: "Leaving Japan after January 1 does not cancel that year's tax. Either appoint a tax agent (nozei kanrinin) with an address in Nagoya to handle your tax, or ask the tax office for your ward to let you pay before the tax notice is issued; you may need to show your withholding slip or file a return. The city also publishes a guide to Japanese personal taxes in English and Japanese." },
    ],
    sourceIds: ["nagoya-resident-tax-filing","nagoya-resident-tax-leaving-japan","nagoya-resident-tax-collection","nagoya-personal-tax-guide"], sourceFormatNote: "Nagoya's tax pages are in Japanese; its personal tax guide is bilingual. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "osaka-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-27100", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Osaka", summary: "Osaka City charges municipal and prefectural inhabitant tax to people living in the city on January 1, based on the previous year's income, and collects the national forest environment tax with it.",
    applicability: "Use Osaka City's route when you lived in Osaka City on January 1 of the tax year, or had an office, business place, or residence there without living in that ward.", responsibleBody: "Osaka City", receivingOffice: "The city tax office responsible for your ward",
    actions: [
      { title: "Know who is taxed and on what", description: "Whether you owe inhabitant tax depends on your situation on January 1 of the tax year. The tax is based on income from January 1 to December 31 of the previous year and has a flat per-person part and an income-based part, with the national forest environment tax collected alongside. People living in the city on January 1 must generally file a return by March 15 unless an exception applies." },
      { title: "Check how you pay and whether relief applies", description: "The tax is paid with payment slips, by deduction from salary, or by deduction from public pension. By application, the city can reduce or waive the tax in special circumstances or where a tax treaty applies. Contact the city tax office for your ward with questions." },
    ],
    sourceIds: ["osaka-resident-tax-overview"], sourceFormatNote: "Osaka City's tax overview is in Japanese. This English summary is Nihonest guidance, not an official translation.",
  },
  {
    id: "sakai-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "jp-27140", lastCheckedAt: "2026-09-24",
    title: "Resident tax in Sakai", summary: "Sakai's English tax guide explains that municipal and prefectural inhabitant tax is paid where you were registered on January 1, based on the previous year's income, including when you leave Japan.",
    applicability: "Use Sakai's route when your address was registered in Sakai City on January 1 of the tax year.", responsibleBody: "Sakai City", receivingOffice: "Your ward office",
    actions: [
      { title: "Declare income unless your employer reports it", description: "Municipal and prefectural inhabitant tax is paid together, to the municipality where your address was registered on January 1, and is calculated on the previous year's income. Declare your income and deductible expenses by March 15 at the ward office's declaration venue, unless your employer submits a salary payment report for you." },
      { title: "Settle the tax before leaving Japan", description: "If you lived in Sakai on January 1, you must still pay that year's tax when you leave Japan: pay the full amount before leaving, or appoint a tax agent to pay for you and notify your ward office, and consult the ward office if you cannot appoint one. Taxes can be paid at banks and post offices, convenience stores, by payment apps, by account transfer, or online." },
    ],
    sourceIds: ["sakai-tax-facts"], sourceFormatNote: "Sakai publishes this guide in English. The ward office handles individual cases.",
  },
]);
