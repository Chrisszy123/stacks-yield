import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        syne:    ['var(--font-syne)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
      borderRadius: {
        lg:  '16px',
        md:  '11px',
        sm:  '8px',
        xl:  '18px',
        '2xl': '18px',
        full: '9999px',
      },
      colors: {
        bg:           '#04040a',
        surface:      '#0d0d15',
        'surface-2':  '#12121c',
        accent:       '#f7931a',
        'accent-dim': 'rgba(247,147,26,0.09)',
        'accent-glow':'rgba(247,147,26,0.16)',
        green:        '#3dd68c',
        red:          '#f16a6a',
        yellow:       '#f5c842',
        text:         '#edecf2',
        'text-2':     '#78778a',
        'text-muted': '#47465a',
        /* shadcn compat */
        background:   'hsl(var(--background))',
        foreground:   'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border:  'rgba(255,255,255,0.06)',
        input:   'hsl(var(--input))',
        ring:    'hsl(var(--ring))',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
