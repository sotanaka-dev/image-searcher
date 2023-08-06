import React, { useState, useContext, useEffect } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";
import { useParams } from "react-router-dom";
import { fetchFavoritesByFolder } from "../utils/apiClient";

export default function FolderFavorites() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}favorites/folder/${id}`;

  useEffect(() => {
    fetchFavoritesByFolder(apiEndpoint, token, setPosts);
  }, []);

  const handleFavoriteRemoved = (postId) => {
    setPosts((posts) => posts.filter((post) => post.id !== postId));
    setIsOpen(false);
  };

  return (
    <>
      <PostList
        posts={posts}
        selectPost={(post) => {
          setSelectedPost(post);
          setIsOpen(true);
        }}
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
    </>
  );
}
