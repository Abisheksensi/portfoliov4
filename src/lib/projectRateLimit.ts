import "server-only";

const WINDOW_SECONDS = 15 * 60;
const LIMIT = 10;
let localWindow = { attempts: 0, expires: 0 };

// An atomic shared bucket avoids trusting spoofable client IP headers.
// It allows 10 password submissions globally per 15 minutes.
const script = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('TTL', KEYS[1])}
`;

export async function takePasswordAttempt() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    if (!url.startsWith("https://")) throw new Error("Secure rate-limit storage required");
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, "1", "portfolio:form-charleston:attempts:v1", String(WINDOW_SECONDS)]),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Rate-limit storage unavailable");
    const { result } = await response.json();
    if (!Array.isArray(result) || result.length !== 2 || !result.every(Number.isInteger) || result[1] < 0) {
      throw new Error("Invalid rate-limit response");
    }
    return { allowed: result[0] <= LIMIT, retryAfter: Math.max(1, result[1]) };
  }

  // Development only; production never falls back to per-instance memory.
  if (process.env.NODE_ENV !== "development") throw new Error("Rate-limit storage not configured");
  const now = Date.now();
  if (localWindow.expires <= now) localWindow = { attempts: 0, expires: now + WINDOW_SECONDS * 1000 };
  localWindow.attempts += 1;
  return { allowed: localWindow.attempts <= LIMIT, retryAfter: Math.ceil((localWindow.expires - now) / 1000) };
}
