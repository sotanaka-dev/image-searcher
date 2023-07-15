import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styles from "../styles/pages/Search.module.scss";

const BASE_URL = "http://localhost:3000/search?keyword=";

export default function Search() {
  const [data, setData] = useState([]);

  const fetchData = async (keyword) => {
    if (keyword !== "") {
      let apiEndpoint = BASE_URL + encodeURIComponent(keyword);
      try {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <SearchInput onKeywordSubmit={fetchData} />
      <SearchResult data={data} />
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

function SearchResult({ data }) {
  return (
    <Masonry columnsCount={4} gutter="12px">
      {data.map((result) => (
        <img
          className={styles.postImage}
          key={result.url}
          src={result.image}
          alt={result.title}
        />
      ))}
    </Masonry>
  );
}
