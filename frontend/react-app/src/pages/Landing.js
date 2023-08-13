import { Link } from "react-router-dom";
import styles from "../styles/pages/Landing.module.scss";
import PageTransition from "../styles/PageTransition";

export default function Landing() {
  return (
    <PageTransition className={styles.wrap}>
      <div className={styles.infoGroup}>
        <img
          src={`${process.env.PUBLIC_URL}/header_logo.png`}
          alt=""
          className={styles.logo}
        />
        <p className={styles.overview}>
          普段から画像・動画系のSNSをよく利用する人のための、それらのSNSの検索結果を1ヶ所で確認できるサービスです。
        </p>
        <div className={styles.btnWrap}>
          <Link to="/users" className={styles.btn}>
            サインアップ
          </Link>
          <Link to="/users/signin" className={styles.btn}>
            サインイン
          </Link>
        </div>
      </div>

      <div className={styles.imgWrap}>
        <img
          src={`${process.env.PUBLIC_URL}/sample.png`}
          alt=""
          className={styles.sampleImg}
        />
      </div>
    </PageTransition>
  );
}
