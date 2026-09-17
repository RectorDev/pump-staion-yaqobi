/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app.html',
    './kar/index.html',
    './payam/index.html',
    './view/index.html',
    './webvault-manager/webvault.html',
    './tools/inject-static-ui.mjs',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        control: '0.75rem',
        panel: '1rem',
      },
      boxShadow: {
        panel: '0 1px 2px rgb(15 23 42 / 0.10), 0 12px 30px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
};
