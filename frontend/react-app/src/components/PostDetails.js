import Modal from "react-modal";
import styles from "../styles/components/PostDetails.module.scss";
import { MdLink, MdArrowBack, RxTwitterLogo, LiaLine } from "./Icon";

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
            <h2 className={styles.title}>{post.title}</h2>
            <div className={styles.actions}>
              <MdArrowBack className={styles.icon} onClick={closeModal} />

              <div className={styles.rightGroup}>
                <FavoriteToggle
                  post={post}
                  onFavoriteRemoved={onFavoriteRemoved}
                />

                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <MdLink className={styles.icon} />
                </a>

                <ShareToTwitter post={post} />
                <ShareToLine post={post} />
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

function ShareToTwitter({ post }) {
  const encodedURL = encodeURIComponent(post.url);
  const encodedText = encodeURIComponent(post.title);

  const URL = `https://twitter.com/share?url=${encodedURL}&text=${encodedText}`;

  return (
    <a href={URL} target="_blank" rel="noopener noreferrer">
      <RxTwitterLogo className={styles.icon} />
    </a>
  );
}

function ShareToLine({ post }) {
  const encodedURL = encodeURIComponent(post.url);
  const encodedText = encodeURIComponent(post.title);

  const URL = `https://social-plugins.line.me/lineit/share?url=${encodedURL}&text=${encodedText}`;

  return (
    <a href={URL} target="_blank" rel="noopener noreferrer">
      <LiaLine className={styles.icon} />
    </a>
  );
}
