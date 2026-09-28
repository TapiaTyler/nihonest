/**
 * Query values read by client boundaries on prebuilt pages. They mirror the server rules they replace: a
 * parameter counts only when it appears exactly once, and return destinations are limited to known pages.
 */
export type QueryValues = Readonly<{ getAll(name: string): string[] }>;

export function singleQueryValue(query: QueryValues, name: string): string | undefined {
  const values = query.getAll(name);
  return values.length === 1 ? values[0] : undefined;
}

export type ArticleReturnDestination = "/roadmap" | "/my-journey";

export function articleReturnDestination(value: string | undefined): ArticleReturnDestination | undefined {
  return value === "/roadmap" || value === "/my-journey" ? value : undefined;
}

/** Residence-status pages return to saved content or the status list, keeping list filters; anything else falls back. */
export function statusReturnDestination(value: string | undefined): string {
  return value && (value === "/saved" || value === "/residence-statuses" || value.startsWith("/residence-statuses?"))
    ? value
    : "/residence-statuses";
}
