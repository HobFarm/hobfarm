# HobFarm Repository Workflow

Focused reference extracted from the former root repository guide. Read it when the root `AGENTS.md` routes the current task here.

## Purpose

This repository contains the HobFarm publishing website, public catalog, and supporting applications.

HobFarm is an independent publisher and creative studio. It publishes articles, recurring stories and media titles, visual work, games, creative applications, production notes, courses, merchandise, and digital releases.

Agents working in this repo should help build, fix, organize, validate, and improve the website. Work should be practical, scoped, and validated before handoff.

---

## Agent Role

You are operating inside the HobFarm website repo.

Your job is to:

1. Inspect the current repo state.
2. Understand the requested task.
3. Make the smallest useful change that solves the task.
4. Preserve working behavior.
5. Run validation.
6. Summarize what changed and what still needs review.

Do not turn a small website fix into a full redesign.

Do not invent new architecture when existing routes, layouts, components, or content collections can be adapted.

Do not focus on outdated brand systems, seasonal scaffolds, or old style language unless an existing file requires compatibility.

---

## Priority Rules

When instructions conflict, use this order:

1. Explicit user request in the current task.
2. The root `AGENTS.md` and the focused project references or skills it routes for the task.
3. `CLAUDE.md`, if the agent is Claude Code or the task references Claude Code.
4. Existing repo conventions.
5. Framework and platform best practices.

Current thread context beats old project lore.

Working code beats theoretical architecture.

Validated fixes beat large speculative rewrites.

---

## Standard Work Procedure

For every task:

1. Confirm the repository is on `main`, then run or inspect `git status --short`.
2. Identify existing uncommitted changes.
3. Avoid overwriting unrelated user or agent changes.
4. Inspect relevant files before editing.
5. Make focused edits.
6. Run the correct validation command.
7. Fix validation errors caused by the task.
8. Leave validated work in the shared `main` worktree for user review.
9. Follow the plain-language release authorization below. Do not make the user
   translate an outcome such as "deploy this" into separate Git instructions.
10. Summarize files changed, commands run, and results.

If uncommitted changes exist in files you need to edit, inspect them first. Do not overwrite them blindly.

### Plain-language release authorization

Treat the user's requested outcome as the authorization boundary:

- "Commit this" authorizes a focused commit of the validated task changes on
  `main`.
- "Push this" authorizes the focused commit when needed and a normal,
  non-force push to `origin/main`.
- "Deploy this," "publish this," "make it live," or "update the live site"
  authorizes the normal end-to-end release path: validate, commit the scoped
  task changes when the deployment gate requires committed source, push when
  the configured hosting workflow requires it, deploy, and verify the live
  result.

Do not ask the user to identify files, stage changes, write a commit message,
press a Git button, or repeat permission for those ordinary release steps.
Resolve the correct repository and deployment target from the project. If more
than one repository is involved, keep each commit scoped to its owning
repository and complete the required release path in the correct order.

This authorization does not include unrelated changes, force pushes,
destructive Git operations, secret rotation, production data edits, paid
provider calls, or creating new cloud resources unless the request clearly
requires them. Stop only for a real conflict that cannot be separated safely or
for a consequential choice the user has not made.

---

## Single-Branch Workflow

HobFarm is maintained by one person using AI tools. `main` is the only working,
publishing, and deployment branch.

Use these rules for every task:

1. Work directly on `main`.
2. Do not create feature branches, preview branches, alternate branches, or Git
   worktrees.
3. Do not leave work in a detached HEAD or another branch. Finished files may
   remain as uncommitted changes in the shared `main` worktree.
4. Use `npm run dev`, `npm run preview`, Chrome, or local Playwright for review.
   Do not create a branch to obtain a preview deployment.
5. Keep both complete and incomplete work on `main` as uncommitted files when
   the user has not requested a commit. Clearly label actual draft content; do
   not treat every uncommitted file as a draft or use a branch as a holding area.
6. When several agents are active, coordinate file ownership in the same
   worktree and preserve each other's changes.
7. Do not create a commit or push merely because the work is complete. A direct
   request to commit, push, publish, deploy, make live, or update the live site
   is explicit authorization for the corresponding release steps described
   above.
8. Before handoff, verify that `main` is checked out. Require a clean working
   tree only when the user requested a commit, and require `main` to match
   `origin/main` only when the user requested a push.

If the repository is not on `main`, safely move the existing work onto `main`
before continuing. Preserve all uncommitted work and unmerged commits. Do not
solve the problem by creating another branch.

---

## Commands

Use npm because `package-lock.json` is committed.

```bash
npm install
npm run dev
npm run build
npm test
npm run preview
npx astro check
```

Before assuming a script exists, inspect `package.json`.

Use `npm run build` as the main validation command.

Use `npm test` for Node-based structural tests. Test files should live in `tests/` and use the `*.test.mjs` suffix.

Use `npx astro check` when touching:

* content schemas
* Markdown frontmatter
* Astro types
* TypeScript
* TSX
* layout props
* component props

Use `npm run preview` for local visual review after a production build.

---

## Git Safety

Multiple agents may touch this repo across different tools.

Before editing:

```bash
git status --short
```

If there are unrelated changes, preserve them.

Do not create branches or worktrees for parallel work. Coordinate changes in
the shared `main` worktree and avoid editing the same files concurrently.

Keep changes scoped to the requested task.

Do not restyle unrelated pages.

Do not normalize unrelated files.

Do not run destructive git commands unless explicitly instructed.

Avoid:

```bash
git reset --hard
git clean -fd
git checkout -- .
git push --force
```

unless the user explicitly requests that exact kind of cleanup and understands the effect.

---

## Commit Rules

Use short imperative commit messages.

Examples:

```text
feat(articles): add latest feed to homepage
fix(gallery): correct hero image metadata
docs(site): update agent guide
feat(grimoire): add resolve endpoint
style(home): tighten article card spacing
```

When the user requests a commit or an outcome that requires one, commit
validated website work directly to `main`. Push `origin/main` when the user
requests a push, publication, deployment, or live update and the configured
release path requires that push. Otherwise, leave the reviewed changes
uncommitted in the shared `main` worktree. Do not create a pull request, PR
branch, review branch, or separate worktree for the normal HobFarm workflow.

---

## Final Response Requirements

At the end of a task, report:

* files changed
* commands run
* build/check result
* visual QA result if applicable
* skipped validation and why
* `main` push status and observed deployment status when a push was requested

Do not claim that Cloudflare finished deploying unless its status was actually
checked. Distinguish a successful `main` push from a confirmed production
deployment.

---
