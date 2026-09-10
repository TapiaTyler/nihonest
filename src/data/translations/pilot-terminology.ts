import type { ProtectedTerm } from "@/domain/translation/protected-text";

/** Target-locale mappings used by the Japanese pilot and included in its terminology revision. */
export const japanesePilotTerminology: readonly ProtectedTerm[] = [
  { id: "certificate-of-eligibility", value: "Certificate of Eligibility", replacement: "在留資格認定証明書（COE）", kind: "official-name" },
  { id: "immigration-services-agency", value: "Immigration Services Agency", replacement: "出入国在留管理庁", kind: "official-name" },
  { id: "status-of-residence", value: "status of residence", replacement: "在留資格", kind: "official-name" },
  { id: "student-status", value: "Student status", replacement: "「留学」の在留資格", kind: "official-name" },
  { id: "temporary-visitor", value: "Temporary Visitor", replacement: "「短期滞在」", kind: "official-name" },
  { id: "landing-permission", value: "landing permission", replacement: "上陸許可", kind: "official-name" },
  { id: "residence-card", value: "residence card", replacement: "在留カード", kind: "official-name" },
  { id: "coe", value: "COE", kind: "acronym" },
  { id: "isa", value: "ISA", kind: "acronym" },
] as const;
