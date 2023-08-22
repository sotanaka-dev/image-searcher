import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import ConfirmationModal from "../components/ConfirmationModal";
import PageHeader from "../components/PageHeader";
import { toast } from "react-toastify";
import * as apiClient from "../utils/apiClient";
import styles from "../styles/pages/MyPage.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";
import {
  MdOutlineEdit,
  MdOutlineVpnKey,
  MdOutlineLogout,
  MdOutlineNoAccounts,
  MdErrorOutline,
} from "../components/Icon";
import PageTransition from "../styles/PageTransition";

export default function MyPage() {
  return (
    <PageTransition>
      <PageHeader title="マイページ" />

      <div className={styles.wrap}>
        <UpdateUsername />
        <UpdatePassword />
        <SignOut />
        <DeleteAccount />
      </div>
    </PageTransition>
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
  const apiEndpoint = `${BASE_URL}users/username`;

  const closeModal = () => {
    setIsOpen(false);
    setUsername("");
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await apiClient.patch(apiEndpoint, token, {
      user: { username },
    });

    if (result.errors) {
      setErrorMessage(result.errors);
      return;
    }

    saveUsername(username);
    closeModal();
    toast.success("ユーザー名が更新されました");
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <MdOutlineEdit className={styles.icon} />
        <p>ユーザー名を更新</p>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Username"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <form onSubmit={handleSubmit} className={formModalStyles.form}>
          <h1 className={formModalStyles.heading}>ユーザー名を更新</h1>
          <p>現在のユーザー名: {sessionUsername}</p>
          {errorMessage && (
            <div className={formModalStyles.errorMessageWrap}>
              {errorMessage.map((message, index) => (
                <p key={index} className={formModalStyles.errorMessage}>
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
            className={formModalStyles.textbox}
            placeholder="新しいユーザー名"
          />
          <button type="submit" className={formModalStyles.btn}>
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
  const apiEndpoint = `${BASE_URL}users/password`;

  const closeModal = () => {
    setIsOpen(false);
    setPassword("");
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await apiClient.patch(apiEndpoint, token, {
      user: { password },
    });

    if (result.errors) {
      setErrorMessage(result.errors);
      return;
    }

    closeModal();
    toast.success("パスワードが更新されました");
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <MdOutlineVpnKey className={styles.icon} />
        <p>パスワードを更新</p>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Password"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <form onSubmit={handleSubmit} className={formModalStyles.form}>
          <h1 className={formModalStyles.heading}>パスワードを更新</h1>
          {errorMessage && (
            <div className={formModalStyles.errorMessageWrap}>
              {errorMessage.map((message, index) => (
                <p key={index} className={formModalStyles.errorMessage}>
                  <MdErrorOutline />
                  &nbsp;{message}
                </p>
              ))}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={formModalStyles.textbox}
            placeholder="新しいパスワード"
          />
          <button type="submit" className={formModalStyles.btn}>
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
    toast.success("サインアウトしました");
    navigate("/users/signin");
  };

  return (
    <button onClick={handleSignOut}>
      <MdOutlineLogout className={styles.icon} />
      <p>サインアウト</p>
    </button>
  );
}

function DeleteAccount() {
  const navigate = useNavigate();
  const { token, removeSessionData } = useContext(AuthContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const apiEndpoint = `${BASE_URL}users`;

  const handleDeleteAccount = async () => {
    const result = await apiClient.destroy(apiEndpoint, token);

    if (result) {
      removeSessionData();
      navigate("/users/signin");
      toast.success("アカウントが削除されました");
      return;
    }

    toast.error("アカウントの削除に失敗しました");
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <MdOutlineNoAccounts className={styles.icon} />
        <p>アカウント削除</p>
      </button>

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
