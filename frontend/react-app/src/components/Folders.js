import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import Modal from "react-modal";

import styles from "../styles/components/Folders.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";

export default function Folders({ parentId = null }) {
  const [folders, setFolders] = useState([]);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders?parentId=${parentId}`;

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Failed to get folder: ${res.statusText}`);
        return;
      }

      const data = await res.json();
      setFolders(data.folders);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewFolder = () => {
    fetchFolders();
  };

  return (
    <div className={styles.foldersWrap}>
      <Link to="/favorites/all" className={styles.folderWrap}>
        <div className={styles.folder}></div>
        <p>全てのお気に入り</p>
      </Link>

      {folders.map((folder) => (
        <Link
          key={folder.id}
          to={`/favorites/folders/${folder.id}`}
          className={styles.folderWrap}
        >
          <div className={styles.folder}></div>
          <p>{folder.name}</p>
        </Link>
      ))}
      <AddFolder onNewFolder={handleNewFolder} />
    </div>
  );
}

function AddFolder({ onNewFolder }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders`;

  const closeModal = () => {
    setIsOpen(false);
    setFolderName("");
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: folderName }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessages = Object.values(result.errors).flat();
        setErrorMessage(errorMessages);
        return;
      }

      onNewFolder();
      closeModal();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={styles.folderWrap}>
        <div className={styles.folder}></div>
        <p>フォルダを追加</p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Folder"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <form onSubmit={handleSubmit} className={formModalStyles.form}>
          <h1 className={formModalStyles.heading}>フォルダを追加</h1>
          {errorMessage && (
            <div className={formModalStyles.errorMessageWrap}>
              {errorMessage.map((message, index) => (
                <p key={index} className={formModalStyles.errorMessage}>
                  {message}
                </p>
              ))}
            </div>
          )}
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className={formModalStyles.textbox}
            placeholder="フォルダ名"
          />
          <button type="submit" className={formModalStyles.btn}>
            追加
          </button>
        </form>
      </Modal>
    </>
  );
}
