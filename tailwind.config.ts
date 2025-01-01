import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customTextColor: 'var(--text-color)',
        customBackgroundColor: 'var(--background-color)',
        customColor: 'var(--custom-color)',
        customColor2: 'var(--colorIwant)',
        decentColor : 'var(--DecentColor)'

      },
    },
  },
} satisfies Config;
