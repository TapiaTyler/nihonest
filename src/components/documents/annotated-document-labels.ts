export const documentLifecycleLabels = {
  current: "Current",
  superseded: "Archived",
  future: "Future",
} as const;

export const documentReviewLabels = {
  "needs-review": "Editorial review",
  verified: "Verified",
  stale: "Stale",
} as const;

export function formatDocumentDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
