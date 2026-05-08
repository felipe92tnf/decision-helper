import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import type { ReactNode } from "react";
  
  import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User,
  } from "firebase/auth";
  
  import {
    auth,
    googleProvider,
  } from "../firebase/firebase";
  
  type AuthContextType = {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
  };
  
  const AuthContext =
    createContext<AuthContextType | null>(null);
  
  export function AuthProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [user, setUser] = useState<User | null>(
      null
    );
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }
      );
  
      return () => unsubscribe();
    }, []);
  
    const loginWithGoogle = async () => {
      await signInWithPopup(
        auth,
        googleProvider
      );
    };
  
    const logout = async () => {
      await signOut(auth);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          loginWithGoogle,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuth debe usarse dentro de AuthProvider"
      );
    }
  
    return context;
  }