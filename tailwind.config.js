/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Helvetica Neue', 'Arial'],
      serif: ['TimesCondensed'],
    },

    extend: {
      colors: {
        ered: '#DD3320',
        egreen: '#52F9B5',
        eorange: '#FF993F',
        ewhite: '#F9FFE1',
        eblack: '#110000',
      },
    },
  },
  plugins: [],
};
