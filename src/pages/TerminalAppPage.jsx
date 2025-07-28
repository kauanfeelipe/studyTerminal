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
import { ConfirmationModal, EditFileModal, CreateFolderModal, MoveFileModal, RenameModal } from '../components/terminal/Modals.jsx';
import { Eraser } from 'lucide-react';

const PREDEFINED_SUBJECTS = ['Análise/Projeto de Sistemas', 'Estrutura de Dados ||', 'Redes de Computadores'];

const TerminalAppPage = () => {
    // States de Arquivos e Editor
    const [allFiles, setAllFiles] = useState([]);
    const [displayedFiles, setDisplayedFiles] = useState([]);
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFileId, setActiveFileId] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState({});

    // States de UI e Funcionalidades Gerais
    const [terminalOutput, setTerminalOutput] = useState('> Terminal aguardando execução de código Python...');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isExecuting, setIsExecuting] = useState(false);
    const [filter, setFilter] = useState({ subject: '', type: '', keyword: '' });
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'editor');
    const [subjects, setSubjects] = useState(PREDEFINED_SUBJECTS);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'green');
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // States para Modais de Ação (Arquivos)
    const [itemToDelete, setItemToDelete] = useState(null);
    const [fileToEdit, setFileToEdit] = useState(null);
    const [fileToMove, setFileToMove] = useState(null);
    
    // States para Pastas e Modais de Ação (Pastas)
    const [folders, setFolders] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [folderToEdit, setFolderToEdit] = useState(null);

    // Refs e Contexto
    const outputRef = useRef(null);
    const { logout, user } = useContext(AuthContext);
    const activeFile = openFiles.find(f => f.id === activeFileId);

    // --- EFEITOS (SIDE EFFECTS) ---

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
        if (!user) {
            setFolders([]);
            return;
        }
        const foldersCol = collection(db, `users/${user.uid}/folders`);
        const foldersQuery = query(foldersCol, orderBy("name"));
        const unsubFolders = onSnapshot(foldersQuery, snap => {
            const fetchedFolders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setFolders(fetchedFolders);
        });
        return () => unsubFolders();
    }, [user]);
    
    useEffect(() => {
        let filtered = [...allFiles];
        filtered = filtered.filter(file => (file.folderId || null) === currentFolderId);
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
    }, [allFiles, filter, showOnlyFavorites, currentFolderId]);

    useEffect(() => { if (outputRef.current) { outputRef.current.scrollTop = outputRef.current.scrollHeight; } }, [terminalOutput]);
    useEffect(() => { if (statusMessage.text) { const timer = setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000); return () => clearTimeout(timer); } }, [statusMessage]);
    useEffect(() => { localStorage.setItem('activeTab', activeTab); }, [activeTab]);

    // --- FUNÇÕES DE MANIPULAÇÃO (HANDLERS) ---

    const handleToggleTheme = () => { setTheme(prevTheme => (prevTheme === 'green' ? 'purple' : 'green')); };

    const handleToggleFavorite = async (file) => {
        if (!user || !file) return;
        const docRef = doc(db, 'users', user.uid, 'files', file.id);
        await updateDoc(docRef, { isFavorite: !file.isFavorite });
    };

    const handleDownloadFile = (file) => {
        if (!file || typeof file.content !== 'string') return;
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
            const fileData = {
                name: activeFile.name,
                subject: activeFile.subject,
                type: activeFile.type,
                content: activeFile.content,
                updatedAt: serverTimestamp(),
                folderId: activeFile.folderId || null,
            };
    
            if (String(activeFile.id).startsWith('new-file')) {
                const fileDataWithCreationDate = { ...fileData, createdAt: serverTimestamp(), isFavorite: false };
                const docRef = await addDoc(collection(db, 'users', user.uid, 'files'), fileDataWithCreationDate);
                savedFileId = docRef.id;
                setStatusMessage({ text: `Ficheiro '${fileData.name}.${fileData.type}' criado com sucesso!`, type: 'success' });
            } else {
                const docRef = doc(db, 'users', user.uid, 'files', activeFile.id);
                await updateDoc(docRef, fileData);
                setStatusMessage({ text: `Ficheiro '${fileData.name}.${fileData.type}' atualizado com sucesso!`, type: 'success' });
            }
    
            const savedFile = { ...activeFile, id: savedFileId };
            setOpenFiles(prev => prev.map(f => f.id === activeFileId ? savedFile : f));
            setActiveFileId(savedFileId);
            setUnsavedChanges(prev => ({ ...prev, [savedFileId]: false }));
        } catch (error) {
            setStatusMessage({ text: "Falha ao salvar no servidor.", type: 'error' });
        }
    }, [activeFile, activeFileId, user]);

    // O useEffect do atalho Ctrl+S foi movido para DEPOIS da declaração de handleSave
    useEffect(() => {
        const handleKeyDown = (event) => { if (event.ctrlKey && event.key === 's') { event.preventDefault(); handleSave(); } };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    const handleNewFile = () => {
        const newFileId = `new-file-${Date.now()}`;
        const newFile = { id: newFileId, name: '', subject: '', type: 'py', content: '', isFavorite: false, folderId: currentFolderId };
        setOpenFiles(prev => [...prev, newFile]);
        setActiveFileId(newFileId);
        setActiveTab('editor');
    };

    const handleCreateFolder = async (name) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'folders'), { name, createdAt: serverTimestamp() });
        setStatusMessage({ text: `Pasta '${name}' criada com sucesso!`, type: 'success' });
        setIsCreateFolderModalOpen(false);
    };

    const handleMoveFile = async (destinationFolderId) => {
        if (!user || !fileToMove) return;
        await updateDoc(doc(db, 'users', user.uid, 'files', fileToMove.id), { folderId: destinationFolderId });
        setStatusMessage({ text: 'Ficheiro movido com sucesso!', type: 'success' });
        setFileToMove(null);
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete || !user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'files', itemToDelete.id));
        setStatusMessage({ text: `Ficheiro '${itemToDelete.name}.${itemToDelete.type}' deletado.`, type: 'success' });
        setItemToDelete(null);
        setOpenFiles(prev => prev.filter(f => f.id !== itemToDelete.id));
    };

    const confirmEditFile = async (fileToUpdate, updatedData) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid, 'files', fileToUpdate.id);
        await updateDoc(docRef, { name: updatedData.name, subject: updatedData.subject });
        setStatusMessage({ text: 'Ficheiro atualizado com sucesso!', type: 'success' });
        setFileToEdit(null);
    };

    const confirmDeleteFolder = async () => {
        if (!folderToDelete || !user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'folders', folderToDelete.id));
        setStatusMessage({ text: `Pasta '${folderToDelete.name}' deletada com sucesso.`, type: 'success' });
        setFolderToDelete(null);
    };

    const confirmEditFolder = async (folderToUpdate, updatedData) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid, 'folders', folderToUpdate.id), { name: updatedData.name });
        setStatusMessage({ text: 'Pasta renomeada com sucesso!', type: 'success' });
        setFolderToEdit(null);
    };

    const requestDeleteItem = (item, event) => {
        event.stopPropagation();
        setItemToDelete({ ...item, type: item.type || 'file' });
    };

    const requestEditFile = (file, event) => {
        event.stopPropagation();
        setFileToEdit(file);
    };
    
    const requestDeleteFolder = (folder, event) => {
        event.stopPropagation();
        const filesInFolder = allFiles.some(file => file.folderId === folder.id);
        if (filesInFolder) {
            setStatusMessage({ text: 'Não é possível deletar. A pasta não está vazia.', type: 'error' });
            return;
        }
        setFolderToDelete(folder);
    };
    
    const requestEditFolder = (folder, event) => {
        event.stopPropagation();
        setFolderToEdit(folder);
    };

    const requestMoveFile = (file, event) => {
        event.stopPropagation();
        setFileToMove(file);
    };

    const loadFile = (file) => {
        if (!openFiles.some(f => f.id === file.id)) setOpenFiles(prev => [...prev, file]);
        setActiveFileId(file.id);
        setActiveTab('editor');
    };

    const handleCloseTab = (fileId, event) => {
        event.stopPropagation();
        const updatedOpenFiles = openFiles.filter(f => f.id !== fileId);
        setOpenFiles(updatedOpenFiles);
        if (activeFileId === fileId) setActiveFileId(updatedOpenFiles.length > 0 ? updatedOpenFiles[0].id : null);
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

    const handleClearTerminal = () => setTerminalOutput('> Terminal limpo.');

    const handleExecute = useCallback(async () => {
        if (!activeFile || activeFile.type !== 'py' || !activeFile.content) return;
        setActiveTab('terminal');
        setIsExecuting(true);
        setTerminalOutput(`> Executando 'python3 ${activeFile.name || "script"}.py'...\n\n`);
        try {
            const response = await api.post('/', { content: activeFile.content });
            const { status, output } = response.data;
            setTerminalOutput(prev => prev + output + `\n> Processo finalizado com ${status === 'success' ? 'sucesso (código 0)' : 'erro (código 1)'}.`);
        } catch (error) {
            setTerminalOutput(prev => prev + `> ERRO CRÍTICO: ${error.response?.data?.detail || "Falha na comunicação."}`);
        } finally {
            setIsExecuting(false);
        }
    }, [activeFile]);


    // --- RENDERIZAÇÃO DO COMPONENTE ---
    return (
        <div className="min-h-screen bg-terminal-bg font-mono flex flex-col">
            {itemToDelete && (<ConfirmationModal message={`Tem certeza que deseja deletar o arquivo "${itemToDelete.name}"?`} onConfirm={confirmDeleteItem} onCancel={() => setItemToDelete(null)} />)}
            {fileToEdit && (<EditFileModal file={fileToEdit} subjects={subjects} onSave={confirmEditFile} onCancel={() => setFileToEdit(null)} />)}
            {isCreateFolderModalOpen && <CreateFolderModal onSave={handleCreateFolder} onCancel={() => setIsCreateFolderModalOpen(false)} />}
            {fileToMove && <MoveFileModal folders={folders} onCancel={() => setFileToMove(null)} onMove={handleMoveFile} />}
            {folderToEdit && <RenameModal item={folderToEdit} onSave={confirmEditFolder} onCancel={() => setFolderToEdit(null)} />}
            {folderToDelete && (<ConfirmationModal message={`Tem certeza que deseja deletar a pasta "${folderToDelete.name}"?`} onConfirm={confirmDeleteFolder} onCancel={() => setFolderToDelete(null)} />)}

            <Header username={user?.email || '...'} onLogout={logout} onToggleTheme={handleToggleTheme} isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(prev => !prev)} />
            
            <Navigation
                activeTab={activeTab}
                onTabClick={setActiveTab}
                activeFile={activeFile}
                onSave={handleSave}
                onExecute={handleExecute}
                onNewFile={handleNewFile}
                onNewFolder={() => setIsCreateFolderModalOpen(true)}
                isExecuting={isExecuting}
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
                        folders={folders}
                        currentFolderId={currentFolderId}
                        setCurrentFolderId={setCurrentFolderId}
                        requestMoveFile={requestMoveFile}
                        requestEditFolder={requestEditFolder}
                        requestDeleteFolder={requestDeleteFolder}
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
            <StatusBar fileCount={displayedFiles.length + (currentFolderId === null ? folders.length : 0)} />
        </div>
    );
};

export default TerminalAppPage;