import { useState, useEffect, useCallback, useRef } from "react";
import { getUserStoriesByStatus } from "../../Services/AuthService"; // apna hi banao
import useAuthStore from "../../Store/authStore";
import "./Stories.css";

const tabs = ["Drafts", "Scheduled", "Published", "Unlisted", "Submissions"];

export default function Stories() {
  const currentUser = useAuthStore((state) => state.user);

  const [currentTab, setCurrentTab] = useState("Drafts");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  const fetchStories = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      setError("");
      const res = await getUserStoriesByStatus(currentUser._id, currentTab.toLowerCase());
      setStories(res?.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while fetching your stories."
      );
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id, currentTab]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // close "..." menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action, story) => {
    setOpenMenuId(null);
    // tum yaha apna edit/delete/publish handlers laga lena
    console.log(action, story);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="stry-state-box">
          <div className="stry-spinner" />
          <p className="stry-state-text">Loading your stories...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="stry-state-box">
          <p className="stry-state-text stry-error-text">{error}</p>
          <button className="stry-retry-btn" onClick={fetchStories}>
            Try Again
          </button>
        </div>
      );
    }

    if (!stories || stories.length === 0) {
      return (
        <div className="stry-state-box">
          <div className="stry-empty-icon">📝</div>
          <p className="stry-state-text">
            No {currentTab.toLowerCase()} stories yet.
          </p>
          <p className="stry-state-subtext">
            {currentTab === "Drafts"
              ? "Start writing and your drafts will show up here."
              : `Stories you ${currentTab.toLowerCase()} will appear here.`}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="stry-table-head">
          <span className="stry-col-latest">Latest</span>
          <span className="stry-col-pub">Publication</span>
          <span className="stry-col-status">Status</span>
        </div>

        <div className="stry-list">
          {stories.map((story) => (
            <div className="stry-row" key={story._id || story.id}>
              <div className="stry-row-main">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="stry-thumb"
                  />
                ) : (
                  <div className="stry-thumb stry-thumb-placeholder" />
                )}

                <div className="stry-info">
                  <h3 className="stry-title">{story.title || "Untitled"}</h3>
                  <p className="stry-meta">
                    {story.readTime ? `${story.readTime} min read` : "1 min read"}
                    {story.wordCount ? ` (${story.wordCount} words)` : ""}
                    {" · "}
                    Updated{" "}
                    {story.updatedAt
                      ? formatRelativeDate(story.updatedAt)
                      : "recently"}
                  </p>
                </div>
              </div>

              <div className="stry-col-pub">
                <span className="stry-pub-text">
                  {story.publication || "—"}
                </span>
              </div>

              <div className="stry-col-status">
                <span className="stry-status-text">
                  {story.status || currentTab}
                </span>
              </div>

              <div className="stry-row-menu" ref={openMenuId === (story._id || story.id) ? menuRef : null}>
                <button
                  className="stry-menu-btn"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === (story._id || story.id)
                        ? null
                        : story._id || story.id
                    )
                  }
                >
                  •••
                </button>

                {openMenuId === (story._id || story.id) && (
                  <div className="stry-dropdown">
                    <button onClick={() => handleAction("edit", story)}>
                      Edit
                    </button>
                    <button onClick={() => handleAction("view-stats", story)}>
                      View stats
                    </button>
                    <button onClick={() => handleAction("duplicate", story)}>
                      Duplicate
                    </button>
                    <button
                      className="stry-danger"
                      onClick={() => handleAction("delete", story)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="Stories">
      <div className="stry-head">
        <h2>Stories</h2>
        <button className="stry-import-btn">Import a story</button>
      </div>

      <ul className="stry-tabs">
        {tabs.map((tab) => (
          <li
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`stry-tab ${currentTab === tab ? "stry-tab-active" : ""}`}
          >
            {tab}
          </li>
        ))}
      </ul>

      <div className="stry-content">{renderContent()}</div>
    </div>
  );
}

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}