/** Starts the local editorial CMS on the loopback interface only. It writes canonical content files; see tools/cms/README.md. */
import { resolve } from "node:path";
import { startGitSession } from "../tools/cms/git-session";
import { createCmsServer } from "../tools/cms/server";

const projectRoot = resolve(import.meta.dirname, "..");
const port = Number(process.env.CMS_PORT ?? "4177");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("CMS_PORT must be an integer from 1 to 65535.");
}

const server = createCmsServer(projectRoot);
const stop = () => server.close();
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
server.listen(port, "127.0.0.1", () => {
  console.log(`Nihonest local editorial CMS: http://127.0.0.1:${port} (open this exact address; other host names are refused)`);
  startGitSession(projectRoot).then(({ identity }) => {
    console.log(`Session: ${identity.worktree} on ${identity.branch} at ${identity.startCommit.slice(0, 12)}.`);
    if (identity.dirtyAtStart.length) {
      console.log(`${identity.dirtyAtStart.length} file(s) already had uncommitted changes; the CMS will not write them this session:`);
      for (const path of identity.dirtyAtStart) console.log(`  ${path}`);
    }
  }, () => undefined);
});
