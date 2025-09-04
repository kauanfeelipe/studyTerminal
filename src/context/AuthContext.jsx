    import React, { createContext, useState, useEffect } from 'react';
    import { auth } from '../services/firebase';
    import { 
      createUserWithEmailAndPassword, 
      signInWithEmailAndPassword, 
      signOut, 
      onAuthStateChanged 
    } from "firebase/auth";
    import { isUserAllowed, getAllowedUsersCount } from '../config/allowedUsers';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
        return () => unsubscribe();
      }, []);

      const register = async (email, password) => {
        // Verificar se o usuário está na whitelist antes de registrar
        if (!isUserAllowed(email)) {
          throw new Error('ACESSO_NEGADO: Este email não está autorizado. Projeto restrito a usuários específicos.');
        }
        
        return createUserWithEmailAndPassword(auth, email, password);
      };

      const login = async (email, password) => {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          
          // Verificar whitelist após login bem-sucedido
          if (!isUserAllowed(result.user.email)) {
            await signOut(auth);
            console.warn(`🚫 Tentativa de login não autorizada: ${result.user.email}`);
            throw new Error('ACESSO_NEGADO: Sua conta não tem permissão para acessar este projeto privado.');
          }
          
          console.log(`✅ Login autorizado: ${result.user.email} (${getAllowedUsersCount()} usuários permitidos)`);
          return result;
        } catch (error) {
          // Re-throw errors de autenticação do Firebase
          throw error;
        }
      };

      const logout = () => {
        return signOut(auth);
      };

      return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
          {!loading && children}
        </AuthContext.Provider>
      );
    };

    export default AuthContext;
    