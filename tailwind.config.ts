import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#080A12", 900: "#0F1220", 700: "#3A3F5C" },
        accent: { 500: "#7C5CFF", 600: "#6B47F5" },
        warm: "#F4F1EA",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ['"JetBrains Mono"', "ui-monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
