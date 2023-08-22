import React, { useState, useContext, useEffect, useCallback } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";
import PageHeader from "../components/PageHeader";
import * as apiClient from "../utils/apiClient";
import PageTransition from "../styles/PageTransition";

export default function AllFavorites() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}favorites`;

  const reloadFavorites = useCallback(async () => {
    setIsLoading(true);
    const data = await apiClient.get(apiEndpoint, token);
    setPosts(data || []);
    setIsLoading(false);
  }, [apiEndpoint, token]);

  useEffect(() => {
    reloadFavorites();
  }, [reloadFavorites]);

  const handleFavoriteRemoved = (postId) => {
    setPosts((posts) => posts.filter((post) => post.id !== postId));
    setIsOpen(false);
  };

  return (
    <PageTransition>
      <PageHeader title="全てのお気に入り" />

      <PostList
        posts={posts}
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
    </PageTransition>
  );
}
