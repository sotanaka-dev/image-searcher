import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";
import Folders from "../components/Folders";
import { useParams } from "react-router-dom";
import { fetchFavoritesByFolder } from "../utils/apiClient";
import styles from "../styles/pages/FolderFavorites.module.scss";

export default function FolderFavorites() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}favorites/folder/${id}`;

  const reloadFavorites = useCallback(() => {
    fetchFavoritesByFolder(apiEndpoint, token, setPosts);
  }, [apiEndpoint, token, setPosts]);

  useEffect(() => {
    reloadFavorites();
  }, [id, reloadFavorites]);

  const handleFavoriteRemoved = (postId) => {
    setPosts((posts) => posts.filter((post) => post.id !== postId));
    setIsOpen(false);
  };

  return (
    <div className={styles.wrap}>
      <PostList
        posts={posts}
        folderId={id}
        selectPost={(post) => {
          setSelectedPost(post);
          setIsOpen(true);
        }}
        reloadFavorites={reloadFavorites}
      />
      <PostDetails
        post={selectedPost}
        modalIsOpen={modalIsOpen}
        closeModal={() => {
          setIsOpen(false);
          setSelectedPost(null);
        }}
        onFavoriteRemoved={handleFavoriteRemoved}
      />
      <Folders parentId={id} />
    </div>
  );
}
