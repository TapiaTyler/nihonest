import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { mdxMetadataPlugin } from "./src/test/mdx-metadata-plugin";

export default defineConfig({
  // Article MDX is imported for metadata only; Vitest has no MDX compiler.
  plugins: [mdxMetadataPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./src/test/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
