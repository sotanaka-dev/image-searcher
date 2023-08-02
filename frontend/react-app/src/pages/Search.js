import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styles from "../styles/pages/Search.module.scss";
import PostDetails from "../components/PostDetails";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import { serviceIcons, MdHelpOutline } from "../components/Icon";

export default function Search() {
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line
  const [unavailableServices, setUnavailableServices] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  const fetchData = async (keyword) => {
    if (keyword !== "") {
      const apiEndpoint = `${BASE_URL}search?keyword=${encodeURIComponent(
        keyword
      )}`;

      if (!token) {
        navigate("/users/signin");
        return;
      }

      try {
        const res = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <>
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
    </>
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
      <div className={styles.textboxInnerWrap}>
        <input
          className={styles.textbox}
          type="text"
          onChange={handleKeywordChange}
          onKeyDown={handleKeywordSubmitInternal}
          value={keyword}
        />
      </div>
    </div>
  );
}

function SearchResult({ posts, selectPost }) {
  function setIcon(service_name) {
    return serviceIcons[service_name] || MdHelpOutline;
  }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 768: 4, 0: 2 }}>
      <Masonry gutter="12px">
        {posts.map((post) => {
          const Icon = setIcon(post.service_name);
          return (
            <div className={styles.postWrap} key={post.id}>
              <Icon className={styles.icon} />
              <img
                className={styles.image}
                src={post.image}
                alt={post.title}
                onClick={() => selectPost(post)}
              />
            </div>
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}
