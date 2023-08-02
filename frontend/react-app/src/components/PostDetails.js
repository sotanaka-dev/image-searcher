import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import styles from "../styles/components/PostDetails.module.scss";
import {
  MdLink,
  MdFavoriteBorder,
  MdFavorite,
  MdOutlineShare,
  MdArrowBack,
} from "./Icon";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";

Modal.setAppElement("#root");

export default function PostDetails({ post, modalIsOpen, closeModal }) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Post Details"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      {post ? (
        <>
          <img className={styles.image} src={post.image} alt={post.title} />
          <div className={styles.footGroup}>
            <h2>{post.title}</h2>
            <div className={styles.actions}>
              <MdArrowBack className={styles.icon} onClick={closeModal} />

              <div className={styles.rightGroup}>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <MdLink className={styles.icon} />
                </a>
                <Favorite postId={post.id} postSource={post.source} />
                <MdOutlineShare className={styles.icon} />
              </div>
            </div>
          </div>
        </>
      ) : (
        "No post selected"
      )}
    </Modal>
  );
}

function Favorite({ postId, postSource }) {
  const { token } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const apiEndpoint = `${BASE_URL}favorites`;

  const fetchFavoriteStatus = async () => {
    const res = await fetch(`${apiEndpoint}/exists?post_id=${postId}`, {
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
            favorite: { post_id: postId, service_name: postSource },
          }),
        }
      );

      if (!res.ok) {
        console.error(`Failed to favorite: ${res.statusText}`);
        return;
      }

      fetchFavoriteStatus();
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
