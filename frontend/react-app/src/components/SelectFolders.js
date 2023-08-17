import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import * as apiClient from "../utils/apiClient";
import styles from "../styles/components/Folders.module.scss";
import { MdCheck, MdFavoriteBorder } from "../components/Icon";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function SelectFolders({
  onFolderSelect = () => {},
  mode,
  movingFolderId = null,
}) {
  const [folders, setFolders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders?all=true`;

  const reloadFolders = useCallback(async () => {
    const result = await apiClient.get(apiEndpoint, token);

    if (result) {
      setFolders(result.folders);
      return;
    }
    toast.error("フォルダの取得に失敗しました");
  }, [apiEndpoint, token]);

  useEffect(() => {
    reloadFolders();
  }, [reloadFolders]);

  const toggleSelect = (id) => {
    if (mode === "single") {
      setSelectedIds([id]);
      return;
    }

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  /* 指定されたフォルダの子孫のIDを再帰的に取得する関数 */
  const getDescendantIds = (folderId, allFolders) => {
    const children = allFolders.filter(
      (folder) => folder.parent_id === folderId
    );
    const descendantIds = children.map((child) => child.id);
    children.forEach((child) => {
      descendantIds.push(...getDescendantIds(child.id, allFolders));
    });
    return descendantIds;
  };

  const descendantsOfMovingFolder = movingFolderId
    ? getDescendantIds(movingFolderId, folders)
    : [];

  return (
    <>
      <div className={styles.foldersWrap}>
        {mode === "single" && (
          <FolderItem
            folder={{ id: null, name: "ルート", favorites_count: null }}
            isSelected={selectedIds.includes(null)}
            onClick={() => toggleSelect(null)}
          />
        )}

        {folders.map((folder) =>
          /* 移動対象のフォルダ自身を移動先として表示しなくする */
          folder.id === movingFolderId ||
          /* 自分自身の子孫フォルダを移動先として表示しないようにする */
          descendantsOfMovingFolder.includes(folder.id) ? null : (
            <FolderItem
              key={folder.id}
              folder={folder}
              isSelected={selectedIds.includes(folder.id)}
              onClick={() => toggleSelect(folder.id)}
            />
          )
        )}
      </div>

      <button
        onClick={() => {
          onFolderSelect(selectedIds);
          setSelectedIds([]);
        }}
        className={
          selectedIds.length === 0 ? styles.disabledBtn : styles.enabledBtn
        }
        disabled={selectedIds.length === 0}
      >
        {mode === "single"
          ? "選択したフォルダに移動"
          : "選択したフォルダに追加"}
      </button>
    </>
  );
}

const FolderItem = ({ folder, isSelected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={styles.folderWrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={`${styles.folder} ${isSelected ? styles.selected : ""}`}>
        {isSelected && <MdCheck className={styles.selectIcon} />}
        <div className={styles.folderInfo}>
          <p className={styles.folderName}>{folder.name}</p>
          {folder.favorites_count !== null && (
            <p className={styles.favoritesCount}>
              <MdFavoriteBorder /> {folder.favorites_count}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
