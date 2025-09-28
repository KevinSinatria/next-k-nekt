"use client";

import { YearPeriodType } from "@/types/year-periods";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    role: string;
  } | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  yearPeriods: YearPeriodType | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [yearPeriods, setYearPeriods] = useState<YearPeriodType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const year_period = JSON.parse(String(localStorage.getItem("year_period")));
    const user = JSON.parse(String(localStorage.getItem("user")));
    if (token) {
      setIsAuthenticated(true);
      setUser(user);
      setYearPeriods(year_period);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const yearPeriod = JSON.parse(String(localStorage.getItem("year_period")));
    setYearPeriods(yearPeriod);
  }, [loading]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated,
        loading,
        setLoading,
        yearPeriods,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
