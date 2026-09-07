import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./SearchPage.css";
import { searchBlogs, searchUsers } from "../../Services/SearchService";
import BlogCard from "../../Components/Blog/BlogCard"; 
import FollowButton from "../../Components/Blog/FollowButton";
import SearchSidebar from "../../Components/Search/SearchSidebar";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [tab, setTab] = useState("stories");
  const [blogs, setBlogs] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setBlogs([]);
      setPeople([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([searchBlogs(query), searchUsers(query)])
      .then(([blogRes, userRes]) => {
        setBlogs(blogRes.data.data || []);
        setPeople(userRes.data.data || []);
      })
      .catch(() => {
        setBlogs([]);
        setPeople([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-layout">
      <main className="search-main">
        <h1 className="search-page-title">
          Results for <strong>{query}</strong>
        </h1>

        <div className="search-tabs">
          <button className={tab === "stories" ? "is-active" : ""} onClick={() => setTab("stories")}>
            Stories
          </button>
          <button className={tab === "people" ? "is-active" : ""} onClick={() => setTab("people")}>
            People
          </button>
        </div>

        {loading ? (
          <div className="search-loading">Searching…</div>
        ) : tab === "stories" ? (
          blogs.length === 0 ? (
            <p className="search-empty">No stories found for "{query}".</p>
          ) : (
            <div className="search-blog-list">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )
        ) : people.length === 0 ? (
          <p className="search-empty">No people found for "{query}".</p>
        ) : (
          <div className="search-people-full-list">
            {people.map((person) => (
              <div key={person._id} className="search-people-full-item">
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
              </div>
            ))}
          </div>
        )}
      </main>

      <aside className="search-sidebar-slot">
        <SearchSidebar query={query} people={people} />
      </aside>
    </div>
  );
}