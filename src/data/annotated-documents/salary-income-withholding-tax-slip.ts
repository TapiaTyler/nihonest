import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { fictionalDocumentNotice } from "@/data/annotated-documents/shared";

export const salaryIncomeWithholdingTaxSlipDocumentFamily = annotatedDocumentFamilySchema.parse({
    id: "salary-income-withholding-tax-slip",
    title: "Salary Income Withholding Tax Slip",
    japaneseName: "給与所得の源泉徴収票",
    issuer: "The employer or other salary payer",
    jurisdiction: "Japan — national income tax record",
    articleId: "payroll-withholding-and-year-end-adjustment",
    glossaryTermIds: ["kyuyo-shotoku-no-gensen-choshu-hyo"],
    description: "Use this annual employer-issued record to distinguish gross salary, payroll-computed income and deductions, and tax withheld. It is not a payslip, resident-tax notice, final return, or proof that no return is required.",
    versions: [
      {
        id: "tax-year-2026",
        label: "2026 tax year",
        lifecycle: "current",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} Amounts, My Number, addresses, dependent identities, and payer identifiers are intentionally omitted. Use the slip issued for your actual tax year.`,
        sourceIds: ["nta-statutory-report-guide-2026", "nta-salary-withholding-slip"],
        sections: [
          {
            id: "record-and-parties",
            label: "Tax year, recipient, and payer",
            fields: [
              { id: "tax-year", number: 1, label: "Tax year", japaneseLabel: "年分", exampleValue: "2026 TAX YEAR", explanation: "The year identifies the salary period governed by this version of the form. Do not compare fields or thresholds with another year's instructions without checking for changes." },
              { id: "recipient", number: 2, label: "Person receiving salary", japaneseLabel: "支払を受ける者", exampleValue: "FICTIONAL RECIPIENT · DETAILS OMITTED", explanation: "Check the name, address or residence, phonetic reading, and any job title. The copy given to the recipient must not show the recipient's My Number." },
              { id: "payer", number: 3, label: "Salary payer", japaneseLabel: "支払者", exampleValue: "FICTIONAL EMPLOYER · IDENTIFIERS OMITTED", explanation: "This identifies the employer or other payer responsible for issuing this slip. Keep separate slips when more than one payer issued salary records." },
            ],
          },
          {
            id: "headline-amounts",
            label: "Headline salary and tax amounts",
            fields: [
              { id: "payment-amount", number: 4, label: "Payment amount", japaneseLabel: "支払金額", exampleValue: "AMOUNT OMITTED", explanation: "This is the total salary and similar compensation whose payment became fixed during the year under the applicable instructions. It is not take-home pay and can include qualifying prior-employer salary when that salary was combined in year-end adjustment." },
              { id: "employment-income", number: 5, label: "Amount after employment-income deduction", japaneseLabel: "給与所得控除後の金額（調整控除後）", exampleValue: "AMOUNT OMITTED", explanation: "For salary covered by year-end adjustment, this is the payroll-computed employment-income amount after the employment-income deduction and any applicable income adjustment deduction. It is not the cash paid into the employee's account." },
              { id: "deductions-total", number: 6, label: "Total income deductions", japaneseLabel: "所得控除の額の合計額", exampleValue: "AMOUNT OMITTED", explanation: "This combines the income deductions reflected in the employer's year-end adjustment, such as applicable social-insurance, basic, spouse, dependent, insurance, disability, or related deductions. A deduction absent here may require separate investigation." },
              { id: "withheld-tax", number: 7, label: "Income tax withheld", japaneseLabel: "源泉徴収税額", exampleValue: "AMOUNT OMITTED", explanation: "For adjusted salary, this is the income tax and special reconstruction income tax after year-end adjustment. For unadjusted salary, it reflects tax required to be withheld under the applicable instructions. It is not resident tax." },
            ],
          },
          {
            id: "adjustment-details",
            label: "Deductions, employment events, and remarks",
            fields: [
              { id: "family-and-residence", number: 8, label: "Spouse, dependents, and nonresident relatives", japaneseLabel: "配偶者・扶養親族等", exampleValue: "COUNTS AND IDENTITIES OMITTED", explanation: "These fields record covered spouse and dependent information, age or disability categories, certain relative-related deductions, and nonresident-relative counts used in payroll. They do not establish immigration sponsorship or household registration." },
              { id: "insurance-and-housing", number: 9, label: "Insurance, pension, and housing-loan details", japaneseLabel: "社会保険料等・生命保険料・住宅借入金等特別控除", exampleValue: "DETAILS OMITTED", explanation: "These fields show deductions and supporting amounts reflected through payroll, including applicable social insurance, national pension, private insurance, and housing-loan credit information. Blank or populated fields must be read with the year's rules and the employee's submitted declarations." },
              { id: "remarks-and-employment", number: 10, label: "Remarks and employment dates", japaneseLabel: "摘要・中途就職・退職", exampleValue: "NO REAL EMPLOYMENT RECORD", explanation: "The remarks and start or departure fields can identify combined prior-employer salary, special treatment, or a mid-year employment event. They can be essential when reconciling several slips or deciding what evidence a return needs.", caution: "A slip does not decide by itself whether a final tax return is required." },
            ],
          },
        ],
      },
      {
        id: "tax-year-2025",
        label: "2025 tax year",
        lifecycle: "superseded",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} This archived explanation is for a 2025 slip. Amounts, My Number, addresses, dependent identities, and payer identifiers are intentionally omitted.`,
        sourceIds: ["nta-statutory-report-guide-2025", "nta-salary-withholding-slip"],
        sections: [
          {
            id: "record-and-parties",
            label: "Tax year, recipient, and payer",
            fields: [
              { id: "tax-year", number: 1, label: "Tax year", japaneseLabel: "年分", exampleValue: "2025 TAX YEAR", explanation: "Use this archived version only to interpret a slip for salary paid in the 2025 tax year. Current instructions and later forms can differ." },
              { id: "recipient", number: 2, label: "Person receiving salary", japaneseLabel: "支払を受ける者", exampleValue: "FICTIONAL RECIPIENT · DETAILS OMITTED", explanation: "Check the recipient's identity and address information. The recipient copy does not display the recipient's My Number." },
              { id: "payer", number: 3, label: "Salary payer", japaneseLabel: "支払者", exampleValue: "FICTIONAL EMPLOYER · IDENTIFIERS OMITTED", explanation: "This identifies the employer or other payer that issued this 2025 record. Several employers can mean several separate slips." },
            ],
          },
          {
            id: "headline-amounts",
            label: "Headline salary and tax amounts",
            fields: [
              { id: "payment-amount", number: 4, label: "Payment amount", japaneseLabel: "支払金額", exampleValue: "AMOUNT OMITTED", explanation: "This records covered salary and similar compensation for the 2025 tax year under that year's instructions. It is not the employee's take-home pay." },
              { id: "employment-income", number: 5, label: "Amount after employment-income deduction", japaneseLabel: "給与所得控除後の金額（調整控除後）", exampleValue: "AMOUNT OMITTED", explanation: "Where year-end adjustment applies, this records the payroll-computed employment-income amount after the applicable employment-income and income-adjustment deductions." },
              { id: "deductions-total", number: 6, label: "Total income deductions", japaneseLabel: "所得控除の額の合計額", exampleValue: "AMOUNT OMITTED", explanation: "This is the total of income deductions reflected in the employer's 2025 year-end adjustment; it does not include every deduction a person might claim separately." },
              { id: "withheld-tax", number: 7, label: "Income tax withheld", japaneseLabel: "源泉徴収税額", exampleValue: "AMOUNT OMITTED", explanation: "This records national income tax and special reconstruction income tax withheld under the applicable 2025 treatment. It is separate from municipal and prefectural resident tax." },
            ],
          },
          {
            id: "adjustment-details",
            label: "Deductions, employment events, and remarks",
            fields: [
              { id: "family-and-residence", number: 8, label: "Spouse, dependents, and nonresident relatives", japaneseLabel: "配偶者・扶養親族等", exampleValue: "COUNTS AND IDENTITIES OMITTED", explanation: "These fields reflect spouse, dependent, special-relative, disability, age, and nonresident-relative information used in the 2025 payroll calculation. They are not residence-status or family-register findings." },
              { id: "insurance-and-housing", number: 9, label: "Insurance, pension, and housing-loan details", japaneseLabel: "社会保険料等・生命保険料・住宅借入金等特別控除", exampleValue: "DETAILS OMITTED", explanation: "Read these populated or blank fields under the 2025 instructions. They identify amounts and credits reflected through payroll, not necessarily every payment or entitlement for the year." },
              { id: "remarks-and-employment", number: 10, label: "Remarks and employment dates", japaneseLabel: "摘要・中途就職・退職", exampleValue: "NO REAL EMPLOYMENT RECORD", explanation: "The remarks and employment-event fields may identify combined former-employer information, special tax treatment, or a mid-year start or departure.", caution: "Use the 2025 instructions when resolving a 2025 record; do not apply a later threshold or label automatically." },
            ],
          },
        ],
      },
    ],
});
