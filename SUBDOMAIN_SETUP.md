# Subdomain Setup Guide

This guide explains how to configure wildcard subdomains for the site, set the required environment variables, and understand how the middleware processes incoming requests.

---

## Prerequisites

- A deployed Next.js application (Vercel or similar).
- Access to DNS management for your domain (e.g., nazzelandavionna.site).
- Ability to configure environment variables for your deployment.

---

## 1. DNS Configuration

### Wildcard Subdomain (Recommended)

1. Sign in to your DNS provider.
2. Create a new record:
   - **Type**: `CNAME`
   - **Name**: `*`
   - **Value**: Your hosting endpoint (e.g., `cname.vercel-dns.com` for Vercel).
3. Ensure the root domain (`@`) also points to the hosting endpoint (A or CNAME depending on your provider).

> Tip: DNS propagation can take up to 24 hours. Use tools like `dig` or `nslookup` to verify.

### Specific Subdomains (Optional)

For individual subdomains (e.g., `blog` or `info`), create additional records with **Name** set to the subdomain and **Type**/ **Value** following your provider’s requirements.

---

## 2. Environment Variables

Set the following variables in your deployment platform (Vercel dashboard, `.env.local` for development, etc.).

### Required

- `NEXT_PUBLIC_SITE_URL`
  - Apex domain used to derive the wildcard host matcher.
  - Example: `https://www.nazzelandavionna.site`

### Optional

- `NEXT_PUBLIC_DIRECT_HOSTS`
  - Comma-separated list of hosts that should bypass subdomain handling.
  - Example: `forum.nazzelandavionna.site,internal.example.com`
  - Useful when certain hosts should not receive the `x-subdomain` header.
- `NEXT_PUBLIC_SUBDOMAIN_ROUTES`
  - Comma-separated `subdomain=/target/path` pairs defining how each subdomain should resolve.
  - Example: `docs=/knowledge-base,blog=/stories`
  - When at least one entry is present, subdomains without explicit mappings fall back to a same-name path (e.g., `gallery.domain.com` → `/gallery`). If this variable is empty, requests hit the core site paths without rewriting.

> Important: Do **not** include protocol prefixes (`https://`) in `NEXT_PUBLIC_DIRECT_HOSTS`.

---

## 3. Middleware Overview

The middleware (`middleware.ts`) inspects every request:

1. Reads the `Host` header and splits out the hostname.
2. Checks if the host is in the allowed list (apex, `www`, direct hosts, localhost).
3. If not, verifies that the host matches `*.apex-domain`.
4. Extracts the subdomain portion (e.g., `blog` from `blog.nazzelandavionna.site`).
5. Adds `x-subdomain` to the request headers so pages/API routes can respond to subdomain-specific logic.
6. Rewrites subdomains based on the mapping list supplied via `NEXT_PUBLIC_SUBDOMAIN_ROUTES`. When mappings exist, any subdomain without a specific entry falls back to a same-name path (e.g., `gallery.domain.com` → `/gallery`).

Any path requested after the subdomain is appended to the resolved base path. For example, `home.domain.com/about` renders the content from `/home/about`.

### Match Configuration

```ts
export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\..*).*)"],
}
```

- Only applies the middleware to dynamic routes.
- Skips static assets and Next.js internals.

### Accessing the Subdomain

Use `headers()` in a server component or handler to read the header:

```tsx
import { headers } from "next/headers"

export function Example() {
  const subdomain = headers().get("x-subdomain")
  return <span>Current subdomain: {subdomain ?? "none"}</span>
}
```

---

## 4. Local Development

- Add `localhost` and `127.0.0.1` to `NEXT_PUBLIC_DIRECT_HOSTS` if you need to bypass subdomain logic while testing locally.
- To simulate subdomains locally, edit your `hosts` file to map entries like `foo.localhost` to `127.0.0.1`.
- Alternatively, use services like `lvh.me` or `nip.io` which resolve wildcard subdomains to localhost automatically.

---

## 5. Verification Checklist

- DNS wildcard record is live (check via `dig *.yourdomain.com`).
- Environment variables set correctly in production.
- Middleware deployed and requests return `x-subdomain` when using subdomains.
- Application logic consumes the header as needed.

---

## 6. Troubleshooting

- **No subdomain detected**: Confirm DNS propagation and ensure the request host matches `*.apex-domain`.
- **Unexpected redirects**: Confirm the subdomain is not in `NEXT_PUBLIC_DIRECT_HOSTS`.
- **TypeScript errors about `process`**: Install Node.js types (`npm i -D @types/node`) or ensure `tsconfig.json` references the correct `lib` entries.
- **Middleware not running**: Verify `middleware.ts` is at the repo root and the matcher covers your route.

---

By following this guide, all pages in the application can safely handle requests coming from different subdomains while maintaining consistent behavior for primary hosts.
