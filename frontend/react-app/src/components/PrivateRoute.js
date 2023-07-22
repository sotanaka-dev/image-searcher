import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate("/users/signin");
    }
  }, [token, navigate]);

  return token ? children : null;
}
