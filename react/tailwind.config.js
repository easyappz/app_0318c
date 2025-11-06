/* eslint-disable */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        calc: {
          bg: "var(--calc-bg)",
          panel: "var(--calc-panel)",
          text: "var(--calc-text)",
          subtext: "var(--calc-subtext)",
          key: "var(--calc-key)",
          keyAlt: "var(--calc-key-alt)",
          operator: "var(--calc-operator)",
          operatorActive: "var(--calc-operator-active)",
          accent: "var(--calc-accent)"
        }
      },
      boxShadow: {
        soft: "0 6px 18px rgba(0,0,0,0.35)",
        inset: "inset 2px 2px 6px rgba(0,0,0,0.45), inset -2px -2px 6px rgba(255,255,255,0.04)"
      }
    }
  },
  plugins: []
};
