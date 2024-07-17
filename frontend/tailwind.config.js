/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '50%' },
          '50%': { borderRadius: '60% 40% 30% 70% / 30% 70% 40% 60%' },
        },
        morphDramatic: {
          '0%, 100%': { borderRadius: '50%' },
          '12.5%': { borderRadius: '70% 30% 50% 50% / 50% 50% 30% 70%' },
          '25%': { borderRadius: '30% 70% 60% 40% / 40% 60% 70% 30%' },
          '37.5%': { borderRadius: '50% 50% 30% 70% / 70% 30% 50% 50%' },
          '50%': { borderRadius: '60% 40% 70% 30% / 30% 70% 40% 60%' },
          '62.5%': { borderRadius: '40% 60% 30% 70% / 70% 30% 60% 40%' },
          '75%': { borderRadius: '30% 70% 50% 50% / 50% 50% 70% 30%' },
          '87.5%': { borderRadius: '70% 30% 40% 60% / 60% 40% 30% 70%' },
        },
      },
      animation: {
        float: 'float 2s ease-in-out infinite',
        morphDramatic: 'morphDramatic 4s ease-in-out infinite',
      },
      colors: {
        'purple-gradient-start': '#DC92FF',
        'mint-gradient-end': '#75FFEE',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.text-gradient-custom': {
          background: 'linear-gradient(90deg, #DC92FF 0%, #75FFEE 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'text-fill-color': 'transparent',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
};
