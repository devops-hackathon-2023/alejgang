/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        csas: {
          50: '#eff7ff',
          100: '#dbecfe',
          200: '#bedeff',
          300: '#92cbfe',
          400: '#5fadfb',
          500: '#398cf8',
          600: '#2870ed',
          700: '#1b57da',
          800: '#1d47b0',
          900: '#1d408b',
          950: '#172854',
        },
        status: {
          fail: '#e72222',
          success: '#028661',
          started: '#2870ed',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      gridTemplateColumns: {
        main: 'min(40ch, 280px) auto',
      },
    },
  },
  plugins: [],
};
