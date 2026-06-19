# Navio (FlyHigh Analytics)

Marketing-intelligence app built on **TanStack Start + TanStack Router**, with
**Supabase** as the data layer and deployed to **Cloudflare Workers**.

- **Live:** https://tanstack-start-app.antonsadlov.workers.dev
- **Frontend/SSR:** TanStack Start (file-based routes in `src/routes/`)
- **Data:** Supabase (schemas `core` / `app` / `public`), read mainly via the
  RPC `app.get_page_object`
- **Deploy:** Cloudflare Workers (`npm run build` with Node 20+, then
  `npx wrangler deploy`)

## Local development

```bash
nvm use 20      # Node 20+ is required for build/deploy
npm install
npm run dev
```

## ⚠️ Secrets / environment files — NEVER push `.env`

**The `.env` file must never be committed or pushed to GitHub.** It holds
secrets (Supabase keys, n8n webhook URLs/secrets, etc.). It lives **only** on
your local machine.

- `.env` (and `.env.*`) are listed in [`.gitignore`](.gitignore) and are
  intentionally untracked.
- Keep your real values locally; if a shared template is needed, commit a
  redacted `.env.example` instead (placeholder values only).
- Before any `git add` / commit, double-check `.env` is **not** staged:

  ```bash
  git status            # .env must NOT appear under "Changes to be committed"
  git ls-files .env     # must return nothing (i.e. not tracked)
  ```

If a secret ever lands in git history, rotate it (generate new keys) — removing
the file from future commits does not erase it from past commits.

### Server-side vs client-side env vars

- Server-only secrets (e.g. `N8N_*`): **never** use a `VITE_` prefix.
- Client-exposed values: use the `VITE_` prefix (these ship to the browser).
