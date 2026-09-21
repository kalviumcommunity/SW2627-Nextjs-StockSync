// Task: Tailwind styling configuration for the app theme.
// Used by: Used by all front-end component styling across the app.
// Important code snippets:
// 1. Content paths for app files
// 2. Custom theme and brand colors
// 3. Tailwind plugin setup

/**
 * File task: Tailwind theme and content configuration for the StockSync front-end design system.
 * Used by: app/*.tsx files and all components using utility classes.
 * Important code snippets:
 *   1. content paths for app and component files.
 *   2. Custom brand colors and theme extensions.
 *   3. Tailwind plugin and safe-list style configuration.
 */

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
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        sidebar: {
          bg: '#0F172A',
          hover: '#1E293B',
          active: '#7C3AED',
        }
      },
    },
  },
  plugins: [],
};
export default config;
