import { FaExclamationTriangle } from "react-icons/fa";
import "../css/ConfirmModal.css";

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {

  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-overlay">

      <div className="confirm-modal">

        <div className="confirm-icon">
          <FaExclamationTriangle />
        </div>

        <h2>
          {title}
        </h2>

        <p>
          {message}
        </p>

        <div className="confirm-actions">

          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete"
            onClick={onConfirm}
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;