module.exports = {
  content: [
    './src//*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in src and its subdirectories
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#1E40AF',
        customPurple: '#6D28D9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};