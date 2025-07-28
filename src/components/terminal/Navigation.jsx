import React from 'react';
import { Code, Folder, Terminal, Save, Play, FilePlus, Keyboard, FolderPlus } from 'lucide-react';

const Navigation = ({ 
    activeTab, 
    onTabClick, 
    activeFile, 
    onSave, 
    onExecute, 
    onNewFile, 
    onNewFolder, 
    isExecuting 
}) => (
    <nav className="bg-terminal-header border-b border-terminal-border px-2 md:px-4 shrink-0 flex justify-between items-center">
        <div className="flex space-x-1">
            {['editor', 'files', 'terminal'].map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabClick(tab)}
                    className={`px-3 py-2 text-sm border-b-2 transition-colors flex items-center ${
                        activeTab === tab
                            ? 'border-terminal-primary text-terminal-primary bg-gray-700/50'
                            : 'border-transparent text-gray-400 hover:text-terminal-primary'
                        }`}
                    title={tab.charAt(0).toUpperCase() + tab.slice(1)}
                >
                    {tab === 'editor' ? <Code className="w-5 h-5" /> : tab === 'files' ? <Folder className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                    <span className="hidden md:inline ml-2">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </button>
            ))}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
            {activeTab === 'editor' && activeFile && (
                <>
                    <button onClick={onSave} title="Salvar (Ctrl+S)" className="flex items-center p-2 md:px-3 md:py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded text-terminal-primary text-xs font-mono transition-colors">
                        <Save className="w-4 h-4 md:mr-1" />
                        <span className="hidden md:inline">Salvar</span>
                    </button>
                    {activeFile.type === 'py' && (
                        <button onClick={onExecute} disabled={isExecuting} title="Executar" className="flex items-center p-2 md:px-3 md:py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded text-blue-400 text-xs font-mono disabled:opacity-50">
                            <Play className="w-4 h-4 md:mr-1" />
                            <span className="hidden md:inline">{isExecuting ? 'Executando...' : 'Executar'}</span>
                        </button>
                    )}
                </>
            )}
            
            <button onClick={onNewFolder} title="Nova Pasta" className="flex items-center p-2 md:px-3 md:py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded text-terminal-primary text-xs font-mono transition-colors">
                <FolderPlus className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Nova Pasta</span>
            </button>
            
            <button onClick={onNewFile} title="Novo Arquivo" className="flex items-center p-2 md:px-3 md:py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded text-terminal-primary text-xs font-mono transition-colors">
                <FilePlus className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Novo Arquivo</span>
            </button>
            
            <div className="hidden md:flex items-center text-xs text-gray-500 space-x-2">
                <Keyboard className="w-4 h-4" />
                <span>Ctrl+S: Salvar</span>
            </div>
        </div>
    </nav>
);

export default Navigation;