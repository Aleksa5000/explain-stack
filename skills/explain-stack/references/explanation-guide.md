# Explanation guide

## Card for each important technology

```
### <Name> <version> · <category>
**What it is:** <one plain sentence>
**Analogy:** <one real-life comparison>  (skip for advanced users)
**Why it's here:** <the job it does in THIS project, with file references: `src/db.ts`, `app/api/...`>
**Instead you could use:** <1–3 real alternatives> · **Why this one (likely):** <the trade-off: simpler / faster / free tier / team knows it / fits the framework / AI tools default to it>
**Without it:** <what would break or what you'd have to write yourself>
```

Rules:
- **"Why it's here" must be grounded:** cite files or config. If the reason isn't visible, say "the code doesn't say why; common reasons are …". Don't invent a story.
- **Always explain the choice as a trade-off**, never "because it's the best". Typical trade-offs: simplicity vs control, speed of development vs performance, managed service vs self-hosted, cost, ecosystem/popularity, what the framework expects.
- If the project was likely scaffolded by a template or AI (e.g. default Vite + Tailwind + shadcn setup), it's fine and honest to say "this is the default for X; it was probably chosen because it's the standard starter".
- Keep each card to about 5–8 lines.

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
| Reverse proxy (nginx) | A receptionist who sends visitors to the right office |
| Vector DB (Chroma, pgvector) | A library sorted by meaning instead of by title |
| WebSockets / SSE | An open phone line instead of sending letters back and forth |

## Connection diagram

In chat, use a simple ASCII flow:
```
Browser (React) ──HTTP/JSON──> FastAPI ──SQL──> Postgres
                                  │
                                  └──> Redis queue ──> Celery worker ──> OpenAI API
```
In `STACK.md`, use a Mermaid `flowchart LR` with the same nodes.

## Findings (honest, non-judgmental)

Mention when you see them, framed as learning:
- **Possibly unused:** in the manifest but never imported.
- **Duplicates:** two libraries for one job (e.g. axios + fetch wrapper, moment + dayjs).
- **Outdated major versions,** only if obvious from the manifest; don't claim exact latest versions you aren't sure about.
- **Heavier than needed:** e.g. a full state library for one global value.
- **Missing pieces commonly expected:** no tests, no input validation, no error monitoring. Only if relevant to understanding.

## Deep dive (single technology)

1. What it is, the analogy, and the problem it was created to solve.
2. **How this project uses it:** walk through the actual files step by step, quoting short code snippets (≤10 lines each).
3. The core concepts needed to work with it (3–5), each explained with an example from this project.
4. Alternatives and when you'd pick them instead.
5. Common beginner mistakes with it, and whether any appear in this project.
6. Typical interview questions about it (2–3) with short model answers.
7. A 30-minute exercise to practice it inside this project (describe it; don't implement it).
Save the deep dive as a section in `STACK.md` only if the user agrees; otherwise keep it in chat.
