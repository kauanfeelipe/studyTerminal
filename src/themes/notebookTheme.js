
export const notebookTheme = {
  base: 'vs', 
  inherit: true,
  rules: [
    { token: 'comment', foreground: 'a0a0a0' },
    { token: 'string', foreground: '6a3e3e' },
    { token: 'number', foreground: '2a4b8d' },
    { token: 'keyword', foreground: '0000ff' },
  ],
  colors: {
    'editor.foreground': '#3B3B3B', 
    'editor.background': '#FDFCF5', 
    'editorCursor.foreground': '#000000',
    'editor.lineHighlightBackground': '#F3F2E9', 
    'editorLineNumber.foreground': '#A0A0A0', 
    'editor.selectionBackground': '#D5D5D5',
  },
};