/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f2f3",
          100: "#f4e5e6",
          200: "#e9cbcd",
          300: "#deb1b3",
          400: "#c38286",
          500: "#af4d53",
          600: "#973641",
          700: "#7c2c35",
          800: "#60222a",
          900: "#441920",
        },
        secondary: {
          50: "#ffffff",
          100: "#ffffff",
          200: "#ffffff",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#f0f0f0",
          700: "#e0e0e0",
          800: "#cccccc",
          900: "#b0b0b0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-montserrat)"],
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
