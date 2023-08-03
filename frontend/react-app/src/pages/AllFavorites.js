import React, { useState, useContext, useEffect } from "react";
import { BASE_URL } from "../config/environment";
import { AuthContext } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";

export default function AllFavorites() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const apiEndpoint = `${BASE_URL}favorites`;

      const res = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
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
