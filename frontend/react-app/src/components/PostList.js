import React, { useState, useContext } from "react";
import Modal from "react-modal";
import Folders from "../components/Folders";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import { addFavoritesToFolders } from "../utils/apiClient";
import styles from "../styles/components/PostList.module.scss";
import formModalStyles from "../styles/components/FormModal.module.scss";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { serviceIcons, MdHelpOutline, MdCheck } from "../components/Icon";

export default function PostList({ posts, selectPost }) {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { token } = useContext(AuthContext);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveFavorites = () => {
    console.log("お気に入りから一括削除");
    handleComplete();
  };

  const handleAddToFolder = async (folderIds) => {
    const apiEndpoint = `${BASE_URL}folders/add_favorites`;

    addFavoritesToFolders(
      apiEndpoint,
      token,
      selectedIds,
      folderIds,
      handleComplete
    );
  };

  const handleComplete = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  function setServiceIcon(service_name) {
    return serviceIcons[service_name] || MdHelpOutline;
  }

  return (
    <div>
      {!isSelectMode && (
        <button onClick={() => setIsSelectMode(true)}>お気に入りを選択</button>
      )}

      {isSelectMode && <button onClick={handleComplete}>キャンセル</button>}

      {isSelectMode && selectedIds.length > 0 && (
        <>
          <button onClick={handleRemoveFavorites}>お気に入りから削除</button>
          <AddToFolderModal onAddToFolder={handleAddToFolder} />
        </>
      )}

      <ResponsiveMasonry columnsCountBreakPoints={{ 768: 4, 0: 2 }}>
        <Masonry gutter="12px">
          {posts.map((post) => {
            const ServiceIcon = setServiceIcon(post.service_name);
            return (
              <div
                className={styles.wrap}
                key={post.id}
                onClick={() => {
                  if (isSelectMode) toggleSelect(post.id);
                }}
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
              </div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

function AddToFolderModal({ onAddToFolder }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>フォルダに追加</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add To Folder"
        className={formModalStyles.modal}
        overlayClassName={formModalStyles.overlay}
      >
        <div className={formModalStyles.form}>
          <Folders
            onAddToFolder={(folderIds) => {
              onAddToFolder(folderIds);
              closeModal();
            }}
          />
        </div>
      </Modal>
    </>
  );
}
