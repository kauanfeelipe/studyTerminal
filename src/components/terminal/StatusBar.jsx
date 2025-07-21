import React from 'react';

const StatusBar = ({ fileCount }) => (
  <footer className="bg-terminal-header border-t border-terminal-border px-4 py-2 text-sm text-gray-400 shrink-0">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span>Arquivos: {fileCount}</span>
        
      </div>
      <div>{new Date().toLocaleString('pt-BR')}</div>
    </div>

    <div className="mt-1 text-center text-xs text-gray-500">
      Desenvolvido por Kauan Felipe © {new Date().getFullYear()}
    </div>
  </footer>
);

export default StatusBar;
