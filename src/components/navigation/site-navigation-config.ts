import type { InterfaceMessageId } from "@/domain/localization/interface-messages";

export const siteDestinations = [
  { href: "/", labelId: "navigation.home" },
  { href: "/explore", labelId: "navigation.explore" },
  { href: "/my-journey", labelId: "navigation.myJourney" },
  { href: "/roadmap", labelId: "navigation.roadmap" },
  { href: "/onboarding", labelId: "navigation.adjustStartingPoint" },
  { href: "/faq", labelId: "navigation.faq" },
  { href: "/glossary", labelId: "navigation.glossary" },
  { href: "/residence-statuses", labelId: "navigation.residenceStatuses" },
  { href: "/saved", labelId: "navigation.saved" },
  { href: "/reminders", labelId: "navigation.reminders" },
  { href: "/account", labelId: "navigation.account" },
] as const;

export type SiteDestinationHref = (typeof siteDestinations)[number]["href"];

export const journeyNavigationLinks = [
  { href: "/my-journey", labelId: "navigation.myJourney", descriptionId: "navigation.journeyDescription" },
  { href: "/roadmap", labelId: "navigation.roadmap", descriptionId: "navigation.roadmapDescription" },
  { href: "/onboarding", labelId: "navigation.adjustStartingPoint", descriptionId: "navigation.startingPointDescription" },
] as const satisfies readonly { href: SiteDestinationHref; labelId: InterfaceMessageId; descriptionId: InterfaceMessageId }[];

export const resourceNavigationLinks = [
  { href: "/faq", labelId: "navigation.faq", descriptionId: "navigation.faqDescription" },
  { href: "/glossary", labelId: "navigation.glossary", descriptionId: "navigation.glossaryDescription" },
  { href: "/residence-statuses", labelId: "navigation.residenceStatuses", descriptionId: "navigation.statusesDescription" },
] as const satisfies readonly { href: SiteDestinationHref; labelId: InterfaceMessageId; descriptionId: InterfaceMessageId }[];

export const mobileNavigationGroups = [
  { id: "journey", labelId: "navigation.journey", links: journeyNavigationLinks },
  { id: "resources", labelId: "navigation.resources", links: resourceNavigationLinks },
] as const;

/** Centralizes route matching so desktop and mobile navigation expose identical active states. */
export function isSiteDestinationActive(pathname: string, href: SiteDestinationHref): boolean {
  if (href === "/") return pathname === href;
  if (href === "/explore") return pathname === href || pathname.startsWith("/articles/");
  return pathname === href || pathname.startsWith(`${href}/`);
}
