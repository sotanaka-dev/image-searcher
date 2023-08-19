import { useState } from "react";
import { Link } from "react-router-dom";
import { stack as Menu } from "react-burger-menu";
import {
  MdMenu,
  MdSearch,
  MdOutlineHome,
  MdFavoriteBorder,
  MdHistory,
  MdOutlineAccountCircle,
} from "./Icon";
import styles from "../styles/components/HamburgerMenu.module.scss";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const customStyles = {
    bmCrossButton: {
      height: "24px",
      width: "24px",
      left: "10px",
    },
    bmCross: {
      background: "#f8f8f8",
    },
    bmMenuWrap: {
      position: "fixed",
      top: "0",
      height: "100%",
      width: "80%",
      maxWidth: "300px",
    },
    bmMenu: {
      background: "#333",
      padding: "84px 48px",
    },
    bmItemList: {
      display: "flex",
      flexDirection: "column",
      rowGap: "36px",
      color: "#f8f8f8",
    },
    bmItem: {
      display: "flex",
      alignItems: "center",
      columnGap: "12px",
      outline: "none",
    },
    bmOverlay: {
      inset: "0",
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MdMenu
        onClick={() => setIsOpen(!isOpen)}
        className={styles.hamburgerIcon}
      />

      <Menu
        right
        styles={customStyles}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        customBurgerIcon={false}
      >
        <Link to="/" onClick={handleCloseMenu} className={styles.link}>
          <MdOutlineHome className={styles.linkIcon} />
          <p>トップ</p>
        </Link>

        <Link to="/search" onClick={handleCloseMenu} className={styles.link}>
          <MdSearch className={styles.linkIcon} />
          <p>検索</p>
        </Link>

        <Link to="/history" onClick={handleCloseMenu} className={styles.link}>
          <MdHistory className={styles.linkIcon} />
          <p>検索履歴</p>
        </Link>

        <Link to="/favorites" onClick={handleCloseMenu} className={styles.link}>
          <MdFavoriteBorder className={styles.linkIcon} />
          <p>お気に入り</p>
        </Link>

        <Link to="/mypage" onClick={handleCloseMenu} className={styles.link}>
          <MdOutlineAccountCircle className={styles.linkIcon} />
          <p>マイページ</p>
        </Link>
      </Menu>
    </>
  );
}
