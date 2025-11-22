/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rwanda: {
          blue: '#00A1DE',
          green: '#00A651',
          yellow: '#FFD100',
          red: '#FF0000'
        },
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5ca',
          300: '#8dd1a7',
          400: '#56b97d',
          500: '#2fa05d',
          600: '#1f8549',
          700: '#1a6a3d',
          800: '#175533',
          900: '#14462b',
          950: '#0a2617'
        },
        secondary: {
          50: '#fdf8f0',
          100: '#fbeee0',
          200: '#f6dac0',
          300: '#efc195',
          400: '#e7a169',
          500: '#e18544',
          600: '#d46e39',
          700: '#b05830',
          800: '#8d472f',
          900: '#733c29',
          950: '#3e1e15'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};