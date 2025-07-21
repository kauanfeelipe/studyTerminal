import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }
        try {
            await register(email, password);
            navigate('/app'); 
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está em uso.');
            } else if (err.code === 'auth/weak-password') {
                setError('A senha deve ter pelo menos 6 caracteres.');
            } else {
                setError('Falha ao criar a conta.');
            }
            console.error("Falha no registo:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-mono">
            <div className="w-full max-w-md bg-terminal-header border border-terminal-border rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-6">
                    <UserPlus className="w-8 h-8 mr-2 text-terminal-primary" />
                    <h1 className="text-2xl text-terminal-primary">StudyTerminal - Registo</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">$ email:</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="password">$ senha:</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">$ confirmar_senha:</label>
                        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" required />
                    </div>
                    {error && (<div className="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4 text-sm"><span className="font-bold">Erro:</span> {error}</div>)}
                    <button type="submit" className="w-full bg-terminal-primary text-terminal-bg font-bold py-2 px-4 rounded hover:bg-opacity-80 transition-opacity">./create-user.sh</button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">Já tem uma conta? <Link to="/login" className="text-terminal-amber hover:underline">./login.sh</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;