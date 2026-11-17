// Local preview only. The site itself is plain static files with no build step.
//
// Vite's dev server treats unknown paths as a single-page app and answers them
// with the root index.html, so /omniguard (no trailing slash) would show the
// Cyber Mango homepage. Static hosts serve omniguard/index.html there, and this
// makes the local preview behave the same way.
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default {
  appType: "mpa",
  plugins: [
    {
      name: "serve-directory-index",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const [path, query] = (req.url || "/").split("?");
          const isCleanPath = !path.endsWith("/") && !path.split("/").pop().includes(".");
          if (isCleanPath && existsSync(join(root, path, "index.html"))) {
            req.url = `${path}/index.html${query ? `?${query}` : ""}`;
          }
          next();
        });
      },
    },
  ],
};
