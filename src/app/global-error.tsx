"use client";

import { useEffect } from "react";

/**
 * Last-resort fallback when the root layout itself fails. It replaces the whole document, so it carries its own
 * markup and styles, and cannot read the saved language: it shows English with a Japanese line beneath.
 */
export default function GlobalError({ error, retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const button = { minHeight: 48, padding: "0 24px", borderRadius: 999, border: 0, background: "#115e59", color: "#fff", font: "600 16px system-ui, sans-serif", cursor: "pointer" } as const;
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fafaf9", color: "#0f172a", font: "16px/1.7 system-ui, sans-serif" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px" }}>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "0 0 16px" }}>That page didn&apos;t load.</h1>
          <p style={{ margin: "0 0 8px", color: "#475569" }}>This is a problem on our side, not something you did. Try again, or start from the home page.</p>
          <p lang="ja" style={{ margin: "0 0 32px", color: "#475569" }}>ページを読み込めませんでした。もう一度お試しください。</p>
          <button type="button" onClick={() => retry()} style={button}>Try again / もう一度試す</button>
        </main>
      </body>
    </html>
  );
}
