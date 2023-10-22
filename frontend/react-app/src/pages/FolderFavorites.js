import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";
import PageHeader from "../components/PageHeader";
import { useParams } from "react-router-dom";
import * as apiClient from "../utils/apiClient";
import styles from "../styles/pages/FolderFavorites.module.scss";
import PageTransition from "../styles/PageTransition";
import { toast } from "react-toastify";

export default function FolderFavorites() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [folder, setFolder] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchFolder = useCallback(async () => {
    const apiEndpoint = `${BASE_URL}folders/${id}`;
    const result = await apiClient.get(apiEndpoint, token);

    if (result) {
      setFolder(result.folder);
      return;
    }
    toast.error("フォルダの取得に失敗しました");
  }, [id, token]);

  const reloadFavorites = useCallback(async () => {
    const apiEndpoint = `${BASE_URL}favorites/folder/${id}`;

    setIsLoading(true);
    const result = await apiClient.get(apiEndpoint, token);
    setIsLoading(false);

    if (result) {
      setPosts(result.posts);
      return;
    }

    toast.error("お気に入りの取得に失敗しました");
  }, [id, token]);

  useEffect(() => {
    fetchFolder();
    reloadFavorites();
  }, [id, fetchFolder, reloadFavorites]);

  const handleFavoriteRemoved = (postId) => {
    setPosts((posts) => posts.filter((post) => post.id !== postId));
    setIsOpen(false);
  };

  return (
    <PageTransition>
      <PageHeader title={`${folder?.name}フォルダ`} />

      <div className={styles.wrap}>
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
      </div>
    </PageTransition>
  );
}
