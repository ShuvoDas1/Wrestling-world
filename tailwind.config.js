module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        "exo-nav": ["Exo", "sans-serif"],
        "gudea-paragraph": ["Gudea", "sans-serif"],
        "khand-headers": ["Khand", "sans-serif"],
        "quattrocento-sans": ["Quattrocento Sans", "sans-serif"],
      },
      colors: {
        main: "#ce061e",
        "main-black": "#18191A",
      },
      gridTemplateColumns: {
        main: "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr) ",
        "template-one": "minmax(180px, 1fr) 1fr minmax(180px, 1fr)",
        "template-one-xl": "minmax(320px, 1fr) 1fr minmax(320px, 1fr)",
        "template-two": "1fr 640px 1fr",
      },
      boxShadow: {
        post: "0 0 4px #cecece",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
