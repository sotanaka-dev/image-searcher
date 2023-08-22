import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import * as apiClient from "../utils/apiClient";
import styles from "../styles/components/FavoriteToggle.module.scss";
import { MdFavoriteBorder, MdFavorite } from "./Icon";
import { toast } from "react-toastify";

export default function FavoriteToggle({ post, onFavoriteRemoved }) {
  const { token } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const baseApiEndpoint = `${BASE_URL}favorites`;

  const updateFavorite = useCallback(async () => {
    const apiEndpoint = `${baseApiEndpoint}/exists?post_id=${post.post_id}`;
    const result = await apiClient.get(apiEndpoint, token);

    if (result) {
      setIsFavorite(result.exists);
      setFavoriteId(result.favoriteId);
      return;
    }

    toast.error("お気に入り情報の取得に失敗しました");
  }, [post.post_id, token, baseApiEndpoint]);

  useEffect(() => {
    updateFavorite();
  }, [updateFavorite]);

  const handleFavorite = async () => {
    if (isFavorite) {
      const apiEndpoint = `${baseApiEndpoint}/${favoriteId}`;
      const result = await apiClient.destroy(apiEndpoint, token);

      if (!result) {
        toast.error("お気に入りの削除に失敗しました");
        return;
      }

      if (onFavoriteRemoved) {
        onFavoriteRemoved(post.id);
      }

      toast.success("お気に入りから削除しました");
    } else {
      const result = await apiClient.post(baseApiEndpoint, token, {
        favorite: { post_id: post.post_id, service_id: post.service_id },
      });

      if (result.errors) {
        toast.error("お気に入りの追加に失敗しました");
        return;
      }

      toast.success("お気に入りに追加しました");
    }

    updateFavorite();
  };

  return isFavorite ? (
    <MdFavorite
      onClick={handleFavorite}
      className={`${styles.icon} ${styles.favorite}`}
    />
  ) : (
    <MdFavoriteBorder onClick={handleFavorite} className={styles.icon} />
  );
}
