import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { fictionalDocumentNotice } from "@/data/annotated-documents/shared";

export const notificationOfChangeInResidenceDocumentFamily = annotatedDocumentFamilySchema.parse({
    id: "notification-of-change-in-residence",
    title: "Notification of change in residence",
    japaneseName: "住民異動届",
    issuer: "The municipality responsible for the address",
    jurisdiction: "Shinjuku City and Nagoya City pilot",
    articleId: "registering-your-address-after-arrival",
    glossaryTermIds: ["jumin-toroku", "tennyu-todoke", "tenshutsu-todoke", "tenkyo-todoke"],
    description: "This shared field map helps readers recognize common concepts without implying that Japan has one national moving form. Obtain and follow the current form and counter instructions from the responsible municipality.",
    versions: [
      {
        id: "current-shared-concepts-and-local-variation",
        label: "Current shared concepts with Shinjuku and Nagoya variation",
        lifecycle: "current",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} This is not a copy of either city's form and cannot be submitted. Field order, wording, evidence, and submission channels vary by municipality and situation.`,
        sourceIds: ["shinjuku-address-changes", "nagoya-resident-registration"],
        sections: [
          {
            id: "move-and-household",
            label: "Move and household concepts",
            fields: [
              { id: "notification-type", number: 1, label: "Type of notification", japaneseLabel: "届出の種類", exampleValue: "転入 · 転居 · 転出 — CHOOSE THE ACTUAL CASE", explanation: "Identify whether the event is a move into the municipality, within it, or out of it. The correct procedure and timing depend on the actual move, not the English word 'address change'." },
              { id: "move-date", number: 2, label: "Date of the move", japaneseLabel: "異動日", exampleValue: "2099-01-01 · EXAMPLE", explanation: "Give the date the residence actually changed. This may differ from the date the notice is submitted." },
              { id: "addresses", number: 3, label: "Former and new address", japaneseLabel: "旧住所・新住所", exampleValue: "EXAMPLE ADDRESSES ONLY", explanation: "Use the actual former and new residence in the format requested by the municipality. A mailing address is not automatically a registrable residence." },
              { id: "household-head", number: 4, label: "Head of household and relationship", japaneseLabel: "世帯主・続柄", exampleValue: "FICTIONAL HOUSEHOLD", explanation: "The form may ask for the household head and each resident's relationship to that person. Foreign-language relationship evidence may need a Japanese translation identifying the translator." },
              { id: "people-moving", number: 5, label: "People covered by the move", japaneseLabel: "異動する人", exampleValue: "ONE FICTIONAL RESIDENT", explanation: "Confirm every household member included in the notification. Evidence and card-update steps can apply separately to each person." },
            ],
          },
          {
            id: "submission-and-local-route",
            label: "Submitter, evidence, and local route",
            fields: [
              { id: "submitter", number: 6, label: "Person submitting the notice", japaneseLabel: "届出人", exampleValue: "RESIDENT · EXAMPLE", explanation: "Identify whether the resident, a household member, legal representative, or another authorized person is submitting. A representative may need additional identity and authority evidence." },
              { id: "residence-evidence", number: 7, label: "Residence and identity documents", japaneseLabel: "本人確認書類・在留カード等", exampleValue: "CHECK YOUR MUNICIPAL LIST", explanation: "Foreign residents may need passports, residence cards or other residence documents, moving-out certificates, My Number Cards, or household-relationship evidence depending on the move." },
              { id: "notification-date", number: 8, label: "Date submitted", japaneseLabel: "届出日", exampleValue: "2099-01-02 · EXAMPLE", explanation: "Record the filing date separately from the move date. Both pilot municipalities describe a fourteen-day route for applicable moving-in or change events, but users should confirm their exact case." },
              { id: "local-handling", number: 9, label: "Municipality-specific form and channel", japaneseLabel: "自治体の様式・受付方法", exampleValue: "SHINJUKU OR NAGOYA INSTRUCTIONS", explanation: "Shinjuku publishes separate change-of-address routes. Nagoya supplies ordinary moving-in and within-ward forms at ward or branch counters and limits postal filing to qualifying moving-out notifications. Do not carry one city's form into the other city as if it were national." },
            ],
          },
        ],
      },
    ],
});
