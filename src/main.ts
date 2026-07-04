import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { extractFrontmatter, stripFrontmatter, applyFrontmatter, currentDate, type FrontmatterData } from './frontmatter';
import './styles.css';

marked.setOptions({ gfm: true, breaks: true });

// ---------- State ----------

interface Doc {
  id: string;
  content: string;
  /** Vom Nutzer vergebener Tab-Name; leer = Titel aus erster Überschrift ableiten */
  name?: string;
}

interface PersistedState {
  docs: Doc[];
  activeId: string;
  theme: 'light' | 'dark';
  view: 'editor' | 'split' | 'preview';
  sidebarOpen: boolean;
  showLineNumbers: boolean;
  fontSize: number;
}

const LS_KEY = 'mdlite.v1';
const FM_DEFAULT_KEYS = ['title', 'date', 'description', 'tags', 'author'];

const WELCOME = `# Willkommen bei mdlite 👋

Ein **schlanker** Markdown-Editor. Tippe links — die Vorschau rechts rendert *live*.
Alles bleibt in deinem Browser: kein Login, kein Server, deine Texte gehören dir.

## Was funktioniert

- **Fett**, *kursiv*, ~~durchgestrichen~~ und \`inline-code\`
- Aufzählungen und nummerierte Listen
- Checklisten:
  - [x] Live-Vorschau
  - [x] Tabs mit eigenen Namen (Doppelklick auf den Tab)
  - [ ] Dein erstes Dokument
- Frontmatter über den \`{ }\`-Knopf in der Toolbar

> Tipp: Nutze die Toolbar oder Tastenkürzel wie ⌘B und ⌘I.
> Deine Arbeit wird automatisch gespeichert — komm einfach wieder.

### Codeblock

\`\`\`js
function gruss(name) {
  return \`Hallo, \${name}!\`.toUpperCase();
}
\`\`\`

### Tabelle

| Feature   | Status |
| --------- | :----: |
| Vorschau  |   ✅   |
| Tabs      |   ✅   |
| Export    |   ✅   |

[Mehr über Markdown](https://commonmark.org) · viel Spaß beim Schreiben!
`;

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function derivedTitle(content: string): string {
  for (const line of (content || '').split('\n')) {
    const t = line.replace(/^#+\s*/, '').trim();
    if (t && t !== '---') return t.slice(0, 40);
  }
  return 'Unbenannt';
}

function titleOf(doc: Doc): string {
  return doc.name || derivedTitle(stripFrontmatter(doc.content));
}

function snippetOf(doc: Doc): string {
  const lines = stripFrontmatter(doc.content)
    .split('\n')
    .map((l) => l.replace(/^[#>\-*\s]+/, '').trim())
    .filter(Boolean);
  return (lines[1] || lines[0] || 'Leeres Dokument').slice(0, 48);
}

function loadState(): PersistedState {
  let saved: Partial<PersistedState> | null = null;
  try {
    saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
  } catch {
    /* korrupter Eintrag → Neustart mit Defaults */
  }
  const docs = saved?.docs?.length ? saved.docs : [{ id: uid(), content: WELCOME }];
  return {
    docs,
    activeId: saved?.activeId && docs.some((d) => d.id === saved!.activeId) ? saved.activeId : docs[0].id,
    theme: saved?.theme === 'dark' ? 'dark' : 'light',
    view: saved?.view === 'editor' || saved?.view === 'preview' ? saved.view : 'split',
    sidebarOpen: typeof saved?.sidebarOpen === 'boolean' ? saved.sidebarOpen : true,
    showLineNumbers: typeof saved?.showLineNumbers === 'boolean' ? saved.showLineNumbers : true,
    fontSize: typeof saved?.fontSize === 'number' ? Math.min(22, Math.max(12, saved.fontSize)) : 15,
  };
}

const state = loadState();
let fileSaved = true; // seit letztem Datei-Export unverändert?

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* Speicher voll o. ä. — Editor bleibt benutzbar */
  }
}

function activeDoc(): Doc {
  return state.docs.find((d) => d.id === state.activeId) || state.docs[0];
}

// ---------- DOM ----------

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

const ta = $<HTMLTextAreaElement>('#ta');
const gutter = $('#gutter');
const preview = $('#preview');
const proseWrap = $<HTMLElement>('.prose-wrap');
const tabsEl = $('#tabs');
const docListEl = $('#doc-list');
const sidebarEl = $('#sidebar');
const editorPane = $('#editor-pane');
const previewPane = $('#preview-pane');
const fileMenu = $('#file-menu');
const fileInput = $<HTMLInputElement>('#file-input');
const savedEl = $('#saved');
const savedLabel = $('#saved-label');

// ---------- Rendering ----------

function esc(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

let lastPreviewKey = '';

function renderPreview() {
  const doc = activeDoc();
  const key = doc.id + '::' + doc.content;
  if (key === lastPreviewKey) return;
  lastPreviewKey = key;

  // Frontmatter als dezente Karte über der Vorschau
  proseWrap.querySelector('.fm-card')?.remove();
  const fm = extractFrontmatter(doc.content);
  if (fm && Object.keys(fm.frontmatter).length) {
    const card = document.createElement('div');
    card.className = 'fm-card';
    card.innerHTML =
      '<dl>' +
      Object.entries(fm.frontmatter)
        .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
        .join('') +
      '</dl>';
    proseWrap.insertBefore(card, preview);
  }

  preview.innerHTML = DOMPurify.sanitize(marked.parse(stripFrontmatter(doc.content)) as string);
}

function renderTabs() {
  tabsEl.textContent = '';
  for (const doc of state.docs) {
    const tab = document.createElement('div');
    tab.className = 'tab' + (doc.id === state.activeId ? ' active' : '');
    tab.innerHTML = `<span class="dot"></span><span class="title">${esc(titleOf(doc))}</span>` +
      `<button class="close" title="Schließen" aria-label="Tab schließen"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`;
    tab.addEventListener('click', () => selectDoc(doc.id));
    tab.querySelector('.close')!.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDoc(doc.id);
    });
    tab.querySelector('.title')!.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      startRename(doc, tab);
    });
    tabsEl.appendChild(tab);
  }
}

function startRename(doc: Doc, tab: HTMLElement) {
  const titleSpan = tab.querySelector('.title') as HTMLElement;
  const input = document.createElement('input');
  input.className = 'rename-input';
  input.value = doc.name || titleOf(doc);
  input.maxLength = 60;
  titleSpan.replaceWith(input);
  input.focus();
  input.select();

  let done = false;
  const commit = (apply: boolean) => {
    if (done) return;
    done = true;
    if (apply) {
      const v = input.value.trim();
      doc.name = v || undefined; // leer = wieder automatischer Titel
      persist();
    }
    renderTabs();
    renderSidebar();
  };
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') commit(true);
    if (e.key === 'Escape') commit(false);
  });
  input.addEventListener('blur', () => commit(true));
  input.addEventListener('click', (e) => e.stopPropagation());
}

function renderSidebar() {
  $('#doc-count').textContent = String(state.docs.length);
  docListEl.textContent = '';
  for (const doc of state.docs) {
    const item = document.createElement('button');
    item.className = 'doc-item' + (doc.id === state.activeId ? ' active' : '');
    item.innerHTML =
      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>` +
      `<span class="meta"><span class="title">${esc(titleOf(doc))}</span><span class="snippet">${esc(snippetOf(doc))}</span></span>`;
    item.addEventListener('click', () => selectDoc(doc.id));
    docListEl.appendChild(item);
  }
}

function renderGutter() {
  if (!state.showLineNumbers) {
    gutter.hidden = true;
    return;
  }
  gutter.hidden = false;
  const lines = Math.max(1, ta.value.split('\n').length);
  if (gutter.childElementCount !== lines) {
    gutter.textContent = '';
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= lines; i++) {
      const div = document.createElement('div');
      div.textContent = String(i);
      frag.appendChild(div);
    }
    gutter.appendChild(frag);
  }
  gutter.scrollTop = ta.scrollTop;
}

function renderStats() {
  const content = ta.value;
  const words = (content.trim().match(/\S+/g) || []).length;
  $('#stat-words').textContent = `${words} Wörter`;
  $('#stat-chars').textContent = `${content.length} Zeichen`;
  $('#stat-lines').textContent = `${content.split('\n').length} Zeilen`;
}

function renderCursor() {
  const pos = ta.selectionStart;
  const before = ta.value.slice(0, pos);
  const line = before.split('\n').length;
  const col = pos - before.lastIndexOf('\n');
  $('#stat-cursor').textContent = `Zeile ${line}, Sp. ${col}`;
}

function renderSaved() {
  savedEl.classList.toggle('unsaved', !fileSaved);
  savedLabel.textContent = fileSaved ? 'Gespeichert' : 'Ungespeichert';
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme === 'dark' ? 'dark' : '';
  $('#set-light').classList.toggle('active', state.theme === 'light');
  $('#set-dark').classList.toggle('active', state.theme === 'dark');
}

function applyView() {
  const showEditor = state.view !== 'preview';
  const showPreview = state.view !== 'editor';
  editorPane.hidden = !showEditor;
  previewPane.hidden = !showPreview;
  editorPane.classList.toggle('with-preview', showEditor && showPreview);
  for (const btn of document.querySelectorAll<HTMLElement>('.seg-btn[data-view]')) {
    btn.classList.toggle('active', btn.dataset.view === state.view);
  }
}

function applySidebar() {
  sidebarEl.hidden = !state.sidebarOpen;
}

function applyFontSize() {
  ta.style.fontSize = state.fontSize + 'px';
  gutter.style.fontSize = state.fontSize + 'px';
  $('#fontsize-value').textContent = String(state.fontSize);
  $('#fontsize-current').textContent = String(state.fontSize);
}

function renderAll() {
  ta.value = activeDoc().content;
  renderTabs();
  renderSidebar();
  renderPreview();
  renderGutter();
  renderStats();
  renderCursor();
  renderSaved();
  applyTheme();
  applyView();
  applySidebar();
  applyFontSize();
}

// ---------- Dokument-Operationen ----------

function selectDoc(id: string) {
  if (id === state.activeId) return;
  state.activeId = id;
  persist();
  renderAll();
}

function newDoc(content = '# Unbenannt\n\n', name?: string) {
  const doc: Doc = { id: uid(), content, name };
  state.docs.push(doc);
  state.activeId = doc.id;
  persist();
  renderAll();
  ta.focus();
}

function closeDoc(id: string) {
  const idx = state.docs.findIndex((d) => d.id === id);
  state.docs = state.docs.filter((d) => d.id !== id);
  if (!state.docs.length) state.docs = [{ id: uid(), content: '# Unbenannt\n\n' }];
  if (state.activeId === id) {
    state.activeId = (state.docs[Math.max(0, idx - 1)] || state.docs[0]).id;
  }
  persist();
  renderAll();
}

function setContent(value: string, selStart?: number, selEnd?: number) {
  activeDoc().content = value;
  fileSaved = false;
  persist();
  if (ta.value !== value) ta.value = value;
  if (selStart != null) {
    ta.focus();
    ta.setSelectionRange(selStart, selEnd ?? selStart);
  }
  renderPreview();
  renderTabs();
  renderSidebar();
  renderGutter();
  renderStats();
  renderCursor();
  renderSaved();
}

// ---------- Formatierung ----------

function wrapSelection(before: string, after: string, placeholder: string) {
  const s = ta.selectionStart;
  const e = ta.selectionEnd;
  const v = ta.value;
  const sel = v.slice(s, e) || placeholder;
  const nv = v.slice(0, s) + before + sel + after + v.slice(e);
  const ns = s + before.length;
  setContent(nv, ns, ns + sel.length);
}

function linePrefix(prefix: string, ordered = false) {
  const v = ta.value;
  const s = ta.selectionStart;
  const e = ta.selectionEnd;
  const ls = v.lastIndexOf('\n', s - 1) + 1;
  let le = v.indexOf('\n', e);
  if (le === -1) le = v.length;
  let i = 0;
  const out = v
    .slice(ls, le)
    .split('\n')
    .map((line) => {
      i++;
      return (ordered ? i + '. ' : prefix) + line;
    })
    .join('\n');
  setContent(v.slice(0, ls) + out + v.slice(le), ls, ls + out.length);
}

function insertText(text: string, caretBack = 0) {
  const s = ta.selectionStart;
  const nv = ta.value.slice(0, s) + text + ta.value.slice(ta.selectionEnd);
  const pos = s + text.length - caretBack;
  setContent(nv, pos, pos);
}

const formatActions: Record<string, () => void> = {
  bold: () => wrapSelection('**', '**', 'fett'),
  italic: () => wrapSelection('*', '*', 'kursiv'),
  strike: () => wrapSelection('~~', '~~', 'durchgestrichen'),
  code: () => wrapSelection('`', '`', 'code'),
  h1: () => linePrefix('# '),
  h2: () => linePrefix('## '),
  h3: () => linePrefix('### '),
  ul: () => linePrefix('- '),
  ol: () => linePrefix('', true),
  check: () => linePrefix('- [ ] '),
  quote: () => linePrefix('> '),
  link: () => wrapSelection('[', '](https://)', 'Text'),
  image: () => insertText('![Bildbeschreibung](https://)'),
  table: () => insertText('\n| Spalte A | Spalte B |\n| --- | --- |\n| Wert | Wert |\n'),
  codeblock: () => insertText('\n```\n\n```\n', 5),
};

// ---------- Datei-Operationen ----------

function filenameOf(doc: Doc): string {
  const base = titleOf(doc)
    .replace(/[^\wäöüÄÖÜß\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return base || 'dokument';
}

function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveMd() {
  const doc = activeDoc();
  download(filenameOf(doc) + '.md', doc.content, 'text/markdown;charset=utf-8');
  fileSaved = true;
  renderSaved();
}

const EXPORT_CSS = `body{max-width:760px;margin:40px auto;padding:0 24px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#2a2622}h1,h2,h3{line-height:1.2}h2{border-bottom:1px solid #e7e2d9;padding-bottom:.2em}a{color:#1b7a52}code{font-family:ui-monospace,monospace;background:#f2efe8;padding:.15em .4em;border-radius:6px}pre{background:#f7f5ef;border:1px solid #e7e2d9;border-radius:12px;padding:14px 16px;overflow:auto}pre code{background:none;padding:0}blockquote{border-left:3px solid #1b7a52;margin:1em 0;padding:.3em 1.1em;color:#6b655c}table{border-collapse:collapse;width:100%}th,td{border:1px solid #e7e2d9;padding:8px 12px}th{background:#f2efe8}img{max-width:100%}@media print{body{margin:16px auto}}`;

function exportHtml() {
  const doc = activeDoc();
  const body = DOMPurify.sanitize(marked.parse(stripFrontmatter(doc.content)) as string);
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titleOf(doc))}</title><style>${EXPORT_CSS}</style></head><body>${body}</body></html>`;
  download(filenameOf(doc) + '.html', html, 'text/html;charset=utf-8');
}

function printDoc() {
  const prevView = state.view;
  state.view = 'preview';
  applyView();
  setTimeout(() => {
    window.print();
    state.view = prevView;
    applyView();
  }, 120);
}

function openFilePicker() {
  fileInput.click();
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const name = file.name.replace(/\.(md|markdown|txt)$/i, '');
    newDoc(String(reader.result || ''), name);
    fileSaved = true;
    renderSaved();
  };
  reader.readAsText(file);
  fileInput.value = '';
});

// ---------- Frontmatter-Dialog ----------

const fmOverlay = $('#fm-overlay');
const fmRows = $('#fm-rows');

function fmAddRow(key = '', value = '') {
  const row = document.createElement('div');
  row.className = 'fm-row';
  row.innerHTML =
    `<input class="key" type="text" placeholder="schlüssel" spellcheck="false">` +
    `<input class="value" type="text" placeholder="Wert">` +
    `<button class="del" title="Eintrag löschen" aria-label="Eintrag löschen"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`;
  (row.querySelector('.key') as HTMLInputElement).value = key;
  (row.querySelector('.value') as HTMLInputElement).value = value;
  row.querySelector('.del')!.addEventListener('click', () => row.remove());
  fmRows.appendChild(row);
}

function openFrontmatter() {
  fmRows.textContent = '';
  const fm = extractFrontmatter(activeDoc().content);
  if (fm && Object.keys(fm.frontmatter).length) {
    for (const [k, v] of Object.entries(fm.frontmatter)) fmAddRow(k, v);
  } else {
    for (const key of FM_DEFAULT_KEYS) fmAddRow(key, key === 'date' ? currentDate() : '');
  }
  fmOverlay.hidden = false;
  (fmRows.querySelector('input.value') as HTMLInputElement | null)?.focus();
}

function saveFrontmatter() {
  const data: FrontmatterData = {};
  for (const row of fmRows.querySelectorAll('.fm-row')) {
    const key = (row.querySelector('.key') as HTMLInputElement).value.trim();
    const value = (row.querySelector('.value') as HTMLInputElement).value.trim();
    if (key && value) data[key] = value;
  }
  setContent(applyFrontmatter(activeDoc().content, data));
  fmOverlay.hidden = true;
}

// ---------- Wiring ----------

ta.addEventListener('input', () => setContent(ta.value));
ta.addEventListener('scroll', () => {
  gutter.scrollTop = ta.scrollTop;
});
for (const ev of ['keyup', 'click']) ta.addEventListener(ev, renderCursor);
ta.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    insertText('  ');
  }
});

for (const btn of document.querySelectorAll<HTMLElement>('[data-fmt]')) {
  btn.addEventListener('click', () => formatActions[btn.dataset.fmt!]?.());
}

$('#btn-sidebar').addEventListener('click', () => {
  state.sidebarOpen = !state.sidebarOpen;
  persist();
  applySidebar();
});
$('#btn-theme').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  persist();
  applyTheme();
});
$('#btn-newtab').addEventListener('click', () => newDoc());

for (const btn of document.querySelectorAll<HTMLElement>('.seg-btn[data-view]')) {
  btn.addEventListener('click', () => {
    state.view = btn.dataset.view as PersistedState['view'];
    persist();
    applyView();
  });
}

// Datei-Menü
const btnFile = $('#btn-file');
btnFile.addEventListener('click', (e) => {
  e.stopPropagation();
  fileMenu.hidden = !fileMenu.hidden;
});
document.addEventListener('click', () => {
  fileMenu.hidden = true;
});
const fileCommands: Record<string, () => void> = {
  new: () => newDoc(),
  open: openFilePicker,
  save: saveMd,
  'export-html': exportHtml,
  print: printDoc,
};
for (const item of document.querySelectorAll<HTMLElement>('.menu-item')) {
  item.addEventListener('click', () => {
    fileMenu.hidden = true;
    fileCommands[item.dataset.cmd!]?.();
  });
}

// Einstellungen
const settingsOverlay = $('#settings-overlay');
$('#btn-settings').addEventListener('click', () => {
  settingsOverlay.hidden = false;
});
$('#settings-close').addEventListener('click', () => {
  settingsOverlay.hidden = true;
});
$('#font-up').addEventListener('click', () => {
  state.fontSize = Math.min(22, state.fontSize + 1);
  persist();
  applyFontSize();
});
$('#font-down').addEventListener('click', () => {
  state.fontSize = Math.max(12, state.fontSize - 1);
  persist();
  applyFontSize();
});
const lnToggle = $('#toggle-linenumbers');
function applyLnToggle() {
  lnToggle.setAttribute('aria-checked', String(state.showLineNumbers));
}
lnToggle.addEventListener('click', () => {
  state.showLineNumbers = !state.showLineNumbers;
  persist();
  applyLnToggle();
  renderGutter();
});
$('#set-light').addEventListener('click', () => {
  state.theme = 'light';
  persist();
  applyTheme();
});
$('#set-dark').addEventListener('click', () => {
  state.theme = 'dark';
  persist();
  applyTheme();
});
$('#reset-all').addEventListener('click', () => {
  if (!confirm('Wirklich alle Dokumente löschen? Das kann nicht rückgängig gemacht werden.')) return;
  state.docs = [{ id: uid(), content: WELCOME }];
  state.activeId = state.docs[0].id;
  fileSaved = true;
  persist();
  settingsOverlay.hidden = true;
  renderAll();
});

// Frontmatter
$('#btn-frontmatter').addEventListener('click', openFrontmatter);
$('#fm-close').addEventListener('click', () => {
  fmOverlay.hidden = true;
});
$('#fm-cancel').addEventListener('click', () => {
  fmOverlay.hidden = true;
});
$('#fm-add').addEventListener('click', () => fmAddRow());
$('#fm-save').addEventListener('click', saveFrontmatter);

// Overlays: Klick auf Hintergrund oder Escape schließt
for (const overlay of [settingsOverlay, fmOverlay]) {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.hidden = true;
  });
}

// Tastenkürzel
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    settingsOverlay.hidden = true;
    fmOverlay.hidden = true;
    fileMenu.hidden = true;
    return;
  }
  if (!(e.metaKey || e.ctrlKey)) return;
  const actions: Record<string, () => void> = {
    b: formatActions.bold,
    i: formatActions.italic,
    e: formatActions.code,
    k: formatActions.link,
    s: saveMd,
    n: () => newDoc(),
    o: openFilePicker,
  };
  const fn = actions[e.key.toLowerCase()];
  if (fn) {
    e.preventDefault();
    fn();
  }
});

// ---------- Start ----------

applyLnToggle();
renderAll();
