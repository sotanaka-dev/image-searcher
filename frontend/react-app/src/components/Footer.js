import styles from "../styles/components/Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.wrap}>
      <img
        src={`${process.env.PUBLIC_URL}/footer_logo.png`}
        alt="Logo"
        className={styles.logo}
      />
      <small className={styles.copyright}>&copy;2023 Sōta Tanaka</small>
    </footer>
  );
}

export default Footer;
