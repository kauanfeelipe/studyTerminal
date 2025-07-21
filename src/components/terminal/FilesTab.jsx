import React from 'react';
import { Calendar, Filter, FilePenLine, Trash2, FileText, Star, Download } from 'lucide-react';
import { PythonIcon } from './Icons.jsx';

const FilesTab = ({
  files,
  openFiles,
  filter,
  setFilter,
  clearFilters,
  subjects,
  loadFile,
  requestEditFile,
  requestDeleteItem,
  onToggleFavorite,
  onToggleShowFavorites,
  isFavoriteFilterActive,
  onDownloadFile
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center text-terminal-primary mb-4">
      <span><span className="text-gray-500">$</span> ls -la ~/estudos</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-terminal-header/50 border border-terminal-border rounded-lg">
      <input type="text" value={filter.keyword} onChange={(e) => setFilter({ ...filter, keyword: e.target.value })} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" placeholder="Buscar..." />
      <select value={filter.subject} onChange={(e) => setFilter({ ...filter, subject: e.target.value })} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary">
        <option value="">Todas as matérias</option>
        {subjects.sort().map(s => (<option key={s} value={s}>{s}</option>))}
      </select>
      <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary">
        <option value="">Todos os tipos</option>
        <option value="py">Python</option>
        <option value="txt">Texto</option>
      </select>
      <div className="flex items-end">
        <button onClick={onToggleShowFavorites} className={`flex items-center w-full justify-center px-4 py-2 rounded text-white transition-colors ${isFavoriteFilterActive ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
          <Star className="w-4 h-4 mr-2" />
          {isFavoriteFilterActive ? 'Mostrar Todos' : 'Favoritos'}
        </button>
      </div>
      <div className="flex items-end">
        <button onClick={clearFilters} className="flex items-center w-full justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Limpar
        </button>
      </div>
    </div>

    <div className="space-y-2">
      {files.map(file => {
        const isOpen = openFiles.some(openFile => openFile.id === file.id);
        return (
          <div key={file.id} onClick={() => loadFile(file)} className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors group ${isOpen ? 'bg-gray-700/50 border-l-2 border-terminal-primary' : 'bg-terminal-header hover:bg-gray-700/50'}`}>
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {file.type === 'py' ? <PythonIcon className="w-5 h-5 text-blue-400 flex-shrink-0" /> : <FileText className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
              <div className="min-w-0">
                <div className="text-terminal-primary font-medium truncate">{file.name}.{file.type}</div>
                <div className="text-sm text-gray-400 truncate">{file.subject}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
              <div className="hidden group-hover:flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{file.createdAt && file.createdAt.toDate ? new Date(file.createdAt.toDate()).toLocaleDateString('pt-BR') : '...'}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(file); }} className="p-1 sm:p-2 rounded-md transition-colors" title={file.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                <Star className={`w-4 h-4 ${file.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDownloadFile(file); }} className="p-1 sm:p-2 rounded-md hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-colors" title="Baixar arquivo">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={(e) => requestEditFile(file, e)} className="p-1 sm:p-2 rounded-md hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 transition-colors" title="Editar arquivo">
                <FilePenLine className="w-4 h-4" />
              </button>
              <button onClick={(e) => requestDeleteItem(file, e)} className="p-1 sm:p-2 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors" title="Deletar arquivo">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {isFavoriteFilterActive ? "Nenhum arquivo favorito encontrado." : "Nenhum ficheiro encontrado."}
        </div>
      )}
    </div>
  </div>
);

export default FilesTab;