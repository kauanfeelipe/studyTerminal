/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // As cores do tema agora apontam para variáveis CSS
        // A sintaxe 'rgb(var(...) / <alpha-value>)' é a forma moderna do Tailwind para isso.
        'terminal-primary': 'rgb(var(--color-terminal-primary) / <alpha-value>)',
        'terminal-amber': 'rgb(var(--color-terminal-amber) / <alpha-value>)',
        'terminal-bg': 'rgb(var(--color-terminal-bg) / <alpha-value>)',
        'terminal-header': 'rgb(var(--color-terminal-header) / <alpha-value>)',
        'terminal-border': 'rgb(var(--color-terminal-border) / <alpha-value>)',
      }
    },
    fontFamily: { 'mono': ['"Fira Code"', 'monospace'] },
  },
  plugins: [],
}