import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { fictionalDocumentNotice } from "@/data/annotated-documents/shared";

export const residentTaxNoticeDocumentFamily = annotatedDocumentFamilySchema.parse({
    id: "resident-tax-notice",
    title: "Resident-tax notice",
    japaneseName: "住民税等の納税通知書・税額通知書",
    issuer: "The municipality responsible for the assessment",
    jurisdiction: "Municipality-specific",
    articleId: "income-and-resident-tax-after-moving-to-japan",
    glossaryTermIds: ["jumin-zei", "tokubetsu-choshu", "futsu-choshu"],
    description: "Select a supported municipality to see its terminology, collection routes, responsible office, and retained document versions. Municipal notices differ, so one city's example must not be used as another city's form.",
    jurisdictionVariants: [
      {
        id: "nagoya-city",
        geographyId: "nagoya",
        label: "Nagoya City",
        issuer: "Nagoya City",
        jurisdiction: "Nagoya City, Aichi Prefecture",
        versions: [
      {
        id: "assessment-year-2026",
        label: "2026 assessment year concepts",
        lifecycle: "current",
        validFrom: "2026-04-01",
        validThrough: "2027-03-31",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} This is a Nagoya-specific concept map, not a copy of the city's form. Nagoya's currently linked multilingual PDF uses notice layouts dated June 1, 2022, so it must not be treated as a guaranteed 2026 layout. Amounts, addresses, identifiers, payment codes, and barcodes are omitted.`,
        sourceIds: ["nagoya-resident-tax-multilingual-notice", "nagoya-resident-tax-english-layout-2022", "nagoya-resident-tax-2026", "nagoya-resident-tax-calculation", "nagoya-resident-tax-collection", "nagoya-tax-due-dates-2026"],
        sections: [
          {
            id: "assessment-and-recipient",
            label: "Assessment year, taxpayer, and responsible office",
            fields: [
              { id: "assessment-year", number: 1, label: "Assessment year", japaneseLabel: "年度", exampleValue: "2026 ASSESSMENT YEAR", explanation: "The assessment year is not the same as the income year. A 2026 resident-tax assessment ordinarily uses income and deductions from calendar year 2025." },
              { id: "taxpayer", number: 2, label: "Taxpayer and notice address", japaneseLabel: "納税義務者・送付先", exampleValue: "FICTIONAL TAXPAYER · ADDRESS OMITTED", explanation: "Check the person named and the address used for delivery. Moving after January 1 does not by itself transfer that assessment to the new municipality." },
              { id: "office", number: 3, label: "Responsible municipal tax office", japaneseLabel: "担当市税事務所・問い合わせ先", exampleValue: "CHECK THE OFFICE PRINTED ON THE NOTICE", explanation: "Use the office and contact details shown on the actual notice. Nagoya assigns responsible municipal tax offices by ward, and the correct office can differ from a ward-office counter." },
            ],
          },
          {
            id: "income-and-calculation",
            label: "Prior-year income, deductions, and assessment",
            fields: [
              { id: "prior-year-income", number: 4, label: "Prior-year income", japaneseLabel: "前年中の所得金額", exampleValue: "AMOUNTS OMITTED", explanation: "Resident tax is calculated from categories of income for the preceding calendar year. This is why collection can begin months after the income was earned or after employment changed." },
              { id: "income-deductions", number: 5, label: "Income deductions", japaneseLabel: "所得控除額", exampleValue: "DEDUCTION DETAILS OMITTED", explanation: "These are the deductions recognized in the municipal calculation. They are not necessarily identical in amount or treatment to deductions shown on a national income-tax return or withholding slip." },
              { id: "taxable-income", number: 6, label: "Taxable income or tax base", japaneseLabel: "課税標準額", exampleValue: "AMOUNTS OMITTED", explanation: "This is the amount used as the base for the income-based component after the applicable income deductions and category rules. It is not gross salary or take-home pay." },
              { id: "income-levy", number: 7, label: "Municipal and prefectural income-based tax", japaneseLabel: "市民税・県民税 所得割額", exampleValue: "CITY AND PREFECTURAL AMOUNTS OMITTED", explanation: "The notice can separate Nagoya municipal tax and Aichi prefectural tax components. Tax credits, adjustments, separate-taxation categories, or local rules can affect the final amounts." },
              { id: "credits-and-reductions", number: 8, label: "Tax credits, adjustments, and reductions", japaneseLabel: "税額控除額等・減免額", exampleValue: "DETAILS OMITTED", explanation: "Review credits, adjustment deductions, donation-related credits, reductions, or other changes shown in the calculation. A blank field does not resolve whether information was missing from the assessment." },
            ],
          },
          {
            id: "amount-and-collection",
            label: "Tax components, collection route, and payment schedule",
            fields: [
              { id: "fixed-components", number: 9, label: "Per-capita levies and forest environment tax", japaneseLabel: "均等割額・森林環境税額", exampleValue: "COMPONENT AMOUNTS OMITTED", explanation: "The notice can include the per-capita municipal and prefectural levies and the national forest environment tax collected together with resident tax. The forest environment tax is national even though the municipality collects it with the local assessment." },
              { id: "collection-method", number: 10, label: "Collection method", japaneseLabel: "徴収方法", exampleValue: "ORDINARY · SALARY · PENSION — CHECK YOUR NOTICE", explanation: "Ordinary collection means the person pays through municipal notices or approved channels. Salary or pension special collection means the responsible payer deducts installments. A job change or departure can change the route without erasing the assessment." },
              { id: "annual-and-balance", number: 11, label: "Annual amount and remaining balance", japaneseLabel: "年税額・差引納付額", exampleValue: "AMOUNTS OMITTED", explanation: "Distinguish the total assessment from the amount still payable through this notice. Prior collection, changes, or another collection route can affect the balance." },
              { id: "installments", number: 12, label: "Installments and due dates", japaneseLabel: "各期納付額・納期限", exampleValue: "DATES AND PAYMENT REFERENCES OMITTED", explanation: "For ordinary collection, use the amounts and exact due dates printed on the actual notice and payment materials. Nagoya's standard schedule has four periods, but weekends, holidays, reassessments, or replacement slips can affect the operative date.", caution: "The tax-calculation statement, tax notice, and payment slips may be separate pages or documents. Keep them together and do not copy payment codes from an example." },
            ],
          },
        ],
      },
      {
        id: "published-layout-reference-2022",
        label: "Published layout reference dated June 1, 2022",
        lifecycle: "superseded",
        validFrom: "2022-06-01",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} This archive explains only the layouts identified by Nagoya's English PDF as of June 1, 2022. It predates later tax and form changes, including the forest environment tax collected from assessment year 2024.`,
        sourceIds: ["nagoya-resident-tax-multilingual-notice", "nagoya-resident-tax-english-layout-2022"],
        sections: [
          {
            id: "calculation-statement",
            label: "Tax Calculation Statement concepts",
            fields: [
              { id: "assessment-year", number: 1, label: "Assessment year and taxpayer", japaneseLabel: "年度・納税義務者", exampleValue: "2022-DATED REFERENCE · IDENTITY OMITTED", explanation: "Use this only to recognize an older Nagoya explanation. Confirm the year and taxpayer printed on the actual record before interpreting its amounts." },
              { id: "prior-year-income", number: 2, label: "Previous calendar year's income", japaneseLabel: "前年中の所得金額", exampleValue: "AMOUNTS OMITTED", explanation: "The archived guide identifies total income for the previous January-through-December period as input to the later assessment." },
              { id: "deductions-and-base", number: 3, label: "Income deductions and taxable income", japaneseLabel: "所得控除額・課税標準額", exampleValue: "AMOUNTS OMITTED", explanation: "The calculation statement separates income, deductions, and the taxable base rather than treating the annual notice amount as a percentage of gross salary." },
              { id: "tax-components", number: 4, label: "Income-based and per-capita components", japaneseLabel: "所得割額・均等割額", exampleValue: "CITY AND PREFECTURAL AMOUNTS OMITTED", explanation: "The archived layout explains income-based and equal per-taxpayer components for municipal and prefectural resident tax. Later notices can add or rename components." },
            ],
          },
          {
            id: "notice-and-payments",
            label: "Tax Notification and payment concepts",
            fields: [
              { id: "annual-tax", number: 5, label: "Annual amount under the notice", japaneseLabel: "年税額", exampleValue: "AMOUNT OMITTED", explanation: "The annual amount is the assessment for the notice; it is not necessarily the amount remaining after payments or collection through another route." },
              { id: "balance", number: 6, label: "Balance due", japaneseLabel: "差引納付額", exampleValue: "AMOUNT OMITTED", explanation: "The English guide distinguishes the remaining balance from the wider calculation. Check subsequent change notices or payments before assuming the displayed balance is still current." },
              { id: "payments", number: 7, label: "First through fourth payments", japaneseLabel: "第1期から第4期までの税額", exampleValue: "AMOUNTS AND DATES OMITTED", explanation: "The archived ordinary-collection layout divides the payable balance into four periods and directs the taxpayer to the respective printed due dates." },
              { id: "inquiry", number: 8, label: "Responsible office and inquiry details", japaneseLabel: "担当市税事務所・問い合わせ先", exampleValue: "VERIFY CURRENT CONTACT DETAILS", explanation: "Office assignments, addresses, telephone numbers, and supported payment channels can change. Use the current Nagoya page or the contact printed on the actual notice rather than relying on this archived reference." },
            ],
          },
        ],
      },
        ],
      },
      {
        id: "shinjuku-city",
        geographyId: "shinjuku",
        label: "Shinjuku City",
        issuer: "Shinjuku City",
        jurisdiction: "Shinjuku City, Tokyo Metropolis",
        versions: [
          {
            id: "assessment-year-2026",
            label: "2026 assessment year concepts",
            lifecycle: "current",
            validFrom: "2026-04-01",
            validThrough: "2027-03-31",
            reviewStatus: "needs-review",
            lastCheckedAt: "2026-09-13",
            notice: `${fictionalDocumentNotice} This Shinjuku-specific concept map covers fields that may appear across ordinary, salary special, or pension special collection records. It is not an exact copy of any one notice. Amounts, addresses, identifiers, payment codes, and barcodes are omitted.`,
            sourceIds: ["shinjuku-resident-tax", "shinjuku-resident-tax-notices-2026", "shinjuku-resident-tax-special-collection-notice", "shinjuku-resident-tax-payment", "shinjuku-tax-inquiries"],
            sections: [
              {
                id: "assessment-and-recipient",
                label: "Assessment year, taxpayer, and responsible section",
                fields: [
                  { id: "assessment-year", number: 1, label: "Assessment year", japaneseLabel: "年度", exampleValue: "2026 ASSESSMENT YEAR", explanation: "The assessment year is different from the income year. A 2026 resident-tax assessment ordinarily reflects income and deductions from calendar year 2025." },
                  { id: "taxpayer", number: 2, label: "Taxpayer and notice address", japaneseLabel: "納税義務者・送付先", exampleValue: "FICTIONAL TAXPAYER · ADDRESS OMITTED", explanation: "Check the named taxpayer and delivery address. Shinjuku generally assesses the resident tax of a person whose address was in the ward on January 1, even if the person later moves." },
                  { id: "office", number: 3, label: "Responsible tax section and contact", japaneseLabel: "担当課・問い合わせ先", exampleValue: "USE THE CONTACT PRINTED ON YOUR NOTICE", explanation: "Use the inquiry destination printed on the actual record. Shinjuku separates assessment and notice questions from payment, collection, and consultation functions, so the right contact depends on the issue." },
                ],
              },
              {
                id: "income-and-calculation",
                label: "Prior-year income, deductions, and assessment",
                fields: [
                  { id: "prior-year-income", number: 4, label: "Prior-year income", japaneseLabel: "前年中の所得金額", exampleValue: "AMOUNTS OMITTED", explanation: "Resident tax uses categories of income from the preceding calendar year. A later assessment can therefore arrive after employment, address, or immigration circumstances have changed." },
                  { id: "income-deductions", number: 5, label: "Income deductions", japaneseLabel: "所得控除額", exampleValue: "DEDUCTION DETAILS OMITTED", explanation: "These are the deductions recognized for the local-tax calculation. Their amounts and treatment do not always match the national income-tax figures on a return or withholding slip." },
                  { id: "taxable-income", number: 6, label: "Taxable income or tax base", japaneseLabel: "課税標準額", exampleValue: "AMOUNTS OMITTED", explanation: "This is the calculation base after applicable deductions and category rules. It is not gross salary, total deposits, or take-home pay." },
                  { id: "income-levy", number: 7, label: "Special ward and metropolitan income-based tax", japaneseLabel: "特別区民税・都民税 所得割額", exampleValue: "WARD AND METROPOLITAN AMOUNTS OMITTED", explanation: "A Shinjuku assessment can distinguish the income-based portions of special ward resident tax and Tokyo metropolitan resident tax. Credits, adjustments, separate taxation, and reductions can change the final figure." },
                  { id: "credits-and-reductions", number: 8, label: "Credits, adjustments, and reductions", japaneseLabel: "税額控除額等・減免額", exampleValue: "DETAILS OMITTED", explanation: "Review tax credits, adjustment deductions, donation-related credits, reductions, and later corrections shown on the calculation record. A notification alone does not establish why an expected item is absent." },
                ],
              },
              {
                id: "amount-and-collection",
                label: "Tax components, collection route, and schedule",
                fields: [
                  { id: "fixed-components", number: 9, label: "Per-capita levies and forest environment tax", japaneseLabel: "均等割額・森林環境税額", exampleValue: "COMPONENT AMOUNTS OMITTED", explanation: "The assessment can include per-capita local levies and the national forest environment tax collected by the municipality. The forest environment tax remains a national tax even when it appears with resident tax." },
                  { id: "collection-method", number: 10, label: "Collection method", japaneseLabel: "普通徴収・給与特別徴収・年金特別徴収", exampleValue: "ORDINARY · SALARY · PENSION — CHECK YOUR RECORD", explanation: "Ordinary collection uses municipal payment materials, salary special collection is deducted by an employer, and pension special collection is deducted from eligible pension payments. The record and payer determine which schedule applies." },
                  { id: "annual-and-balance", number: 11, label: "Annual assessment, change, or remaining balance", japaneseLabel: "年税額・変更税額・差引納付額", exampleValue: "AMOUNTS OMITTED", explanation: "Distinguish the annual assessment from a later changed amount or the balance remaining under one collection route. Job changes, corrections, prior deductions, or switching routes can affect what is still payable." },
                  { id: "installments", number: 12, label: "Installment or monthly amounts and due dates", japaneseLabel: "各期・各月の税額・納期限", exampleValue: "DATES AND PAYMENT REFERENCES OMITTED", explanation: "Shinjuku ordinary collection generally uses four periods in June, August, October, and the following January, while salary special collection generally runs monthly from June through the following May. Use the exact dates and amounts on the actual notice.", caution: "A calculation notice, employer-delivered taxpayer notice, change notice, and payment slip can be separate records. Keep related pages together and never copy a payment code from an example." },
                ],
              },
            ],
          },
        ],
      },
    ],
});
