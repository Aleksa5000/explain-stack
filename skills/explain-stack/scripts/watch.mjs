#!/usr/bin/env node
// explain-stack watch: once STACK.md is saved in a project, keep it up to date in every later session there.
// No dependencies. State: ~/.claude/explain-stack/state.json (EXPLAIN_STACK_HOME overrides).
//
//   node watch.mjs hook            SessionStart hook (reads the hook JSON on stdin)
//   node watch.mjs on [path]       watch this project (call after saving STACK.md)
//   node watch.mjs off [path]      stop watching it
//   node watch.mjs status          watched projects (JSON)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve, sep } from "node:path";

const DIR = process.env.EXPLAIN_STACK_HOME || join(homedir(), ".claude", "explain-stack");
const STATE = join(DIR, "state.json");
const SKIP = new Set([".git", "node_modules", ".venv", "venv", "dist", "build", "out", ".next", "__pycache__", ".pytest_cache", "target", "vendor", "coverage", ".cache", ".idea", ".vscode", "interview-reports"]);
const SRC = /\.(js|jsx|ts|tsx|mjs|cjs|py|go|rs|java|kt|swift|rb|php|cs|cpp|c|h|vue|svelte|html|css|scss|sql|prisma|dart|toml|ya?ml|json|gradle|kts)$/i;
const SECRET = /(^|[\\/])(\.env[^\\/]*|.*\.(pem|key|p12)|credentials[^\\/]*|secrets?\.[^\\/]*)$/i;
const OWN = new Set(["STACK.md", "CODE.md"]);

const norm = (p) => { let r = resolve(p).split(sep).join("/"); if (/^[A-Z]:/.test(r)) r = r[0].toLowerCase() + r.slice(1); return r.replace(/\/+$/, ""); };
const load = () => { try { return JSON.parse(readFileSync(STATE, "utf8")); } catch { return { version: 1, projects: {} }; } };
const save = (s) => { mkdirSync(DIR, { recursive: true }); writeFileSync(STATE, JSON.stringify(s, null, 2)); };
const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).trim();
const root = (d) => { try { return norm(git(d, "rev-parse", "--show-toplevel")); } catch { return null; } };
function find(state, dir) {
  const d = norm(dir);
  let best = null;
  for (const k of Object.keys(state.projects)) if ((d === k || d.startsWith(k + "/")) && (!best || k.length > best.length)) best = k;
  return best;
}
function changedFiles(dir, since, limit = 30) {
  const out = [];
  let seen = 0;
  const walk = (d) => {
    if (out.length >= limit || seen > 20000) return;
    let es; try { es = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of es) {
      const f = join(d, e.name);
      if (e.isDirectory()) { if (!SKIP.has(e.name) && !e.name.startsWith(".")) walk(f); }
      else if (e.isFile() && SRC.test(e.name) && !SECRET.test(f) && !OWN.has(e.name)) {
        seen++;
        try { if (statSync(f).mtimeMs > since) out.push(norm(f).slice(norm(dir).length + 1)); } catch {}
      }
      if (out.length >= limit) return;
    }
  };
  walk(dir);
  return out;
}
// What changed since STACK.md was written: from the commit in its footer (git) or its file date.
function staleness(key) {
  const file = join(key, "STACK.md");
  if (!existsSync(file)) return { missing: true };
  const text = readFileSync(file, "utf8");
  const sha = (text.match(/from commit ([0-9a-f]{7,40})/) || [])[1];
  if (sha) {
    try {
      const log = git(key, "log", "--oneline", "--no-decorate", "-n", "20", `${sha}..HEAD`);
      const commits = log ? log.split("\n") : [];
      const dirty = git(key, "status", "--porcelain").split("\n").filter((l) => l.trim() && !/STACK\.md|CODE\.md/.test(l)).length;
      return { since: sha, commits, dirty, count: commits.length + (dirty ? 1 : 0) };
    } catch { /* commit gone: fall back to the date */ }
  }
  const files = changedFiles(key, statSync(file).mtimeMs);
  return { since: "the file's date", files, count: files.length };
}

const [cmd, arg] = process.argv.slice(2);
const state = load();
state.projects ||= {};

if (cmd === "hook") {
  try {
    let input = {};
    try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}
    const key = find(state, input.cwd || process.cwd());
    if (!key || state.projects[key].on === false) process.exit(0);
    const s = staleness(key);
    let ctx = `[explain-stack] ${"The user's own request always comes first: answer it or do it completely before anything below, and never let this note replace or shorten that answer. "}This project is watched by explain-stack: its STACK.md (in ${key}) explains the stack and should stay accurate. ` +
      `During this session, whenever your work adds, removes or upgrades a dependency, a service or a main part of the architecture, update only the affected parts of STACK.md at the end of that task (the explain-stack skill, "refresh" mode) and say so in one line. Never touch any other file for this.`;
    if (s.missing) ctx += ` STACK.md is missing: offer once to recreate it with /explain-stack.`;
    else if (s.count > 0) {
      const what = s.commits ? `${s.commits.length} commit(s) since ${s.since}${s.dirty ? " plus uncommitted changes" : ""}: ${s.commits.slice(0, 5).join("; ")}` : `${s.files.length}${s.files.length >= 30 ? "+" : ""} changed source file(s) since ${s.since}`;
      ctx += ` STACK.md is out of date (${what}). The user turned on automatic upkeep, so don't ask for permission: in the same turn, right after their first request is fully done, refresh STACK.md with the explain-stack skill in "refresh" mode (only what changed; STACK.md is the only file you touch) and end your reply with one line saying what you updated. If their task is long, do it when that task is finished.`;
    }
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx } }));
  } catch { /* never break a session */ }
  process.exit(0);
}
if (cmd === "on") {
  const dir = arg || process.cwd();
  const key = find(state, dir) || root(dir) || norm(dir);
  state.projects[key] = { ...(state.projects[key] || {}), on: true, since: new Date().toISOString().slice(0, 10) };
  save(state);
  console.log(JSON.stringify({ ok: true, watching: key }));
} else if (cmd === "off") {
  const key = find(state, arg || process.cwd());
  if (key) { state.projects[key].on = false; save(state); }
  console.log(JSON.stringify({ ok: true, stopped: key }));
} else if (cmd === "status") {
  console.log(JSON.stringify({ stateFile: norm(STATE), projects: Object.fromEntries(Object.entries(state.projects).map(([k, v]) => [k, { ...v, stale: v.on === false ? null : staleness(k) }])) }, null, 2));
} else {
  console.error("usage: watch.mjs hook | on [path] | off [path] | status");
  process.exit(1);
}
