/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      ssm: '305px',
      st: '370px',
      sm: '558px',
      mi: '700px',
      md: '891px',
      lg: '976px',
      lx: '1175px',
      xl: '1440px',
    },
    extend: { 
      colors:{
        mainBackColor: '#07071C',
        mainTextGrey: '#ACACB5',
        primaryGreen : '#4EE39D',
        primaryBlack: '#07071C',
        PrimaryPurple: '#9756FF',
        userDashPurple: '#473ECD',
        purpleGradientBlue : '#00B3EC',          
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}

