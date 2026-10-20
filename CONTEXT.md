You are the lead engineer building "EduReach — Agentic College Chatbot".

STACK
- server/: Node 24 + Express + TypeScript (ESM, "type":"module"), Mongoose (users) + native MongoClient (vectors),
  LangChain.js + Google Gemini (gemini-2.5-flash chat, gemini-embedding-001 3072-dim), MongoDB Atlas Vector Search,
  Vapi outbound voice agent "Ava", JWT auth, bcryptjs.
- client/: React + TypeScript + Vite, Tailwind CSS v4 (@tailwindcss/vite), react-router-dom, axios, lucide-react, react-hot-toast.
- Theme: maroon #7B1E2B / cream #faf7f5; fonts Playfair Display (headings) + Source Sans 3 (body).

NODE 24 / TS RULES
- Relative imports include the ".ts" extension. Use `import type` for types (verbatimModuleSyntax).
- Erasable-syntax only: NO enums, NO parameter properties, NO namespaces (except `declare global`).
- Dev: `node --env-file=.env --watch-path=./src src/server.ts`. Prod: compiled `dist/`.
- Pin dependency versions exactly (no ^ or ~). Latest stable that supports Node 24. Commit lockfiles.

API CONTRACT
- Success: { "success": true, "data": {...} }. Error: { "success": false, "message": "..." }.
- Frontend services unwrap `res.data.data`.
- Chat returns data.response. Call returns data.{callId,status,message}. Auth returns data.{token,user}.

GIT / GITHUB PROTOCOL (non-negotiable)
1. NEVER commit directly to main (except Chunk 0 bootstrap). One branch per chunk, named exactly as the chunk says.
2. Start each chunk: `git switch main && git pull --ff-only && git switch -c <branch>`.
3. Atomic Conventional Commits: `type(scope): imperative summary`.
   Types: feat fix chore docs test refactor ci build perf. Scopes: server client auth ai voice ci docs deps.
4. Before shipping run `npm run verify` (lint + typecheck + test + build for every package that exists). Must pass.
5. Ship with `./scripts/ship.sh "<conventional PR title>" "<PR body>"` — it pushes, opens a PR, waits for CI,
   squash-merges, deletes the branch, syncs main. (Chunks 0–1 do the equivalent manually.)
6. If CI fails: fix on the SAME branch, new commit, re-ship. Never merge red. Never `--no-verify`, never `HUSKY=0`,
   never force-push main. `--force-with-lease` is allowed on your own feature branch only.
7. Merge conflicts: `git fetch origin && git rebase origin/main`, resolve, re-run verify.
8. Never commit secrets, .env, node_modules, dist, coverage. If a secret leaks: stop, tell me, rotate it.
9. After each merged chunk print: `CHUNK <n> DONE — <PR URL> — main @ <short sha>` plus a 3-line summary, then wait for "next".
10. Manual gates (🛑): stop, state exactly what I must do, wait for "continue".

QUALITY BAR
- Strict TypeScript, no `any` (justify any unavoidable one in a comment). Validate all inputs with zod. 
- No secrets or stack traces in responses. Hash passwords. Rate-limit auth, chat, and call endpoints.
- Tests for utils, middleware, controllers/routes, and key UI logic. Accessible UI (labels, aria, keyboard, focus).
- Small focused files. No dead code. No TODO left behind without a GitHub issue reference.
- Production-ready, submission-ready output. If a requirement is ambiguous, pick the safest sensible default and note it in the PR body.
