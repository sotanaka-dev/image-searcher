import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import Modal from "react-modal";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  createNewFolder,
  updateFolderName,
  deleteFolder,
  fetchFolders,
} from "../utils/apiClient";
import styles from "../styles/components/Folders.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";
import {
  MdCheck,
  MdAdd,
  MdDeleteOutline,
  MdOutlineEdit,
} from "../components/Icon";

export default function Folders({
  parentId = null,
  isCalledFromFavorites = false,
  defaultSelectMode = false,
  onAddToFolder = () => {},
}) {
  const [folders, setFolders] = useState([]);
  const { token } = useContext(AuthContext);
  // TODO: 関数化
  let apiEndpoint = `${BASE_URL}folders`;
  if (parentId !== null) {
    apiEndpoint += `?parent_id=${parentId}`;
  } else if (defaultSelectMode) {
    apiEndpoint += "?all=true";
  }

  const [isSelectMode, setIsSelectMode] = useState(defaultSelectMode);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchFolders(apiEndpoint, token, setFolders);
  }, [parentId, apiEndpoint, token]);

  const reloadFolders = () => {
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
          // TODO: 同じコンテンツを2回記述していて冗長なのでリファクタリング
          isSelectMode ? (
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
          ) : (
            <>
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
              <DeleteFolder reloadFolders={reloadFolders} id={folder.id} />
              <UpdateFolderName
                reloadFolders={reloadFolders}
                id={folder.id}
                folderName={folder.name}
              />
            </>
          )
        )}
        {!defaultSelectMode && (
          <AddFolder reloadFolders={reloadFolders} parentId={parentId} />
        )}
      </div>
      {isSelectMode && <button onClick={handleComplete}>選択完了</button>}
    </>
  );
}

function AddFolder({ reloadFolders, parentId }) {
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

    createNewFolder(
      apiEndpoint,
      token,
      folderName,
      parentId,
      setErrorMessage,
      reloadFolders,
      closeModal
    );
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

function UpdateFolderName({ reloadFolders, id, folderName }) {
  const { token } = useContext(AuthContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const apiEndpoint = `${BASE_URL}folders/${id}`;
  const [newFolderName, setNewFolderName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateFolderName(
      apiEndpoint,
      token,
      newFolderName,
      setErrorMessage,
      reloadFolders,
      closeModal
    );
  };

  const closeModal = () => {
    setIsOpen(false);
    setNewFolderName("");
    setErrorMessage(null);
  };

  return (
    <>
      <MdOutlineEdit onClick={() => setIsOpen(true)} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Folder Name"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <form onSubmit={handleSubmit} className={formModalStyles.form}>
          <h1 className={formModalStyles.heading}>フォルダ名を更新</h1>
          {errorMessage && (
            <div className={formModalStyles.errorMessageWrap}>
              {errorMessage.map((message, index) => (
                <p key={index} className={formModalStyles.errorMessage}>
                  {message}
                </p>
              ))}
            </div>
          )}
          <p>現在のフォルダ: {folderName}</p>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className={formModalStyles.textbox}
            placeholder="新しいフォルダ名"
          />
          <button type="submit" className={formModalStyles.btn}>
            更新
          </button>
        </form>
      </Modal>
    </>
  );
}

function DeleteFolder({ reloadFolders, id }) {
  const { token } = useContext(AuthContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const apiEndpoint = `${BASE_URL}folders/${id}`;

  const handleDeleteFolder = async () => {
    deleteFolder(apiEndpoint, token, reloadFolders);
  };

  return (
    <>
      <MdDeleteOutline onClick={() => setIsOpen(true)} />
      <ConfirmationModal
        isOpen={modalIsOpen}
        handleClose={() => setIsOpen(false)}
        handleConfirm={handleDeleteFolder}
        message="フォルダを削除します。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </>
  );
}
