import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the tribute page", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /최민정/);
  assert.match(html, /최민정이 남긴 기록/);
  assert.match(html, /우리가 기억하는 순간/);
  assert.match(html, /오랫동안 기억하겠습니다/);
  assert.match(html, /\/images\/tribute\/hero\/hero-01\.jpg/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders the moderation page", async () => {
  const response = await render("/admin");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /메시지 관리자/);
  assert.match(html, /Supabase Auth/);
});

test("keeps content and image slots editable outside components", async () => {
  const [dataFile, packageJson, guide, schema] = await Promise.all([
    readFile(new URL("../src/data/tributeData.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../docs/content-entry-guide.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/supabase-schema.sql", import.meta.url), "utf8"),
  ]);

  assert.match(dataFile, /careerSummary/);
  assert.match(dataFile, /highlights/);
  assert.match(dataFile, /quotes/);
  assert.match(dataFile, /CLOSING IMAGE/);
  assert.match(guide, /src\/data\/tributeData\.ts/);
  assert.match(schema, /create table if not exists public\.fan_messages/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("../public/images/tribute/highlights/.gitkeep", import.meta.url));
});
