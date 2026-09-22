import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHmac } from "node:crypto";

const base = "http://localhost:3100";
const route = `${base}/work/form-charleston`;
const privateSentence = "The central experience question";
const password = readFileSync(".form-charleston-access.local.txt", "utf8").match(/^Password: (.+)$/m)[1];
const post = (body, options = {}) => fetch(`${base}/api/project-access`, {
  method: "POST",
  headers: { Origin: base, "Content-Type": "application/json", ...options.headers },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

test("protected project authorization and public project regression", async () => {
  const anonymous = await fetch(route);
  assert.equal(anonymous.status, 200);
  const html = await anonymous.text();
  assert.match(html, /Good work/);
  assert.ok(!html.includes(privateSentence));
  assert.match(anonymous.headers.get("x-robots-tag"), /noindex/);
  assert.ok(!html.includes(process.env.FORM_CHARLESTON_PASSWORD_HASH));

  const rsc = await fetch(`${route}?_rsc=access-test`, { headers: { RSC: "1" } });
  assert.ok(!(await rsc.text()).includes(privateSentence));
  for (const slug of ["blueshield", "cryptolabs-otc", "activate-camera"]) {
    const response = await fetch(`${base}/work/${slug}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Selected contribution/);
  }
  assert.equal((await fetch(`${base}/work/unknown-project`)).status, 404);
  assert.equal((await post({ password }, { headers: { Origin: "https://other.example" } })).status, 403);
  assert.equal((await post("{")).status, 400);
  assert.equal((await post({ password: "a".repeat(3000) })).status, 413);
  assert.equal((await post({ password: "incorrect-password" })).status, 401);

  const unlocked = await post({ password });
  assert.equal(unlocked.status, 200);
  const setCookie = unlocked.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=strict/i);
  assert.match(setCookie, /Max-Age=86400/i);
  const cookie = setCookie.split(";")[0];
  const content = await fetch(route, { headers: { Cookie: cookie } });
  assert.ok((await content.text()).includes(privateSentence));
  const privateRsc = await fetch(`${route}?_rsc=access-test`, { headers: { Cookie: cookie, RSC: "1" } });
  assert.ok((await privateRsc.text()).includes(privateSentence));
  const nextAnonymous = await fetch(route);
  assert.ok(!(await nextAnonymous.text()).includes(privateSentence), "private response must not leak into a public cache");

  const badCookie = cookie.slice(0, -1) + (cookie.endsWith("0") ? "1" : "0");
  assert.ok(!(await (await fetch(route, { headers: { Cookie: badCookie } })).text()).includes(privateSentence));
  const payload = `${Math.floor(Date.now() / 1000) - 1}.${"a".repeat(32)}`;
  const signature = createHmac("sha256", process.env.PROJECT_SESSION_SECRET).update(`form-charleston:${process.env.FORM_CHARLESTON_PASSWORD_HASH}:${payload}`).digest("hex");
  const expired = `form_charleston_access=${payload}.${signature}`;
  assert.ok(!(await (await fetch(route, { headers: { Cookie: expired } })).text()).includes(privateSentence));

  const locked = await post({ action: "lock" }, { headers: { Cookie: cookie } });
  assert.equal(locked.status, 200);
  assert.match(locked.headers.get("set-cookie"), /Max-Age=0/i);
  for (let i = 0; i < 8; i++) assert.equal((await post({ password: "incorrect-password" })).status, 401);
  const limited = await post({ password });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
});
