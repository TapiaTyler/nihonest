import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AccountContentSyncProvider } from "@/components/account/account-content-sync-provider";
import { BrowserSchemaConfig } from "@/components/browser-schema-config";
import { AccountSessionProvider } from "@/components/account/account-session-provider";
import { PersonalizationProvider } from "@/components/personalization/personalization-provider";
import { JourneyUpdateNotice } from "@/components/personalization/journey-update-notice";
import { SavedContentProvider } from "@/components/saved-content/saved-content-provider";
import { GlossaryStudyProvider } from "@/components/glossary-study/glossary-study-provider";
import { ChecklistProgressProvider } from "@/components/roadmap/checklist-progress-provider";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { ReadingAidProvider } from "@/components/localization/reading-aid-provider";
import { SiteFooter } from "@/components/site-footer";
import { SkipLink } from "@/components/navigation/skip-link";
import { SiteHeader } from "@/components/site-header";
import { ThemeEffects } from "@/components/theme/theme-effects";
import { themeColors } from "@/domain/theme/theme";
import { themeStorageKey } from "@/lib/storage/theme";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Nihonest — Find your place in Japan",
  description:
    "A public-first knowledgebase for people preparing to move to Japan or building a life there.",
  applicationName: "Nihonest",
  referrer: "origin-when-cross-origin",
  keywords: ["Japan", "moving to Japan", "status of residence", "visa guidance", "Japanese glossary"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nihonest",
    title: "Nihonest — Find your place in Japan",
    description: "Practical, sourced guidance for moving to and building a life in Japan.",
  },
};

/**
 * The browser bar takes the colour at the very top of the page, which is the header: white in the light theme and
 * slate-950 in the dark one. `ThemeEffects` replaces both values when the visitor picks a theme by hand.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
  colorScheme: "light dark",
};

/** Applies a saved light or dark choice before the first paint so the page never flashes the wrong theme. */
const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-page text-ink-strong antialiased">
        <BrowserSchemaConfig />
        <ThemeEffects />
        <ContentLocaleProvider>
          <ReadingAidProvider>
            <PersonalizationProvider>
          <SavedContentProvider>
            <GlossaryStudyProvider>
              <ChecklistProgressProvider>
                <AccountSessionProvider>
                  <AccountContentSyncProvider>
            <SkipLink />
            <SiteHeader />
            <JourneyUpdateNotice />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
                  </AccountContentSyncProvider>
                </AccountSessionProvider>
              </ChecklistProgressProvider>
            </GlossaryStudyProvider>
          </SavedContentProvider>
            </PersonalizationProvider>
          </ReadingAidProvider>
        </ContentLocaleProvider>
      </body>
    </html>
  );
}
