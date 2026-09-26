// Some Windows hosts report uv_os_get_passwd/ENOMEM when tsx asks Node for a temporary-directory username.
// Scope this fallback to the CMS process; all other userInfo failures still propagate.
// Node's --require preload must be CommonJS so it runs before the tsx ESM loader.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const os = require("node:os");
const originalUserInfo = os.userInfo;
os.userInfo = function userInfoWithHostFallback(options) {
  try {
    return originalUserInfo(options);
  } catch (error) {
    if (process.platform !== "win32" || error?.info?.syscall !== "uv_os_get_passwd") throw error;
    return { uid: -1, gid: -1, username: process.env.USERNAME || "local", homedir: os.homedir(), shell: null };
  }
};
