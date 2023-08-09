import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Search.module.scss";
import PostDetails from "../components/PostDetails";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import PostList from "../components/PostList";
import { serviceIcons } from "../components/Icon";
import { toast } from "react-toastify";

export default function Search() {
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line
  const [unavailableServices, setUnavailableServices] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState(
    Object.keys(serviceIcons).map((serviceName) => serviceName.toLowerCase())
  );
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  const fetchData = async (keyword) => {
    if (keyword !== "") {
      const apiEndpoint = `${BASE_URL}search?keyword=${encodeURIComponent(
        keyword
      )}&services=${selectedServices.join(",")}`;

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
      <div className={styles.headGroup}>
        <SelectSns
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />
        <SearchInput
          onKeywordSubmit={fetchData}
          selectedServices={selectedServices}
        />
      </div>
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
      />
    </>
  );
}

function SelectSns({ selectedServices, setSelectedServices }) {
  const handleServiceClick = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
      return;
    }
    setSelectedServices([...selectedServices, service]);
  };

  return (
    <div className={styles.iconsWrap}>
      {Object.entries(serviceIcons).map(([serviceName, Icon]) => (
        <Icon
          key={serviceName}
          onClick={() => handleServiceClick(serviceName.toLowerCase())}
          className={
            selectedServices.includes(serviceName.toLowerCase())
              ? styles.selected
              : ""
          }
        />
      ))}
    </div>
  );
}

function SearchInput({ onKeywordSubmit, selectedServices }) {
  const [keyword, setKeyword] = useState("");

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleKeywordSubmitInternal = (e) => {
    if (e.key === "Enter") {
      if (selectedServices.length > 0) {
        e.preventDefault();
        onKeywordSubmit(keyword);
        return;
      }
      toast.warning("SNSが選択されていません");
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
