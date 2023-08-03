import { Link } from "react-router-dom";
import styles from "../styles/components/Header.module.scss";

function Header() {
  return (
    <header className={styles.wrap}>
      <Link to="/mypage">My Page</Link>
      <br />
      <Link to="/search">Search Page</Link>
      <br />
      <Link to="/favorites">Favorites</Link>
    </header>
  );
}

export default Header;
