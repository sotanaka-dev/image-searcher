import Modal from "react-modal";
import styles from "../styles/components/PostDetails.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faHeart,
  faShareFromSquare,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#root");

export default function PostDetails({ post, modalIsOpen, closeModal }) {
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
              <FontAwesomeIcon
                icon={faArrowLeft}
                size="xl"
                className={styles.closeBtn}
                onClick={closeModal}
              />

              <div className={styles.rightGroup}>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLink} size="xl" />
                </a>
                <FontAwesomeIcon icon={faHeart} size="xl" />
                <FontAwesomeIcon icon={faShareFromSquare} size="xl" />
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
