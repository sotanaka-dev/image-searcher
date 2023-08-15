import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import Modal from "react-modal";
import ConfirmationModal from "../components/ConfirmationModal";
import * as apiClient from "../utils/apiClient";
import SelectFolders from "./SelectFolders";
import styles from "../styles/components/Folders.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineEdit,
  MdFavoriteBorder,
  MdErrorOutline,
  MdOutlineDriveFileMove,
} from "../components/Icon";
import { toast } from "react-toastify";

export default function Folders({
  parentId = null,
  isCalledFromFavorites = false,
}) {
  const [folders, setFolders] = useState([]);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders${
    parentId !== null ? `?parent_id=${parentId}` : ""
  }`;

  const reloadFolders = () => {
    apiClient.fetchFolders(apiEndpoint, token, setFolders);
  };

  useEffect(() => {
    reloadFolders();
  }, [parentId, apiEndpoint, token]);

  return (
    <div className={styles.foldersWrap}>
      <div className={styles.headGroup}></div>

      {isCalledFromFavorites && (
        <div className={styles.folderWrap}>
          <Link to="/favorites/all" className={styles.folder}>
            <div className={styles.folderInfo}>
              <p className={styles.folderName}>全てのお気に入り</p>
              {/* <p className={styles.favoritesCount}>
                  <MdFavoriteBorder /> 10
                </p> */}
            </div>
          </Link>
        </div>
      )}
      {folders.map((folder) => (
        <div key={folder.id} className={styles.folderWrap}>
          <Link
            to={`/favorites/folders/${folder.id}`}
            className={styles.folder}
          >
            <div className={styles.folderInfo}>
              <p className={styles.folderName}>{folder.name}</p>
              <p className={styles.favoritesCount}>
                <MdFavoriteBorder /> {folder.favorites_count}
              </p>
            </div>
          </Link>

          <div className={styles.folderActions}>
            <UpdateFolderName
              reloadFolders={reloadFolders}
              id={folder.id}
              folderName={folder.name}
            />
            <MoveFolder reloadFolders={reloadFolders} id={folder.id} />
            <DeleteFolder reloadFolders={reloadFolders} id={folder.id} />
          </div>
        </div>
      ))}

      <AddFolder reloadFolders={reloadFolders} parentId={parentId} />
    </div>
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

  const handleSuccess = () => {
    reloadFolders();
    closeModal();
    toast.success("フォルダが作成されました");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    apiClient.createNewFolder(
      apiEndpoint,
      token,
      folderName,
      parentId,
      setErrorMessage,
      handleSuccess
    );
  };

  return (
    <>
      <div className={styles.folderWrap}>
        <div className={`${styles.folder} ${styles.addIconWrap}`}>
          <MdAdd onClick={() => setIsOpen(true)} className={styles.addIcon} />
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
                  <MdErrorOutline />
                  &nbsp;{message}
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

  const closeModal = () => {
    setIsOpen(false);
    setNewFolderName("");
    setErrorMessage(null);
  };

  const handleSuccess = () => {
    reloadFolders();
    closeModal();
    toast.success("フォルダ名が更新されました");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    apiClient.updateFolderName(
      apiEndpoint,
      token,
      newFolderName,
      setErrorMessage,
      handleSuccess
    );
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
                  <MdErrorOutline />
                  &nbsp;{message}
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

  const handleSuccess = () => {
    reloadFolders();
    toast.success("フォルダが削除されました");
  };

  const handleDeleteFolder = async () => {
    apiClient.deleteFolder(apiEndpoint, token, handleSuccess);
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

function MoveFolder({ reloadFolders, id }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders/${id}`;

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    reloadFolders();
    closeModal();
    toast.success("フォルダを移動しました");
  };

  const handleMoveFolder = async ([parentId]) => {
    await apiClient.patch(apiEndpoint, token, {
      folder: { parent_id: parentId },
    });

    handleSuccess();
  };

  return (
    <>
      <MdOutlineDriveFileMove onClick={() => setIsOpen(true)} />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Move Folder"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <div className={formModalStyles.form}>
          <SelectFolders
            onFolderSelect={handleMoveFolder}
            mode="single"
            movingFolderId={id}
          />
        </div>
      </Modal>
    </>
  );
}
