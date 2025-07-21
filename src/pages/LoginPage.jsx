import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Terminal } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/app');
        } catch (err) {
            setError("Falha no login. Verifique as suas credenciais.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-mono">
            <div className="w-full max-w-md bg-terminal-header border border-terminal-border rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-6">
                    <Terminal className="w-8 h-8 mr-2 text-terminal-primary" />
                    <h1 className="text-2xl text-terminal-primary">StudyTerminal - Login</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">$ email:</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="password">$ password:</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary" required />
                    </div>
                    {error && (<div className="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4 text-sm"><span className="font-bold">Erro:</span> {error}</div>)}
                    <button type="submit" className="w-full bg-terminal-primary text-terminal-bg font-bold py-2 px-4 rounded hover:bg-opacity-80 transition-opacity">./login.sh</button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">Não tem conta? <Link to="/register" className="text-terminal-amber hover:underline">./register.sh</Link></p>
            </div>
        </div>
    );
};
export default LoginPage;