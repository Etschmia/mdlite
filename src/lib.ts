/**
 * mdlite als Bibliothek: die Preview-Funktionalität ohne die App-Hülle.
 *
 * Bewusst KEIN `import katex` hier — sonst zöge ein Bundler (esbuild etc.) KaTeX
 * (~349 KB + Fonts) in jeden Consumer, auch wenn er keine Formeln braucht.
 * `main.ts` bleibt die eigenständige App und wird hiervon nicht berührt.
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { extractFrontmatter, stripFrontmatter, applyFrontmatter, currentDate } from './frontmatter';

export { extractFrontmatter, stripFrontmatter, applyFrontmatter, currentDate };
export type { FrontmatterData } from './frontmatter';

export interface RenderOptions {
  /** Frontmatter-Block am Anfang behalten statt entfernen (Default: entfernen). */
  keepFrontmatter?: boolean;
}

/**
 * GFM-Markdown -> sanitisiertes HTML. Entspricht dem Preview-Kern der App
 * (marked mit gfm+breaks, danach DOMPurify), ohne KaTeX-Formeln.
 */
export function renderMarkdown(md: string, opts: RenderOptions = {}): string {
  marked.setOptions({ gfm: true, breaks: true });
  const src = opts.keepFrontmatter ? md : stripFrontmatter(md);
  return DOMPurify.sanitize(marked.parse(src) as string);
}
