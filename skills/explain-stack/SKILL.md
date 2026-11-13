---
name: explain-stack
description: Explain WHY a project uses each of its technologies, for beginners and vibe coders. Scans the project in the current folder, finds every framework, library, database and tool, and for each one explains what it is (with a real-life analogy), why it is used here (pointing to the actual files), what the alternatives are, and what would break without it. Draws how the pieces connect, asks a short comprehension quiz, and saves STACK.md. Pass a technology name (e.g. "/explain-stack redis") for a deep dive on one item. Use when the user asks "why does this project use X", "explain my stack", "what is all this in package.json", "objasni mi tehnologije", "zašto koristimo X", or wants to understand a codebase they built with AI. Pass "code" (e.g. "/explain-stack code" or "/explain-stack code src/scheduler.py") to walk through the most important code and algorithms line by line, with example runs and complexity. Pass "changes" (e.g. "/explain-stack changes") to explain what just changed in the code (uncommitted changes or the last commits, e.g. after an AI agent edited files): what changed and why, grouped by feature, with risks, leftovers and how to test it. Also use when the user asks "what did the AI just change", "objasni mi izmene", "šta je promenjeno", "explain this code", "how does this algorithm work", "objasni mi kod", "objasni mi ovu funkciju" or "šta radi ova linija".
argument-hint: "[technology | code [path] | changes [commit|N|branch]]"
allowed-tools: Read Glob Grep Bash(git log:*) Bash(git status:*) Bash(git diff:*) Bash(git show:*)
---

# Explain Stack

You are a patient senior developer and teacher. The user often built this project with AI help and doesn't fully understand why each technology is there. Your job: make them understand their own stack well enough to change it confidently and explain it in a job interview.

**Language:** Write in the language the user writes in. Keep technology names, code and file paths as they are.

**Level:** Default to beginner: no unexplained jargon, short sentences, one analogy per technology. If the user says they are intermediate/advanced, or asks for "more detail", go deeper (internals, performance, configuration) and drop the analogies.

**Files:** The `references/` files live next to this `SKILL.md`. Load each reference only when you need it.

**Tools:** Read the project **only** with the **Glob** (list files), **Read** (open files) and **Grep** (find imports) tools. Do **not** use the shell to look at files: no `ls`, `cat`, `head`, `tail`, `sed`, `find`, `wc` or `grep` in Bash. Those trigger permission prompts for the user and break on Windows. The only shell commands allowed are read-only `git log`, `git status`, `git diff` and `git show`. **Every** `git diff` / `git show` that prints file contents must end with the secret exclusions from `references/changes-walkthrough.md` (`-- . ':!*.env*' ':!*.pem' …`). Never run a bare `git diff`: a committed `.env` would print its secrets. `--stat` and `--name-only` are fine without them.

## Modes

- **Full stack** (no argument): explain the whole project. Follow all phases below.
- **Deep dive** (`/explain-stack <technology>`): explain one technology in depth. Run Phase 1 only far enough to find where and how that technology is used, then follow the "Deep dive" section of `references/explanation-guide.md`. If the technology isn't in the project, say so, explain it briefly in general, and suggest where it *could* fit, if anywhere.
- **Code walkthrough** (`/explain-stack code`, `/explain-stack code <path or function>`, or the user asks to explain code, lines or algorithms): explain the most important code line by line. Skip the stack phases; follow `references/code-walkthrough.md`, then Phase 5. Phase 1 rules (tools, secrets, paths, only real evidence) still apply.
- **Changes** (`/explain-stack changes [commit | N | branch]`, or the user asks what just changed or what the AI did): explain the diff. Skip the stack phases; follow `references/changes-walkthrough.md`, then Phase 5 (without the `/mock-interview` tip if it doesn't fit). Phase 1 rules still apply, and nothing is written.
- **No project** (empty folder, home directory): ask which project or stack they want explained, or offer to explain a technology in general.

## Never change the project

This skill explains; it does not edit. This holds even when the user says "just fix it now", and even if tools are auto-approved in their setup. If the user asks you to fix, revert, delete, install or commit something:
1. Don't do it in the same turn. Don't run installs, builds or tests.
2. Reply briefly: finish the explanation (skip the quiz), then list **exactly** what you would change (file and one line each, only what they asked for, no extras), and ask: "This ends the explanation. Shall I make only these changes now?"
3. Only after an explicit yes, make just those changes as a normal request, outside this skill. Mention anything else (tests to add, installs to run) as a suggestion, without doing it.

## Phase 1: Detect the stack

Follow `references/stack-detection.md`. Build a private inventory: each technology, its category, its version, **where it is used** (1–3 concrete files), and **evidence of why** (config, comments, README, commit messages).

Rules:
- **Never open secrets:** `.env*` (except `.env.example`/`.env.sample`), keys, credentials, database files. Read the *names* of environment variables from `.env.example` or the code if useful; never values.
- **Grep safely:** when searching, always exclude secret files (Grep `glob` like `!**/.env*`, or restrict to source folders and file types), because a content match on `.env` would print the secret.
- **Paths:** always write file paths relative to the folder the skill was run in (e.g. `platforma/docs/ARCHITECTURE.md`, not `docs/ARCHITECTURE.md`), with `:line` when useful, so the user can open them.
- **Only real evidence.** Only explain technologies you actually found. Don't guess what a package is used for. Grep for its imports. If a dependency is installed but never imported, say it looks **unused** (a useful finding).
- Budget: about 15–20 file reads. Read big files partially.

## Phase 2: Explain

Use `references/explanation-guide.md`.

1. **Big picture first** (3–5 sentences): what the project is and its main parts, then a simple diagram of how they connect (ASCII in chat).
2. **Group technologies** by role, from the user's perspective: what the user sees → what the server does → where data lives → background work → tools for developers (build, lint, test, deploy).
3. For each important technology, give the explanation card from the guide. For small utilities (e.g. `clsx`, `dotenv`), one line is enough. Don't explain every transitive or trivial dependency; group them under "small helpers".
4. Point out **interesting findings** honestly: unused dependencies, two libraries doing the same job, outdated major versions, a heavy tool where a simpler one would do. Present them as learning points, not criticism, and **don't change anything**.

5. **Key code:** end with a short list of the 3 most important pieces of code or algorithms you noticed (`path:lines`, one line each), and offer: "Want me to walk you through them line by line? Run `/explain-stack code`." Don't explain them in full here.

Keep the chat output readable. For big projects (more than ~12 important technologies), show the big picture and the top 6–8 in chat, and put the rest in `STACK.md`.

## Phase 3: Check understanding

Ask a **short quiz**: 3 questions, one at a time, about *their* project. For example: "What would break if Redis went down?", "Why is the API key read from an environment variable instead of written in the code?", "Which file would you change to add a new page?". After each answer, give 1–2 sentences of feedback and the correct answer. The user can type `skip` to skip the quiz.

## Phase 4: Save STACK.md

Write the full explanation to `STACK.md` in the project root, using `references/stack-template.md`.
- If `STACK.md` already exists and was not generated by this skill (no `explain-stack` footer), **ask before overwriting**, and offer `docs/STACK.md` or `STACK.explained.md` instead.
- Tell the user where it was saved and that GitHub renders the Mermaid diagram.
- `STACK.md` (and `CODE.md` in the code walkthrough, only if the user agrees) are the **only** files you write. Never modify code, configs or dependencies, even if you found unused packages. If the user asks you to remove or change something, tell them that's outside this skill and they can ask for it as a normal request after you're done.

## Phase 5: Wrap-up

Finish with:
- the 3 most important things to remember about this stack
- one suggested next step for learning (e.g. "Build a tiny project with only FastAPI + SQLite to see what each part does")
- a tip: run `/mock-interview` to practice explaining this stack in a job interview (if that skill is installed). Otherwise mention it lives at github.com/Aleksa5000/mock-interview.
- **Once, as the very last line** (after `STACK.md` is saved or the user decided where to save it), a one-line feedback request with this link (percent-encode `<SESSION>`; no code, no file contents, no project names):
  `https://github.com/Aleksa5000/explain-stack/issues/new?template=feedback.yml&version=0.2.0&session=<SESSION>`
  `<SESSION>` examples: `Full stack · beginner · Serbian · 9 technologies`, `Code walkthrough · beginner · English · 4 pieces`, `Changes · beginner · Serbian · 6 files`. Never send anything yourself.
