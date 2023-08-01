import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/pages/AuthForm.module.scss";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";

export default function AuthForm({
  endpoint,
  submitButtonText,
  link,
  linkText,
  errorProcessor,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { token, saveToken, saveUsername } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigate("/search");
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = `${BASE_URL}users${endpoint ? "/" + endpoint : ""}`;
    const data = {
      user: {
        username: username,
        password: password,
      },
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessages = errorProcessor(result.errors);
        setErrorMessage(errorMessages);
        return;
      }

      saveToken(result.user.token);
      saveUsername(result.user.username);
      navigate("/search");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.heading}>{submitButtonText}</h1>
        {errorMessage && (
          <div className={styles.errorMessageWrap}>
            {errorMessage.map((message, index) => (
              <p key={index} className={styles.errorMessage}>
                {message}
              </p>
            ))}
          </div>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.textbox}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.textbox}
        />
        <Link to={link}>{linkText}</Link>
        <button type="submit" className={styles.btn}>
          {submitButtonText}
        </button>
      </form>
    </div>
  );
}
