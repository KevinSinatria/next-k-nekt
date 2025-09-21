"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
   isAuthenticated: boolean;
   setAccessToken: (token: string) => void;
   setIsAuthenticated: (isAuthenticated: boolean) => void;
   loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);
   const [accessToken, setAccessToken] = useState('');

   useEffect(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
         setIsAuthenticated(true);
         setAccessToken(token);
      }
      setLoading(false);
   }, [accessToken]);

   return (
      <AuthContext.Provider value={{ isAuthenticated, setAccessToken, setIsAuthenticated, loading }}>
         {children}
      </AuthContext.Provider>
   );
};
export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};