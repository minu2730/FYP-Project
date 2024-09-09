/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor:{
        rock:"#222831",
        cement:"#393e46",
        myorange:"#f96d00",
        cloud:"#f2f2f2"
      },
      screens: {
        'sm': '490px',
        // => @media (min-width: 640px) { ... }
    
        'md': '768px',
        // => @media (min-width: 768px) { ... }
    
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
    
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
    
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
      , width: {
        '30': '120px',
      },
      backgroundImage: {
        mobiles: "url('./src/assets/graphImage.png')  ",
      }
    },
  },
  
  plugins: [],
}

