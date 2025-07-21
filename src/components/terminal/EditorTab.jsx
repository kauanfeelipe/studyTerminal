import React from 'react';
import { FileText, XCircle } from 'lucide-react';
import Editor, { useMonaco } from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PythonIcon } from './Icons.jsx';
import draculaTheme from 'monaco-themes/themes/Dracula.json';

const EditorTab = ({ openFiles = [], activeFileId, setActiveFileId, unsavedChanges, handleCloseTab, activeFile, handleMetadataChange, handleEditorChange, subjects }) => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('dracula', draculaTheme);
    }
  }, [monaco]);
  
  if (openFiles.length === 0) {
    return <div className="text-center text-gray-500 py-16">Abra um ficheiro na aba "Files" ou crie um novo.</div>;
  }

  const editorOptions = {
    python: { minimap: { enabled: true }, fontSize: 14, wordWrap: 'on' },
    txt: { 
      minimap: { enabled: false }, 
      fontSize: 14, 
      fontFamily: '"Fira Code", monospace', 
      wordWrap: 'bounded', 
      lineNumbers: 'on', 
      glyphMargin: true 
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center border-b border-terminal-border overflow-x-auto">
        {openFiles.map(file => (
          <button key={file.id} onClick={() => setActiveFileId(file.id)} className={`flex-shrink-0 flex items-center px-3 py-2 text-sm ${activeFileId === file.id ? 'bg-terminal-header text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
            {file.type === 'py' ? <PythonIcon className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            <span className={`whitespace-nowrap ${unsavedChanges[file.id] ? 'text-yellow-400' : ''}`}>{file.name || 'novo_ficheiro'}{unsavedChanges[file.id] && '*'}</span>
            <XCircle onClick={(e) => handleCloseTab(file.id, e)} className="w-4 h-4 ml-3 hover:text-red-500"/>
          </button>
        ))}
      </div>

      {activeFile && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <input type="text" value={activeFile.name} onChange={(e) => handleMetadataChange('name', e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" placeholder="Nome do ficheiro" />
            <select value={activeFile.subject} onChange={(e) => handleMetadataChange('subject', e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary">
              <option value="">Selecione uma matéria</option>
              {subjects.sort().map(s => (<option key={s} value={s}>{s}</option>))}
            </select>
            <select value={activeFile.type} onChange={(e) => handleMetadataChange('type', e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary">
              <option value="py">Python (.py)</option>
              <option value="txt">Texto (.txt)</option>
            </select>
          </div>
          <div className="relative border border-gray-600 rounded">
            {activeFile.type === 'txt' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border">
                <Editor height="60vh" theme="dracula" language="markdown" value={activeFile.content} onChange={handleEditorChange} options={editorOptions.txt} />
                <div className="bg-white text-black p-4 overflow-y-auto prose prose-sm max-w-none break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeFile.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <Editor height="60vh" theme="dracula" language="python" value={activeFile.content} onChange={handleEditorChange} options={editorOptions.python} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditorTab;