/** Starts the read-only CMS foundation on the loopback interface only. */
import { resolve } from "node:path";
import { createCmsServer } from "../tools/cms/server";

const projectRoot = resolve(import.meta.dirname, "..");
const port = Number(process.env.CMS_PORT ?? "4177");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("CMS_PORT must be an integer from 1 to 65535.");
}

const server = createCmsServer(projectRoot);
server.listen(port, "127.0.0.1", () => {
  console.log(`Nihonest CMS foundation (read-only): http://127.0.0.1:${port}`);
});
