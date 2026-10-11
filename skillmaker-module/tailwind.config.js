/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./skillmaker/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Page / Surface backgrounds ──────────────────────────────────────
        background: '#eafdff',

        surface: '#eafdff',
        'surface-bright': '#eafdff',
        'surface-dim': '#c2dfe3',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#dcf9fd',
        'surface-container': '#d6f3f7',
        'surface-container-high': '#d0eef1',
        'surface-container-highest': '#cbe8eb',

        // ── Primary teal brand ─────────────────────────────────────────────
        primary: '#006b5e',
        'primary-hover': '#005449',
        'primary-container': '#00a693',
        'primary-fixed': '#7af7e1',

        // ── On-Primary (text on teal backgrounds) ─────────────────────────
        'on-primary': '#ffffff',
        'on-primary-container': '#00332c',
        'on-primary-fixed': '#00201b',

        // ── Secondary slate-blue ───────────────────────────────────────────
        secondary: '#1e667f',
        'secondary-container': '#a1e0fd',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#1c657e',

        // ── Text / on-surface ──────────────────────────────────────────────
        'on-surface': '#021f22',
        'on-surface-variant': '#3c4946',
        'on-background': '#021f22',

        // ── Borders ────────────────────────────────────────────────────────
        outline: '#6c7a76',
        'outline-variant': '#bbcac5',

        // ── Error ──────────────────────────────────────────────────────────
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#410002',
      },
      fontSize: {
        'display':            ['48px', { lineHeight: '56px', letterSpacing: '-0.03em',  fontWeight: '700' }],
        'metric-callout':     ['40px', { lineHeight: '44px', letterSpacing: '-0.03em',  fontWeight: '700' }],
        'headline-lg':        ['36px', { lineHeight: '44px', letterSpacing: '-0.025em', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em',  fontWeight: '600' }],
        'headline-md':        ['24px', { lineHeight: '32px', letterSpacing: '-0.02em',  fontWeight: '600' }],
        'headline-sm':        ['20px', { lineHeight: '28px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'title-md':           ['16px', { lineHeight: '24px', letterSpacing: '-0.01em',  fontWeight: '600' }],
        'body-lg':            ['16px', { lineHeight: '24px', letterSpacing: '0em',      fontWeight: '400' }],
        'body-md':            ['14px', { lineHeight: '20px', letterSpacing: '0em',      fontWeight: '400' }],
        'body-sm':            ['12px', { lineHeight: '16px', letterSpacing: '0.01em',   fontWeight: '400' }],
        'label-md':           ['13px', { lineHeight: '16px', letterSpacing: '-0.01em',  fontWeight: '500' }],
        'label-sm':           ['11px', { lineHeight: '14px', letterSpacing: '0.02em',   fontWeight: '500' }],
      },
      spacing: {
        gutter: '1.5rem',
        margin: '2rem',
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card:          '0 4px 20px -2px rgba(0,107,94,0.06), 0 2px 6px -1px rgba(0,0,0,0.03)',
        'glow-primary':'0 0 20px rgba(0,166,147,0.35)',
        float:         '0 12px 32px -4px rgba(13,92,117,0.18)',
      },
    },
  },
  plugins: [],
}
