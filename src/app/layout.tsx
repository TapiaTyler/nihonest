import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PersonalizationProvider } from "@/components/personalization/personalization-provider";
import { SavedContentProvider } from "@/components/saved-content/saved-content-provider";
import { GlossaryStudyProvider } from "@/components/glossary-study/glossary-study-provider";
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
        <PersonalizationProvider>
          <SavedContentProvider>
            <GlossaryStudyProvider>
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            </GlossaryStudyProvider>
          </SavedContentProvider>
        </PersonalizationProvider>
      </body>
    </html>
  );
}
