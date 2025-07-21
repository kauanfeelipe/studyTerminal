    import React, { createContext, useState, useEffect } from 'react';
    import { auth } from '../services/firebase';
    import { 
      createUserWithEmailAndPassword, 
      signInWithEmailAndPassword, 
      signOut, 
      onAuthStateChanged 
    } from "firebase/auth";

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

      const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
      };

      const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
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
    