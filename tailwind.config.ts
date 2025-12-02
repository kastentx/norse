import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        norse: {
          gold: "#FFD700",
          bronze: "#CD7F32",
          stone: "#8B8D7A",
          ice: "#E0F4FF",
          fire: "#FF6B35",
          night: "#0F1419",
          rune: "#9D4EDD",
        },
      },
      fontFamily: {
        norse: ["var(--font-norse)"],
      },
    },
  },
};

export default config;
