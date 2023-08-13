import Folders from "../components/Folders";
import PageTransition from "../styles/PageTransition";

export default function Favorites() {
  return (
    <PageTransition>
      <Folders isCalledFromFavorites={true} />
    </PageTransition>
  );
}
