import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};

// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Reactの全コンポーネントを対象に
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
      },
    },
  },
  plugins: [],
};
