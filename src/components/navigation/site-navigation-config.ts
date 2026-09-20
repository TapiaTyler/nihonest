export const siteDestinations = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/my-journey", label: "My Journey" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/onboarding", label: "Adjust Starting Point" },
  { href: "/faq", label: "FAQ" },
  { href: "/glossary", label: "Glossary" },
  { href: "/residence-statuses", label: "Residence Statuses" },
  { href: "/saved", label: "Saved" },
  { href: "/reminders", label: "Reminders" },
  { href: "/account", label: "Account" },
] as const;

export type SiteDestinationHref = (typeof siteDestinations)[number]["href"];

export const journeyNavigationLinks = [
  { href: "/my-journey", label: "My Journey", description: "Follow your selected route step by step." },
  { href: "/roadmap", label: "Roadmap", description: "See your progress and next recommended action." },
  { href: "/onboarding", label: "Adjust Starting Point", description: "Change your stage, journey, or route." },
] as const;

export const resourceNavigationLinks = [
  { href: "/faq", label: "FAQ", description: "Find answers to common questions." },
  { href: "/glossary", label: "Glossary", description: "Understand Japanese terms in context." },
  { href: "/residence-statuses", label: "Residence Statuses", description: "Browse immigration status categories." },
] as const;

export const mobileNavigationGroups = [
  { label: "Journey", links: journeyNavigationLinks },
  { label: "Resources", links: resourceNavigationLinks },
] as const;

/** Centralizes route matching so desktop and mobile navigation expose identical active states. */
export function isSiteDestinationActive(pathname: string, href: SiteDestinationHref): boolean {
  if (href === "/") return pathname === href;
  if (href === "/explore") return pathname === href || pathname.startsWith("/articles/");
  return pathname === href || pathname.startsWith(`${href}/`);
}
