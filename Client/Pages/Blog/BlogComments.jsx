import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2, X, Check } from "lucide-react";
import "./BlogComments.css";
import { updateComment, deleteComment } from "../../Services/BlogService";
import { useToast } from "../../Components/Ui/AlertToast";

/**
 * BlogComments
 *
 * Props:
 *  - comments       : array of comment objects
 *  - setComments    : setter from BlogRead, used to reflect edit/delete locally
 *  - currentUserId  : logged-in user's id — three-dot menu only shows on own comments
 *
 * Usage in BlogRead.jsx:
 *   <BlogComments comments={comments} setComments={setComments} currentUserId={currentUser?._id} />
 */
const BlogComments = ({ comments = [], setComments, currentUserId }) => {
  return (
    <section className="blogread-comments">
      <div className="blogread-comments-header">
        <h3 className="blogread-comments-title">
          Comments
          <span className="blogread-comments-count">{comments.length}</span>
        </h3>
      </div>

      {comments.length === 0 ? (
        <div className="blogread-comments-empty">
          <div className="blogread-comments-empty-icon">💬</div>
          <h4>No comments yet</h4>
          <p>Be the first one to share your thoughts.</p>
        </div>
      ) : (
        <div className="blogread-comment-list">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              isOwner={currentUserId && c.authorId?._id === currentUserId}
              onUpdated={(updated) =>
                setComments((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))
              }
              onDeleted={(id) =>
                setComments((prev) => prev.filter((x) => x._id !== id))
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};

function CommentItem({ comment, isOwner, onUpdated, onDeleted }) {
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [busy, setBusy] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const startEdit = () => {
    setEditText(comment.text);
    setEditing(true);
    setMenuOpen(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditText(comment.text);
  };

  const saveEdit = async () => {
    if (!editText.trim() || busy) return;
    setBusy(true);
    try {
      const res = await updateComment(comment.blogId, comment._id, editText.trim());
      onUpdated(res.data.data);
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't update comment.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await deleteComment(comment.blogId , comment._id);
      onDeleted(comment._id);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete comment.");
      setBusy(false);
    }
  };

  return (
    <div className="blogread-comment-item">
      <img
        src={comment.authorId?.avatar || "/default-avatar.png"}
        alt={comment.authorId?.name || "User"}
        className="blogread-comment-avatar"
      />

      <div className="blogread-comment-content">
        <div className="blogread-comment-top">
          <p className="blogread-comment-author">
            {comment.authorId?.name || "Anonymous"}
            {isOwner && (
              <span className="blogread-comment-authorTag">Author</span>
            )}
          </p>

          {isOwner && !editing && (
            <div className="blogread-comment-menu" ref={menuRef}>
              <button
                type="button"
                className="blogread-comment-menu-trigger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Comment options"
              >
                <MoreHorizontal size={16} />
              </button>

              {menuOpen && (
                <div className="blogread-comment-menu-dropdown">
                  <button type="button" onClick={startEdit}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={handleDelete}
                    disabled={busy}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="blogread-comment-edit">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="blogread-comment-edit-actions">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={busy}
                className="is-cancel"
              >
                <X size={14} /> Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={busy || !editText.trim()}
                className="is-save"
              >
                <Check size={14} /> {busy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="blogread-comment-text">
            {comment.text}
            {comment.edited && (
              <span className="blogread-comment-edited-tag"> (edited)</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default BlogComments;