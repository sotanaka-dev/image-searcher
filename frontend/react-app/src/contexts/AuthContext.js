import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUsername = sessionStorage.getItem("username");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    setLoading(false);
  }, []);

  const saveToken = (newToken) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const saveUsername = (newUsername) => {
    sessionStorage.setItem("username", newUsername);
    setUsername(newUsername);
  };

  const removeSessionData = () => {
    sessionStorage.removeItem("token");
    setToken(null);

    sessionStorage.removeItem("username");
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, username, saveToken, saveUsername, removeSessionData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
