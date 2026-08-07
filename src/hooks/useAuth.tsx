import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface DemoUser {
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "solar-sweeper-auth";

function loadUser(): DemoUser | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => loadUser());

  const login = useCallback((email: string, password: string, remember: boolean) => {
    if (email.trim().toLowerCase() !== "admin@solarsweeper.com" || password !== "admin123") {
      return false;
    }

    const nextUser: DemoUser = {
      email: "admin@solarsweeper.com",
      name: "Aarav Sharma",
      role: "Operations Lead"
    };
    setUser(nextUser);

    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }

    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
