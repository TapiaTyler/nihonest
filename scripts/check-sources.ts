import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { sources } from "@/data/sources";
import {
  recordSourceCheck,
  sourceMonitoringStateSchema,
  type SourceMonitoringState,
} from "@/domain/source/source-monitoring";
import { checkSource } from "@/lib/source-monitoring/source-checker";

const statePath = resolve(process.cwd(), "content/source-monitoring/state.json");
const cachePath = resolve(process.cwd(), ".source-monitoring/cache");

type CliOptions = Readonly<{
  sourceIds: readonly string[];
  all: boolean;
  dryRun: boolean;
}>;

function parseArguments(argumentsToParse: readonly string[]): CliOptions {
  const sourceIds: string[] = [];
  let all = false;
  let dryRun = false;

  for (let index = 0; index < argumentsToParse.length; index += 1) {
    const argument = argumentsToParse[index]!;
    if (argument === "--all") all = true;
    else if (argument === "--dry-run") dryRun = true;
    else if (argument === "--source") {
      const sourceId = argumentsToParse[index + 1];
      if (!sourceId) throw new Error("--source requires a source ID.");
      sourceIds.push(sourceId);
      index += 1;
    }
    else if (argument.startsWith("--source=")) sourceIds.push(argument.slice("--source=".length));
    else throw new Error(`Unknown option "${argument}".`);
  }

  if (all && sourceIds.length > 0) throw new Error("Use either --all or --source, not both.");
  if (!all && sourceIds.length === 0) {
    throw new Error("Choose at least one source with --source <id>, or explicitly use --all.");
  }
  return { sourceIds: [...new Set(sourceIds)], all, dryRun };
}

async function readState(): Promise<SourceMonitoringState> {
  return sourceMonitoringStateSchema.parse(JSON.parse(await readFile(statePath, "utf8")));
}

async function saveState(state: SourceMonitoringState): Promise<void> {
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

async function main(): Promise<void> {
  const options = parseArguments(process.argv.slice(2));
  const requestedIds = new Set(options.sourceIds);
  const selectedSources = options.all ? sources : sources.filter(({ id }) => requestedIds.has(id));
  const missingIds = options.sourceIds.filter((id) => !sources.some((source) => source.id === id));
  if (missingIds.length > 0) throw new Error(`Unknown source ID(s): ${missingIds.join(", ")}.`);

  let state = await readState();
  for (const source of selectedSources) {
    const result = await checkSource(source, {
      accepted: state.sources[source.id]?.accepted,
      onSnapshot: options.dryRun ? undefined : async (snapshot, content) => {
        const sourceCachePath = join(cachePath, source.id);
        await mkdir(sourceCachePath, { recursive: true });
        await writeFile(join(sourceCachePath, snapshot.fingerprint), content);
      },
    });
    console.log(`[${result.status}] ${source.id}: ${result.detail}`);
    state = recordSourceCheck(state, result);
    // Saving after each source preserves completed observations if a deliberate --all run is interrupted.
    if (!options.dryRun) await saveState(state);
  }

  console.log(options.dryRun
    ? `Checked ${selectedSources.length} source(s); dry run left repository state unchanged.`
    : `Checked ${selectedSources.length} source(s); review content/source-monitoring/state.json.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "The source check failed.");
  process.exitCode = 1;
});
