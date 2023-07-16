import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styles from "../styles/pages/Search.module.scss";
import PostDetails from "../components/PostDetails";

const BASE_URL = "http://localhost:3000/search?keyword=";

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [unavailableServices, setUnavailableServices] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const fetchData = async (keyword) => {
    if (keyword !== "") {
      let apiEndpoint = BASE_URL + encodeURIComponent(keyword);
      try {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setPosts(data.posts);
        setUnavailableServices(data.unavailable_services);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <SearchInput onKeywordSubmit={fetchData} />
      <SearchResult
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
      />
    </div>
  );
}

function SearchInput({ onKeywordSubmit }) {
  const [keyword, setKeyword] = useState("");

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleKeywordSubmitInternal = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onKeywordSubmit(keyword);
    }
  };

  return (
    <div className={styles.textboxWrap}>
      <input
        className={styles.textbox}
        type="text"
        onChange={handleKeywordChange}
        onKeyDown={handleKeywordSubmitInternal}
        value={keyword}
      />
    </div>
  );
}

function SearchResult({ posts, selectPost }) {
  return (
    <Masonry columnsCount={4} gutter="12px">
      {posts.map((post) => (
        <img
          className={styles.postImage}
          key={post.url}
          src={post.image}
          alt={post.title}
          onClick={() => selectPost(post)}
        />
      ))}
    </Masonry>
  );
}
