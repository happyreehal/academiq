import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("academiq_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("academiq_user");
      localStorage.removeItem("academiq_token");
      return null;
    }
  });

  const login = (userData, token) => {
    localStorage.setItem("academiq_token", token);
    localStorage.setItem("academiq_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("academiq_token");
    localStorage.removeItem("academiq_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}