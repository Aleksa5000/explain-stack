# Changes walkthrough

Goal: the user understands **what just changed in their code**, often after an AI agent edited many files, well enough to decide whether to keep it, test it and explain it. You explain; you never change, revert, stage or commit anything.

## 1. Pick what to explain

| User says | Compare |
|---|---|
| `/explain-stack changes` | Uncommitted changes (`git diff HEAD`) plus new untracked files. If there are none, the **last commit** (`git show HEAD`). Say which one you chose. |
| `changes last` / `changes HEAD~1`… | That commit (`git show <ref>`) |
| `changes 3` / "last 3 commits" | `git diff HEAD~3 HEAD` and the 3 commit messages (`git log --oneline -3`) |
| `changes <branch>` | `git diff <branch>...HEAD` (what this branch adds) |

If the folder is not a git repo, say that this mode needs git, explain in two lines why it's worth using (you can see and undo every AI change), and offer the full-stack or code walkthrough instead.

## 2. Read the diff safely

- **Always exclude secrets** with pathspecs, on every `git diff` and `git show` that prints contents. Copy these commands exactly:
  - `git diff HEAD -- . ':!*.env*' ':!*.pem' ':!*.key' ':!*secret*' ':!*credentials*' ':!*.db' ':!*.sqlite'`
  - `git show HEAD -- . ':!*.env*' ':!*.pem' ':!*.key' ':!*secret*' ':!*credentials*' ':!*.db' ':!*.sqlite'`
  - for one file: `git diff HEAD -- src/orders.js` (only for a path you know is not secret)
  Never run a bare `git diff` or `git show`. A committed `.env` would print its values.
  Separately, `git diff HEAD --stat` (or `git show --stat`) shows file names only. If a secret-like file changed, mention its **name** only ("`.env` changed. I didn't open it.").
- **Overview first:** run `--stat` to see the size. Skip lock files, generated files, build output and snapshots (mention them in one line: "`pnpm-lock.yaml` updated because a package was added").
- **Big diffs** (more than ~600 changed lines or 15 files): explain the 5–8 most important files in detail and list the rest in one line each. Diff file by file (`git diff HEAD -- <path>`), not all at once.
- **New untracked files** (from `git status`): read them with the agent's file reading (never secret files).
- If you need context around a change, Read that part of the current file.
- If a diff line *looks like* a secret (API key, token, password), don't quote it. Say "line 12 of `config.ts` looks like a hard-coded secret" and treat it as the top risk.

## 3. Explain

**Summary first (3–5 lines):** what this change does as a whole, in plain language ("Adds password reset: a new API route, an email template and a database column."). If there are commit messages, use them, and say when the code does something the message doesn't mention.

**Then group by feature, not by file**, in the order data flows (database → backend → frontend → tests/config). For each group:

```
### <N>. <What this part does>: `<file>`, `<file>`
**What changed:** <plain description; quote the key lines (≤10) with + / ->
**Why (likely):** <the reason: from the commit message, a comment or the logic; say "likely" when inferring>
**What it affects:** <who or what uses this code now: callers, pages, data>
**Watch out:** <only if real: risk, behavior change, missing piece>
```

**Then a review checklist**, only items that apply, each with `file:line`:
- 🔴 **Risks:** hard-coded secrets; removed validation, auth checks or error handling; deleted or skipped tests (`.skip`, `xit`); destructive migrations (dropping columns or tables); changed public API or URL; behavior that silently changed.
- 🟡 **Leftovers:** `console.log`/`print` debugging, commented-out code, `TODO`s, unused imports, new dependencies (say what each is for and whether it's used).
- 🟢 **Good signs:** tests added, input validated, errors handled.

**How to test it (3–5 steps):** concrete things to click or run ("Open /reset-password, enter an unknown email, and check that you still see the same success message").

**Verdict:** one honest sentence, e.g. "Looks complete; check the 2 risks above before committing." Never a guarantee.

## 4. Check understanding

Two quick questions (the user can type `skip`), e.g. "Which file would you change to make the reset link expire after 1 hour?", "What happens now if the email service is down?". After each answer: 1–2 sentences of feedback and the correct answer.

## Rules

- **Read-only.** Never run `git add`, `commit`, `checkout`, `restore`, `reset`, `stash`, installs, builds, tests or anything that changes files. If the user asks you to undo or fix something, follow "Never change the project" in `SKILL.md`: list the exact changes and ask for confirmation first.
- Only describe what's in the diff. Don't invent intentions. Say "likely" when guessing why.
- No file is written in this mode. The explanation stays in chat.
