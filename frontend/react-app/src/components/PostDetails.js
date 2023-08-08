import Modal from "react-modal";
import styles from "../styles/components/PostDetails.module.scss";
import { MdLink, MdOutlineShare, MdArrowBack } from "./Icon";

import FavoriteToggle from "./FavoriteToggle";

Modal.setAppElement("#root");

export default function PostDetails({
  post,
  modalIsOpen,
  closeModal,
  onFavoriteRemoved,
}) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Post Details"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      {post ? (
        <>
          <img className={styles.image} src={post.image} alt={post.title} />
          <div className={styles.footGroup}>
            <h2>{post.title}</h2>
            <div className={styles.actions}>
              <MdArrowBack className={styles.icon} onClick={closeModal} />

              <div className={styles.rightGroup}>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <MdLink className={styles.icon} />
                </a>
                <FavoriteToggle
                  post={post}
                  onFavoriteRemoved={onFavoriteRemoved}
                />
                <MdOutlineShare className={styles.icon} />
              </div>
            </div>
          </div>
        </>
      ) : (
        "No post selected"
      )}
    </Modal>
  );
}
