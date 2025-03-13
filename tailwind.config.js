/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent': {
          400: '#9333ea', // Daha koyu mor
          500: '#7928ca', // Ana aksan rengi
          600: '#6323a5', // Hover için
          700: '#4c1b80', // Aktif durum için
        },
        'background': {
          700: '#161616', // Daha koyu gri
          800: '#121212', // Çok koyu gri
          900: '#0a0a0a', // En koyu gri
        },
        'card': {
          700: '#1a1a1a', // Koyu mat gri
          800: '#151515', // Daha koyu mat gri
          900: '#101010', // En koyu mat gri
        },
        'gray': {
          750: '#151515', // Özel koyu gri
          850: '#121212', // Özel çok koyu gri
          950: '#0a0a0a', // Özel en koyu gri
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
