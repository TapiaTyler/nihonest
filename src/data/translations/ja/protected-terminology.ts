import type { ProtectedTerm } from "@/domain/translation/protected-text";

/** Shared Japanese mappings; every article batch contributes to this revision-addressed registry. */
export const japaneseProtectedTerminology: readonly ProtectedTerm[] = [
  { id: "certificate-of-eligibility", value: "Certificate of Eligibility", replacement: "在留資格認定証明書（COE）", kind: "official-name" },
  { id: "immigration-services-agency", value: "Immigration Services Agency", replacement: "出入国在留管理庁", kind: "official-name" },
  { id: "status-of-residence", value: "status of residence", replacement: "在留資格", kind: "official-name" },
  { id: "student-status", value: "Student status", replacement: "「留学」の在留資格", kind: "official-name" },
  { id: "temporary-visitor", value: "Temporary Visitor", replacement: "「短期滞在」", kind: "official-name" },
  { id: "landing-permission", value: "landing permission", replacement: "上陸許可", kind: "official-name" },
  { id: "residence-card", value: "residence card", replacement: "在留カード", kind: "official-name" },
  { id: "identity-verification", value: "Identity Verification", replacement: "本人確認", kind: "official-name" },
  { id: "my-number", value: "My Number", replacement: "マイナンバー", kind: "official-name" },
  { id: "individual-number", value: "Individual Number", replacement: "個人番号", kind: "official-name" },
  { id: "individual-number-notice", value: "Individual Number Notice", replacement: "個人番号通知書", kind: "official-name" },
  { id: "my-number-card", value: "My Number Card", replacement: "マイナンバーカード", kind: "official-name" },
  { id: "resident-registration", value: "Resident Registration", replacement: "住民登録", kind: "official-name" },
  { id: "basic-resident-register", value: "Basic Resident Register", replacement: "住民基本台帳", kind: "official-name" },
  { id: "certificate-of-residence", value: "Certificate of Residence", replacement: "住民票", kind: "official-name" },
  { id: "coe", value: "COE", kind: "acronym" },
  { id: "isa", value: "ISA", kind: "acronym" },
] as const;
