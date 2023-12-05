module.exports = {
  content: [
    // app content
    "src/**/*.{js,ts,jsx,tsx}",
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
    // "../../apps/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require("daisyui")
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.5rem'
      },
      spacing: {
        '18': '4.5rem',
      },
      screens: {
        'mobileXs': {'min': '320px', 'max': '360px'},
      }
    }
  },
  daisyui: {
    themes: [
      {
        gojiraf: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: "#000000",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
        }
      }
    ],
  },
};