"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePersonalization } from "./personalization-provider";

export function JourneyRouteLink({
  href,
  journeyId,
  routeId,
  focusedArticleId,
  className,
  children,
}: Readonly<{
  href: string;
  journeyId: string;
  routeId: string;
  focusedArticleId: string;
  className: string;
  children: ReactNode;
}>) {
  const { saveJourneyRoute } = usePersonalization();

  return (
    <Link
      href={href}
      onClick={() => saveJourneyRoute({ journeyId, routeId, focusedArticleId })}
      className={className}
    >
      {children}
    </Link>
  );
}
