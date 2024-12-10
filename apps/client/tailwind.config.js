/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        blue: {
          0: "#0C589C",
          1: "#2468A5",
          2: "#3C79AF",
          3: "#548AB9",
          4: "#6D9AC3",
          5: "#85ABCD",
          6: "#9DBCD7",
          7: "#B6CCE1",
          8: "#CEDDEB",
          9: "#E6EEF5",
          10: "#F2F6FA",
        },
        admin: "#30A9DA",
        onBlue: "#FFFFFF",
        error: {
          dark: "#691911",
          light: "#F4D6D2",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        0: "0px 4px 6px 0px rgba(0, 0, 0, 0.09)",
        1: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addComponents, theme }) {
      addComponents({
        ".text-p-bold": {
          fontSize: theme("fontSize.p-bold"),
          fontWeight: theme("fontWeight.p-bold"),
          lineHeight: theme("lineHeight.p-bold"),
        },
      });
    },
  ],
  safelist: [
    "border-red-700",
    "border-sky-700",
    "border-blue-700",
    "border-green-700",
    "border-yellow-700",
    "border-purple-700",
    "border-pink-700",
    "border-orange-700",
    "border-brown-700",
    "border-gray-700",
    "border-black-700",

    "text-red-700",
    "text-sky-700",
    "text-blue-700",
    "text-green-700",
    "text-yellow-700",
    "text-purple-700",
    "text-pink-700",
    "text-orange-700",
    "text-brown-700",
    "text-gray-700",
    "text-black-700",

    "bg-red-700",
    "bg-sky-700",
    "bg-blue-700",
    "bg-green-700",
    "bg-yellow-700",
    "bg-purple-700",
    "bg-pink-700",
    "bg-orange-700",
    "bg-brown-700",
    "bg-gray-700",
    "bg-black-700",
  ],
};
