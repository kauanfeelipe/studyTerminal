import React, { useState } from 'react';
import { XCircle, CheckCircle, Save } from 'lucide-react';

export const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 max-w-sm w-full">
      <p className="text-white text-center mb-6">{message}</p>
      <div className="flex justify-center space-x-4">
        <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors">
            <XCircle className="w-5 h-5 mr-2" />
            Cancelar
        </button>
        <button onClick={onConfirm} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white transition-colors">
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirmar
        </button>
      </div>
    </div>
  </div>
);

export const EditFileModal = ({ file, subjects, onSave, onCancel }) => {
  const [data, setData] = useState({
    name: file.name,
    subject: file.subject,
  });

  const handleSaveClick = () => {
    onSave(file, data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-terminal-header border border-terminal-border rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg text-center text-white mb-4">Editar Ficheiro</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fileName" className="block text-sm text-gray-400 mb-1">Nome do ficheiro:</label>
            <input
              id="fileName"
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green"
            />
          </div>

          <div>
            <label htmlFor="fileSubject" className="block text-sm text-gray-400 mb-1">Matéria:</label>
            <select
              id="fileSubject"
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green"
            >
              {subjects.sort().map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          

        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors">
            <XCircle className="w-5 h-5 mr-2" />
            Cancelar
          </button>
          <button onClick={handleSaveClick} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white transition-colors">
            <Save className="w-5 h-5 mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
