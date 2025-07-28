import React, { useState } from 'react';
import { XCircle, CheckCircle, Save, FolderPlus, FilePenLine } from 'lucide-react';

export const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 max-w-sm w-full">
            <p className="text-white text-center mb-6">{message}</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors">
                    <XCircle className="w-5 h-5 mr-2" /> Cancelar
                </button>
                <button onClick={onConfirm} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white transition-colors">
                    <CheckCircle className="w-5 h-5 mr-2" /> Confirmar
                </button>
            </div>
        </div>
    </div>
);

export const EditFileModal = ({ file, subjects, onSave, onCancel }) => {
    const [data, setData] = useState({ name: file.name, subject: file.subject });
    const handleSaveClick = () => { onSave(file, data); };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg text-center text-white mb-4">Editar Ficheiro</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fileName" className="block text-sm text-gray-400 mb-1">Nome do ficheiro:</label>
                        <input id="fileName" type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" />
                    </div>
                    <div>
                        <label htmlFor="fileSubject" className="block text-sm text-gray-400 mb-1">Matéria:</label>
                        <select id="fileSubject" value={data.subject} onChange={(e) => setData({ ...data, subject: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary">
                            {subjects.sort().map(s => (<option key={s} value={s}>{s}</option>))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors">
                        <XCircle className="w-5 h-5 mr-2" /> Cancelar
                    </button>
                    <button onClick={handleSaveClick} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white transition-colors">
                        <Save className="w-5 h-5 mr-2" /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CreateFolderModal = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const handleSaveClick = () => { if (name.trim()) { onSave(name.trim()); } };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg text-center text-white mb-4 flex items-center justify-center"><FolderPlus className="w-6 h-6 mr-2" />Criar Nova Pasta</h3>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da pasta" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" autoFocus />
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
                        <XCircle className="w-5 h-5 mr-2" /> Cancelar
                    </button>
                    <button onClick={handleSaveClick} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white">
                        <Save className="w-5 h-5 mr-2" /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MoveFileModal = ({ folders, onMove, onCancel }) => {
    const [destinationId, setDestinationId] = useState(null);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg text-center text-white mb-4">Mover Ficheiro Para...</h3>
                <select value={destinationId === null ? 'root' : destinationId} onChange={(e) => setDestinationId(e.target.value === 'root' ? null : e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary">
                    <option value="root">-- Raiz --</option>
                    {folders.map(folder => (<option key={folder.id} value={folder.id}>{folder.name}</option>))}
                </select>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
                        <XCircle className="w-5 h-5 mr-2" /> Cancelar
                    </button>
                    <button onClick={() => onMove(destinationId)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">
                        <CheckCircle className="w-5 h-5 mr-2" /> Mover
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RenameModal = ({ item, onSave, onCancel }) => {
    const [name, setName] = useState(item.name || '');
    const itemType = item.type ? 'Ficheiro' : 'Pasta';

    const handleSaveClick = () => {
        if (name.trim()) {
            onSave(item, { name: name.trim() });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg text-center text-white mb-4 flex items-center justify-center">
                    <FilePenLine className="w-6 h-6 mr-2" />
                    Renomear {itemType}
                </h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Nome d${itemType === 'Pasta' ? 'a' : 'o'} ${itemType.toLowerCase()}`}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary"
                    autoFocus
                />
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
                        <XCircle className="w-5 h-5 mr-2" /> Cancelar
                    </button>
                    <button onClick={handleSaveClick} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">
                        <Save className="w-5 h-5 mr-2" /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};