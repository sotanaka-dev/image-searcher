import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import * as apiClient from "../utils/apiClient";
import { toast } from "react-toastify";
import styles from "../styles/pages/AuthForm.module.scss";
import { MdLink, MdErrorOutline } from "../components/Icon";
import PageTransition from "../styles/PageTransition";

export default function AuthForm({
  endpoint,
  submitButtonText,
  link,
  linkText,
  successMessage,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { token, saveToken, saveUsername } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}users${endpoint ? "/" + endpoint : ""}`;

  useEffect(() => {
    if (token) {
      navigate("/search");
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await apiClient.post(apiEndpoint, token, {
      user: {
        username: username,
        password: password,
      },
    });

    if (result.errors) {
      setErrorMessage(result.errors);
      return;
    }

    saveToken(result.user.token);
    saveUsername(result.user.username);
    toast.success(successMessage);
    navigate("/search");
  };

  return (
    <PageTransition className={styles.wrap}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.heading}>{submitButtonText}</h1>

        {errorMessage && (
          <div className={styles.errorMessageWrap}>
            {errorMessage.map((message, index) => (
              <p key={index} className={styles.errorMessage}>
                <MdErrorOutline />
                &nbsp;{message}
              </p>
            ))}
          </div>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.textbox}
          placeholder="ユーザー名"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.textbox}
          placeholder="パスワード"
        />

        <Link to={link} className={styles.link}>
          <MdLink className={styles.icon} />
          &nbsp;{linkText}
        </Link>

        <button type="submit" className={styles.btn}>
          {submitButtonText}
        </button>
      </form>
    </PageTransition>
  );
}
