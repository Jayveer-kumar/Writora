import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSuggestedAuthors } from "../../Services/AuthService";
import FollowButton from "../Blog/FollowButton";

export default function WhoToFollow() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuggestedAuthors()
      .then((res) => setAuthors(res.data.data || []))
      .catch(() => setAuthors([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && authors.length === 0) return null;

  return (
    <div className="sidebar-section">
      <h4 className="sidebar-heading">Who to follow</h4>

      {loading ? (
        <div className="sidebar-skeleton-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sidebar-skeleton-row" />
          ))}
        </div>
      ) : (
        <ul className="whotofollow-list">
          {authors.map((author) => (
            <li key={author._id} className="whotofollow-item">
              <Link to={`/profile/${author._id}`} className="whotofollow-avatar-link">
                <img src={author.avatar} alt={author.name} className="whotofollow-avatar" />
              </Link>
              <div className="whotofollow-info">
                <Link to={`/profile/${author._id}`} className="whotofollow-name">
                  {author.name}
                </Link>
                <span className="whotofollow-sub">{author.followerCount} followers</span>
              </div>
              <FollowButton
                authorId={author._id}
                authorName={author.name}
                initialIsFollowing={false}
                initialNotifyByEmail={false}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}