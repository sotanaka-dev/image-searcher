import React, { useState, useContext, useEffect } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/components/FavoriteToggle.module.scss";
import { MdFavoriteBorder, MdFavorite } from "./Icon";

export default function FavoriteToggle({ post, onFavoriteRemoved }) {
  const { token } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const apiEndpoint = `${BASE_URL}favorites`;

  const fetchFavoriteStatus = async () => {
    const res = await fetch(`${apiEndpoint}/exists?post_id=${post.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { exists, favoriteId } = await res.json();
    setIsFavorite(exists);
    setFavoriteId(favoriteId);
  };

  useEffect(() => {
    fetchFavoriteStatus();
  }, []);

  const handleFavorite = async () => {
    try {
      const res = await fetch(
        `${apiEndpoint}${isFavorite ? `/${favoriteId}` : ""}`,
        {
          method: isFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            favorite: { post_id: post.id, service_id: post.service_id },
          }),
        }
      );

      if (!res.ok) {
        console.error(`Failed to favorite: ${res.statusText}`);
        return;
      }

      fetchFavoriteStatus();

      if (isFavorite && onFavoriteRemoved) {
        onFavoriteRemoved(post.id);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
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
