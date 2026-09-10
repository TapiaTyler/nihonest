import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountContentSyncProvider } from "@/components/account/account-content-sync-provider";
import { AccountSessionProvider } from "@/components/account/account-session-provider";
import { PersonalizationProvider } from "@/components/personalization/personalization-provider";
import { JourneyUpdateNotice } from "@/components/personalization/journey-update-notice";
import { SavedContentProvider } from "@/components/saved-content/saved-content-provider";
import { GlossaryStudyProvider } from "@/components/glossary-study/glossary-study-provider";
import { ChecklistProgressProvider } from "@/components/roadmap/checklist-progress-provider";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { ReadingAidProvider } from "@/components/localization/reading-aid-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-stone-50 text-slate-900 antialiased">
        <ContentLocaleProvider>
          <ReadingAidProvider>
            <PersonalizationProvider>
          <SavedContentProvider>
            <GlossaryStudyProvider>
              <ChecklistProgressProvider>
                <AccountSessionProvider>
                  <AccountContentSyncProvider>
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
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
