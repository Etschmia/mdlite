// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import html from '../index.html?raw';

async function boot(languages: string[]) {
  vi.resetModules();
  document.documentElement.innerHTML = html.replace(/<script[^>]*><\/script>/, '');
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true });
  window.matchMedia ||= () =>
    ({ matches: false, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList;
  await import('./main');
}

const stored = () => JSON.parse(localStorage.getItem('mdlite.v1') || '{}');

describe('app language', () => {
  beforeEach(() => localStorage.clear());

  it('uses the browser language when nothing is stored', async () => {
    await boot(['ru-RU', 'en']);
    expect(document.documentElement.lang).toBe('ru');
    expect(document.querySelector('.sidebar-label')!.textContent).toBe('Документы');
    expect((document.querySelector('#ta') as HTMLTextAreaElement).value).toMatch(/^# Добро пожаловать/);
    expect(document.querySelector('#stat-words')!.textContent).toMatch(/слов/);
  });

  it('falls back to German for unsupported browser languages', async () => {
    await boot(['fr-FR']);
    expect(document.documentElement.lang).toBe('de');
    expect(document.querySelector('[data-i18n="file"]')!.textContent).toBe('Datei');
  });

  it('switches language, swaps the untouched welcome doc and persists the choice', async () => {
    await boot(['de']);
    const select = document.querySelector('#lang-select') as HTMLSelectElement;
    select.value = 'hy';
    select.dispatchEvent(new Event('change'));
    expect(document.documentElement.lang).toBe('hy');
    expect(document.title).toContain('Markdown');
    expect(document.querySelector('[data-i18n="settings"]')!.textContent).toBe('Կարգավորումներ');
    expect((document.querySelector('#ta') as HTMLTextAreaElement).value).toMatch(/^# Բարի գալուստ/);
    expect(stored().lang).toBe('hy');

    // Rückkehr: gespeicherte Wahl schlägt Browser-Sprache
    await boot(['en-US']);
    expect(document.documentElement.lang).toBe('hy');
    expect((document.querySelector('#lang-select') as HTMLSelectElement).value).toBe('hy');
  });

  it('leaves edited documents alone on language change', async () => {
    await boot(['en']);
    const ta = document.querySelector('#ta') as HTMLTextAreaElement;
    ta.value = '# My notes\n\nkeep me';
    ta.dispatchEvent(new Event('input'));
    const select = document.querySelector('#lang-select') as HTMLSelectElement;
    select.value = 'de';
    select.dispatchEvent(new Event('change'));
    expect(ta.value).toBe('# My notes\n\nkeep me');
    expect(stored().docs[0].content).toBe('# My notes\n\nkeep me');
  });
});
