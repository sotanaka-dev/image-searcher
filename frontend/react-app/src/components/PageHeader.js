import { useNavigate } from "react-router-dom";
import styles from "../styles/components/PageHeader.module.scss";

function PageHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <button onClick={() => navigate(-1)} className={styles.goBack}>
        戻る
      </button>

      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

export default PageHeader;
