import { withCmsFileLock } from "./write-locks";
/** Guarded, literal-only English supplement edits in one registered location module. */
import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, realpath, rename, rm, stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { localGuidanceSupplementSchema, type LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import { structuredEditorialRevision } from "@/lib/editorial/editorial-catalog";
import { CmsEditError } from "./article-writer";
import { guardCmsWrite, noteCmsWrite } from "./git-session";
import { noteCmsLocalGuidanceWrite, readLocalGuidanceCatalog, type LocalGuidanceDetail } from "./local-guidance-catalog";

export type LocalGuidanceContentEdit = Readonly<{
  expectedRevision: string;
  expectedSourceRevision: string;
  fields: Record<string, unknown>;
}>;

const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const revision = /^[a-f0-9]{64}$/;
const scalarFields = ["title", "summary", "applicability", "responsibleBody", "receivingOffice", "sourceFormatNote"] as const;
type ScalarField = (typeof scalarFields)[number];
const hash = (source: string) => createHash("sha256").update(source).digest("hex");
function validText(value: unknown, optional: boolean): value is string {
  return typeof value === "string" && Buffer.byteLength(value, "utf8") <= 20_000 && (optional || Boolean(value.trim()));
}

function validatedFields(current: LocalGuidanceSupplement, submitted: Record<string, unknown>) {
  const next = { ...current, actions: current.actions.map((action) => ({ ...action })) };
  const edits: { field: string; value: string }[] = [];
  for (const [key, value] of Object.entries(submitted)) {
    if (key === "actions") {
      if (!Array.isArray(value) || value.length !== current.actions.length || !value.length
        || value.some((action) => !action || typeof action !== "object" || Array.isArray(action)
          || Object.keys(action).some((name) => name !== "title" && name !== "description")
          || !validText(action.title, false) || !validText(action.description, false))) {
        throw new CmsEditError("Actions must retain their count and have nonempty titles and descriptions.", 422);
      }
      value.forEach((action, index) => {
        const changed = action as { title: string; description: string };
        if (changed.title !== current.actions[index]!.title) edits.push({ field: `actions.${index}.title`, value: changed.title });
        if (changed.description !== current.actions[index]!.description) edits.push({ field: `actions.${index}.description`, value: changed.description });
      });
      next.actions = value as { title: string; description: string }[];
      continue;
    }
    if (!(scalarFields as readonly string[]).includes(key)) throw new CmsEditError(`Field ${key} is not editable here.`, 422);
    const optional = key === "receivingOffice" || key === "sourceFormatNote";
    if (!validText(value, optional)) throw new CmsEditError(`${key} must contain valid text.`, 422);
    const normalized = optional && !value.trim() ? undefined : value;
    if (normalized !== current[key as ScalarField]) edits.push({ field: key, value: normalized ?? "" });
    if (normalized === undefined) delete (next as unknown as Record<string, unknown>)[key];
    else (next as unknown as Record<string, unknown>)[key] = normalized;
  }
  const parsed = localGuidanceSupplementSchema.safeParse(next);
  if (!parsed.success) throw new CmsEditError("The proposed supplement does not pass content validation.", 422);
  return { value: parsed.data, edits };
}

function patchLiteralFields(source: string, detail: LocalGuidanceDetail, edits: readonly { field: string; value: string }[]) {
  const ranges = detail.source.fieldValues;
  const patches: { start: number; end: number; text: string }[] = [];
  const insertions: string[] = [];
  for (const edit of edits) {
    const range = ranges[edit.field];
    if (range) {
      if (edit.value) patches.push({ start: range[0], end: range[1], text: JSON.stringify(edit.value) });
      else {
        if (edit.field !== "receivingOffice" && edit.field !== "sourceFormatNote") {
          throw new CmsEditError(`The ${edit.field} field cannot be empty.`, 422);
        }
        const property = detail.source.fieldProperties[edit.field];
        if (!property) throw new CmsEditError(`Cannot safely remove ${edit.field}.`, 422);
        let [start, end] = property;
        const trailing = /^\s*,/.exec(source.slice(end, detail.source.objectEnd));
        if (trailing) end += trailing[0].length;
        else {
          const before = source.slice(detail.source.objectStart + 1, start);
          const commaAt = before.lastIndexOf(",");
          if (commaAt < 0 || before.slice(commaAt + 1).trim()) throw new CmsEditError(`Cannot safely remove ${edit.field}.`, 422);
          start = detail.source.objectStart + 1 + commaAt;
        }
        patches.push({ start, end, text: "" });
      }
    } else if ((edit.field === "receivingOffice" || edit.field === "sourceFormatNote") && edit.value) {
      insertions.push(`${edit.field}: ${JSON.stringify(edit.value)}`);
    } else {
      throw new CmsEditError(`The ${edit.field} source field cannot be safely edited. Use the TypeScript source.`, 422);
    }
  }
  if (insertions.length) {
    const { objectStart, objectEnd } = detail.source;
    if (objectStart === undefined || objectEnd === undefined) throw new CmsEditError("Cannot safely add a source field.", 422);
    let position = objectEnd - 1;
    while (position > objectStart && /\s/.test(source[position - 1]!)) position -= 1;
    const comma = source.slice(objectStart + 1, position).trimEnd().endsWith(",") ? "" : ",";
    patches.push({ start: position, end: position, text: `${comma} ${insertions.join(", ")}` });
  }
  let next = source;
  for (const patch of patches.sort((a, b) => b.start - a.start)) next = next.slice(0, patch.start) + patch.text + next.slice(patch.end);
  return next;
}

async function saveUnlocked(projectRoot: string, id: string, input: LocalGuidanceContentEdit) {
  if (!stableId.test(id) || !revision.test(input.expectedRevision) || !revision.test(input.expectedSourceRevision)) {
    throw new CmsEditError("Invalid supplement ID or revision.", 400);
  }
  if (!input.fields || typeof input.fields !== "object" || Array.isArray(input.fields) || !Object.keys(input.fields).length) {
    throw new CmsEditError("Choose an English content field to change.", 422);
  }
  const catalog = await readLocalGuidanceCatalog(projectRoot);
  const detail = catalog.details.get(id);
  if (!detail) {
    if (catalog.failures.some(({ error }) => error.includes("changed outside the CMS"))) {
      throw new CmsEditError("A location file changed outside the CMS. Restart before editing it.", 409);
    }
    throw new CmsEditError("Supplement not found or its location cannot be parsed. Restart after external changes.", 404);
  }
  if (detail.revision !== input.expectedRevision || detail.source.sourceRevision !== input.expectedSourceRevision) {
    throw new CmsEditError("The supplement or its location file changed. Refresh before editing.", 409);
  }
  const canonicalDirectory = await realpath(resolve(projectRoot, "src/data/local-guidance/locations"));
  const target = await realpath(resolve(projectRoot, detail.source.path));
  if (!target.startsWith(`${canonicalDirectory}${sep}`)) throw new CmsEditError("Location path escapes the canonical directory.", 403);
  return withCmsFileLock(target, async () => {
    const original = await readFile(target, "utf8");
    if (hash(original) !== input.expectedSourceRevision) throw new CmsEditError("The location file changed while loading. Refresh.", 409);
    const proposed = validatedFields(detail.value, input.fields);
    if (!proposed.edits.length) return { changed: false, revision: detail.revision, sourceRevision: detail.source.sourceRevision };
    if (detail.sources.some((source) => source.language === "ja") && !proposed.value.sourceFormatNote) {
      throw new CmsEditError("A supplement citing a Japanese source needs its source-format note.", 422);
    }
    const next = patchLiteralFields(original, detail, proposed.edits);
    await guardCmsWrite(projectRoot, target);
    const cmsDirectory = resolve(projectRoot, ".cms");
    await mkdir(cmsDirectory, { recursive: true });
    if (await realpath(cmsDirectory) !== join(await realpath(projectRoot), ".cms")) {
      throw new CmsEditError("CMS temporary directory escapes the checkout.", 403);
    }
    const temporaryPath = join(cmsDirectory, `${id}-${randomUUID()}.tmp`);
    try {
      const handle = await open(temporaryPath, "wx", (await stat(target)).mode);
      try { await handle.writeFile(next, "utf8"); await handle.sync(); }
      finally { await handle.close(); }
      if (hash(await readFile(target, "utf8")) !== input.expectedSourceRevision) {
        throw new CmsEditError("The location file changed during saving. Refresh.", 409);
      }
      await rename(temporaryPath, target);
    } finally { await rm(temporaryPath, { force: true }); }
    await noteCmsWrite(projectRoot, target);
    noteCmsLocalGuidanceWrite(projectRoot, id, proposed.value, hash(next));
    return { changed: true, revision: structuredEditorialRevision(proposed.value), sourceRevision: hash(next) };
  });
}

export async function saveLocalGuidanceContent(projectRoot: string, id: string, input: LocalGuidanceContentEdit) {
  return saveUnlocked(projectRoot, id, input);
}
