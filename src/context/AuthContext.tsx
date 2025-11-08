"use client";

import { api } from "@/lib/api";
import { getUserData } from "@/services/auth";
import { YearPeriodType } from "@/types/year-periods";
import { AxiosError } from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    fullname: string;
    role: string;
  } | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  yearPeriods: YearPeriodType | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [yearPeriods, setYearPeriods] = useState<YearPeriodType | null>(null);

  const getAuthUserData = async () => {
    try {
      const user = await getUserData();
      setUser(user.data);
      localStorage.setItem("user", JSON.stringify(user.data));
      if (user) {
        if (user.role === "admin") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
      toast.error("Terjadi kesalahan server.");
    }
  };

  useEffect(() => {
    const year_period = JSON.parse(String(localStorage.getItem("year_period")));
    if (year_period) {
      setYearPeriods(year_period);
    }
    getAuthUserData();
  }, []);

  useEffect(() => {
    const yearPeriod = JSON.parse(String(localStorage.getItem("year_period")));
    setYearPeriods(yearPeriod);
  }, [loading]);

  const refreshUser = async () => {
    const user = await api.get("/auth/me");
    localStorage.setItem("user", JSON.stringify(user.data.data));
    setUser(user.data.data);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated,
        loading,
        setLoading,
        yearPeriods,
        refreshUser,
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
