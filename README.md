<p align="center">
  <img src="docs/logo.svg" alt="explain-stack logo" width="120">
</p>

<h1 align="center">explain-stack</h1>

<p align="center">
  <b>Finally understand <i>why</i> your project uses every technology in it, right in Claude Code.</b><br>
  <a href="https://github.com/Aleksa5000/explain-stack/stargazers"><img src="https://img.shields.io/github/stars/Aleksa5000/explain-stack?style=flat" alt="stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a>
  <a href="https://github.com/Aleksa5000/explain-stack/releases"><img src="https://img.shields.io/github/v/release/Aleksa5000/explain-stack" alt="release"></a>
</p>

<p align="center">
  <img src="docs/demo.gif" alt="explain-stack demo: a diagram of the project, an explanation card for Zod with an analogy and file references, findings about unused packages, and a quiz question" width="760">
</p>

You built something, maybe with AI doing most of the typing. Now `package.json` has 40 packages and there's a `docker-compose.yml` with Redis in it. Why are they there? `explain-stack` reads your project and explains each technology in plain language, pointing at the exact files where it's used.

Made for vibe coders, beginners and anyone joining an unfamiliar codebase.

## ✨ What it does

- 🔍 **Finds your whole stack.** It reads manifests (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`…), Docker and CI files and database configs, then **greps the imports** to confirm what is actually used.
- 🧠 **Explains every technology with a card:**
  - **What it is**, in one sentence
  - **An analogy** ("Redis is a sticky note on the fridge")
  - **Why it's here**, with real file and line references
  - **Alternatives** and the trade-off that explains this choice
  - **What would break without it**
- 🗺️ **Draws how the pieces connect**: an ASCII diagram in chat and a Mermaid diagram in the file.
- 🕵️ **Honest findings**: unused packages, duplicate libraries, services set up but never called, missing tests. It reports them and **never changes anything**.
- ❓ **A 3-question quiz** about *your* project, to check that it clicked. You can skip it.
- 📄 **Saves `STACK.md`**. If you already have one, it asks before overwriting.
- 🎯 **Deep dive mode**: `/explain-stack redis` goes deep on one technology: how your code uses it, core concepts, common mistakes, interview questions and a 30-minute exercise. If the technology isn't in the project, it says so instead of inventing usage.
- 🌍 **Speaks your language**, at your level (beginner by default; say "I'm intermediate" for more depth).

## 📦 Install

**Option A: as a plugin (recommended, gets updates)**

Inside Claude Code:
```
/plugin marketplace add Aleksa5000/explain-stack
/plugin install explain-stack@explain-stack
```

**Option B: copy the skill manually**
```bash
git clone https://github.com/Aleksa5000/explain-stack.git
# macOS / Linux
cp -r explain-stack/skills/explain-stack ~/.claude/skills/
# Windows (PowerShell)
Copy-Item -Recurse explain-stack\skills\explain-stack $HOME\.claude\skills\
```

Restart Claude Code after installing.

## 🚀 Usage

Open Claude Code in your project folder and run:

| Command | What you get |
|---|---|
| `/explain-stack` | The whole stack explained, findings, quiz, `STACK.md` |
| `/explain-stack redis` | A deep dive on one technology |

When installed as a plugin, the full name is `/explain-stack:explain-stack`. You can also just ask *"why does this project use Redis?"* or *"explain my stack, I'm a beginner"*.

See a real output in [`examples/sample-STACK.md`](examples/sample-STACK.md), generated from a small Express + Zod + SQLite API.

## 🔒 Safe by design

- **Read-only.** It scans your project with Read/Glob/Grep only. No shell commands, no installs, no builds.
- **Never reads secrets.** It skips `.env*` files (except `.env.example`), keys, credentials and databases, and excludes them from searches. We tested this with a planted fake secret.
- **Never changes your code.** `STACK.md` is the only file it writes. If you ask it to remove an unused package, it tells you to ask for that separately after it's done.

## 💬 Feedback

At the end, the skill shows a **prefilled feedback link** once. It contains only the mode, level, language and number of technologies. **Nothing is sent automatically.**
- [Give feedback](https://github.com/Aleksa5000/explain-stack/issues/new?template=feedback.yml)
- [Report a bug](https://github.com/Aleksa5000/explain-stack/issues/new?template=bug_report.yml)
- [Suggest an idea](https://github.com/Aleksa5000/explain-stack/issues/new?template=feature_request.yml)
- [Discussions](https://github.com/Aleksa5000/explain-stack/discussions)

## 🤝 Works great with

**[mock-interview](https://github.com/Aleksa5000/mock-interview)**. First understand your stack with `/explain-stack`, then practice explaining it to an interviewer with `/mock-interview`.

## Contributing

Ideas, new ecosystems, better analogies and translations are welcome.
The skill lives in [`skills/explain-stack/`](skills/explain-stack/):
- `SKILL.md` is the main flow
- `references/` holds stack detection, the explanation guide and the `STACK.md` template

Release checklist: bump the version in `.claude-plugin/plugin.json`, in the feedback link in `SKILL.md` (Phase 5), and in `CHANGELOG.md`. The icon is rendered from `docs/logo.svg`, and the demo GIF is made by `scripts/make_demo_gif.py`.

If this helped you understand your project, please ⭐ the repo so more people can find it.

## License

[MIT](LICENSE) © Aleksa Djorovic
