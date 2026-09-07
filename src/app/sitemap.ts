import type { MetadataRoute } from "next";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { residenceStatuses } from "@/data/residence-statuses";
import { getAllArticles } from "@/lib/content/articles";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { siteUrl } from "@/lib/site-url";

function absolute(path: string) {
  return new URL(path, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/explore", "/faq", "/glossary", "/residence-statuses"].map((path) => ({ url: absolute(path) }));
  return [
    ...staticRoutes,
    ...articleGroups.map(({ id }) => ({ url: absolute(`/explore/${id}`) })),
    ...guidedJourneys.map(({ id }) => ({ url: absolute(`/explore/journeys/${id}`) })),
    ...getAllArticles().map(({ metadata }) => ({ url: absolute(`/articles/${metadata.slug}`), lastModified: metadata.updatedAt })),
    ...getAllGlossaryTerms().map(({ slug }) => ({ url: absolute(`/glossary/${slug}`) })),
    ...residenceStatuses.map(({ slug, lastReviewedAt }) => ({ url: absolute(`/residence-statuses/${slug}`), lastModified: lastReviewedAt })),
  ];
}
