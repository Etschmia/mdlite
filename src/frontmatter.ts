/** Einfaches YAML-Frontmatter: flache key: value-Paare am Dokumentanfang. */

export type FrontmatterData = Record<string, string>;

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

export function extractFrontmatter(markdown: string): { frontmatter: FrontmatterData; content: string } | null {
  const match = markdown.match(FRONTMATTER_REGEX);
  if (!match) return null;

  const frontmatter: FrontmatterData = {};
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) frontmatter[key] = value;
  }
  return { frontmatter, content: match[2] };
}

export function stripFrontmatter(markdown: string): string {
  const match = markdown.match(FRONTMATTER_REGEX);
  return match ? match[2] : markdown;
}

function serializeValue(value: string): string {
  // Quoten, wenn YAML den Wert sonst anders interpretieren würde
  if (/[:#'"]|^\s|\s$/.test(value)) return `"${value.replace(/"/g, '\\"')}"`;
  return value;
}

/** Ersetzt/entfernt/erzeugt den Frontmatter-Block am Dokumentanfang. */
export function applyFrontmatter(markdown: string, data: FrontmatterData): string {
  const body = stripFrontmatter(markdown);
  const keys = Object.keys(data);
  if (!keys.length) return body;
  const yaml = keys.map((k) => `${k}: ${serializeValue(data[k])}`).join('\n');
  return `---\n${yaml}\n---\n\n${body.replace(/^\n+/, '')}`;
}

export function currentDate(): string {
  return new Date().toISOString().slice(0, 10);
}
