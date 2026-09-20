import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { fictionalDocumentNotice } from "@/data/annotated-documents/shared";

export const certificateOfEligibilityDocumentFamily = annotatedDocumentFamilySchema.parse({
    id: "certificate-of-eligibility",
    title: "Certificate of Eligibility",
    japaneseName: "在留資格認定証明書",
    issuer: "Immigration Services Agency of Japan",
    jurisdiction: "Japan",
    articleId: "visa-and-status-of-residence-explained",
    glossaryTermIds: ["certificate-of-eligibility"],
    description: "The COE records an immigration pre-examination result that supports later visa and landing procedures. It is not itself the visa, landing permission, or residence card.",
    versions: [
      {
        id: "current-paper-and-electronic-context",
        label: "Current paper and electronic context",
        lifecycle: "current",
        validFrom: "2023-03-17",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: fictionalDocumentNotice,
        sourceIds: ["isa-coe-application", "isa-coe-validity", "isa-electronic-coe"],
        sections: [
          {
            id: "subject-and-route",
            label: "Subject and planned route",
            fields: [
              { id: "identity", number: 1, label: "Name and identity details", japaneseLabel: "氏名・生年月日・性別・国籍", exampleValue: "NIHONEST TARO · EXAMPLE", explanation: "These identify the foreign national who is the subject of the decision, even when an eligible organization or relative submitted the application." },
              { id: "passport", number: 2, label: "Passport information", japaneseLabel: "旅券番号", exampleValue: "PASSPORT NUMBER OMITTED", explanation: "Compare identifying information with the passport used for the later visa and travel process." },
              { id: "status", number: 3, label: "Intended status of residence", japaneseLabel: "在留資格", exampleValue: "STUDENT — EXAMPLE", explanation: "This describes the planned residence route examined for the COE. The later landing decision is separate." },
              { id: "activity-context", number: 4, label: "Activity or organization context", japaneseLabel: "活動・所属機関等", exampleValue: "EXAMPLE SCHOOL", explanation: "Route-specific organization or activity information helps identify the examined plan; it does not give the holder unrestricted permission for other work or study." },
            ],
          },
          {
            id: "decision-and-use",
            label: "Decision and later use",
            fields: [
              { id: "issue-details", number: 5, label: "Issue and decision details", japaneseLabel: "交付・認定情報", exampleValue: "FICTIONAL ISSUE RECORD", explanation: "Use the official issue information to identify the certificate and its timing. Nihonest does not create a realistic application or certificate number." },
              { id: "presentation", number: 6, label: "Paper or electronic presentation", japaneseLabel: "書面・電子交付", exampleValue: "ELECTRONIC EXAMPLE", explanation: "A COE may be handled in paper or electronic form under the current system. Follow the current diplomatic-mission and ISA instructions for presentation." },
              { id: "validity", number: 7, label: "Validity and timing", japaneseLabel: "有効期間", exampleValue: "CHECK CURRENT ISA RULE", explanation: "The certificate must be used within the applicable current period and process. Exceptional extensions should never be assumed from an older notice." },
              { id: "not-a-guarantee", number: 8, label: "What this does not decide", japaneseLabel: "査証・上陸許可とは別", exampleValue: "NOT A VISA", explanation: "A COE supports later examination. It does not guarantee visa issuance or landing permission and is not the residence card received after qualifying entry.", caution: "Keep the visa, landing permission, status of residence, and residence card as separate decisions and records." },
            ],
          },
        ],
      },
    ],
});
