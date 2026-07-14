/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#11161d",
        panel: "#171e27",
        panelAlt: "#1e2733",
        border: "#2a3542",
        silver: "#c3ccd4",
        silverDim: "#8b98a5",
        blue: {
          DEFAULT: "#2f86c6",
          dim: "#1d5a8c",
          deep: "#123a5c",
        },
      },
    },
  },
  plugins: [],
};
