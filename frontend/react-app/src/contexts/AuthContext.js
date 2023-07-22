import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
}
