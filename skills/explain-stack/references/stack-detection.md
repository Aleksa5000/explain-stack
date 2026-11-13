# Stack detection

Goal: build a complete, accurate and **detailed** picture of the project, with evidence for every claim. Read-only. Budget: about **25–35 file reads** in detailed mode (10–15 in quick mode). Read big files partially (offset/limit or Grep) and prefer files that show decisions.

## 1. Project shape and map

- List the root and the main source folders (Glob, 2 levels deep). Note monorepo signs (`apps/`, `packages/`, `services/`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`) and separate parts (`frontend/`, `backend/`, `web/`, `api/`, `mobile/`, `desktop/`).
- Build a **project map**: each important folder with what it contains in one line ("`backend/app/routers/`: one file per group of API endpoints"). Skip noise folders.
- Read `README*`, and if present `docs/`, `ARCHITECTURE*`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING*`: the intended purpose and the **stated reasons** for choices. Quote them when you explain "why".
- Skip: `node_modules/`, `.venv/`, `venv/`, `dist/`, `build/`, `.next/`, `__pycache__/`, `vendor/`, `target/`, binaries, datasets, images, office files, backups.
- Never open `.env*` (except `.env.example` / `.env.sample`), `*.pem`, `*.key`, `credentials*`, `secrets.*`, `*.db`, `*.sqlite`.

## 2. Manifests (each part of a monorepo separately)

| Ecosystem | Files | Notes |
|---|---|---|
| JS/TS | `package.json` (deps vs devDeps, `scripts`, `engines`), lock file name (npm/pnpm/yarn/bun), `tsconfig.json`, `vite.config.*`, `next.config.*`, `tailwind.config.*`, `eslint*`, `prettier*` | `scripts` show how it's run/built/tested |
| Python | `pyproject.toml`, `requirements*.txt`, `uv.lock`/`poetry.lock`, `setup.cfg`, `alembic.ini`, `pytest.ini` | pinned (`==`) vs ranges |
| Go | `go.mod` | |
| Rust | `Cargo.toml` | |
| Java/Kotlin | `pom.xml`, `build.gradle*` | |
| PHP / Ruby / .NET / Dart | `composer.json`, `Gemfile`, `*.csproj`, `pubspec.yaml` | |

Record the **major version** of each important technology (e.g. React 18 vs 19, Express 4 vs 5, Pydantic 1 vs 2) when it changes how the code is written.

## 3. Entry points and how it runs

- Find the **entry points**: server start (`app.listen`, `uvicorn.run`, `main.py`, `src/index.*`, `app/layout.tsx`, `manage.py`), workers, CLI scripts, desktop launchers.
- Find **how to run it**: `package.json` scripts, `Makefile`, `docker-compose*.yml`, `Procfile`, `.cmd`/`.sh` launchers, README instructions. Note ports. **Never run anything.**

## 4. Infrastructure and services

- **Containers:** `Dockerfile`, `docker-compose*.yml`. Services listed there (postgres, redis, nginx…) are part of the stack even if not in a manifest.
- **Hosting/CI:** `vercel.json`, `netlify.toml`, `fly.toml`, `render.yaml`, `Procfile`, `.github/workflows/*`, `deploy/`, `Caddyfile`, `nginx.conf`, `*.service`.
- **Database:** `prisma/schema.prisma`, `drizzle.config.*`, `migrations/`, `alembic/`, `supabase/`, `schema.sql`, `CREATE TABLE` statements, ORM models.
- **Configuration:** names of env variables in `.env.example` or code (`process.env.X`, `os.environ["X"]`, `os.getenv`, settings classes). **Names only, never values.** Note what each one controls and its default if the code shows one.
- **External services:** `STRIPE_*`, `OPENAI_API_KEY`, `SUPABASE_URL`, `SENTRY_DSN`, SMTP… and the file that calls them.

## 5. Confirm usage with evidence

For every important dependency:
1. Grep for its import/require (`from "x"`, `import x`, `require("x")`, `from x import`) in source folders. Always exclude `.env*` and other secret files from the search (`glob: "!**/.env*"`), so a match never prints a secret value.
2. Record 1–3 files where it is used and **what it does there**, with line numbers (e.g. "`src/api/client.ts:12` creates the axios instance with the auth header").
3. Find its **key configuration** (the lines that set it up: connection string name, middleware order, model settings, pool size, CORS, timeouts) and note the file and lines for a short quote.
4. If there are no imports and it's not a CLI/plugin used via config or scripts, mark it **possibly unused**.
5. Look for **why** evidence: README sentences, comments, config, commit messages (`git log --oneline -30`, if it's a git repo).
6. Note **gotchas actually present**: e.g. a missing timeout, a sync call in async code, a dev-only setting, an internal API used, an outdated pattern for that major version.

## 6. Trace one real request (the most useful part)

Pick the **main user action** (log in, create an order, start a training, ask the tutor) and follow it through the code, file by file:
UI/client call → route/handler → validation → business logic/service → database/external service → response → what the UI does with it.
Record each step as `file:line` + one sentence. This becomes "A request's journey" in the explanation. 4–8 steps is ideal.

## 7. Data model

From ORM models, migrations or SQL: the main entities (tables/collections), their important fields and the relationships (one-to-many…). 3–8 entities is enough; name the file.

## 8. Categories

Use these groups (skip empty ones):
1. **Frontend / UI**: framework, styling, components, state, routing, forms, data fetching
2. **Backend / API**: language, framework, validation, auth
3. **Data**: database, ORM/query builder, migrations, cache, search/vector DB, file storage
4. **Background & real-time**: queues, workers, schedulers, websockets/SSE
5. **External services & AI**: payments, email, AI APIs, analytics, monitoring
6. **Developer tools**: package manager, bundler, TypeScript, linter/formatter, tests
7. **Infrastructure**: Docker, hosting, CI/CD, reverse proxy
