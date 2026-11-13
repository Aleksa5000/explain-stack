# Explanation guide

## Card for each important technology (detailed mode)

```
### <Name> <version> · <category>
**What it is:** <one plain sentence>
**Analogy:** <one real-life comparison>  (skip for advanced users)
**Why it's here:** <the job it does in THIS project, and the stated or likely reason for choosing it, with evidence (README/docs quote, config, comment)>
**How it works here:**
1. <step with `file:line`: where it's set up>
2. <step with `file:line`: where it's used for the main job>
3. <step: what happens with the result>
**Key config:** <a short quote (≤8 lines) of the lines that set it up, with `file:lines`, and what each important setting means>
**Version note:** <only if the major version matters: "Express 4: async errors aren't caught automatically, that's why server.js:8 patches it; Express 5 does it itself">
**Instead you could use:** <1–3 real alternatives> · **Why this one (likely):** <the trade-off>
**Without it:** <what would break or what you'd have to write yourself>
**Watch out:** <1–2 gotchas actually present in this project, with `file:line`; skip if none>
**Start reading at:** <the 1–2 files to open first to understand this part>
**Learn more:** <the official docs URL, only if you're sure it's correct>
```

Quick mode (`/explain-stack quick`): use only What it is · Analogy · Why it's here · Instead · Without it, 5–8 lines.

Rules:
- **Everything must be grounded:** cite files and lines. If the reason isn't visible, say "the code doesn't say why; common reasons are …". Don't invent a story.
- **Explain the choice as a trade-off**, never "because it's the best". Typical trade-offs: simplicity vs control, speed of development vs performance, managed service vs self-hosted, cost, ecosystem/popularity, what the framework expects.
- If the project was likely scaffolded by a template or AI (e.g. default Vite + Tailwind + shadcn setup), it's fine and honest to say "this is the default for X; it was probably chosen because it's the standard starter".
- **Explain new terms the first time** they appear, in one short clause ("middleware, code that runs before every request, …"), and add them to the glossary.
- Small helpers (`clsx`, `dotenv`, `uuid`): one line each, grouped.

## Good analogies (adapt, don't overuse)

| Technology type | Analogy |
|---|---|
| Frontend framework (React, Vue) | The shop window and the counter: what customers see and touch |
| Backend framework (Express, FastAPI) | The kitchen: takes orders, prepares them, sends them out |
| Database (Postgres, SQLite) | The warehouse with labeled shelves |
| ORM (Prisma, SQLAlchemy) | A translator between your code and the warehouse language (SQL) |
| Cache (Redis) | A sticky note on the fridge, so you don't walk to the warehouse every time |
| Queue / workers (Celery, BullMQ) | A ticket system: orders wait in line and workers pick them up one by one |
| Auth (JWT, sessions) | A wristband at a festival that proves you paid |
| Validation (Zod, Pydantic) | A bouncer checking IDs at the door |
| Bundler (Vite, webpack) | Packing everything into suitcases before the trip |
| TypeScript | Labels on every box, so you never put shoes in the fridge |
| Linter/formatter | Spell-check and auto-format for code |
| Docker | A shipping container: runs the same on every ship |
| CI/CD | An automatic quality check and delivery truck after every change |
| Reverse proxy (nginx, Caddy) | A receptionist who sends visitors to the right office |
| Vector DB (Chroma, pgvector) | A library sorted by meaning instead of by title |
| WebSockets / SSE | An open phone line instead of sending letters back and forth |
| ML framework (PyTorch, TensorFlow) | A workshop full of tools for building and training a machine |

## Sections around the cards (detailed mode)

In this order in chat (all of them also go to `STACK.md`):

1. **Big picture** (3–5 sentences) + the connection diagram.
2. **Project map:** the important folders, one line each:
   ```
   backend/            FastAPI server
     app/routers/      one file per group of endpoints (auth, quiz, documents)
     app/services/     business logic, called by the routers
     app/models/       database tables (SQLAlchemy)
   frontend/src/       React app (pages, components, API client)
   docker-compose.yml  starts Postgres, Redis and the worker
   ```
3. **How to run it:** the commands from scripts/README, which ports, what must run first (e.g. "Postgres via docker compose, then the backend, then the frontend"). Never run them yourself.
4. **The technology cards**, grouped by role.
5. **A request's journey:** the traced main action, step by step (`file:line` + one sentence each), e.g.
   1. `frontend/src/pages/Quiz.tsx:88`: the user clicks *Submit*; `api.post("/quiz/answer")`
   2. `backend/app/routers/quiz.py:41`: FastAPI receives it; Pydantic checks the body
   3. `backend/app/services/quiz_service.py:165`: calculates the next review date
   4. `backend/app/models/review.py`: saves it to Postgres through SQLAlchemy
   5. back in `Quiz.tsx:95`: shows "Next review in 3 days"
6. **Data model:** the main entities, key fields and relations (and the file).
7. **Configuration:** env variable names, what each controls, default if any, where it's read (`file:line`). Never values.
8. **Findings** (below).
9. **Key code** (3 pieces, one line each) + the offer to run `/explain-stack code`.
10. **Glossary:** every technical term you used, one plain sentence each.

## Connection diagram

In chat, use a simple ASCII flow with the real names and ports:
```
Browser (React :5173) ──HTTP/JSON──> FastAPI (:8000) ──SQL──> Postgres
                                        │
                                        └──> Redis queue ──> Celery worker ──> OpenAI API
```
In `STACK.md`, use a Mermaid `flowchart LR` with the same nodes.

## Findings (honest, non-judgmental)

Mention when you see them, framed as learning, each with `file:line`:
- **Possibly unused:** in the manifest but never imported.
- **Missing from the manifest:** imported in code but not declared (works only on the author's machine).
- **Duplicates:** two libraries for one job (e.g. axios + fetch wrapper, moment + dayjs).
- **Outdated major versions,** only if obvious; don't claim exact latest versions you aren't sure about.
- **Heavier than needed:** e.g. a full state library for one global value.
- **Fragile spots:** internal APIs, missing timeouts, secrets handling, dev settings that would be dangerous in production.
- **Missing pieces commonly expected:** no tests, no input validation, no error monitoring. Only if relevant to understanding.

## Deep dive (single technology)

1. What it is, the analogy, and the problem it was created to solve.
2. **How this project uses it:** walk through the actual files step by step, quoting short code snippets (≤10 lines each).
3. The configuration in this project, setting by setting.
4. The core concepts needed to work with it (3–5), each explained with an example from this project.
5. Alternatives and when you'd pick them instead.
6. Common beginner mistakes with it, and whether any appear in this project.
7. Typical interview questions about it (2–3) with short model answers.
8. A 30-minute exercise to practice it inside this project (describe it; don't implement it).
Save the deep dive as a section in `STACK.md` only if the user agrees; otherwise keep it in chat.
