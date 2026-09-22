import "server-only";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

export const PROJECT_COOKIE = "form_charleston_access";
export const SESSION_SECONDS = 24 * 60 * 60;
const deriveKey = promisify(scrypt);

function credentials() {
  const hash = process.env.FORM_CHARLESTON_PASSWORD_HASH ?? "";
  const secret = process.env.PROJECT_SESSION_SECRET ?? "";
  if (!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash) || secret.length < 32) {
    return null;
  }
  return { hash, secret };
}

export function accessConfigured() {
  return credentials() !== null;
}

export async function verifyProjectPassword(password: string) {
  const config = credentials();
  if (!config || password.length > 256 || !password.length) return false;
  const [, salt, expected] = config.hash.split(":");
  const actual = await deriveKey(password, salt, 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

function sign(payload: string, config: NonNullable<ReturnType<typeof credentials>>) {
  // Password rotation also invalidates all previously issued sessions.
  return createHmac("sha256", config.secret)
    .update(`form-charleston:${config.hash}:${payload}`)
    .digest("hex");
}

export function createProjectSession() {
  const config = credentials();
  if (!config) throw new Error("Project access is not configured");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${expires}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${sign(payload, config)}`;
}

export async function hasProjectAccess() {
  const token = (await cookies()).get(PROJECT_COOKIE)?.value;
  const config = credentials();
  if (!token || !config || !/^\d{10}\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(token)) return false;
  const [expires, nonce, signature] = token.split(".");
  const now = Math.floor(Date.now() / 1000);
  if (Number(expires) <= now || Number(expires) > now + SESSION_SECONDS) return false;
  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(sign(`${expires}.${nonce}`, config), "hex"));
}

export const projectCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
