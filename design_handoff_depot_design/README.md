# Handoff: Depot Design System

## Overview
A reusable design system — warm cream canvas, emerald accent, stone neutrals, soft
shadows, generous radii — plus a working **Markdown editor (lite)** built on it.
This package lets a developer using Claude Code implement the same look & feel in a
real codebase.

## About the design files
The files in `reference/` are **design references written in HTML** — prototypes that
show the intended look and behavior. They are **not** meant to be shipped as-is.
The task is to **recreate them in your target environment** (React, Vue, Svelte,
SwiftUI, plain HTML/CSS, …) using that project's established patterns and component
library. If the project has no framework yet, pick the most appropriate one and
implement there.

The one file meant to be used **directly** is **`tokens.css`** — it is production-ready
plain CSS (custom properties + `.prose`/highlight.js styles). Import it globally and
build against the variables.

## Fidelity
**High-fidelity.** Final colors, typography, spacing and interactions. Recreate the UI
faithfully, but with your codebase's own components — map the tokens onto your
framework (e.g. CSS vars, Tailwind theme, or a theme object).

## How to reference this in Claude Code
1. Copy this whole folder into your repo, e.g. `design/`.
2. Import the tokens once, globally:
   ```html
   <link rel="stylesheet" href="/design/tokens.css">
   ```
   (or `@import "./design/tokens.css";` in your root stylesheet).
3. Add the Google Fonts `<link>` noted at the top of `tokens.css` to your `<head>`.
4. In your Claude Code prompt, point at the files by path and state the rule, e.g.:
   > "Follow the design system in `design/DESIGN.md`. Use only the CSS variables from
   > `design/tokens.css` — never hard-code colors, fonts or shadows. Here's the visual
   > reference: `design/reference/Depot Design System (standalone).html`. Build a
   > <your feature> screen in <React/…> using our existing components."
5. Optionally add a short pointer in your repo's `CLAUDE.md` so every session knows it:
   > "Visual style: Depot Design System — see `design/DESIGN.md` and `design/tokens.css`.
   > All UI must use those tokens; light + dark via `data-theme`."

## Design tokens
Full source of truth is **`tokens.css`** (light on `:root`, dark on `[data-theme="dark"]`).
Summary of roles:
- **Surfaces/text:** `--background --card --popover --muted --foreground --muted-foreground`
- **Brand:** `--primary` emerald · `--secondary` mint · `--accent` peach (+ `-foreground` pairs)
- **Status:** `--success --warning --info --destructive`
- **Links:** `--link --link-hover --link-visited` (use `--link` for text links, not `--primary`)
- **Lines/focus:** `--border --input --ring`
- **Charts:** `--chart-1…5`
- **Code:** `--code-bg --code-border --code-inline-bg` + `--syn-keyword/string/number/comment/function/tag/attr/punct`
- **Shape:** `--radius-sm 8 / --radius 10 / --radius-lg 16 / --radius-xl 20 / --radius-pill 999`; one shadow `--shadow-soft`
- **Type:** `--font-display` Bricolage Grotesque (headings) · `--font-sans` Schibsted Grotesk (UI/body) · `--font-mono` Geist Mono (numbers/code). Use `tabular-nums` on data.

## Components & patterns
See **`DESIGN.md` §2–3** for the full pattern list (buttons, cards, inputs, toggles,
tabs, tables, badges, alerts, dialogs, tooltips, editor toolbar, syntax highlighting,
`.prose` rendered content) with exact sizes, radii and state rules.

## The Markdown editor (lite)
`reference/Markdown Editor Lite.dc.html` is a full working example built on the system:
- Split editor / live preview (real Markdown via `marked` + `DOMPurify`); mobile view toggle.
- Formatting toolbar (bold/italic/code/headings/lists/quote/link/image/table) + shortcuts (⌘B/I/E/K, ⌘S/N/O).
- Multiple documents as tabs, document sidebar, file menu (New/Open/Save `.md`/Export HTML/Print).
- Settings dialog (font size, line numbers, theme), status bar (words/chars/lines, cursor, saved state).
- Code blocks highlighted via `highlight.js`, mapped to the `--syn-*` tokens in `tokens.css`.
- Auto-saves to `localStorage`.
Third-party libs used (load from your package manager or a CDN): `marked`, `dompurify`, `highlight.js`.

## Files
- `tokens.css` — production CSS variables + `.prose` + highlight.js mapping (**use directly**).
- `DESIGN.md` — the design guide (foundations, component patterns, do/don't).
- `reference/Depot Design System (standalone).html` — offline visual reference of the whole system.
- `reference/Depot Design System.dc.html` — source of the system showcase.
- `reference/Markdown Editor Lite.dc.html` — source of the working editor example.
