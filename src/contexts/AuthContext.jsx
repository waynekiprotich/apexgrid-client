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

  return (
    <AuthContext.Provider value={{ 
      currentUser, login, register, loginWithGoogle, logout, 
      updatePassword, updateEmail, deleteUser, loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
