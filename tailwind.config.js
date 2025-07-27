/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-hover': '#1ed760',
          black: '#191414',
          white: '#FFFFFF',
          base: '#121212',
          elevated: '#282828',
          highlight: '#3E3E3E',
          'text-base': '#FFFFFF',
          'text-bright': '#FFFFFF',
          'text-subdued': '#A7A7A7',
          gray: {
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
          },
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
