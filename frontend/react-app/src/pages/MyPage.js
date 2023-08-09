import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import styles from "../styles/pages/MyPage.module.scss";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import ConfirmationModal from "../components/ConfirmationModal";

export default function MyPage() {
  return (
    <div className={styles.wrap}>
      <UpdateUsername />
      <UpdatePassword />
      <SignOut />
      <DeleteAccount />
    </div>
  );
}

function UpdateUsername() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    token,
    username: sessionUsername,
    saveUsername,
  } = useContext(AuthContext);

  const closeModal = () => {
    setIsOpen(false);
    setUsername("");
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = `${BASE_URL}users/username`;

    try {
      const res = await fetch(apiEndpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.errors);
        return;
      }

      saveUsername(result.username);
      closeModal();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>ユーザー名を更新</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Username"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.heading}>ユーザー名を更新</h1>
          {errorMessage && (
            <div className={styles.errorMessageWrap}>
              {errorMessage.map((message, index) => (
                <p key={index} className={styles.errorMessage}>
                  {message}
                </p>
              ))}
            </div>
          )}
          <p>現在のユーザー名: {sessionUsername}</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.textbox}
            placeholder="新しいユーザー名"
          />
          <button type="submit" className={styles.btn}>
            更新
          </button>
        </form>
      </Modal>
    </>
  );
}

function UpdatePassword() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { token } = useContext(AuthContext);

  const closeModal = () => {
    setIsOpen(false);
    setPassword("");
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = `${BASE_URL}users/password`;

    try {
      const res = await fetch(apiEndpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.errors);
        return;
      }

      closeModal();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>パスワードを更新</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Password"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.heading}>パスワードを更新</h1>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.textbox}
            placeholder="新しいパスワード"
          />
          <button type="submit" className={styles.btn}>
            更新
          </button>
        </form>
      </Modal>
    </>
  );
}

function SignOut() {
  const navigate = useNavigate();
  const { removeSessionData } = useContext(AuthContext);

  const handleSignOut = () => {
    removeSessionData();
    navigate("/users/signin");
  };

  return <button onClick={handleSignOut}>サインアウト</button>;
}

function DeleteAccount() {
  const navigate = useNavigate();
  const { token, removeSessionData } = useContext(AuthContext);
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleDeleteAccount = async () => {
    const apiEndpoint = `${BASE_URL}users`;

    try {
      const res = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Failed to delete account: ${res.statusText}`);
        return;
      }

      removeSessionData();
      navigate("/users/signin");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>アカウント削除</button>

      <ConfirmationModal
        isOpen={modalIsOpen}
        handleClose={() => setIsOpen(false)}
        handleConfirm={handleDeleteAccount}
        message="アカウントを削除します。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </>
  );
}
