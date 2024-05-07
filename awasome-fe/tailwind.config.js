/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        left: "-8px 0 15px -3px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        biru: "#007bff",
        alert: "#CB3A30",
        itam: {
          100: "#374151",
          200: "#111827",
          300: "#1F2937",
        },
        ijau: {
          100: "#34D399",
          200: "#348366",
          300: "#047857",
          400: "#E3FFF5",
          500: "#A5F6D8",
        },
      },
    },
  },
  plugins: [],
};
