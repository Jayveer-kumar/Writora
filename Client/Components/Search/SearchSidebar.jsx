import { Link } from "react-router-dom";
import { CATEGORIES } from "../../src/Constants/categories";
import FollowButton from "../Blog/FollowButton";

/**
 * SearchSidebar
 *
 * Props:
 *  - query: string — current search term
 *  - people: array of user objects (already fetched by parent)
 */
export default function SearchSidebar({ query, people = [] }) {
  const matchingTopics = query
    ? CATEGORIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : [];

  if (matchingTopics.length === 0 && people.length === 0) return null;

  return (
    <div className="search-sidebar">
      {matchingTopics.length > 0 && (
        <div className="search-sidebar-section">
          <h4 className="search-sidebar-heading">Topics matching {query}</h4>
          <div className="search-topic-pills">
            {matchingTopics.map((topic) => (
              <Link key={topic} to={`/home?category=${encodeURIComponent(topic)}`} className="search-topic-pill">
                {topic}
              </Link>
            ))}
          </div>
        </div>
      )}

      {people.length > 0 && (
        <div className="search-sidebar-section">
          <h4 className="search-sidebar-heading">People matching {query}</h4>
          <ul className="search-people-list">
            {people.slice(0, 3).map((person) => (
              <li key={person._id} className="search-people-item">
                <Link to={`/profile/${person._id}`} className="search-people-link">
                  <img src={person.avatar} alt={person.name} className="search-people-avatar" />
                  <div className="search-people-info">
                    <span className="search-people-name">{person.name}</span>
                    {person.bio && <span className="search-people-bio">{person.bio}</span>}
                  </div>
                </Link>
                <FollowButton
                  authorId={person._id}
                  authorName={person.name}
                  initialIsFollowing={false}
                  initialNotifyByEmail={false}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}