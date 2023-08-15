import React, { useState, useContext, useEffect } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import { fetchFolders } from "../utils/apiClient";
import styles from "../styles/components/Folders.module.scss";
import { MdCheck, MdFavoriteBorder } from "../components/Icon";

/* onAddToFolderは、名前を抽象化して渡せば移動とお気に入りを追加で分けなくてもいいかも（具体的な処理は呼び出しもとに記述するから） */
export default function SelectFolders({ onAddToFolder = () => {} }) {
  const [folders, setFolders] = useState([]);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}folders?all=true`;

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    /* TODO: apiClientをリファクタリング */
    fetchFolders(apiEndpoint, token, setFolders);
  }, [apiEndpoint, token]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  /*
  ここは名前を変えて、フォルダにお気に入り追加時とフォルダ移動時で分ける必要がある
  それか、引数の関数名を抽象化すればここで一元化できる
  */
  const handleComplete = () => {
    onAddToFolder(selectedIds);

    setSelectedIds([]);
  };

  return (
    <>
      <div className={styles.foldersWrap}>
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => {
              toggleSelect(folder.id);
            }}
            className={styles.folderWrap}
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
                <p className={styles.favoritesCount}>
                  <MdFavoriteBorder /> {folder.favorites_count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleComplete}
        className={
          selectedIds.length === 0 ? styles.disabledBtn : styles.enabledBtn
        }
        disabled={selectedIds.length === 0}
      >
        選択したフォルダに追加
      </button>
    </>
  );
}
