# Changelog

## 0.3.0 — 2026-11-14
- Much more detailed analysis (about 25–35 files) and explanations: every technology card now covers how it works in your code step by step (file:line), key config, version notes, gotchas, where to start reading and official docs.
- New sections: project map, how to run it, a request's journey (one real action traced from click to database), data model, configuration (env variable names only) and a glossary. STACK.md gets a table of contents.
- `/explain-stack quick` keeps the short overview.
- Findings now also flag dependencies used in code but missing from the manifest, and fragile spots.

## 0.2.0 — 2026-11-13
- Code walkthrough mode: `/explain-stack code [path]` explains the most important code and algorithms line by line, with an example run, Big-O, edge cases, an interview answer and a quiz. Optional `CODE.md`.
- Changes mode: `/explain-stack changes [commit|N|branch]` explains uncommitted changes or recent commits, grouped by feature, with risks, leftovers and test steps. Secret files are excluded from diffs.
- Full-stack mode now ends with a short list of the key code worth walking through.

## 0.1.0 — 2026-11-13
- First release: full-stack and single-technology explanations grounded in the project's files, connection diagram, findings (unused/duplicate deps), comprehension quiz, STACK.md output, feedback link.
