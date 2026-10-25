# Contributing to EduReach

Thank you for your interest in contributing to EduReach! To maintain high engineering standards, clean git history, and seamless automated CI/CD, all contributors must adhere to the engineering guidelines outlined below.

---

## 1. Branching & Git Workflow

### 1.1 Branch Naming Conventions

Never commit directly to `main`. Every change must originate from a dedicated feature or maintenance branch branched from the latest `main`:

```bash
git switch main
git pull --ff-only
git switch -c <type>/<short-description>
```

Allowed branch prefixes (kebab-case):

- `feat/`: New user-facing or platform features (e.g. `feat/voice-call-history`)
- `fix/`: Bug fixes (e.g. `fix/phone-validation-regex`)
- `chore/`: Tooling, dependency, or configuration updates (e.g. `chore/containerization`)
- `docs/`: Documentation updates (e.g. `docs/project-documentation`)
- `test/`: Test additions or test infrastructure refactoring (e.g. `test/client-coverage`)
- `ci/`: GitHub Actions and workflow updates (e.g. `ci/add-docker-runner`)
- `refactor/`: Code improvements without behavior changes (e.g. `refactor/server-utils`)

---

### 1.2 Conventional Commits

All commit messages are strictly checked via Husky and `@commitlint/cli`. Follow the Conventional Commits specification:

```text
type(scope): imperative short summary (<= 72 chars)

[optional body explaining rationale and context]
```

- **Types**: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`, `build`, `perf`
- **Allowed Scopes**: `server`, `client`, `auth`, `ai`, `voice`, `ci`, `docs`, `deps`

**Examples**:

- `feat(voice): add call popup with state machine and consent`
- `fix(auth): correct duplicate email error status code`
- `docs(api): document chat and voice endpoints`
- `chore(deps): update langchain dependencies`

---

### 1.3 Pre-commit Hooks & Formatting

The monorepo uses Husky and `lint-staged`:

- Every staged file is automatically formatted with **Prettier** before commit.
- Every commit message is validated against the commitlint configuration.

To manually format all project files:

```bash
npm run format
```

---

## 2. Monorepo Quality Gate: `npm run verify`

Before creating a pull request or shipping code, you must run the comprehensive monorepo verification script:

```bash
npm run verify
```

This script sequentially executes:

1. `npm --prefix server run lint` & `npm --prefix client run lint` (ESLint)
2. `npm --prefix server run typecheck` & `npm --prefix client run typecheck` (`tsc --noEmit`)
3. `npm --prefix server run test` (Vitest backend suite)
4. `npm --prefix client run test` (Vitest + JSDOM frontend suite)
5. `npm --prefix server run build` & `npm --prefix client run build` (Vite & TypeScript production bundle verification)

A failure at any stage stops the pipeline and prevents code from being shipped.

---

## 3. Shipping & Pull Request Automation: `scripts/ship.sh`

EduReach includes an automated shipping utility that handles pushing, pull request creation, CI monitoring, and squash-merging:

```bash
# On Git Bash or POSIX shell:
./scripts/ship.sh "<conventional PR title>" "<optional PR body>"

# On Windows PowerShell:
& "C:\Program Files\Git\bin\bash.exe" scripts/ship.sh "feat(voice): add call popup UI"
```

The script performs the following actions automatically:

1. Verifies that the working tree is clean.
2. Pushes the branch to GitHub (`git push -u origin <branch>`).
3. Creates a pull request with the provided title and body.
4. Watches and waits for all GitHub Actions CI checks to turn green.
5. Performs a **squash-merge** into `main` and deletes the remote branch.
6. Switches your local repository back to `main` and fast-forwards `main`.

---

## 4. TypeScript & Node 24 Engineering Rules

EduReach targets **Node.js 24 native ESM** and modern strict TypeScript:

1. **Relative Imports**: All relative imports within `server/` must explicitly include the `.ts` extension (e.g. `import { env } from "../config/env.ts";`).
2. **`verbatimModuleSyntax`**: Always use `import type` for type-only imports to allow TypeScript to strip types cleanly during compilation.
3. **Erasable Syntax**:
   - ❌ NO TypeScript `enum`s (use string union types or `as const` object maps).
   - ❌ NO constructor parameter properties (explicitly declare class fields).
   - ❌ NO namespaces (except `declare global` if strictly necessary).
4. **Runtime Input Validation**: Never trust external network payloads or query parameters. Always validate inputs using **Zod** schemas before processing.
5. **No `any`**: The codebase maintains strict typing without `any`. Any unavoidable exceptions must be justified with an inline comment.
6. **Error Envelope**: All API controllers must return responses adhering to the `{ success: true, data }` or `{ success: false, message }` envelope contract.
