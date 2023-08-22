import React, { useState, useContext } from "react";
import Modal from "react-modal";
import SelectFolders from "./SelectFolders";
import ConfirmationModal from "../components/ConfirmationModal";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import * as apiClient from "../utils/apiClient";
import styles from "../styles/components/PostList.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  setServiceIcon,
  MdCheck,
  MdOutlineCreateNewFolder,
  MdOutlineFolderOff,
  TbHeartOff,
} from "../components/Icon";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

export default function PostList({
  posts,
  folderId = false,
  selectPost,
  reloadFavorites,
  isLoading,
}) {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleComplete = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  return (
    <div>
      {reloadFavorites && (
        <div className={styles.headGroup}>
          {isSelectMode ? (
            <>
              <button onClick={handleComplete} className={styles.toggleBtn}>
                キャンセル
              </button>

              <div className={styles.fixedWrap}>
                <AddToFolder
                  selectedIds={selectedIds}
                  onComplete={handleComplete}
                  isDisabled={selectedIds.length === 0}
                />
                {folderId && (
                  <RemoveToFolder
                    folderId={folderId}
                    selectedIds={selectedIds}
                    onComplete={handleComplete}
                    reloadFavorites={reloadFavorites}
                    isDisabled={selectedIds.length === 0}
                  />
                )}
                <RemoveFavorites
                  selectedIds={selectedIds}
                  onComplete={handleComplete}
                  reloadFavorites={reloadFavorites}
                  isDisabled={selectedIds.length === 0}
                />
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsSelectMode(true)}
              className={styles.toggleBtn}
            >
              お気に入りを選択
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div>
          <Skeleton count={30} />
        </div>
      ) : (
        <ResponsiveMasonry columnsCountBreakPoints={{ 768: 4, 0: 2 }}>
          <Masonry gutter="12px">
            {posts.map((post, index) => {
              const ServiceIcon = setServiceIcon(post.service_name);
              return (
                <motion.div
                  className={styles.post}
                  key={post.post_id}
                  onClick={() => {
                    if (isSelectMode) toggleSelect(post.id);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {isSelectMode && selectedIds.includes(post.id) && (
                    <MdCheck className={styles.selectIcon} />
                  )}
                  <ServiceIcon className={styles.serviceIcon} />
                  <img
                    className={`${styles.image} ${
                      selectedIds.includes(post.id) ? styles.selected : ""
                    }`}
                    src={post.image}
                    alt={post.title}
                    onClick={(event) => {
                      if (!isSelectMode) {
                        event.stopPropagation();
                        selectPost(post);
                      }
                    }}
                  />
                </motion.div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
}

function RemoveFavorites({
  selectedIds,
  onComplete,
  reloadFavorites,
  isDisabled,
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}favorites/destroy_multiple`;

  const handleRemoveFavorites = async () => {
    const result = await apiClient.destroy(apiEndpoint, token, {
      favorite_ids: selectedIds,
    });

    if (result) {
      onComplete();
      reloadFavorites();
      toast.success("お気に入りから削除しました");
      return;
    }

    toast.error("お気に入りの削除に失敗しました");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={styles.selectModeBtn}
      >
        お気に入りから削除
      </button>

      <button
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={styles.selectModeIcon}
      >
        <TbHeartOff />
      </button>

      <ConfirmationModal
        isOpen={modalIsOpen}
        handleClose={() => setIsOpen(false)}
        handleConfirm={handleRemoveFavorites}
        message="お気に入りから削除します。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </>
  );
}

function RemoveToFolder({
  folderId,
  selectedIds,
  onComplete,
  reloadFavorites,
  isDisabled,
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders/${folderId}/remove_favorites`;

  const handleRemoveToFolder = async () => {
    const result = await apiClient.destroy(apiEndpoint, token, {
      favorite_ids: selectedIds,
    });

    if (result) {
      onComplete();
      reloadFavorites();
      toast.success("フォルダからお気に入りを削除しました");
      return;
    }

    toast.error("お気に入りの削除に失敗しました");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={styles.selectModeBtn}
      >
        フォルダから削除
      </button>

      <button
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={styles.selectModeIcon}
      >
        <MdOutlineFolderOff />
      </button>
      <ConfirmationModal
        isOpen={modalIsOpen}
        handleClose={() => setIsOpen(false)}
        handleConfirm={handleRemoveToFolder}
        message="選択したお気に入りをこのフォルダから削除します。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </>
  );
}

function AddToFolder({ selectedIds, onComplete, isDisabled }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders/add_favorites`;

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddToFolder = async (folderIds) => {
    const result = await apiClient.post(apiEndpoint, token, {
      favorite_ids: selectedIds,
      folder_ids: folderIds,
    });

    if (result.errors) {
      toast.error("お気に入りの追加に失敗しました");
      return;
    }

    onComplete();
    closeModal();
    toast.success("フォルダにお気に入りを追加しました");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={styles.selectModeBtn}
      >
        フォルダに追加
      </button>

      <button
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={styles.selectModeIcon}
      >
        <MdOutlineCreateNewFolder />
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add To Folder"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <div className={formModalStyles.form}>
          <SelectFolders onFolderSelect={handleAddToFolder} mode="multi" />
        </div>
      </Modal>
    </>
  );
}
