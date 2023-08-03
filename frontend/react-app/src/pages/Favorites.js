import { Link } from "react-router-dom";

export default function Favorites() {
  return (
    <>
      <Link to="/favorites/all">全てのお気に入り</Link>
      {/* <Link to="/favorites/folders">全てのお気に入り</Link> */}
    </>
  );
}
