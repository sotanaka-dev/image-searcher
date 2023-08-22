import { Link } from "react-router-dom";
import styles from "../styles/components/Header.module.scss";
import HamburgerMenu from "./HamburgerMenu";

function Header() {
  return (
    <header className={styles.wrap}>
      <div className={styles.innerWrap}>
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/header_logo.png`}
            alt="Logo"
            className={styles.logo}
          />
        </Link>

        <div>
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
