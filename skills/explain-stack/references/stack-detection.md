# Stack detection

Goal: build a complete and accurate inventory quickly, with evidence. Read-only.

## 1. Find the project shape

- List the root. Note monorepo signs (`apps/`, `packages/`, `services/`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`) and separate parts (`frontend/`, `backend/`, `web/`, `api/`, `mobile/`).
- Read `README*`, and if present `docs/`, `ARCHITECTURE*`, `CLAUDE.md` and `AGENTS.md`, for the intended purpose and stated reasons for choices.
- Skip: `node_modules/`, `.venv/`, `venv/`, `dist/`, `build/`, `.next/`, `__pycache__/`, `vendor/`, `target/`, binaries, datasets, images, office files.
- Never open `.env*` (except `.env.example` / `.env.sample`), `*.pem`, `*.key`, `credentials*`, `secrets.*`, `*.db`, `*.sqlite`.

## 2. Read manifests (each part of a monorepo separately)

| Ecosystem | Files | Notes |
|---|---|---|
| JS/TS | `package.json` (deps vs devDeps, `scripts`), lock file name (npm/pnpm/yarn/bun), `tsconfig.json`, `vite.config.*`, `next.config.*`, `tailwind.config.*`, `eslint*`, `prettier*` | `scripts` show how it's run/built/tested |
| Python | `pyproject.toml`, `requirements*.txt`, `uv.lock`/`poetry.lock`, `setup.cfg`, `alembic.ini`, `pytest.ini` | |
| Go | `go.mod` | |
| Rust | `Cargo.toml` | |
| Java/Kotlin | `pom.xml`, `build.gradle*` | |
| PHP / Ruby / .NET / Dart | `composer.json`, `Gemfile`, `*.csproj`, `pubspec.yaml` | |

## 3. Infrastructure and services

- **Containers:** `Dockerfile`, `docker-compose*.yml`. The services listed there (postgres, redis, nginx…) are part of the stack even if not in a manifest.
- **Hosting/CI:** `vercel.json`, `netlify.toml`, `fly.toml`, `render.yaml`, `Procfile`, `.github/workflows/*`, `deploy/`.
- **Database:** `prisma/schema.prisma`, `drizzle.config.*`, `migrations/`, `alembic/`, `supabase/`, `schema.sql`.
- **External services:** names of env variables in `.env.example` or code (`STRIPE_*`, `OPENAI_API_KEY`, `SUPABASE_URL`, `SENTRY_DSN`…). Names only, never values.

## 4. Confirm usage with evidence

For every important dependency:
1. Grep for its import/require (`from "x"`, `import x`, `require("x")`, `from x import`) in source folders. Always exclude `.env*` and other secret files from the search (`glob: "!**/.env*"`), so a match never prints a secret value.
2. Record 1–3 files where it is used and what it does there (e.g. "`src/api/client.ts` creates the axios instance with the auth header").
3. If there are no imports and it's not a CLI/plugin used via config or scripts, mark it **possibly unused**.
4. Look for **why** evidence: README sentences, comments, config, commit messages (`git log --oneline -30`, if it's a git repo).

## 5. Categories

Use these groups (skip empty ones):
1. **Frontend / UI**: framework, styling, components, state, routing, forms, data fetching
2. **Backend / API**: language, framework, validation, auth
3. **Data**: database, ORM/query builder, migrations, cache, search/vector DB, file storage
4. **Background & real-time**: queues, workers, schedulers, websockets/SSE
5. **External services & AI**: payments, email, AI APIs, analytics, monitoring
6. **Developer tools**: package manager, bundler, TypeScript, linter/formatter, tests
7. **Infrastructure**: Docker, hosting, CI/CD, reverse proxy
