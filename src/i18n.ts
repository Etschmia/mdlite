/**
 * Mehrsprachigkeit: Deutsch, Englisch, Armenisch, Russisch.
 *
 * Alle sichtbaren Texte der App liegen hier als Schlüssel → Text. Statische
 * Texte in index.html werden über data-i18n-Attribute befüllt (siehe
 * applyI18n in main.ts), dynamische über t()/tn().
 */

export type Lang = 'de' | 'en' | 'hy' | 'ru';

export const LANGS: readonly Lang[] = ['de', 'en', 'hy', 'ru'];
export const DEFAULT_LANG: Lang = 'de';

/** Eigenbezeichnung der Sprachen für die Auswahl in den Einstellungen */
export const LANG_NAMES: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  hy: 'Հայերեն',
  ru: 'Русский',
};

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (LANGS as readonly string[]).includes(v);
}

/**
 * Sprache aus den Browser-Einstellungen ableiten: erste unterstützte Sprache
 * aus navigator.languages (nur der Basis-Code zählt, "en-US" → "en"),
 * sonst Deutsch.
 */
export function detectLang(
  preferred: readonly string[] = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [],
): Lang {
  for (const tag of preferred) {
    const base = String(tag || '').toLowerCase().split(/[-_]/)[0];
    if (isLang(base)) return base;
  }
  return DEFAULT_LANG;
}

const de = {
  appTitle: 'mdlite — Markdown Editor',
  metaDescription: 'Ein schlanker Markdown-Editor: Live-Vorschau, Tabs, lokales Speichern. Ohne Login, ohne Schnickschnack.',

  // Kopfleiste
  sidebarToggle: 'Seitenleiste ein-/ausblenden',
  sidebar: 'Seitenleiste',
  file: 'Datei',
  newDoc: 'Neues Dokument',
  open: 'Öffnen…',
  saveMd: 'Speichern (.md)',
  exportHtml: 'Als HTML exportieren',
  print: 'Drucken / PDF',
  view: 'Ansicht',
  viewEditor: 'Nur Editor',
  viewSplit: 'Geteilte Ansicht',
  viewPreview: 'Nur Vorschau',
  settings: 'Einstellungen',
  themeToggle: 'Hell / Dunkel umschalten',
  themeToggleAria: 'Theme umschalten',

  // Tabs & Seitenleiste
  newTab: 'Neuer Tab (Doppelklick auf Tab = umbenennen)',
  newTabAria: 'Neuer Tab',
  documents: 'Dokumente',
  rename: 'Umbenennen',
  closeTab: 'Tab schließen',
  resizeSidebar: 'Breite der Seitenleiste anpassen',
  resizeSplit: 'Aufteilung zwischen Editor und Vorschau anpassen',
  untitled: 'Unbenannt',
  emptyDoc: 'Leeres Dokument',
  filenameFallback: 'dokument',

  // Toolbar
  formatting: 'Formatierung',
  bold: 'Fett — ⌘B',
  italic: 'Kursiv — ⌘I',
  strike: 'Durchgestrichen',
  code: 'Code (inline) — ⌘E',
  h1: 'Überschrift 1',
  h2: 'Überschrift 2',
  h3: 'Überschrift 3',
  ul: 'Aufzählung',
  ol: 'Nummerierte Liste',
  check: 'Checkliste',
  quote: 'Zitat',
  link: 'Link — ⌘K',
  image: 'Bild',
  table: 'Tabelle',
  codeblock: 'Codeblock',
  math: 'Formel (inline) — $…$',
  mathblock: 'Formelblock — $$…$$',
  frontmatterEdit: 'Frontmatter bearbeiten',
  editorPlaceholder: '# Titel\n\nSchreibe hier in Markdown…',

  // Platzhalter, die die Formatierungsknöpfe in den Text einfügen
  phBold: 'fett',
  phItalic: 'kursiv',
  phStrike: 'durchgestrichen',
  phCode: 'code',
  phLink: 'Text',
  phImage: 'Bildbeschreibung',
  phColA: 'Spalte A',
  phColB: 'Spalte B',
  phCell: 'Wert',

  // Statusleiste
  saved: 'Gespeichert',
  unsaved: 'Ungespeichert',
  words_one: '{n} Wort',
  words_other: '{n} Wörter',
  chars_one: '{n} Zeichen',
  chars_other: '{n} Zeichen',
  lines_one: '{n} Zeile',
  lines_other: '{n} Zeilen',
  cursor: 'Zeile {line}, Sp. {col}',

  // Mobile Ansicht
  mobileSidebar: 'Dokumente',
  mobileEditor: 'Editor',
  mobilePreview: 'Vorschau',
  switchView: 'Ansicht wechseln: {view}',
  switchViewAria: 'Ansicht wechseln zu {view}',

  // Einstellungen
  close: 'Schließen',
  fontSize: 'Schriftgröße im Editor',
  fontSizeCurrent: 'Aktuell {n} px',
  smaller: 'Kleiner',
  larger: 'Größer',
  lineNumbers: 'Zeilennummern',
  lineNumbersDesc: 'Nummern-Spalte links anzeigen',
  appearance: 'Erscheinungsbild',
  appearanceDesc: 'Hell oder Dunkel',
  light: 'Hell',
  dark: 'Dunkel',
  language: 'Sprache',
  languageDesc: 'Sprache der Oberfläche',
  resetAll: 'Alle Dokumente zurücksetzen',
  resetConfirm: 'Wirklich alle Dokumente löschen? Das kann nicht rückgängig gemacht werden.',

  // Frontmatter-Dialog
  frontmatter: 'Frontmatter',
  fmKey: 'Schlüssel',
  fmValue: 'Wert',
  fmKeyPlaceholder: 'schlüssel',
  fmValuePlaceholder: 'Wert',
  fmAdd: 'Eintrag hinzufügen',
  fmDelete: 'Eintrag löschen',
  cancel: 'Abbrechen',
  apply: 'Übernehmen',

  welcome: `# Willkommen bei mdlite 👋

Ein **schlanker** Markdown-Editor. Tippe links — die Vorschau rechts rendert *live*.
Alles bleibt in deinem Browser: kein Login, kein Server, deine Texte gehören dir.

## Was funktioniert

- **Fett**, *kursiv*, ~~durchgestrichen~~ und \`inline-code\`
- Aufzählungen und nummerierte Listen
- Checklisten:
  - [x] Live-Vorschau
  - [x] Tabs mit eigenen Namen (Stift oder Doppelklick – im Reiter wie in der Sidebar)
  - [ ] Dein erstes Dokument
- Frontmatter über den \`{ }\`-Knopf in der Toolbar
- Formeln mit KaTeX: \\\$E = mc^2\\\$ wird zu $E = mc^2$
- Oberfläche auf Deutsch, Englisch, Armenisch oder Russisch (Einstellungen → Sprache)

> Tipp: Nutze die Toolbar oder Tastenkürzel wie ⌘B und ⌘I.
> Deine Arbeit wird automatisch gespeichert — komm einfach wieder.

### Codeblock

\`\`\`js
function gruss(name) {
  return \`Hallo, \${name}!\`.toUpperCase();
}
\`\`\`

### Formeln

Inline wie $E = mc^2$ — oder als eigener Block:

$$
\\int_a^b f(x)\\,dx = F(b) - F(a)
$$

### Tabelle

| Feature   | Status |
| --------- | :----: |
| Vorschau  |   ✅   |
| Tabs      |   ✅   |
| Export    |   ✅   |

[Mehr über Markdown](https://commonmark.org) · viel Spaß beim Schreiben!
`,
};

export type MessageKey = keyof typeof de;
type PluralKey = 'words' | 'chars' | 'lines';
/** Jede Sprache braucht alle Schlüssel; zusätzliche Pluralformen (few/many) sind optional. */
export type Messages = Record<MessageKey, string> & Partial<Record<`${PluralKey}_${'few' | 'many'}`, string>>;

const en: Messages = {
  appTitle: 'mdlite — Markdown Editor',
  metaDescription: 'A lightweight Markdown editor: live preview, tabs, local saving. No login, no frills.',

  sidebarToggle: 'Show / hide sidebar',
  sidebar: 'Sidebar',
  file: 'File',
  newDoc: 'New document',
  open: 'Open…',
  saveMd: 'Save (.md)',
  exportHtml: 'Export as HTML',
  print: 'Print / PDF',
  view: 'View',
  viewEditor: 'Editor only',
  viewSplit: 'Split view',
  viewPreview: 'Preview only',
  settings: 'Settings',
  themeToggle: 'Toggle light / dark',
  themeToggleAria: 'Toggle theme',

  newTab: 'New tab (double-click a tab to rename)',
  newTabAria: 'New tab',
  documents: 'Documents',
  rename: 'Rename',
  closeTab: 'Close tab',
  resizeSidebar: 'Adjust sidebar width',
  resizeSplit: 'Adjust split between editor and preview',
  untitled: 'Untitled',
  emptyDoc: 'Empty document',
  filenameFallback: 'document',

  formatting: 'Formatting',
  bold: 'Bold — ⌘B',
  italic: 'Italic — ⌘I',
  strike: 'Strikethrough',
  code: 'Inline code — ⌘E',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  ul: 'Bulleted list',
  ol: 'Numbered list',
  check: 'Checklist',
  quote: 'Quote',
  link: 'Link — ⌘K',
  image: 'Image',
  table: 'Table',
  codeblock: 'Code block',
  math: 'Inline formula — $…$',
  mathblock: 'Formula block — $$…$$',
  frontmatterEdit: 'Edit frontmatter',
  editorPlaceholder: '# Title\n\nWrite Markdown here…',

  phBold: 'bold',
  phItalic: 'italic',
  phStrike: 'strikethrough',
  phCode: 'code',
  phLink: 'Text',
  phImage: 'Image description',
  phColA: 'Column A',
  phColB: 'Column B',
  phCell: 'Value',

  saved: 'Saved',
  unsaved: 'Unsaved',
  words_one: '{n} word',
  words_other: '{n} words',
  chars_one: '{n} character',
  chars_other: '{n} characters',
  lines_one: '{n} line',
  lines_other: '{n} lines',
  cursor: 'Ln {line}, Col {col}',

  mobileSidebar: 'Documents',
  mobileEditor: 'Editor',
  mobilePreview: 'Preview',
  switchView: 'Switch view: {view}',
  switchViewAria: 'Switch view to {view}',

  close: 'Close',
  fontSize: 'Editor font size',
  fontSizeCurrent: 'Currently {n} px',
  smaller: 'Smaller',
  larger: 'Larger',
  lineNumbers: 'Line numbers',
  lineNumbersDesc: 'Show number column on the left',
  appearance: 'Appearance',
  appearanceDesc: 'Light or dark',
  light: 'Light',
  dark: 'Dark',
  language: 'Language',
  languageDesc: 'Interface language',
  resetAll: 'Reset all documents',
  resetConfirm: 'Really delete all documents? This cannot be undone.',

  frontmatter: 'Frontmatter',
  fmKey: 'Key',
  fmValue: 'Value',
  fmKeyPlaceholder: 'key',
  fmValuePlaceholder: 'Value',
  fmAdd: 'Add entry',
  fmDelete: 'Delete entry',
  cancel: 'Cancel',
  apply: 'Apply',

  welcome: `# Welcome to mdlite 👋

A **lightweight** Markdown editor. Type on the left — the preview on the right renders *live*.
Everything stays in your browser: no login, no server, your texts belong to you.

## What works

- **Bold**, *italic*, ~~strikethrough~~ and \`inline code\`
- Bulleted and numbered lists
- Checklists:
  - [x] Live preview
  - [x] Tabs with custom names (pencil or double-click – in the tab and in the sidebar)
  - [ ] Your first document
- Frontmatter via the \`{ }\` button in the toolbar
- Formulas with KaTeX: \\\$E = mc^2\\\$ becomes $E = mc^2$
- Interface in German, English, Armenian or Russian (Settings → Language)

> Tip: use the toolbar or shortcuts like ⌘B and ⌘I.
> Your work is saved automatically — just come back.

### Code block

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`.toUpperCase();
}
\`\`\`

### Formulas

Inline like $E = mc^2$ — or as a block of its own:

$$
\\int_a^b f(x)\\,dx = F(b) - F(a)
$$

### Table

| Feature  | Status |
| -------- | :----: |
| Preview  |   ✅   |
| Tabs     |   ✅   |
| Export   |   ✅   |

[More about Markdown](https://commonmark.org) · happy writing!
`,
};

const hy: Messages = {
  appTitle: 'mdlite — Markdown խմբագրիչ',
  metaDescription: 'Թեթև Markdown խմբագրիչ՝ կենդանի նախադիտում, ներդիրներ, տեղային պահպանում։ Առանց մուտքի, առանց ավելորդությունների։',

  sidebarToggle: 'Ցույց տալ / թաքցնել կողային վահանակը',
  sidebar: 'Կողային վահանակ',
  file: 'Ֆայլ',
  newDoc: 'Նոր փաստաթուղթ',
  open: 'Բացել…',
  saveMd: 'Պահպանել (.md)',
  exportHtml: 'Արտահանել որպես HTML',
  print: 'Տպել / PDF',
  view: 'Տեսք',
  viewEditor: 'Միայն խմբագրիչ',
  viewSplit: 'Բաժանված տեսք',
  viewPreview: 'Միայն նախադիտում',
  settings: 'Կարգավորումներ',
  themeToggle: 'Բաց / մուգ թեմա',
  themeToggleAria: 'Փոխել թեման',

  newTab: 'Նոր ներդիր (կրկնակի սեղմում ներդիրի վրա՝ վերանվանել)',
  newTabAria: 'Նոր ներդիր',
  documents: 'Փաստաթղթեր',
  rename: 'Վերանվանել',
  closeTab: 'Փակել ներդիրը',
  resizeSidebar: 'Փոխել կողային վահանակի լայնությունը',
  resizeSplit: 'Փոխել խմբագրիչի և նախադիտման բաժանումը',
  untitled: 'Անանուն',
  emptyDoc: 'Դատարկ փաստաթուղթ',
  filenameFallback: 'փաստաթուղթ',

  formatting: 'Ձևաչափում',
  bold: 'Թավ — ⌘B',
  italic: 'Շեղ — ⌘I',
  strike: 'Ջնջված',
  code: 'Ներտողային կոդ — ⌘E',
  h1: 'Վերնագիր 1',
  h2: 'Վերնագիր 2',
  h3: 'Վերնագիր 3',
  ul: 'Ցուցակ',
  ol: 'Համարակալված ցուցակ',
  check: 'Ստուգաթերթ',
  quote: 'Մեջբերում',
  link: 'Հղում — ⌘K',
  image: 'Նկար',
  table: 'Աղյուսակ',
  codeblock: 'Կոդի բլոկ',
  math: 'Ներտողային բանաձև — $…$',
  mathblock: 'Բանաձևի բլոկ — $$…$$',
  frontmatterEdit: 'Խմբագրել frontmatter-ը',
  editorPlaceholder: '# Վերնագիր\n\nԳրեք այստեղ Markdown-ով…',

  phBold: 'թավ',
  phItalic: 'շեղ',
  phStrike: 'ջնջված',
  phCode: 'կոդ',
  phLink: 'Տեքստ',
  phImage: 'Նկարի նկարագրություն',
  phColA: 'Սյուն A',
  phColB: 'Սյուն B',
  phCell: 'Արժեք',

  saved: 'Պահպանված է',
  unsaved: 'Պահպանված չէ',
  words_one: '{n} բառ',
  words_other: '{n} բառ',
  chars_one: '{n} նիշ',
  chars_other: '{n} նիշ',
  lines_one: '{n} տող',
  lines_other: '{n} տող',
  cursor: 'Տող {line}, սյուն {col}',

  mobileSidebar: 'Փաստաթղթեր',
  mobileEditor: 'Խմբագրիչ',
  mobilePreview: 'Նախադիտում',
  switchView: 'Փոխել տեսքը՝ {view}',
  switchViewAria: 'Անցնել {view} տեսքին',

  close: 'Փակել',
  fontSize: 'Խմբագրիչի տառաչափ',
  fontSizeCurrent: 'Ներկայումս {n} px',
  smaller: 'Փոքրացնել',
  larger: 'Մեծացնել',
  lineNumbers: 'Տողերի համարներ',
  lineNumbersDesc: 'Ցույց տալ համարների սյունը ձախում',
  appearance: 'Արտաքին տեսք',
  appearanceDesc: 'Բաց կամ մուգ',
  light: 'Բաց',
  dark: 'Մուգ',
  language: 'Լեզու',
  languageDesc: 'Ինտերֆեյսի լեզուն',
  resetAll: 'Վերակայել բոլոր փաստաթղթերը',
  resetConfirm: 'Իսկապե՞ս ջնջել բոլոր փաստաթղթերը։ Սա հնարավոր չէ հետարկել։',

  frontmatter: 'Frontmatter',
  fmKey: 'Բանալի',
  fmValue: 'Արժեք',
  fmKeyPlaceholder: 'բանալի',
  fmValuePlaceholder: 'Արժեք',
  fmAdd: 'Ավելացնել գրառում',
  fmDelete: 'Ջնջել գրառումը',
  cancel: 'Չեղարկել',
  apply: 'Կիրառել',

  welcome: `# Բարի գալուստ mdlite 👋

**Թեթև** Markdown խմբագրիչ։ Գրեք ձախում — աջ կողմի նախադիտումը թարմացվում է *անմիջապես*։
Ամեն ինչ մնում է ձեր դիտարկիչում՝ առանց մուտքի, առանց սերվերի. ձեր տեքստերը ձերն են։

## Ինչ է աշխատում

- **Թավ**, *շեղ*, ~~ջնջված~~ և \`ներտողային կոդ\`
- Սովորական և համարակալված ցուցակներ
- Ստուգաթերթեր՝
  - [x] Կենդանի նախադիտում
  - [x] Ներդիրներ սեփական անուններով (մատիտ կամ կրկնակի սեղմում՝ ներդիրում և կողային վահանակում)
  - [ ] Ձեր առաջին փաստաթուղթը
- Frontmatter՝ գործիքագոտու \`{ }\` կոճակով
- Բանաձևեր KaTeX-ով՝ \\\$E = mc^2\\\$ դառնում է $E = mc^2$
- Ինտերֆեյսը՝ գերմաներեն, անգլերեն, հայերեն կամ ռուսերեն (Կարգավորումներ → Լեզու)

> Խորհուրդ՝ օգտագործեք գործիքագոտին կամ ⌘B և ⌘I ստեղնաշարային համակցությունները։
> Ձեր աշխատանքը պահպանվում է ինքնաբերաբար — պարզապես վերադարձեք։

### Կոդի բլոկ

\`\`\`js
function voghjuyn(anun) {
  return \`Բարև, \${anun}!\`.toUpperCase();
}
\`\`\`

### Բանաձևեր

Ներտողային՝ $E = mc^2$ — կամ որպես առանձին բլոկ՝

$$
\\int_a^b f(x)\\,dx = F(b) - F(a)
$$

### Աղյուսակ

| Հնարավորություն | Կարգավիճակ |
| --------------- | :--------: |
| Նախադիտում      |     ✅     |
| Ներդիրներ       |     ✅     |
| Արտահանում      |     ✅     |

[Ավելին Markdown-ի մասին](https://commonmark.org) · հաճելի գրառում։
`,
};

const ru: Messages = {
  appTitle: 'mdlite — Markdown-редактор',
  metaDescription: 'Лёгкий Markdown-редактор: живой предпросмотр, вкладки, локальное сохранение. Без входа, без лишнего.',

  sidebarToggle: 'Показать / скрыть боковую панель',
  sidebar: 'Боковая панель',
  file: 'Файл',
  newDoc: 'Новый документ',
  open: 'Открыть…',
  saveMd: 'Сохранить (.md)',
  exportHtml: 'Экспорт в HTML',
  print: 'Печать / PDF',
  view: 'Вид',
  viewEditor: 'Только редактор',
  viewSplit: 'Разделённый вид',
  viewPreview: 'Только предпросмотр',
  settings: 'Настройки',
  themeToggle: 'Светлая / тёмная тема',
  themeToggleAria: 'Переключить тему',

  newTab: 'Новая вкладка (двойной клик по вкладке — переименовать)',
  newTabAria: 'Новая вкладка',
  documents: 'Документы',
  rename: 'Переименовать',
  closeTab: 'Закрыть вкладку',
  resizeSidebar: 'Изменить ширину боковой панели',
  resizeSplit: 'Изменить разделение между редактором и предпросмотром',
  untitled: 'Без названия',
  emptyDoc: 'Пустой документ',
  filenameFallback: 'документ',

  formatting: 'Форматирование',
  bold: 'Жирный — ⌘B',
  italic: 'Курсив — ⌘I',
  strike: 'Зачёркнутый',
  code: 'Встроенный код — ⌘E',
  h1: 'Заголовок 1',
  h2: 'Заголовок 2',
  h3: 'Заголовок 3',
  ul: 'Маркированный список',
  ol: 'Нумерованный список',
  check: 'Чек-лист',
  quote: 'Цитата',
  link: 'Ссылка — ⌘K',
  image: 'Изображение',
  table: 'Таблица',
  codeblock: 'Блок кода',
  math: 'Встроенная формула — $…$',
  mathblock: 'Блок формулы — $$…$$',
  frontmatterEdit: 'Редактировать frontmatter',
  editorPlaceholder: '# Заголовок\n\nПишите здесь в Markdown…',

  phBold: 'жирный',
  phItalic: 'курсив',
  phStrike: 'зачёркнутый',
  phCode: 'код',
  phLink: 'Текст',
  phImage: 'Описание изображения',
  phColA: 'Столбец A',
  phColB: 'Столбец B',
  phCell: 'Значение',

  saved: 'Сохранено',
  unsaved: 'Не сохранено',
  words_one: '{n} слово',
  words_few: '{n} слова',
  words_many: '{n} слов',
  words_other: '{n} слова',
  chars_one: '{n} символ',
  chars_few: '{n} символа',
  chars_many: '{n} символов',
  chars_other: '{n} символа',
  lines_one: '{n} строка',
  lines_few: '{n} строки',
  lines_many: '{n} строк',
  lines_other: '{n} строки',
  cursor: 'Стр. {line}, кол. {col}',

  mobileSidebar: 'Документы',
  mobileEditor: 'Редактор',
  mobilePreview: 'Предпросмотр',
  switchView: 'Переключить вид: {view}',
  switchViewAria: 'Переключить вид на {view}',

  close: 'Закрыть',
  fontSize: 'Размер шрифта в редакторе',
  fontSizeCurrent: 'Сейчас {n} px',
  smaller: 'Меньше',
  larger: 'Больше',
  lineNumbers: 'Номера строк',
  lineNumbersDesc: 'Показывать колонку с номерами слева',
  appearance: 'Оформление',
  appearanceDesc: 'Светлое или тёмное',
  light: 'Светлое',
  dark: 'Тёмное',
  language: 'Язык',
  languageDesc: 'Язык интерфейса',
  resetAll: 'Сбросить все документы',
  resetConfirm: 'Действительно удалить все документы? Это нельзя отменить.',

  frontmatter: 'Frontmatter',
  fmKey: 'Ключ',
  fmValue: 'Значение',
  fmKeyPlaceholder: 'ключ',
  fmValuePlaceholder: 'Значение',
  fmAdd: 'Добавить запись',
  fmDelete: 'Удалить запись',
  cancel: 'Отмена',
  apply: 'Применить',

  welcome: `# Добро пожаловать в mdlite 👋

**Лёгкий** Markdown-редактор. Пишите слева — предпросмотр справа обновляется *вживую*.
Всё остаётся в вашем браузере: без входа, без сервера, ваши тексты принадлежат вам.

## Что умеет

- **Жирный**, *курсив*, ~~зачёркнутый~~ и \`встроенный код\`
- Маркированные и нумерованные списки
- Чек-листы:
  - [x] Живой предпросмотр
  - [x] Вкладки с собственными именами (карандаш или двойной клик — во вкладке и в боковой панели)
  - [ ] Ваш первый документ
- Frontmatter через кнопку \`{ }\` на панели инструментов
- Формулы с KaTeX: \\\$E = mc^2\\\$ превращается в $E = mc^2$
- Интерфейс на немецком, английском, армянском или русском (Настройки → Язык)

> Совет: используйте панель инструментов или сочетания клавиш вроде ⌘B и ⌘I.
> Ваша работа сохраняется автоматически — просто возвращайтесь.

### Блок кода

\`\`\`js
function privet(imya) {
  return \`Привет, \${imya}!\`.toUpperCase();
}
\`\`\`

### Формулы

Встроенная, как $E = mc^2$ — или отдельным блоком:

$$
\\int_a^b f(x)\\,dx = F(b) - F(a)
$$

### Таблица

| Функция      | Статус |
| ------------ | :----: |
| Предпросмотр |   ✅   |
| Вкладки      |   ✅   |
| Экспорт      |   ✅   |

[Подробнее о Markdown](https://commonmark.org) · приятного письма!
`,
};

export const MESSAGES: Record<Lang, Messages> = { de, en, hy, ru };

let current: Lang = DEFAULT_LANG;

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang) {
  current = lang;
}

type Params = Record<string, string | number>;

function interpolate(text: string, params?: Params): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in params ? String(params[k]) : m));
}

/** Text zum Schlüssel in der aktuellen Sprache; {name}-Platzhalter werden ersetzt. */
export function t(key: MessageKey, params?: Params): string {
  return interpolate(MESSAGES[current][key] ?? MESSAGES[DEFAULT_LANG][key], params);
}

const pluralRules: Partial<Record<Lang, Intl.PluralRules>> = {};

/** Pluralform nach CLDR-Regeln der aktuellen Sprache, z. B. tn('words', 5) → "5 Wörter". */
export function tn(key: PluralKey, n: number): string {
  const rules = (pluralRules[current] ||= new Intl.PluralRules(current));
  const msgs = MESSAGES[current] as Record<string, string | undefined>;
  const text = msgs[`${key}_${rules.select(n)}`] ?? msgs[`${key}_other`] ?? '';
  return interpolate(text, { n });
}

/** Alle Willkommenstexte (aller Sprachen) — für die Erkennung unveränderter Startdokumente */
export function welcomeTexts(): string[] {
  return LANGS.map((l) => MESSAGES[l].welcome);
}
