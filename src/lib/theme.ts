import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

function resolveEffective(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return browser && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

function applyTheme(effective: 'light' | 'dark') {
  if (!browser) return;
  document.documentElement.classList.toggle('dark', effective === 'dark');
  const color = effective === 'dark' ? '#0A0A0A' : '#F4F4F0';
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = color;
}

function createThemeStore() {
  const initial: Theme = browser
    ? (localStorage.getItem('theme') as Theme) ?? 'system'
    : 'system';

  const { subscribe, set, update } = writable<Theme>(initial);
  let mediaQuery: MediaQueryList | null = null;

  function onSystemChange() {
    const saved = browser ? (localStorage.getItem('theme') as Theme) : 'system';
    if (saved === 'system') {
      applyTheme(resolveEffective('system'));
    }
  }

  function toggle() {
    update((current) => {
      const order: Theme[] = ['light', 'dark', 'system'];
      const next = order[(order.indexOf(current) + 1) % order.length];
      if (browser) {
        localStorage.setItem('theme', next);
        applyTheme(resolveEffective(next));
      }
      return next;
    });
  }

  function init() {
    if (!browser) return;
    const saved = (localStorage.getItem('theme') as Theme) ?? 'system';
    set(saved);
    applyTheme(resolveEffective(saved));
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', onSystemChange);
  }

  return { subscribe, toggle, init };
}

export const theme = createThemeStore();
