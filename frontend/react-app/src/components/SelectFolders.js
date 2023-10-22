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
  btnText,
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

  return (
    <>
      <div className={styles.foldersWrap}>
        {folders.map((folder) => {
          return (
            <motion.div
              key={folder.id}
              onClick={() => toggleSelect(folder.id)}
              className={styles.folderWrap}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                className={`${styles.folder} ${
                  selectedIds.includes(folder.id) ? styles.selected : ""
                }`}
              >
                {selectedIds.includes(folder.id) && (
                  <MdCheck className={styles.selectIcon} />
                )}
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
        })}
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
        {btnText}
      </button>
    </>
  );
}
