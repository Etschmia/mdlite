// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './lib';

describe('renderMarkdown', () => {
  it('removes executable HTML from untrusted Markdown', () => {
    const html = renderMarkdown([
      '# Vorschau',
      '<script>globalThis.pwned = true</script>',
      '<img src=x onerror="globalThis.pwned = true">',
      '<svg><a href="javascript:alert(1)">click</a></svg>',
      '[bad](javascript:alert(1))',
    ].join('\n'));

    expect(html).toContain('<h1>Vorschau</h1>');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.querySelector('script')).toBeNull();
    expect(doc.querySelector('[onerror]')).toBeNull();
    expect([...doc.querySelectorAll('[href]')]
      .some((node) => node.getAttribute('href')?.startsWith('javascript:'))).toBe(false);
  });

  it('strips frontmatter unless explicitly retained', () => {
    const markdown = '---\ntitle: Test\n---\n\nText';
    expect(renderMarkdown(markdown)).not.toContain('title: Test');
    expect(renderMarkdown(markdown, { keepFrontmatter: true })).toContain('title: Test');
  });
});
