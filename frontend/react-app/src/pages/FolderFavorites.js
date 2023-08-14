import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";
import Folders from "../components/Folders";
import { useParams } from "react-router-dom";
import * as apiClient from "../utils/apiClient";
import styles from "../styles/pages/FolderFavorites.module.scss";
import PageTransition from "../styles/PageTransition";

export default function FolderFavorites() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}favorites/folder/${id}`;

  const reloadFavorites = useCallback(async () => {
    setIsLoading(true);
    const data = await apiClient.get(apiEndpoint, token);
    setPosts(data || []);
    setIsLoading(false);
  }, [apiEndpoint, token]);

  useEffect(() => {
    reloadFavorites();
  }, [id, reloadFavorites]);

  const handleFavoriteRemoved = (postId) => {
    setPosts((posts) => posts.filter((post) => post.id !== postId));
    setIsOpen(false);
  };

  return (
    <PageTransition className={styles.wrap}>
      <PostList
        posts={posts}
        folderId={id}
        selectPost={(post) => {
          setSelectedPost(post);
          setIsOpen(true);
        }}
        reloadFavorites={reloadFavorites}
        isLoading={isLoading}
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
    </PageTransition>
  );
}
