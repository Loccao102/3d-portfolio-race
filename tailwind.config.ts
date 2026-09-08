import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0c0f17',
          card: '#121722',
          cyan: '#00f3ff',
          amber: '#ffaa00',
          red: '#ff3366',
        },
      },
    },
  },
  plugins: [],
};

export default config;

