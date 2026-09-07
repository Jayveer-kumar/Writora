import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import "./BlogOptionMenu.css";
import { deleteBlog } from "../../Services/BlogService";
import ConfirmDialog from "../Common/ConfirmDialog/ConfirmDialog";
import { useToast } from "../Ui/AlertToast";

/**
 * BlogOptionsMenu — three-dot dropdown with Edit + Delete.
 * Only render this when the logged-in user is the blog's author.
 *
 * Usage (BlogRead.jsx):
 *   <BlogOptionsMenu blogId={blog._id} onDeleted={() => navigate("/home")} />
 *
 * Usage (ProfilePage.jsx blog list — own profile):
 *   <BlogOptionsMenu blogId={blog._id} onDeleted={() => setBlogs(prev => prev.filter(b => b._id !== blog._id))} />
 */
export default function BlogOptionsMenu({ blogId, onDeleted }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const handleEdit = () => {
    setMenuOpen(false);
    navigate(`/write/${blogId}`); // same editor, edit mode — see note below
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteBlog(blogId);
      toast.success("Story deleted");
      setConfirmOpen(false);
      onDeleted?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete this story.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="blogoptions-wrapper" ref={menuRef}>
        <button
          type="button"
          className="blogoptions-trigger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Story options"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuOpen && (
          <div className="blogoptions-dropdown">
            <button type="button" onClick={handleEdit}>
              <Pencil size={14} /> Edit
            </button>
            <button
              type="button"
              className="is-danger"
              onClick={() => {
                setMenuOpen(false);
                setConfirmOpen(true);
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this story?"
        message="This can't be undone. The story and its comments will be permanently removed."
        confirmText="Delete"
        danger
        busy={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}