# mdlite

Ein bewusst schlanker Markdown-Editor im Browser. Live unter **[mdlite.martuni.de](https://mdlite.martuni.de)**.

Kein Login, kein Backend, kein PWA-Ballast: Alles läuft lokal im Browser, Dokumente
werden automatisch in `localStorage` gesichert — wer wiederkommt, macht dort weiter,
wo er aufgehört hat.

## Features

- **Split-Ansicht** mit Live-Vorschau (umschaltbar: Editor / Geteilt / Vorschau)
- **Tabs** mit frei vergebbaren Namen (Doppelklick auf den Tab; leerer Name = automatischer Titel aus der ersten Überschrift)
- **Dokumenten-Seitenleiste** mit Titel und Snippet
- **Formatierungs-Toolbar** + Tastenkürzel (⌘B/I/E/K, ⌘S/N/O, Tab = 2 Leerzeichen)
- **Frontmatter-Editor**: einfacher Key/Value-Dialog, der den YAML-Block am Dokumentanfang pflegt; in der Vorschau als dezente Karte dargestellt
- **Datei-Operationen**: `.md` öffnen und speichern, Export als eigenständiges HTML, Drucken/PDF über den Browser
- **Hell/Dunkel**-Umschaltung, Schriftgröße, Zeilennummern
- Statusleiste mit Wort-/Zeichen-/Zeilenzahl und Cursorposition

## Bewusst weggelassen

Dieses Projekt ist der Neuanfang eines größeren Editors ([mark](https://mark.martuni.de)),
reduziert auf das, was tatsächlich genutzt wird. Kein CodeMirror, kein
Syntax-Highlighting-Themenzoo, kein PWA/Service-Worker, kein GitHub-Sync,
kein PDF-/docx-Export, kein Linter. Code-Blöcke werden als Code dargestellt — mehr nicht.

## Technik

- [Vite](https://vite.dev) + Vanilla TypeScript, kein Framework
- Laufzeit-Abhängigkeiten: nur [`marked`](https://marked.js.org) (Markdown → HTML)
  und [`dompurify`](https://github.com/cure53/DOMPurify) (Sanitizing)
- Design: „Depot Design System" (`design_handoff_depot_design/`), Styling ausschließlich
  über die CSS-Variablen aus `src/tokens.css` (Light/Dark via `data-theme`)
- Gesamtgröße: ~29 kB gzip JavaScript

## Entwicklung

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Typecheck + Produktions-Build nach dist/
```

## Deployment

Statisches Hosting des `dist/`-Ordners genügt. Produktiv läuft die Seite hinter
Caddy (`/etc/caddy/sites/mdlite.caddy`) auf mdlite.martuni.de.
