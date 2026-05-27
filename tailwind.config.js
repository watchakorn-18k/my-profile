/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Geist', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      display: ['Archivo Black', 'Geist', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        substrate: '#F4F4F0',
        ink: '#0A0A0A',
        muted: '#787774',
        border: '#D4D4D0',
        accent: '#E61919',
        surface: '#EAEAE6',
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
