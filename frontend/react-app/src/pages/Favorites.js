import { Link } from "react-router-dom";
import Folders from "../components/Folders";
import PageHeader from "../components/PageHeader";
import PageTransition from "../styles/PageTransition";
import foldersStyles from "../styles/components/Folders.module.scss";
import { motion } from "framer-motion";

export default function Favorites() {
  return (
    <PageTransition>
      <PageHeader title="お気に入り" />

      <div className={foldersStyles.foldersWrap}>
        <div className={foldersStyles.headGroup}></div>

        <motion.div
          className={foldersStyles.folderWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/favorites/all" className={foldersStyles.folder}>
            <div className={foldersStyles.folderInfo}>
              <p className={foldersStyles.folderName}>全てのお気に入り</p>
            </div>
          </Link>
        </motion.div>

        <Folders />
      </div>
    </PageTransition>
  );
}
