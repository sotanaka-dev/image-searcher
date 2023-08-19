import { useState } from "react";
import { Link } from "react-router-dom";
import { stack as Menu } from "react-burger-menu";
import {
  MdMenu,
  MdSearch,
  MdOutlineHome,
  MdFavoriteBorder,
  MdHistory,
} from "./Icon";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    bmCrossButton: {
      height: "24px",
      width: "24px",
      left: "10px",
    },
    bmCross: {
      background: "#ccc",
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
      color: "#ccc",
    },
    bmItem: {
      outline: "none",
    },
    bmOverlay: {
      inset: "0",
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  const iconStyles = {
    fontSize: "3.6rem",
    cursor: "pointer",
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MdMenu onClick={() => setIsOpen(!isOpen)} style={iconStyles} />

      <Menu
        right
        styles={styles}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        customBurgerIcon={false}
      >
        <Link to="/search" onClick={handleCloseMenu}>
          <MdSearch />
          &nbsp;&nbsp;検索
        </Link>
        <Link to="/history" onClick={handleCloseMenu}>
          <MdHistory />
          &nbsp;&nbsp;検索履歴
        </Link>
        <Link to="/mypage" onClick={handleCloseMenu}>
          <MdOutlineHome />
          &nbsp;&nbsp;マイページ
        </Link>
        <Link to="/favorites" onClick={handleCloseMenu}>
          <MdFavoriteBorder />
          &nbsp;&nbsp;お気に入り
        </Link>
      </Menu>
    </>
  );
}
