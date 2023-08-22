import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Search.module.scss";
import PostDetails from "../components/PostDetails";
import PageHeader from "../components/PageHeader";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import PostList from "../components/PostList";
import { serviceIcons, MdSearch } from "../components/Icon";
import { toast } from "react-toastify";
import PageTransition from "../styles/PageTransition";
import * as apiClient from "../utils/apiClient";

export default function Search() {
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line
  const [unavailableServices, setUnavailableServices] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState(
    Object.keys(serviceIcons).map((serviceName) => serviceName.toLowerCase())
  );
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  const handleSearch = async (keyword) => {
    if (keyword !== "") {
      if (!token) {
        navigate("/users/signin");
        return;
      }

      const searchEndpoint = `${BASE_URL}search?keyword=${encodeURIComponent(
        keyword
      )}&services=${selectedServices.join(",")}`;

      setIsLoading(true);
      const data = await apiClient.get(searchEndpoint, token);
      setPosts(data.posts || []);
      setUnavailableServices(data.unavailable_services || []);
      setIsLoading(false);

      const searchHistoryEndpoint = `${BASE_URL}search_histories`;
      apiClient.post(searchHistoryEndpoint, token, {
        search_history: { keyword: keyword },
      });
    }
  };

  return (
    <PageTransition>
      <PageHeader title="検索" />

      <div className={styles.headGroup}>
        <SelectSns
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />
        <SearchInput
          onKeywordSubmit={handleSearch}
          selectedServices={selectedServices}
        />
      </div>

      <PostList
        posts={posts}
        selectPost={(post) => {
          setSelectedPost(post);
          setIsOpen(true);
        }}
        isLoading={isLoading}
      />

      <PostDetails
        post={selectedPost}
        modalIsOpen={modalIsOpen}
        closeModal={() => {
          setIsOpen(false);
          setSelectedPost(null);
        }}
      />
    </PageTransition>
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
          className={`${styles.icon} ${
            selectedServices.includes(serviceName.toLowerCase())
              ? styles.selected
              : ""
          }`}
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

  const handleKeywordSubmit = (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    if (selectedServices.length > 0) {
      e.preventDefault();
      onKeywordSubmit(keyword);
      return;
    }
    toast.warning("SNSが選択されていません");
  };

  return (
    <div className={styles.textboxWrap}>
      <input
        className={styles.textbox}
        type="text"
        onChange={handleKeywordChange}
        onKeyDown={handleKeywordSubmit}
        value={keyword}
        placeholder="キーワード"
      />

      <button onClick={handleKeywordSubmit} className={styles.searchBtn}>
        <MdSearch className={styles.searchIcon} />
      </button>
    </div>
  );
}
