/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Geist', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      display: ['Archivo Black', 'Geist', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        substrate: 'var(--color-substrate)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        accent: '#E61919',
        surface: 'var(--color-surface)',
      },
      letterSpacing: {
        tightest: '-0.06em',
      },
      lineHeight: {
        crush: '0.9',
        tight: '1.05',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
