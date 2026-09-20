import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const registryDirectory = resolve(process.cwd(), "src/lib/content/article-registry");

async function readRegistrationModules() {
  const moduleNames = (await readdir(registryDirectory))
    .filter((file) => file.endsWith(".ts") && file !== "registration.ts")
    .sort();
  return Promise.all(moduleNames.map(async (file) => ({
    file,
    content: await readFile(resolve(registryDirectory, file), "utf8"),
  })));
}

describe("article catalog", () => {
  it("does not use unsupported pipe-table syntax in article MDX", async () => {
    const directory = resolve(process.cwd(), "content/articles");
    const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx"));
    const invalidFiles: string[] = [];

    for (const file of files) {
      const content = await readFile(resolve(directory, file), "utf8");
      if (/^\s*\|.*\|\s*$/m.test(content)) invalidFiles.push(file);
    }

    expect(invalidFiles).toEqual([]);
  });

  it("statically registers every article MDX file exactly once", async () => {
    const articleFiles = (await readdir(resolve(process.cwd(), "content/articles")))
      .filter((file) => file.endsWith(".mdx"))
      .sort();
    const modules = await readRegistrationModules();
    const registeredFiles = modules
      .flatMap(({ content }) => [...content.matchAll(/content\/articles\/(.+?\.mdx)";/g)].map((match) => match[1]))
      .sort();

    expect(registeredFiles).toEqual(articleFiles);
    expect(new Set(registeredFiles).size).toBe(registeredFiles.length);
  });

  it("assembles every registration family once in the compatibility catalog", async () => {
    const catalog = await readFile(resolve(process.cwd(), "src/lib/content/articles.ts"), "utf8");
    const modules = await readRegistrationModules();

    for (const { file, content } of modules) {
      const exportName = content.match(/export const (\w+) = \[/)?.[1];
      expect(exportName, `${file} must expose one registration array`).toBeDefined();
      expect(catalog.match(new RegExp(`\\.\\.\\.${exportName}`, "g"))).toHaveLength(1);
    }
  });
});
