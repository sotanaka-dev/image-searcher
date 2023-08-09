import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import { getFavoriteStatus, toggleFavoriteStatus } from "../utils/apiClient";
import styles from "../styles/components/FavoriteToggle.module.scss";
import { MdFavoriteBorder, MdFavorite } from "./Icon";
import { toast } from "react-toastify";

export default function FavoriteToggle({ post, onFavoriteRemoved }) {
  const { token } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const apiEndpoint = `${BASE_URL}favorites`;

  const updateFavorite = useCallback(async () => {
    const { exists, favoriteId } = await getFavoriteStatus(
      apiEndpoint,
      token,
      post.post_id
    );
    setIsFavorite(exists);
    setFavoriteId(favoriteId);
  }, [post.post_id, token, apiEndpoint]);

  useEffect(() => {
    updateFavorite();
  }, [updateFavorite]);

  const handleSuccess = () => {
    updateFavorite();

    if (isFavorite) {
      if (onFavoriteRemoved) {
        onFavoriteRemoved(post.id);
      }
      toast.success("お気に入りから削除しました");
      return;
    }
    toast.success("お気に入りに追加しました");
  };

  const handleFavorite = async () => {
    toggleFavoriteStatus(
      apiEndpoint,
      token,
      isFavorite,
      favoriteId,
      post.post_id,
      post.service_id,
      handleSuccess
    );
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
