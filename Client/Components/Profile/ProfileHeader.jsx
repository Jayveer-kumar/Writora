import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Link2, Check } from "lucide-react";
import FollowButton from "../Blog/FollowButton";
import { useToast } from "../Ui/AlertToast";

/**
 * ProfileHeader
 *
 * Props:
 *  - user            : { _id, name, avatar, bio, pronouns, followersCount, followingCount }
 *  - isOwnProfile    : boolean — decides Edit-Profile vs Follow+menu
 *  - followState     : { isFollowing, notifyByEmail } — ignored when isOwnProfile is true
 */
export default function ProfileHeader({ user, isOwnProfile, followState }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Profile link copied");
    setTimeout(() => setCopied(false), 1500);
    setMenuOpen(false);
  };

  if (!user) return null;

  return (
    <div className="profile-header">
      <img src={user.avatar} alt={user.name} className="profile-avatar" />

      <div className="profile-header-top">
        <div>
          <h1 className="profile-name">
            {user.name}
            {user.pronouns && <span className="profile-pronouns">{user.pronouns}</span>}
          </h1>

          <div className="profile-stats">
            <span>
              <strong>{user.followersCount}</strong> followers
            </span>
            <span>
              <strong>{user.followingCount}</strong> following
            </span>
          </div>
        </div>

        {/* ---------- Case 1: apna hi profile ---------- */}
        {isOwnProfile ? (
          <button
            type="button"
            className="profile-edit-btn"
            onClick={() => navigate("/settings/profile")}
          >
            Edit profile
          </button>
        ) : (
          /* ---------- Case 2: kisi aur ka profile ---------- */
          <div className="profile-actions">
            <FollowButton
              authorId={user._id}
              authorName={user.name}
              initialIsFollowing={followState?.isFollowing}
              initialNotifyByEmail={followState?.notifyByEmail}
            />

            <div className="profile-menu-wrapper" ref={menuRef}>
              <button
                type="button"
                className="profile-menu-trigger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="More options"
              >
                <MoreHorizontal size={18} />
              </button>

              {menuOpen && (
                <div className="profile-menu-dropdown">
                  <button type="button" onClick={handleCopyLink}>
                    {copied ? <Check size={14} /> : <Link2 size={14} />}
                    {copied ? "Copied!" : "Copy link to profile"}
                  </button>
                  {/* Mute / Block / Report yahan future me add kar sakte ho
                      jab backend me un features ka support ho */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {user.bio && <p className="profile-bio">{user.bio}</p>}
    </div>
  );
}