import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#152238",
        mist: "#edf3ff",
        sky: "#7cc6fe",
        teal: "#1f9d8b",
        storm: "#26344f",
        sun: "#f9b233"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(21, 34, 56, 0.12)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(249,178,51,0.5), transparent 34%), radial-gradient(circle at right, rgba(124,198,254,0.5), transparent 26%), linear-gradient(135deg, #eff7ff 0%, #f7fcff 46%, #eefcf8 100%)"
      }
    }
  },
  plugins: []
};

export default config;
