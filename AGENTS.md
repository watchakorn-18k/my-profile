# AGENTS.md

## Project Overview

This repository is a personal portfolio site for Watchakorn Buddeewong.
It is built with SvelteKit 1, Svelte 4, TypeScript, Vite, Tailwind CSS, and
custom global CSS in `src/app.css`.

The site is statically prerendered for GitHub Pages:

- `src/routes/+layout.ts` sets `prerender = true`.
- `svelte.config.js` uses `@sveltejs/adapter-static`.
- `kit.paths.base` is empty in dev and reads `process.env.BASE_PATH` for production builds.

## Core Commands

Use the scripts already defined in `package.json`:

- `npm run dev` - start the Vite dev server.
- `npm run check` - run `svelte-check` with the project TypeScript config.
- `npm run build` - create the static production build in `build/`.
- `npm run preview` - preview the production build locally.

The repo currently has multiple lockfiles (`package-lock.json`, `yarn.lock`,
and `bun.lockb`). Do not update lockfiles unless dependency changes are required.
If dependency changes are required, keep the change scoped and explain which
package manager was used.

## Important Files

- `src/routes/+layout.svelte` - shared shell, navigation, footer, theme init.
- `src/routes/+page.svelte` - landing page and resume download.
- `src/routes/about/+page.svelte` - profile, skills, experience, WakaTime data.
- `src/routes/portfolio/+page.svelte` - portfolio list from `src/lib/portfolio.json`.
- `src/routes/certificate/+page.svelte` - certificate list from `src/lib/certificate.json`.
- `src/lib/theme.ts` - light/dark/system theme store and DOM theme application.
- `src/lib/waketime.ts` - client-side WakaTime data helper.
- `src/app.css` - global design tokens, component classes, animations, and noise overlay.
- `tailwind.config.js` - Tailwind content paths, CSS variable color aliases, fonts, and sizing.

## Design Direction

Preserve the current industrial/brutalist portfolio style:

- Monospace typography, uppercase labels, bracketed metadata, hard borders, tight grids.
- Off-white/dark substrate, black/near-white ink, muted gray text, red accent `#E61919`.
- Prefer existing component classes such as `heading-display`, `tag-bracket`,
  `section-border`, `card-industrial`, `btn-primary`, and `btn-outline`.
- Keep layouts responsive with Tailwind breakpoints already used in the app.
- Avoid adding unrelated decorative gradients, soft card-heavy marketing layouts, or
  a visual style that conflicts with the current grid-based presentation.

## SvelteKit Guidance

- Use `$lib/...` aliases for imports under `src/lib`.
- When linking internal routes, account for the configured base path. Existing layout
  links use `$app/paths` `base`; follow that pattern for new shared navigation links.
- Keep browser-only APIs inside `onMount` or behind SvelteKit browser checks.
  This matters because the app is prerendered.
- Keep remote images lazy-loaded where practical and provide useful `alt` text.
- Prefer typed data structures when adding larger inline arrays or JSON-driven views.

## Content And Data

- Portfolio entries live in `src/lib/portfolio.json`.
- Certificate entries live in `src/lib/certificate.json`.
- The resume asset is `src/lib/assets/my_resume.pdf`; the landing page controls the
  downloaded filename.
- Certificate images are currently resolved from the GitHub raw URL path. Be careful
  when renaming certificate assets or changing repository branch assumptions.

## Quality Checks

Before finishing changes that affect source code, run:

1. `npm run check`
2. `npm run build`

For documentation-only changes, tests are not required, but note that no runtime
verification was needed.

## Change Discipline

- Keep edits focused on the requested behavior or documentation.
- Do not reformat unrelated files.
- Do not change deployment/base-path behavior unless the task specifically requires it.
- Do not remove existing content, links, or assets without confirming the intent.
- If changing dependencies, scripts, or build config, explain the impact clearly.

## Skills Usage Guide

**ALWAYS invoke `/karpathy-guidelines` before writing or reviewing code — no exceptions.**

Only invoke additional skills when the task directly matches. Each skill costs tokens; don't stack unnecessarily.

| Skill | When to use |
|---|---|
| `karpathy-guidelines` | **Every task.** Reduces LLM coding mistakes, enforces surgical changes. |
| `industrial-brutalist-ui` | Adding new UI components or pages. Ensures brutalist style consistency. |
| `design-taste-frontend-v1` | Evaluating or improving visual design quality of existing pages. |
| `high-end-visual-design` | Major visual overhaul or premium polish pass. Rarely needed. |
| `minimalist-ui` | Only if pivoting to minimal style. **Conflicts with current brutalist aesthetic — avoid.** |
| `redesign-existing-projects` | Full-page or full-site redesign. Not for small tweaks. |
| `brandkit` | When working on brand identity, logos, color palette changes. |
| `gsap-core` | Adding basic GSAP animations (tweens, easing, stagger). |
| `gsap-scrolltrigger` | Scroll-driven animations (parallax, reveal-on-scroll). |
| `gsap-timeline` | Sequenced multi-step animations. |
| `gsap-plugins` | Using GSAP plugins (SplitText, DrawSVG, MorphSVG, etc.). |
| `gsap-performance` | Optimizing existing GSAP animations for performance. |
| `gsap-utils` | GSAP utility methods (toArray, mapRange, snap, etc.). |
| `gsap-react` | **Not applicable** — this project uses Svelte, not React. |
| `gsap-frameworks` | GSAP + Svelte integration (onMount, cleanup, scoping). Use instead of `gsap-react`. |
| `full-output-enforcement` | When Claude truncates output or gives partial code. Forces complete output. |

### Typical combos

- **New page/section:** `karpathy-guidelines` + `industrial-brutalist-ui`
- **Add scroll animation:** `karpathy-guidelines` + `gsap-core` + `gsap-scrolltrigger` + `gsap-frameworks`
- **Bug fix / refactor:** `karpathy-guidelines` only
- **Design polish:** `karpathy-guidelines` + `design-taste-frontend-v1`
