import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, MailX, UserMinus, Check } from "lucide-react";
import { followUser, unfollowUser, toggleFollowNotification } from "../../Services/AuthService";
import {useToast} from "../Ui/AlertToast"
import "./FollowButton.css";

/**
 * FollowButton
 *
 * Props:
 *  - authorId          : string  (the blog author's user id)
 *  - authorName        : string  (used in toast messages)
 *  - initialIsFollowing: boolean (from blog.followState.isFollowing)
 *  - initialNotifyByEmail: boolean (from blog.followState.notifyByEmail)
 *
 * Usage in BlogRead.jsx:
 *   <FollowButton
 *     authorId={blog?.authorId?._id}
 *     authorName={blog?.authorId?.name}
 *     initialIsFollowing={followState?.isFollowing}
 *     initialNotifyByEmail={followState?.notifyByEmail}
 *   />
 */
export default function FollowButton({
  authorId,
  authorName,
  initialIsFollowing = false,
  initialNotifyByEmail = false,
}) {
  const toast = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [notifyByEmail, setNotifyByEmail] = useState(initialNotifyByEmail);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const wrapperRef = useRef(null);

  // keep in sync if the blog data arrives/changes after mount
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
    setNotifyByEmail(initialNotifyByEmail);
  }, [initialIsFollowing, initialNotifyByEmail]);

  // close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleMainClick = async () => {
    if (busy) return;

    // not following yet -> single click directly follows (no dropdown needed)
    if (!isFollowing) {
      setBusy(true);
      try {
        await followUser(authorId);
        setIsFollowing(true);
        setNotifyByEmail(true);
        toast.success(`You're now following ${authorName || "this author"}`);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Couldn't follow. Try again.");
      } finally {
        setBusy(false);
      }
      return;
    }

    // already following -> toggle the dropdown
    setDropdownOpen((open) => !open);
  };

  const handleToggleNotification = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await toggleFollowNotification(authorId);
      const newValue = res?.data?.data?.notifyByEmail;
      setNotifyByEmail(newValue);
      toast.success(newValue ? "Email notifications turned on" : "Email notifications turned off");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't update notification setting.");
    } finally {
      setBusy(false);
    }
  };

  const handleUnfollow = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await unfollowUser(authorId);
      setIsFollowing(false);
      setDropdownOpen(false);
      toast.success(`Unfollowed ${authorName || "author"}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't unfollow. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!authorId) return null;

  return (
    <div className="followbtn-wrapper" ref={wrapperRef}>
      <button
        type="button"
        onClick={handleMainClick}
        disabled={busy}
        className={`followbtn ${isFollowing ? "followbtn-following" : "followbtn-follow"}`}
      >
        {isFollowing ? "Following" : "Follow"}
        {isFollowing && <ChevronDown size={14} className={`followbtn-chevron ${dropdownOpen ? "is-open" : ""}`} />}
      </button>

      {dropdownOpen && isFollowing && (
        <div className="followbtn-dropdown">
          <button
            type="button"
            className="followbtn-dropdown-item"
            onClick={handleToggleNotification}
            disabled={busy}
          >
            {notifyByEmail ? <Mail size={15} /> : <MailX size={15} />}
            <span>Email notifications</span>
            {notifyByEmail && <Check size={14} className="followbtn-check" />}
          </button>

          <div className="followbtn-dropdown-divider" />

          <button
            type="button"
            className="followbtn-dropdown-item followbtn-dropdown-danger"
            onClick={handleUnfollow}
            disabled={busy}
          >
            <UserMinus size={15} />
            <span>Unfollow</span>
          </button>
        </div>
      )}
    </div>
  );
}