/** Checks that the local CMS never reaches the public Next.js application (docs/LOCAL-CMS-REQUIREMENTS.md §9 and §11). */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

/** Strings that exist only in CMS code. Finding one in the application source or build output means the CMS leaked in. */
export const cmsMarkers = ["x-cms-token", "X-CMS-Token", "tools/cms", "createCmsServer", "Nihonest local editorial CMS"] as const;

async function* files(directory: string, skip: (path: string) => boolean): AsyncGenerator<string> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (skip(path)) continue;
    if (entry.isDirectory()) yield* files(path, skip);
    else if (entry.isFile()) yield path;
  }
}

export type BoundaryFinding = Readonly<{ path: string; marker: string }>;

/** Scans text files under `directory` for CMS markers, skipping files larger than `maxBytes`. */
export async function findCmsMarkers(projectRoot: string, directory: string, options: Readonly<{
  skip?: (relativePath: string) => boolean; maxBytes?: number; extensions?: readonly string[];
}> = {}): Promise<readonly BoundaryFinding[]> {
  const findings: BoundaryFinding[] = [];
  const skip = (path: string) => options.skip?.(relative(projectRoot, path).split(sep).join("/")) ?? false;
  for await (const path of files(join(projectRoot, directory), skip)) {
    if (options.extensions && !options.extensions.some((extension) => path.endsWith(extension))) continue;
    if ((await stat(path)).size > (options.maxBytes ?? 20_000_000)) continue;
    const text = await readFile(path, "utf8");
    for (const marker of cmsMarkers) {
      if (text.includes(marker)) findings.push({ path: relative(projectRoot, path).split(sep).join("/"), marker });
    }
  }
  return findings;
}
