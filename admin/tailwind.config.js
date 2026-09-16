/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#9A80BD',
          purpleDark: '#7D60A6',
          purpleLight: '#FAF7FC',
          pink: '#F472B6',
          pinkSoft: '#FDF2F8',
          charcoal: '#2D2235',
        }
      }
    },
  },
  plugins: [],
}
