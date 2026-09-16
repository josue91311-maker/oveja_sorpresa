/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--theme-primary, #9A80BD)',
          dark: 'var(--theme-primary-dark, #7D60A6)',
          light: '#BFA8DC',
          soft: '#F5F0FB',
        },
        secondary: {
          DEFAULT: 'var(--theme-secondary, #F472B6)',
          soft: '#FDF2F8',
          pastel: '#FCE7F3',
        },
        ink: 'var(--theme-ink, #2D2235)',
        plum: '#4A3E56',
        muted: '#7C7087',
        surface: '#FFFDFE',
        'surface-warm': '#FAF7FC',
        border: '#EFE7F5',

        brand: {
          purple: '#9A80BD',
          purpleHover: '#8569aa',
          purpleDeep: '#4C3B5E',
          purpleDark: '#7D60A6',
          purpleLight: '#FAF7FC',
          pink: '#F472B6',
          pinkSoft: '#FDF2F8',
          pinkLight: '#FDEEF5',
          pinkMuted: '#FAD2E1',
          pinkAccent: '#F472B6',
          charcoal: '#2E2438',
          cream: '#FAF8FB',
          linen: '#FFFDFE',
        },
      },
      fontFamily: {
        brand: ['"Quicksand"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
      },
      boxShadow: {
        cute: '0 8px 24px -4px rgba(154, 128, 189, 0.12)',
        card: '0 4px 20px -2px rgba(45, 34, 53, 0.04)',
        floating: '0 12px 32px -4px rgba(125, 96, 166, 0.28)',
        soft: '0 10px 30px -5px rgba(154, 128, 189, 0.12)',
        float: '0 25px 50px -12px rgba(154, 128, 189, 0.25)',
      },
    },
  },
  plugins: [],
};
