import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { db } from '../services/firebase.js';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import api from '../services/api.js';
import Header from '../components/terminal/Header.jsx';
import Navigation from '../components/terminal/Navigation.jsx';
import EditorTab from '../components/terminal/EditorTab.jsx';
import FilesTab from '../components/terminal/FilesTab.jsx';
import StatusBar from '../components/terminal/StatusBar.jsx';
import { ConfirmationModal, EditFileModal } from '../components/terminal/Modals.jsx';
import { Eraser } from 'lucide-react';

const PREDEFINED_SUBJECTS = ['Análise/Projeto de Sistemas', 'Estrutura de Dados ||', 'Redes de Computadores'];

const TerminalAppPage = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [displayedFiles, setDisplayedFiles] = useState([]);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const [terminalOutput, setTerminalOutput] = useState('> Terminal aguardando execução de código Python...');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isExecuting, setIsExecuting] = useState(false);
  const [filter, setFilter] = useState({ subject: '', type: '', keyword: '' });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'editor');
  const [subjects, setSubjects] = useState(PREDEFINED_SUBJECTS);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'green');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const outputRef = useRef(null);
  const { logout, user } = useContext(AuthContext);
  const activeFile = openFiles.find(f => f.id === activeFileId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setAllFiles([]);
      return;
    }
    const filesCol = collection(db, `users/${user.uid}/files`);
    const filesQuery = query(filesCol, orderBy("name"));

    const unsubFiles = onSnapshot(filesQuery, snap => {
      const files = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllFiles(files);
    });

    return () => unsubFiles();
  }, [user]);

  useEffect(() => {
    let filtered = [...allFiles];
    if (showOnlyFavorites) { filtered = filtered.filter(file => file.isFavorite === true); }
    if (filter.subject) { filtered = filtered.filter(file => file.subject === filter.subject); }
    if (filter.type) { filtered = filtered.filter(file => file.type === filter.type); }
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filtered = filtered.filter(file => file.name.toLowerCase().includes(keyword) || (file.content && file.content.toLowerCase().includes(keyword)));
    }
    filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
    setDisplayedFiles(filtered);
  }, [allFiles, filter, showOnlyFavorites]);

  useEffect(() => { if (outputRef.current) { outputRef.current.scrollTop = outputRef.current.scrollHeight; } }, [terminalOutput]);
  useEffect(() => { if (statusMessage.text) { const timer = setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000); return () => clearTimeout(timer); } }, [statusMessage]);
  useEffect(() => { localStorage.setItem('activeTab', activeTab); }, [activeTab]);


  const handleToggleTheme = () => { setTheme(prevTheme => (prevTheme === 'green' ? 'purple' : 'green')); };

  const handleToggleFavorite = async (file) => {
    if (!user || !file) return;
    const docRef = doc(db, 'users', user.uid, 'files', file.id);
    const newFavoriteStatus = !file.isFavorite;
    try {
      await updateDoc(docRef, { isFavorite: newFavoriteStatus });
      setAllFiles(prevFiles => prevFiles.map(f => f.id === file.id ? { ...f, isFavorite: newFavoriteStatus } : f));
    } catch (error) {
      console.error("Erro ao favoritar o arquivo:", error);
      setStatusMessage({ text: 'Não foi possível alterar o status de favorito.', type: 'error' });
    }
  };

  const handleDownloadFile = (file) => {
    if (!file || typeof file.content !== 'string') {
      setStatusMessage({ text: 'Conteúdo do arquivo inválido para download.', type: 'error' });
      return;
    }
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file.name}.${file.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleSave = useCallback(async () => {
    if (!activeFile || !user) return;
    if (!activeFile.name || !activeFile.subject) {
      setStatusMessage({ text: 'Erro: Nome e matéria são obrigatórios.', type: 'error' });
      return;
    }
    try {
      let savedFileId = activeFile.id;
      const fileData = { name: activeFile.name, subject: activeFile.subject, type: activeFile.type, content: activeFile.content, updatedAt: serverTimestamp() };
      if (String(activeFile.id).startsWith('new-file')) {
        const fileDataWithCreationDate = { ...fileData, createdAt: serverTimestamp(), isFavorite: false };
        const docRef = await addDoc(collection(db, 'users', user.uid, 'files'), fileDataWithCreationDate);
        savedFileId = docRef.id;
        setStatusMessage({ text: `Ficheiro '${fileData.name}.${fileData.type}' criado com sucesso!`, type: 'success' });
        const newFileForState = { ...fileDataWithCreationDate, id: savedFileId, createdAt: { toDate: () => new Date() } };
        setAllFiles(prevFiles => [...prevFiles, newFileForState]);
      } else {
        const docRef = doc(db, 'users', user.uid, 'files', activeFile.id);
        await updateDoc(docRef, fileData);
        setStatusMessage({ text: `Ficheiro '${fileData.name}.${fileData.type}' atualizado com sucesso!`, type: 'success' });
      }
      const savedFile = { ...activeFile, id: savedFileId };
      setOpenFiles(prev => prev.map(f => f.id === activeFileId ? savedFile : f));
      setActiveFileId(savedFileId);
      setUnsavedChanges(prev => {
        const newUnsaved = { ...prev };
        delete newUnsaved[activeFile.id];
        newUnsaved[savedFileId] = false;
        return newUnsaved;
      });
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
      setStatusMessage({ text: "Falha ao salvar no servidor.", type: 'error' });
    }
  }, [activeFile, activeFileId, user]);

  const confirmDeleteItem = async () => {
    if (!itemToDelete || !user) return;
    const { id, name, type } = itemToDelete;
    const itemName = `${name}.${type}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'files', id));
      setStatusMessage({ text: `Ficheiro '${itemName}' deletado com sucesso.`, type: 'success' });
      setItemToDelete(null);
      setOpenFiles(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      setStatusMessage({ text: `Falha ao deletar o ficheiro.`, type: 'error' });
      setItemToDelete(null);
    }
  };

  const confirmEditFile = async (fileToUpdate, updatedData) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'files', fileToUpdate.id);
    const cleanData = { name: updatedData.name, subject: updatedData.subject };
    try {
      await updateDoc(docRef, cleanData);
      setStatusMessage({ text: 'Ficheiro atualizado com sucesso!', type: 'success' });
      setFileToEdit(null);
      setOpenFiles(prev => prev.map(f => f.id === fileToUpdate.id ? { ...f, ...updatedData } : f));
    } catch (error) {
      console.error('Erro ao editar arquivo:', error);
      setStatusMessage({ text: 'Erro ao atualizar o ficheiro.', type: 'error' });
      setFileToEdit(null);
    }
  };

  const handleNewFile = () => {
    const newFileId = `new-file-${Date.now()}`;
    const newFile = { id: newFileId, name: '', subject: '', type: 'py', content: '', isFavorite: false };
    setOpenFiles(prev => [...prev, newFile]);
    setActiveFileId(newFileId);
    setActiveTab('editor');
  };

  const requestDeleteItem = (item, event) => {
    event.stopPropagation();
    setItemToDelete({ ...item, type: item.type || 'file' });
  };

  const requestEditFile = (file, event) => {
    event.stopPropagation();
    setFileToEdit(file);
  };

  const loadFile = (file) => {
    if (!openFiles.some(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFileId(file.id);
    setActiveTab('editor');
  };

  const handleCloseTab = (fileId, event) => {
    event.stopPropagation();
    const updatedOpenFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(updatedOpenFiles);
    if (activeFileId === fileId) {
      setActiveFileId(updatedOpenFiles.length > 0 ? updatedOpenFiles[0].id : null);
    }
  };

  const handleMetadataChange = (field, value) => {
    if (!activeFile) return;
    setOpenFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, [field]: value } : f));
    setUnsavedChanges(prev => ({ ...prev, [activeFileId]: true }));
  };

  const handleEditorChange = (value) => {
    if (!activeFile) return;
    setOpenFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: value || "" } : f));
    setUnsavedChanges(prev => ({ ...prev, [activeFileId]: true }));
  };

  const handleClearTerminal = () => { setTerminalOutput('> Terminal limpo.'); };

  const handleExecute = useCallback(async () => {
    if (!activeFile || activeFile.type !== 'py' || !activeFile.content) {
      setStatusMessage({ text: 'Erro: Apenas ficheiros Python com conteúdo podem ser executados.', type: 'error' });
      return;
    }
    setActiveTab('terminal');
    setIsExecuting(true);
    setTerminalOutput(`> Executando 'python3 ${activeFile.name || "script"}.py'...\n\n`);
    try {
      const response = await api.post('/', { content: activeFile.content });
      const result = response.data;
      if (result.status === 'success') {
        setTerminalOutput(prev => prev + result.output + '\n> Processo finalizado com sucesso (código 0).');
      } else {
        setTerminalOutput(prev => prev + `> ERRO DE EXECUÇÃO:\n${result.output}\n> Processo finalizado com erro (código 1).`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Falha na comunicação com o servidor de execução.";
      setTerminalOutput(prev => prev + `> ERRO CRÍTICO: ${errorMsg}`);
    } finally {
      setIsExecuting(false);
    }
  }, [activeFile]);

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.ctrlKey && event.key === 's') { event.preventDefault(); handleSave(); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [handleSave]);

  return (
    <div className="min-h-screen bg-terminal-bg font-mono flex flex-col">
      {itemToDelete && (<ConfirmationModal message={`Tem certeza que deseja deletar o arquivo "${itemToDelete.name}"?`} onConfirm={confirmDeleteItem} onCancel={() => setItemToDelete(null)} />)}
      {fileToEdit && (<EditFileModal file={fileToEdit} subjects={subjects} onSave={confirmEditFile} onCancel={() => setFileToEdit(null)} />)}

      <Header
        username={user?.email || '...'}
        onLogout={logout}
        onToggleTheme={handleToggleTheme}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(prev => !prev)}
      />
      <Navigation
        activeTab={activeTab} onTabClick={setActiveTab} activeFile={activeFile}
        onSave={handleSave} onExecute={handleExecute} onNewFile={handleNewFile} isExecuting={isExecuting}
      />
      {statusMessage.text && (<div className={`px-4 py-2 text-center text-sm ${statusMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}> {statusMessage.text}</div>)}

      <main className="flex-grow p-4 overflow-y-auto" onClick={() => setIsMenuOpen(false)}>
        {activeTab === 'editor' && (
          <EditorTab
            openFiles={openFiles} activeFileId={activeFileId} setActiveFileId={setActiveFileId}
            unsavedChanges={unsavedChanges} handleCloseTab={handleCloseTab} activeFile={activeFile}
            handleMetadataChange={handleMetadataChange} handleEditorChange={handleEditorChange} subjects={subjects}
          />
        )}
        {activeTab === 'files' && (
          <FilesTab
            files={displayedFiles}
            filter={filter}
            setFilter={setFilter}
            clearFilters={() => setFilter({ subject: '', type: '', keyword: '' })}
            subjects={subjects}
            loadFile={loadFile}
            requestEditFile={requestEditFile}
            requestDeleteItem={requestDeleteItem}
            onToggleFavorite={handleToggleFavorite}
            onToggleShowFavorites={() => setShowOnlyFavorites(prev => !prev)}
            isFavoriteFilterActive={showOnlyFavorites}
            openFiles={openFiles}
            onDownloadFile={handleDownloadFile}
          />
        )}
        {activeTab === 'terminal' && (
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center text-terminal-primary mb-4">
              <span><span className="text-gray-500">$</span> tail -f /var/log/execution.log</span>
              <button onClick={handleClearTerminal} className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"><Eraser className="w-4 h-4 mr-2" />Limpar Terminal</button>
            </div>
            <div ref={outputRef} className="bg-black/50 border border-gray-600 rounded p-4 h-full min-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">{terminalOutput}</div>
          </div>
        )}
      </main>
      <StatusBar fileCount={displayedFiles.length} />
    </div>
  );
};

export default TerminalAppPage;