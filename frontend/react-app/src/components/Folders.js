import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import Modal from "react-modal";
import { fetchFolders } from "../utils/apiClient";
import styles from "../styles/components/Folders.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";
import { MdCheck, MdAdd } from "../components/Icon";

export default function Folders({
  parentId = null,
  isCalledFromFavorites = false,
  onAddToFolder = () => {},
}) {
  const [folders, setFolders] = useState([]);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders?parentId=${parentId}`;
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!isCalledFromFavorites) {
      setIsSelectMode(true);
    }
    fetchFolders(apiEndpoint, token, setFolders);
  }, []);

  const handleNewFolder = () => {
    fetchFolders(apiEndpoint, token, setFolders);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleComplete = () => {
    console.log("Folder > handleComplete");

    onAddToFolder(selectedIds);

    setIsSelectMode(false);
    setSelectedIds([]);
  };

  return (
    <>
      <div className={styles.foldersWrap}>
        {isCalledFromFavorites && (
          <Link to="/favorites/all" className={styles.folderWrap}>
            <div className={styles.folderInnerWrap}>
              <div className={styles.folder}></div>
            </div>
            <p>全てのお気に入り</p>
          </Link>
        )}
        {folders.map((folder) =>
          isCalledFromFavorites ? (
            <Link
              key={folder.id}
              to={`/favorites/folders/${folder.id}`}
              className={styles.folderWrap}
            >
              <div className={styles.folderInnerWrap}>
                <div
                  className={`${styles.folder} ${
                    selectedIds.includes(folder.id) ? styles.selected : ""
                  }`}
                ></div>
                {isSelectMode && selectedIds.includes(folder.id) && (
                  <MdCheck className={styles.selectIcon} />
                )}
              </div>
              <p className={styles.folderName}>{folder.name}</p>
            </Link>
          ) : (
            <div
              key={folder.id}
              onClick={() => {
                if (isSelectMode) toggleSelect(folder.id);
              }}
              className={styles.folderWrap}
            >
              <div className={styles.folderInnerWrap}>
                <div
                  className={`${styles.folder} ${
                    selectedIds.includes(folder.id) ? styles.selected : ""
                  }`}
                ></div>
                {isSelectMode && selectedIds.includes(folder.id) && (
                  <MdCheck className={styles.selectIcon} />
                )}
              </div>
              <p className={styles.folderName}>{folder.name}</p>
            </div>
          )
        )}
        <AddFolder onNewFolder={handleNewFolder} />
      </div>
      {isSelectMode && <button onClick={handleComplete}>選択完了</button>}
    </>
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
      <div className={styles.folderWrap}>
        <div className={styles.folderInnerWrap}>
          <div className={`${styles.folder} ${styles.iconWrap}`}>
            <MdAdd onClick={() => setIsOpen(true)} className={styles.addIcon} />
          </div>
        </div>
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
