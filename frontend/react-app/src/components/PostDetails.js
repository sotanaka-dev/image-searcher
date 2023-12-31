import Modal from "react-modal";
import styles from "../styles/components/PostDetails.module.scss";
import {
  setServiceIcon,
  MdLink,
  MdArrowBack,
  RiTwitterLine,
  LiaLine,
} from "./Icon";

import FavoriteToggle from "./FavoriteToggle";

Modal.setAppElement("#root");

export default function PostDetails({
  post,
  modalIsOpen,
  closeModal,
  onFavoriteRemoved,
}) {
  const ServiceIcon = setServiceIcon(post?.service_name);

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
            <div className={styles.heading}>
              <span className={styles.serviceIcon}>
                <ServiceIcon />
              </span>

              <h2 className={styles.title}>{post.title}</h2>
            </div>

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

  const handleClick = (e) => {
    e.preventDefault();
    window.open(URL, "_blank", "noopener,noreferrer");
  };

  return (
    <span onClick={handleClick}>
      <RiTwitterLine className={styles.icon} />
    </span>
  );
}

function ShareToLine({ post }) {
  const encodedURL = encodeURIComponent(post.url);
  const encodedText = encodeURIComponent(post.title);

  const URL = `https://social-plugins.line.me/lineit/share?url=${encodedURL}&text=${encodedText}`;

  const handleClick = (e) => {
    e.preventDefault();
    window.open(URL, "_blank", "noopener,noreferrer");
  };

  return (
    <span onClick={handleClick}>
      <LiaLine className={styles.icon} />
    </span>
  );
}
