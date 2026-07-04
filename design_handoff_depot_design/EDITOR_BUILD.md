# Build Guide: Markdown Editor (Lite)

A self-sufficient spec to rebuild the **Markdown Editor Lite** as a real app in your
codebase. The HTML file `reference/Markdown Editor Lite.dc.html` is the visual & behavioral
reference — recreate it in your framework, don't ship the HTML as-is. Style everything
with the variables in `tokens.css` (never hard-code colors/fonts/shadows).

---

## Ready-to-paste prompt for Claude Code

> Build the Markdown editor from `reference/Markdown Editor Lite.dc.html` as a real app
> in this repo using **[React + Vite / Next.js / Vue / your stack]**. Requirements:
> - Import `tokens.css` globally; use its CSS variables for all styling (light + dark via
>   `data-theme` on `<html>`). Add the Google Fonts link noted in `tokens.css`.
> - Use `marked` for Markdown→HTML, `dompurify` to sanitize, and `highlight.js` for code
>   blocks (the `.hljs-*` → `--syn-*` mapping is already in `tokens.css`).
> - Follow the layout, components, interactions and state described in `EDITOR_BUILD.md`.
> - Match spacing, radii and type from `DESIGN.md`. Keep it accessible (labels, focus rings,
>   44px min hit targets on mobile).
> Start with the split editor/preview + live rendering, then add the toolbar, tabs, sidebar,
> file menu, settings and status bar.

Install: `npm i marked dompurify highlight.js`

---

## Overview
A lightweight, privacy-friendly Markdown editor: type on the left, live-rendered preview
on the right. No backend — documents auto-save to `localStorage`.

## Layout
Full-height app, flex column:
1. **Top bar** (`--card` bg, 1px bottom border): sidebar toggle · app logo+name · **Datei**
   menu button · flexible spacer · view segmented control (Editor / Split / Vorschau) ·
   settings gear · theme toggle. All icon buttons 34×34, radius 10.
2. **Tab strip** (`--card`, 1px bottom border, horizontally scrollable): one pill per open
   doc (active = `--muted` bg + border + status dot in `--primary`; close ✕ on each) and a
   dashed “+” new-tab button.
3. **Body** (flex row, fills remaining height):
   - **Sidebar** (`--card`, 244px, collapsible): “DOKUMENTE” label + count pill; list of
     docs (icon + title + snippet; active item = `--muted` + border).
   - **Editor pane** (flex 1, right border when split): formatting **toolbar** (row of
     32×32 ghost icon buttons + `H1/H2/H3` text buttons + 1px separators, horizontally
     scrollable) above a monospace **textarea** (`--font-mono`, line-height 1.7, padding
     18–20). Optional **line-number gutter** (52px, right-aligned, `--muted-foreground`
     @55% opacity, scroll-synced to the textarea).
   - **Preview pane** (flex 1, `--card` bg): scroll container, padding 28–34, centered
     `max-width: 760px` `.prose` element whose `innerHTML` = sanitized rendered Markdown.
4. **Status bar** (`--card`, 1px top border, 12px `--muted-foreground`): saved indicator
   (dot: `--primary` when saved, `--warning` when unsaved) · word / char / line counts ·
   spacer · `Zeile X, Sp. Y` (mono) · `Markdown`.

**View modes:** `split` shows both panes; `editor` hides preview; `preview` hides editor.
On mobile default to `split` but let the segmented control switch to single panes.

## Components (exact treatment)
- **Icon buttons:** 34×34 (chrome) / 32×32 (toolbar), radius 10/8, transparent bg,
  `--muted` on hover, `--foreground` icon, stroke-width ~2, `currentColor`.
- **Datei dropdown** (`--card`, 1px border, radius 14, `--shadow-soft`, pops under button):
  Neues Dokument (⌘N), Öffnen… (⌘O), Speichern .md (⌘S), — divider —, Als HTML exportieren,
  Drucken / PDF. Rows: icon + label + optional mono shortcut, `--muted` on hover.
- **Segmented control & tabs:** pill group on `--muted`; active = `--card` + `--shadow-soft`.
- **Settings dialog:** overlay `oklch(0.2 0.02 60 / 0.45)` + blur; sheet `--card`, radius 20,
  max-width 440. Rows: font size (−/number/+, 12–22), line numbers (toggle switch),
  appearance (Hell/Dunkel segmented), and a destructive “Alle Dokumente zurücksetzen”.
- **Toggle switch:** 42×24 pill track (`--primary` when on, else `--border`), 18px white knob.

## Interactions & behavior
- **Live preview:** on every input, `preview.innerHTML = DOMPurify.sanitize(marked.parse(md))`,
  then run `hljs.highlightElement` on each `pre code`. Configure marked with `{gfm:true, breaks:true}`
  (enables tables + task lists). Debounce optional.
- **Toolbar formatting** operates on the textarea selection:
  - Wrap: bold `**…**`, italic `*…*`, strikethrough `~~…~~`, inline code `` `…` ``.
  - Line-prefix (per selected line): H1 `# `, H2 `## `, H3 `### `, bullet `- `,
    ordered `1. ` (incrementing), checklist `- [ ] `, quote `> `.
  - Insert: link `[Text](https://)`, image `![alt](https://)`, table template, fenced code
    block (caret placed inside). Restore selection after edit.
- **Shortcuts:** ⌘/Ctrl+B/I/E/K (bold/italic/code/link), ⌘S save, ⌘N new, ⌘O open, Tab inserts 2 spaces.
- **Tabs:** click to switch; ✕ closes (if last one closes, seed a fresh empty doc). Tab/sidebar
  **title derives from the first heading/first non-empty line**; snippet from the next line.
- **File ops:** Open = hidden `<input type=file accept=.md,.markdown,.txt>` → read as text → new tab.
  Save = download `.md` Blob. Export HTML = standalone HTML doc (inline print-friendly CSS) Blob.
  Print = switch to preview view then `window.print()`.
- **Theme toggle** flips `data-theme` between `''`/`dark`. **Sidebar toggle** shows/hides sidebar.

## State
- `docs: [{ id, content }]`, `activeId`
- `theme` ('light'|'dark'), `view` ('split'|'editor'|'preview'), `sidebarOpen` (bool)
- `showLineNumbers` (bool), `fontSize` (12–22), `saved` (bool), `cursor {line, col}`
- Persist `{docs, activeId, theme, view, sidebarOpen, showLineNumbers, fontSize}` to
  `localStorage` on change; hydrate on load; seed a welcome document if empty.
- Derived (not stored): word/char/line counts, tab titles/snippets.

## Rendered content (.prose) & syntax colors
Both are already defined in `tokens.css` — apply the `.prose` class to the preview container
and load highlight.js; the `--syn-*` mapping colors code blocks in both themes automatically.

## Files in this bundle
- `tokens.css` — production CSS variables + `.prose` + hljs mapping (use directly).
- `DESIGN.md` — the overall design system (foundations + component patterns).
- `reference/Markdown Editor Lite.dc.html` — the visual/behavioral reference to recreate.
