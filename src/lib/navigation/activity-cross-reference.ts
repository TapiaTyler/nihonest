export function safeActivityReturnPath(value: string | undefined) {
  const allowedOrigin = value && ["/explore", "/faq", "/residence-statuses"].some((path) => (
    value === path || value.startsWith(`${path}?`) || value.startsWith(`${path}#`)
  ));
  return value && !value.startsWith("//") && allowedOrigin
    ? value
    : "/explore";
}

export function activityCrossReferenceHref(activityId: string, returnTo?: string) {
  const query = new URLSearchParams({ activity: activityId });
  if (returnTo) query.set("returnTo", safeActivityReturnPath(returnTo));
  return `/can-i-do-this?${query}`;
}
