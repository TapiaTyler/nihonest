import type { ComponentType } from "react";

/** A statically imported MDX module paired with its untrusted metadata export. */
export type ArticleRegistration = readonly [
  metadata: unknown,
  Content: ComponentType,
];
