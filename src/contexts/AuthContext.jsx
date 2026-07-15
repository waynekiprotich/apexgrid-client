import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword as firebaseUpdatePassword,
  updateEmail as firebaseUpdateEmail,
  deleteUser as firebaseDeleteUser
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updatePassword = (newPassword) => {
    return firebaseUpdatePassword(auth.currentUser, newPassword);
  };

  const updateEmail = (newEmail) => {
    return firebaseUpdateEmail(auth.currentUser, newEmail);
  };

  const deleteUser = () => {
    return firebaseDeleteUser(auth.currentUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      currentUser, login, register, loginWithGoogle, logout, 
      updatePassword, updateEmail, deleteUser, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
