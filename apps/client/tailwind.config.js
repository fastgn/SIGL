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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
    "border-red-600",
    "border-sky-400",
    "border-blue-700",
    "border-green-600",
    "border-yellow-400",
    "border-purple-700",
    "border-pink-600",
    "border-orange-600",
    "border-yellow-900",
    "border-gray-400",
    "border-gray-950",

    "text-red-600",
    "text-sky-400",
    "text-blue-700",
    "text-green-600",
    "text-yellow-400",
    "text-purple-700",
    "text-pink-600",
    "text-orange-600",
    "text-yellow-900",
    "text-gray-400",
    "text-gray-950",

    "bg-red-600",
    "bg-sky-400",
    "bg-blue-700",
    "bg-green-600",
    "bg-yellow-400",
    "bg-purple-700",
    "bg-pink-600",
    "bg-orange-600",
    "bg-yellow-900",
    "bg-gray-400",
    "bg-gray-950",
  ],
};
