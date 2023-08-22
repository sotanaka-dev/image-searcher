import { Link } from "react-router-dom";
import styles from "../styles/components/Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.wrap}>
      <Link to="/">
        <img
          src={`${process.env.PUBLIC_URL}/footer_logo.png`}
          alt="Logo"
          className={styles.logo}
        />
      </Link>

      <small className={styles.copyright}>&copy;2023 Sōta Tanaka</small>
    </footer>
  );
}

export default Footer;
