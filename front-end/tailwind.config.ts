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
        display: ['var(--font-syne)', 'Syne', 'system-ui', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
        // legacy aliases
        syne:    ['var(--font-syne)', 'Syne', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:  '16px',
        input: '11px',
        btn:   '11px',
        pill:  '6px',
        // legacy
        lg:    '16px',
        md:    '11px',
        sm:    '8px',
        xl:    '18px',
        '2xl': '18px',
        full:  '9999px',
      },
      colors: {
        bg:           '#04040a',
        surface:      '#0d0d15',
        'surface-2':  '#12121c',
        surface2:     '#12121c',
        accent:       '#f7931a',
        accentL:      '#ffaa47',
        brand:        '#f7931a',
        'accent-dim': 'rgba(247,147,26,0.09)',
        'accent-glow':'rgba(247,147,26,0.18)',
        green:        '#3dd68c',
        red:          '#f16a6a',
        yellow:       '#f5c842',
        muted:        '#47465a',
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
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border:  'rgba(255,255,255,0.06)',
        input:   'hsl(var(--input))',
        ring:    'hsl(var(--ring))',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.06)',
      },
      boxShadow: {
        orange:    '0 8px 28px rgba(247,147,26,0.40)',
        card:      '0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
        cardHover: '0 4px 8px rgba(0,0,0,0.35), 0 16px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'drift-1':   'drift1 22s ease-in-out infinite',
        'drift-2':   'drift2 28s ease-in-out infinite alternate-reverse',
        'march':     'march 2s linear infinite',
        'float':     'float 6s ease-in-out infinite',
        'shimmer':   'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.25' } },
        drift1:   { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(-35px,25px)' } },
        drift2:   { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(35px,-25px)' } },
        march:    { to: { strokeDashoffset: '-18' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
