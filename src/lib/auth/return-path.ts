/** Accepts only same-site absolute paths so authentication callbacks cannot become open redirects. */
export function safeAuthReturnPath(value: string | null | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}
