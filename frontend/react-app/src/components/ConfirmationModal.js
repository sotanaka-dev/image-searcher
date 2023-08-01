import Modal from "react-modal";
import styles from "../styles/components/ConfirmationModal.module.scss";

function ConfirmationModal({
  isOpen,
  handleClose,
  handleConfirm,
  message,
  confirmText,
  cancelText,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Confirmation Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <p className={styles.message}>{message}</p>
      <div className={styles.btnWrap}>
        <button
          onClick={() => {
            handleConfirm();
            handleClose();
          }}
          className={styles.btn}
        >
          {confirmText}
        </button>
        <button onClick={handleClose} className={styles.btn}>
          {cancelText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
