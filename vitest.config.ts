import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Node >= 25 enables its own experimental global localStorage, which shadows
    // jsdom's (no clear()/getItem() without --localstorage-file). Disable it so
    // the jsdom environment provides localStorage.
    execArgv: ['--no-experimental-webstorage'],
  },
});
