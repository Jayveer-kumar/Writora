import { useState, useEffect, useCallback } from "react";
import { getAllBlogsOfUSer } from "../../Services/AuthService";
import useAuthStore from "../../Store/authStore";
import ReadingHistory from "./ReadingHistory";
import SavedList from "./SavedList";
import YourStoryTab from "./YourListTab";

import "./Library.css";

const tabs = ["Your List", "Saved List", "Reading History"];

export default function Library() {
  const currentUser = useAuthStore((state) => state.user);

  const [currentTab, setCurrentTab] = useState("Your List");
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStories = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      setError("");
      const res = await getAllBlogsOfUSer(currentUser._id);
      setAllStories(res?.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while fetching your stories."
      );
      setAllStories([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (currentTab === "Your List") {
      fetchStories();
    }
  }, [currentTab, fetchStories]);

  const renderTabContent = () => {
    // --- Loading state ---
    if (currentTab === "Your List" && loading) {
      return (
        <div className="lib-state-box">
          <div className="lib-spinner" />
          <p className="lib-state-text">Loading your stories...</p>
        </div>
      );
    }

    // --- Error state ---
    if (currentTab === "Your List" && error) {
      return (
        <div className="lib-state-box">
          <p className="lib-state-text lib-error-text">{error}</p>
          <button className="lib-retry-btn" onClick={fetchStories}>
            Try Again
          </button>
        </div>
      );
    }

    // --- Empty state ---
    if (currentTab === "Your List" && !loading && !error && allStories.length === 0) {
      return (
        <div className="lib-state-box">
          <div className="lib-empty-icon">📂</div>
          <p className="lib-state-text">You haven't added any stories yet.</p>
          <p className="lib-state-subtext">
            Stories you write or save will show up here.
          </p>
        </div>
      );
    }

    // --- Actual content ---
    switch (currentTab) {
      case "Your List":
        return <YourStoryTab stories={allStories} />;
      case "Saved List":
        return <SavedList />;
      case "Reading History":
        return <ReadingHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="Library">
      <div className="lib-head-box">
        <div className="lib-head">
          <h2>Your Library</h2>
          <button className="lib-new-list-btn">New</button>
        </div>

        <ul className="lib-head-switch-btns">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`lib-head-switch-btn ${
                currentTab === tab ? "lib-tab-active" : ""
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      <div className="lib-content">{renderTabContent()}</div>
    </div>
  );
}