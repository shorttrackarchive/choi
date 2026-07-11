import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const command = process.argv[2] || "dev";
const binName = process.platform === "win32" ? "vinext.CMD" : "vinext";
const localBin = join(process.cwd(), "node_modules", ".bin", binName);
const pnpmDir = join(process.cwd(), "node_modules", ".pnpm");

function findVinextCli() {
  if (!existsSync(pnpmDir)) return null;

  const entry = readdirSync(pnpmDir, { withFileTypes: true }).find(
    (item) => item.isDirectory() && item.name.startsWith("vinext@"),
  );

  if (!entry) return null;

  const cliPath = join(
    pnpmDir,
    entry.name,
    "node_modules",
    "vinext",
    "dist",
    "cli.js",
  );

  return existsSync(cliPath) ? cliPath : null;
}

const fallbackCli = findVinextCli();

if (!existsSync(localBin) && !fallbackCli) {
  console.error("vinext executable was not found. Run pnpm install first.");
  process.exit(1);
}

const child = fallbackCli
  ? spawn(process.execPath, [fallbackCli, command], {
      stdio: "inherit",
      env: {
        ...process.env,
        WRANGLER_LOG_PATH:
          process.env.WRANGLER_LOG_PATH || ".wrangler/wrangler.log",
      },
    })
  : spawn(localBin, [command], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    WRANGLER_LOG_PATH:
      process.env.WRANGLER_LOG_PATH || ".wrangler/wrangler.log",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
