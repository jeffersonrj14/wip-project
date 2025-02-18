import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#FFFFFF',
        'secondary-light': '#DFE6E9',
        'ternary-light': '#f6f7f8',

        'primary-dark': '#383838',
        'secondary-dark': '#212121',
        'ternary-dark': '#141414'
      }
    }
  },
  plugins: []
} satisfies Config
