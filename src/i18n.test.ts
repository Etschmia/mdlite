import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_LANG, LANGS, MESSAGES, detectLang, setLang, t, tn, welcomeTexts } from './i18n';

afterEach(() => setLang(DEFAULT_LANG));

describe('detectLang', () => {
  it('picks the first supported browser language, ignoring the region', () => {
    expect(detectLang(['en-US', 'de'])).toBe('en');
    expect(detectLang(['fr-FR', 'hy-AM'])).toBe('hy');
    expect(detectLang(['ru'])).toBe('ru');
    expect(detectLang(['de-CH'])).toBe('de');
  });

  it('falls back to German for unsupported or empty lists', () => {
    expect(detectLang(['fr', 'es-ES'])).toBe('de');
    expect(detectLang([])).toBe('de');
    expect(detectLang(['', 'zh-Hant'])).toBe('de');
  });
});

describe('messages', () => {
  it('provides every key in every language', () => {
    const keys = Object.keys(MESSAGES.de).sort();
    for (const lang of LANGS) {
      const own = Object.keys(MESSAGES[lang]).filter((k) => !/_(few|many)$/.test(k)).sort();
      expect(own, lang).toEqual(keys);
      for (const key of keys) expect(MESSAGES[lang][key as keyof typeof MESSAGES.de], `${lang}.${key}`).toBeTruthy();
    }
  });

  it('keeps welcome texts distinct so an unedited one can be swapped on language change', () => {
    const texts = welcomeTexts();
    expect(new Set(texts).size).toBe(LANGS.length);
    expect(texts.every((w) => w.startsWith('# '))).toBe(true);
  });

  it('interpolates placeholders', () => {
    setLang('en');
    expect(t('cursor', { line: 3, col: 7 })).toBe('Ln 3, Col 7');
    setLang('hy');
    expect(t('fontSizeCurrent', { n: 16 })).toContain('16 px');
  });

  it('applies CLDR plural rules', () => {
    setLang('de');
    expect(tn('words', 1)).toBe('1 Wort');
    expect(tn('words', 2)).toBe('2 Wörter');
    setLang('en');
    expect(tn('lines', 1)).toBe('1 line');
    expect(tn('lines', 0)).toBe('0 lines');
    setLang('ru');
    expect(tn('words', 1)).toBe('1 слово');
    expect(tn('words', 3)).toBe('3 слова');
    expect(tn('words', 5)).toBe('5 слов');
    expect(tn('words', 21)).toBe('21 слово');
    expect(tn('chars', 11)).toBe('11 символов');
    setLang('hy');
    expect(tn('lines', 7)).toBe('7 տող');
  });
});
