import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate("/users/signin");
    }
  }, [token, navigate]);

  return token ? children : null;
}
