import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, Lock, Users } from 'lucide-react';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Sistema desabilitado para projeto privado
    const isRegistrationDisabled = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (isRegistrationDisabled) {
            setError('⚠️ Registro desabilitado. Este é um projeto privado para uso entre amigos específicos.');
            return;
        }
        
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }
        try {
            await register(email, password);
            navigate('/app'); 
        } catch (err) {
            if (err.message.includes('ACESSO_NEGADO')) {
                setError(err.message.replace('ACESSO_NEGADO: ', ''));
            } else if (err.code === 'auth/email-already-in-use') {
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
                    {isRegistrationDisabled ? (
                        <Lock className="w-8 h-8 mr-2 text-red-400" />
                    ) : (
                        <UserPlus className="w-8 h-8 mr-2 text-terminal-primary" />
                    )}
                    <h1 className="text-2xl text-terminal-primary">StudyTerminal - Registo</h1>
                </div>
                
                {/* Aviso de projeto privado */}
                {isRegistrationDisabled && (
                    <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Users className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-yellow-400 font-semibold mb-2">🔒 Projeto Privado</h3>
                                <p className="text-yellow-200 text-sm mb-2">
                                    Este StudyTerminal foi configurado para uso privado entre amigos específicos.
                                </p>
                                <p className="text-gray-300 text-xs">
                                    ✅ Se você já tem uma conta autorizada, use o botão de login abaixo.<br/>
                                    ❌ Novos registros estão temporariamente desabilitados.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">$ email:</label>
                        <input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className={`w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary ${isRegistrationDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isRegistrationDisabled}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="password">$ senha:</label>
                        <input 
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className={`w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary ${isRegistrationDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isRegistrationDisabled}
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">$ confirmar_senha:</label>
                        <input 
                            id="confirmPassword" 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className={`w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-primary focus:outline-none focus:border-terminal-primary ${isRegistrationDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isRegistrationDisabled}
                            required 
                        />
                    </div>
                    {error && (<div className="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4 text-sm"><span className="font-bold">Erro:</span> {error}</div>)}
                    <button 
                        type="submit" 
                        disabled={isRegistrationDisabled}
                        className={`w-full font-bold py-2 px-4 rounded transition-opacity ${
                            isRegistrationDisabled 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-terminal-primary text-terminal-bg hover:bg-opacity-80'
                        }`}
                    >
                        {isRegistrationDisabled ? '🔒 Registro Desabilitado' : './create-user.sh'}
                    </button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">Já tem uma conta? <Link to="/login" className="text-terminal-amber hover:underline">./login.sh</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;