import { NextRequest, NextResponse } from "next/server";
import { accessConfigured, createProjectSession, PROJECT_COOKIE, projectCookieOptions, verifyProjectPassword } from "../../../src/lib/projectAccess";
import { takePasswordAttempt } from "../../../src/lib/projectRateLimit";

export const runtime = "nodejs";

function reply(message: string, status: number, retryAfter?: number) {
  return NextResponse.json({ message }, {
    status,
    headers: { "Cache-Control": "private, no-store", ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}) },
  });
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return reply("Request not allowed.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply("Invalid request.", 400);

  // Stream with a hard cap; do not trust a caller-supplied Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return reply("Please enter a password.", 400);
  let body = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 2048) {
        await reader.cancel();
        return reply("Invalid request.", 413);
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    const data = JSON.parse(body);

    if (data.action === "lock") {
      const response = reply("Project locked.", 200);
      response.cookies.set(PROJECT_COOKIE, "", { ...projectCookieOptions, maxAge: 0 });
      return response;
    }
    if (typeof data.password !== "string" || !data.password.length || data.password.length > 256) {
      return reply("Please enter a valid password.", 400);
    }
    if (!accessConfigured()) return reply("Access is temporarily unavailable. Please request access below.", 503);
    const limit = await takePasswordAttempt();
    if (!limit.allowed) return reply("Too many attempts. Please try again in 15 minutes.", 429, limit.retryAfter);
    if (!await verifyProjectPassword(data.password)) return reply("That password is incorrect. Please try again.", 401);

    const response = reply("Project unlocked.", 200);
    response.cookies.set(PROJECT_COOKIE, createProjectSession(), projectCookieOptions);
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) return reply("Invalid request.", 400);
    // Missing secrets or unavailable shared storage must never grant access.
    return reply("Access is temporarily unavailable. Please try again later or request access below.", 503);
  }
}
