# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio site for Watchakorn Buddeewong (wk-18k). Static SvelteKit app deployed to GitHub Pages.

## Commands

```bash
bun install          # install deps
bun run dev          # dev server (localhost:5173)
bun run build        # static build → build/
bun run preview      # preview production build
bun run check        # svelte-check type checking
```

## Architecture

- **SvelteKit 1.x** with `adapter-static` — fully prerendered, no SSR
- **Svelte 4** components with TypeScript
- **Tailwind CSS 3** + custom CSS variables for theming (light/dark/system)
- **Bun** as package manager and script runner

### Key Paths

- `src/routes/` — pages: index, `/about`, `/portfolio`, `/certificate`
- `src/routes/about/` — has sub-components: `DisplayCoding.svelte`, `DisplayData.svelte`, `DisplayInfo.svelte`
- `src/lib/theme.ts` — Svelte writable store for light/dark/system theme, persisted to localStorage
- `src/lib/waketime.ts` — fetches WakaTime coding stats via axios
- `src/lib/portfolio.json` — project data (name, desc, image URL, tags)
- `src/lib/certificate.json` — certificate data (name, image filename)
- `src/app.css` — design system: CSS custom properties, component classes (`.card-industrial`, `.btn-primary`, `.nav-link`, etc.)
- `static/certificate/` — certificate images (`cert_1.png` through `cert_20.png`)

### Design System

Industrial/brutalist aesthetic. Key design tokens in `app.css` via CSS custom properties (`--color-substrate`, `--color-ink`, `--color-accent`, etc.). Dark mode toggled by `.dark` class on `<html>`. Accent color: `#E61919`. Fonts: JetBrains Mono (body), Geist (sans), Archivo Black (display headings).

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with Bun and deploys to GitHub Pages on push to `master`. `BASE_PATH` env var is set to repo name for correct asset paths on GH Pages.

### Layout

`+layout.ts` sets `prerender = true` globally. `+layout.svelte` provides nav bar (desktop + mobile), footer, and theme toggle. Navigation uses `$app/paths` `base` for GH Pages compatibility.

## Skills Usage Guide

**ALWAYS use:** `/karpathy-guidelines` — invoke on every task before writing/reviewing code.

Use other skills only when task matches. Don't stack multiple skills unless truly needed — each costs tokens.

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

### Typical combos for this project

- **New page/section:** `karpathy-guidelines` + `industrial-brutalist-ui`
- **Add scroll animation:** `karpathy-guidelines` + `gsap-core` + `gsap-scrolltrigger` + `gsap-frameworks`
- **Bug fix / refactor:** `karpathy-guidelines` only
- **Design polish:** `karpathy-guidelines` + `design-taste-frontend-v1`
