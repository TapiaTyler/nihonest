import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { fictionalDocumentNotice } from "@/data/annotated-documents/shared";

export const myNumberCardAndNoticeDocumentFamily = annotatedDocumentFamilySchema.parse({
    id: "my-number-card-and-notice",
    title: "My Number Card and notification context",
    japaneseName: "マイナンバーカード・個人番号通知書",
    issuer: "Municipality, with card and notice operations supported by J-LIS",
    jurisdiction: "Japan",
    articleId: "understanding-my-number",
    glossaryTermIds: ["my-number", "kojin-bango", "my-number-card"],
    description: "Separate the optional photo card, the Individual Number printed on its reverse, the electronic certificates, and the notice or application materials that may arrive after resident registration.",
    versions: [
      {
        id: "current-card-and-notification-context",
        label: "Current card and notification context",
        lifecycle: "current",
        reviewStatus: "needs-review",
        lastCheckedAt: "2026-09-13",
        notice: `${fictionalDocumentNotice} The Individual Number, application ID, portrait, PINs, QR code, and machine-readable elements are intentionally omitted.`,
        sourceIds: ["digital-agency-my-number-card", "my-number-faq", "jlis-my-number-card-sample-image", "jlis-image-reuse-terms"],
        officialVisuals: [
          {
            id: "official-card-sample",
            assetUrl: "https://www.kojinbango-card.go.jp/hpsv/wpmng/assets/img/faq/card_sample_img1.png",
            width: 308,
            height: 180,
            alt: "Official sample of a My Number Card with clearly fictional sample details",
            caption: "Official J-LIS sample image published in its current FAQ. Use current municipal instructions and the semantic field explanations below; notation on an individual card may differ.",
            sourceId: "jlis-my-number-card-sample-image",
            rightsSourceId: "jlis-image-reuse-terms",
            presentation: "unmodified",
          },
        ],
        sections: [
          {
            id: "card-face-and-validity",
            label: "Card face and separate validity dates",
            fields: [
              { id: "identity", number: 1, label: "Identity information and portrait", japaneseLabel: "氏名・住所・生年月日・性別・顔写真", exampleValue: "NIHONEST TARO · EXAMPLE ADDRESS", explanation: "The card face displays core resident identity information and a portrait. Compare those details with the resident record; the concept map does not create a realistic card image." },
              { id: "card-expiry", number: 2, label: "Card expiration date", japaneseLabel: "有効期間の満了日", exampleValue: "2099-12-31 · EXAMPLE", explanation: "The physical card has its own expiration date printed on the face. A changed period of stay can require a separate municipal card procedure for a foreign resident." },
              { id: "electronic-certificate-expiry", number: 3, label: "Electronic-certificate expiration", japaneseLabel: "電子証明書の有効期限", exampleValue: "CHECK SEPARATELY", explanation: "The electronic certificate has a separate expiry from the card body. It may be recorded on the face or checked through the official service; do not assume the two dates match." },
              { id: "address-update", number: 4, label: "Updated name or address", japaneseLabel: "追記欄", exampleValue: "NO REAL ADDRESS", explanation: "When recorded information changes, the municipality updates the applicable record and card notation. Follow the local procedure within the required period rather than writing on the card yourself." },
            ],
          },
          {
            id: "number-electronic-and-notice",
            label: "Protected number, electronic use, and mailed materials",
            fields: [
              { id: "individual-number", number: 5, label: "Twelve-digit Individual Number", japaneseLabel: "個人番号", exampleValue: "12-DIGIT NUMBER OMITTED", explanation: "The reverse carries the holder's Individual Number. Reveal or copy it only for a procedure legally using the number; it is not the residence-card number.", caution: "Nihonest never asks a user to upload or store this number." },
              { id: "electronic-certificates", number: 6, label: "Electronic certificates and IC functions", japaneseLabel: "電子証明書・ICチップ", exampleValue: "FUNCTIONS ONLY · NO CREDENTIAL", explanation: "Electronic certificates can support online identity verification and signatures. The concept map does not reproduce a credential, PIN, chip data, or scannable element." },
              { id: "individual-number-notice", number: 7, label: "Individual Number Notice", japaneseLabel: "個人番号通知書", exampleValue: "SEPARATE MAILED NOTICE", explanation: "The notice informs a newly registered resident of the number but is not a photo identity document. If information is wrong, contact the municipality about the underlying resident record." },
              { id: "application-material", number: 8, label: "Card application material", japaneseLabel: "個人番号カード交付申請書", exampleValue: "APPLICATION ID AND QR OMITTED", explanation: "Application material can accompany the notice or be issued by the municipality. Applying for the optional photo card is a separate step from being assigned the number." },
            ],
          },
        ],
      },
    ],
});
