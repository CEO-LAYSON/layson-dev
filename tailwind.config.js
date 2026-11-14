import typography from '@tailwindcss/typography'

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        raised: v('raised'),
        line: v('line'),
        fg: v('fg'),
        muted: v('muted'),
        accent: v('accent'),
        'accent-fg': v('accent-fg'),
        'accent-ink': v('accent-ink'),
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.055em',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.4', transform: 'scale(.8)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
}
