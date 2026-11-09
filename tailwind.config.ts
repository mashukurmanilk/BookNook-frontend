import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#fdf8f4",
          100: "#fbf0e7",
          200: "#f6decb",
          300: "#eec3a4",
          400: "#e49e75",
          500: "#dc7d4f",
          600: "#ce6239",
          700: "#ab4c2e",
          800: "#893f2c",
          900: "#703728",
          950: "#3d1b13",
        },
        paper: {
          light: "#faf8f5",
          dark: "#141416",
          cardLight: "#ffffff",
          cardDark: "#1c1d21",
          borderLight: "#e5e7eb",
          borderDark: "#2c2e35",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Playfair Display", "Merriweather", "Georgia", "serif"],
      },
      boxShadow: {
        book: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "book-hover": "0 20px 30px -10px rgba(0, 0, 0, 0.22), 0 10px 15px -5px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
