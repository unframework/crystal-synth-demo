/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Arial'],
      serif: ['TimesCondensed'],
    },

    extend: {
      colors: {
        ered: {
          DEFAULT: '#DD3320',
          500: '#770E09',
        },
        egreen: {
          DEFAULT: '#52F9B5',
          500: '#22773A',
        },
        eorange: {
          DEFAULT: '#FF993F',
          500: '#872E11',
        },
        ewhite: {
          DEFAULT: '#F9FFE1',
          500: '#7B6340',
        },
        eblack: '#110000',
      },
    },
  },
  plugins: [],
};
