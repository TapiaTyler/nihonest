import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { fictionalDocumentNotice } from "@/data/annotated-documents/shared";

export const residenceCardDocumentFamily = annotatedDocumentFamilySchema.parse({
    id: "residence-card",
    title: "Residence Card",
    japaneseName: "在留カード",
    issuer: "Immigration Services Agency of Japan",
    jurisdiction: "Japan",
    articleId: "documents-received-when-entering-japan",
    glossaryTermIds: ["zairyu-card"],
    description: "Use the fields together to understand identity, residence status, validity, and work-related notation. This concept map does not reproduce security features or exact card geometry.",
    versions: [
      {
        id: "issued-from-2026-06-14",
        label: "Issued from June 14, 2026",
        lifecycle: "current",
        validFrom: "2026-06-14",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: fictionalDocumentNotice,
        sourceIds: ["isa-residence-card-format-2026", "isa-specified-residence-card", "isa-residence-card-comparison-image", "isa-content-reuse-policy"],
        officialVisuals: [
          {
            id: "official-format-comparison",
            assetUrl: "https://www.moj.go.jp/isa/content/001458498.jpg",
            width: 990,
            height: 600,
            alt: "Official ISA comparison showing residence-card formats issued through June 13, 2026 and from June 14, 2026",
            caption: "Official ISA comparison of the earlier and current residence-card formats. It is a visual reference, not a substitute for checking the printed details and current official guidance.",
            sourceId: "isa-residence-card-comparison-image",
            rightsSourceId: "isa-content-reuse-policy",
            presentation: "unmodified",
          },
        ],
        sections: [
          {
            id: "identity-and-residence",
            label: "Visible identity and residence information",
            fields: [
              { id: "identity", number: 1, label: "Name", japaneseLabel: "氏名", exampleValue: "NIHONEST TARO", explanation: "Compare the displayed name with the passport and other records. The schematic uses a fictional name." },
              { id: "personal-details", number: 2, label: "Birth, sex, and nationality or region", japaneseLabel: "生年月日・性別・国籍・地域", exampleValue: "2000-01-01 · X · EXAMPLE", explanation: "These identity fields should be checked for errors when the card is received." },
              { id: "address", number: 3, label: "Place of residence", japaneseLabel: "住居地", exampleValue: "EXAMPLE ADDRESS", explanation: "The registered address is updated through the required municipal procedure. A hotel or mailing address is not automatically a registrable residence." },
              { id: "status", number: 4, label: "Status of residence", japaneseLabel: "在留資格", exampleValue: "STUDENT — EXAMPLE", explanation: "This is the status governing the authorized activity or position. The English example is deliberately non-operational." },
              { id: "stay-expiry", number: 5, label: "Period-of-stay expiration date", japaneseLabel: "在留期間の満了の日", exampleValue: "2099-12-31 — EXAMPLE", explanation: "This deadline is not the same as passport validity, visa validity, or a school or employment contract end date." },
            ],
          },
          {
            id: "permissions-and-validity",
            label: "Permissions and validity",
            fields: [
              { id: "work-restriction", number: 6, label: "Work restriction", japaneseLabel: "就労制限の有無", exampleValue: "CHECK ACTIVITY CONDITIONS", explanation: "Read the exact notation with the status and actual duties. A job title alone does not establish permission.", caution: "A Designated Activities case may also require its designation document." },
              { id: "outside-activity", number: 7, label: "Outside-activity permission", japaneseLabel: "資格外活動許可", exampleValue: "NONE — EXAMPLE", explanation: "When permission exists, its fact and limits must be read with the principal status and any separate permission record." },
              { id: "card-identity", number: 8, label: "Card number and card-validity date", japaneseLabel: "在留カード番号・有効期間の満了の日", exampleValue: "NUMBER OMITTED", explanation: "The card has its own number and validity date. Nihonest never generates a realistic number or machine-readable credential." },
            ],
          },
        ],
      },
      {
        id: "issued-through-2026-06-13",
        label: "Issued through June 13, 2026",
        lifecycle: "superseded",
        validThrough: "2026-06-13",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} Cards issued under this design can remain valid after the newer design was introduced; check the date printed on the actual card.`,
        sourceIds: ["isa-residence-card-format-2026", "isa-new-entrant-guidance", "isa-residence-card-comparison-image", "isa-content-reuse-policy"],
        officialVisuals: [
          {
            id: "official-format-comparison",
            assetUrl: "https://www.moj.go.jp/isa/content/001458498.jpg",
            width: 990,
            height: 600,
            alt: "Official ISA comparison showing residence-card formats issued through June 13, 2026 and from June 14, 2026",
            caption: "Official ISA comparison of the earlier and current residence-card formats. Earlier cards can remain valid after the newer format was introduced, subject to the validity printed on the card.",
            sourceId: "isa-residence-card-comparison-image",
            rightsSourceId: "isa-content-reuse-policy",
            presentation: "unmodified",
          },
        ],
        sections: [
          {
            id: "front",
            label: "Front-side concepts",
            fields: [
              { id: "identity", number: 1, label: "Identity", japaneseLabel: "氏名・生年月日・性別・国籍・地域", exampleValue: "FICTIONAL HOLDER", explanation: "The front identifies the holder. Compare it with the passport and report an apparent error." },
              { id: "address", number: 2, label: "Place of residence", japaneseLabel: "住居地", exampleValue: "EXAMPLE ADDRESS", explanation: "The first registered address and later updates form part of the residence record." },
              { id: "status-and-period", number: 3, label: "Status and period of stay", japaneseLabel: "在留資格・在留期間", exampleValue: "EXAMPLE STATUS · 1 YEAR", explanation: "The status and granted period are separate concepts; neither is simply the original entry visa." },
              { id: "work-restriction", number: 4, label: "Work restriction", japaneseLabel: "就労制限の有無", exampleValue: "CHECK EXACT NOTATION", explanation: "The visible notation must be considered with any outside-activity permission and, where relevant, a designation document." },
              { id: "expiry-and-number", number: 5, label: "Expiration and card number", japaneseLabel: "在留期間満了日・在留カード番号", exampleValue: "NUMBER OMITTED", explanation: "Confirm the printed deadlines; this schematic omits any plausible card number." },
            ],
          },
          {
            id: "reverse",
            label: "Reverse-side concepts",
            fields: [
              { id: "address-history", number: 6, label: "Later address records", japaneseLabel: "住居地記載欄", exampleValue: "NO REAL ADDRESS", explanation: "Municipal officers record qualifying address changes; altering the card yourself is not permitted." },
              { id: "outside-activity", number: 7, label: "Outside-activity permission", japaneseLabel: "資格外活動許可欄", exampleValue: "NONE — EXAMPLE", explanation: "This field can materially change how the front-side work notation is understood, but only within the permission's stated scope." },
              { id: "pending-application", number: 8, label: "Application pending notation", japaneseLabel: "申請中", exampleValue: "NOT PENDING", explanation: "A qualifying extension or change application may be noted here. The notation does not mean the application has been approved." },
            ],
          },
        ],
      },
    ],
});
