# Form Charleston access

Form Charleston is checked on the server at `/work/form-charleston`, before the full case study is rendered. Other project pages remain public. The public homepage title and summary are intentionally public. Full project records are marked `server-only` and cannot be imported into client code.

## Local use

The initial local password is in `.form-charleston-access.local.txt`. Both that file and `.env.local` are ignored by Git. The local server uses the password hash and session signing secret from `.env.local`.

Access lasts 24 hours, uses an HTTP-only, SameSite=Strict cookie, and can be removed with **Lock project**. Production cookies also require HTTPS. Rotating either the password hash or the session secret invalidates all existing sessions on subsequent requests. Already viewed material cannot be recalled from a recipient.

## Vercel setup before publishing

Use the **Next.js** framework preset. Remove any Output Directory override pointing to `out`; this is now a Next.js server deployment, not a static export. Do not deploy the old `out/` folder or use the historical Sites static manifest for this version.

Set these server-only environment variables in Vercel, then redeploy:

- `FORM_CHARLESTON_PASSWORD_HASH`: copy the salted hash from `.env.local`, or generate a new one below.
- `PROJECT_SESSION_SECRET`: copy from `.env.local`, or generate with `openssl rand -hex 32`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: use an Upstash Redis database for the shared password-attempt limit.

Do not use a `NEXT_PUBLIC_` prefix. Do not upload the plaintext password file. Share the password directly with intended viewers.

The shared limit permits **10 password submissions across all visitors per 15-minute window**. It is deliberately independent of spoofable IP headers and limits distributed guessing, but one visitor can temporarily exhaust it for everyone. Only login attempts consume this budget; viewing an unlocked project does not. Redis failure or missing production configuration keeps new logins closed with a friendly unavailable message. Existing valid sessions remain valid. Development uses a local in-memory counter that resets on server restart.

## Choose a new password

Run `node scripts/hash-project-password.mjs`. Input is hidden. Copy the resulting hash to `FORM_CHARLESTON_PASSWORD_HASH` in `.env.local` and Vercel. The tool prints only the hash, never the password. Use a long, unique password. After rotation, update or remove your ignored local password note to avoid retaining outdated credentials.

## Media and publication boundaries

The current case study uses the same public portrait as the rest of the portfolio. That image is not confidential and remains public. There are currently no project-specific confidential media files. Never place future confidential screenshots, videos, PDFs, or source material in `public/`, or statically import them into client components. They need private storage and a server endpoint that checks `hasProjectAccess()` before serving bytes or issuing short-lived download links.

Noindex and no-store headers are applied to the private route, including its password screen. Protection applies to future requests on the new deployment; it cannot revoke files or pages already made public in old deployments. Before adding confidential work, remove any publicly accessible earlier copies and confirm your NDA allows sharing with the intended recipient.

## Verification

Run an isolated dev instance with `NEXT_BUILD_DIR=.next-access-check npx next dev --webpack --port 3100`, then `node --env-file=.env.local --test tests/project-access.test.mjs`. This checks anonymous and RSC responses, metadata, valid/invalid/tampered/expired access, logout, origin checks, all public projects, and attempt throttling. The tests intentionally exhaust the isolated login budget. Stop that instance afterwards.
