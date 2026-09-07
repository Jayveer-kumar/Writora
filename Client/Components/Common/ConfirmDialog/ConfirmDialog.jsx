import { createPortal } from "react-dom";
import "./ConfirmDialog.css";

/**
 * ConfirmDialog — generic confirmation modal.
 *
 * Usage:
 *   <ConfirmDialog
 *     open={confirmOpen}
 *     title="Delete this story?"
 *     message="This can't be undone. The story and its comments will be permanently removed."
 *     confirmText="Delete"
 *     danger
 *     busy={deleting}
 *     onConfirm={handleDelete}
 *     onCancel={() => setConfirmOpen(false)}
 *   />
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">{title}</h3>
        {message && <p className="confirm-message">{message}</p>}

        <div className="confirm-actions">
          <button type="button" className="confirm-btn-cancel" onClick={onCancel} disabled={busy}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-btn-confirm ${danger ? "is-danger" : ""}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}