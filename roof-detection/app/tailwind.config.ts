import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "primary-orange": "#DE6C27",
        "primary-text": "#202020",
        "secondary-text": "#4A4949",
        "light-gray": "#D4D4D4",
      },
      fontSize: {
        h1: "2.5rem",
        h2: "1.875rem",
        h3: "1.25rem",
        small: "0.875rem",
      },
    },
  },
  plugins: [],
};
export default config;
