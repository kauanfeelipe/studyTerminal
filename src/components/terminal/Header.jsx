import React from 'react';
import { Terminal, LogOut, Palette, Menu, X } from 'lucide-react';

const Header = ({ username, onLogout, onToggleTheme, isMenuOpen, onToggleMenu }) => {
  const displayName = username?.split('@')[0];

  return (
    <header className="relative bg-terminal-header border-b border-terminal-border px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 flex items-center">
          <Terminal className="w-4 h-4 mr-2 text-terminal-primary" />
          <span className="text-sm hidden md:inline">studyTerminal v1.0.0</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-terminal-amber">
          <span className="text-sm text-terminal-amber"> user: {displayName}</span>
        </span>
        
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={onToggleTheme} 
            title="Mudar Tema" 
            className="text-terminal-primary hover:text-terminal-amber transition-colors"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button onClick={onLogout} title="Sair" className="flex items-center text-red-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={onToggleMenu} title="Menu" className="text-terminal-primary">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full right-4 mt-2 w-48 bg-terminal-header border border-terminal-border rounded-md shadow-lg z-20">
          <ul className="py-1">
            <li>
              <button 
                onClick={onToggleTheme} 
                className="w-full flex items-center px-4 py-2 text-sm text-terminal-primary hover:bg-terminal-bg"
              >
                <Palette className="w-4 h-4 mr-3" />
                Mudar Tema
              </button>
            </li>
            <li>
              <button 
                onClick={onLogout} 
                className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-terminal-bg"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;