import React, { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../config/environment";
import * as apiClient from "../utils/apiClient";
import PageTransition from "../styles/PageTransition";
import styles from "../styles/pages/SearchHistories.module.scss";
import { MdClose, MdHistory } from "../components/Icon";
import { toast } from "react-toastify";

export default function SearchHistories() {
  const [searchHistories, setSearchHistories] = useState([]);
  const { token } = useContext(AuthContext);
  const apiEndpoint = `${BASE_URL}search_histories`;

  const reloadSearchHistories = useCallback(async () => {
    const result = await apiClient.get(apiEndpoint, token);

    if (result) {
      const grouped = result.search_histories.reduce((acc, history) => {
        const date = new Date(history.created_at).toLocaleDateString("ja-JP");
        if (!acc[date]) acc[date] = [];
        acc[date].push(history);
        return acc;
      }, {});

      setSearchHistories(grouped);
    }

    console.log(result);
  }, [token, apiEndpoint]);

  useEffect(() => {
    reloadSearchHistories();
  }, [reloadSearchHistories]);

  const deleteSearchHistory = async (id) => {
    const result = await apiClient.destroy(`${apiEndpoint}/${id}`, token);

    if (result) {
      reloadSearchHistories();
      toast.success("検索履歴が削除されました");
      return;
    }

    toast.error("検索履歴の削除に失敗しました");
  };

  return (
    <PageTransition className={styles.wrap}>
      {Object.keys(searchHistories).map((date) => (
        <div key={date} className={styles.dailyHistory}>
          <h2 className={styles.date}>
            <MdHistory />
            &nbsp;{date}
          </h2>

          <ul className={styles.historyList}>
            {searchHistories[date].map((history) => (
              <li key={history.id} className={styles.history}>
                <p>{history.keyword}</p>

                <div className={styles.rightGroup}>
                  <p>
                    {new Date(history.created_at).toLocaleTimeString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <MdClose
                    className={styles.closeIcon}
                    onClick={() => deleteSearchHistory(history.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </PageTransition>
  );
}
