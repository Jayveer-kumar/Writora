import ActivityTab from "./ActivityTab";
import HomeTab from "./HomeTab";
import AboutTab from "./AboutTab";
import ProfileSidebar from "./ProfileSidebar";
import "./profile.css";

import { useState, useEffect } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────
const USER = {
  name: "Arjun Sharma",
  handle: "@arjun.dev",
  initials: "AS",
  bio: "Full-stack developer · Building cool things · Open source enthusiast · Coffee addict ☕",
  location: "Mumbai, India",
  joined: "March 2022",
  website: "arjun.dev",
  followers: "2.4k",
  following: 318,
  posts: 142,
};

const POSTS = [
  { tag: "React", time: "2h ago", text: "Just shipped a new feature using React Server Components — the DX is genuinely amazing. No more loading states for simple data fetches." },
  { tag: "CSS", time: "1d ago", text: "Reminder that CSS Grid + subgrid solves 80% of the layout problems we used to reach for JS for. Native is underrated." },
  { tag: "Open Source", time: "3d ago", text: "Crossed 500 GitHub stars on my side project today. Still can't believe people actually use the stuff I build 🙏" },
];

const ACTIVITY = [
  { color: "", time: "2 hours ago", text: "Posted a new update about React Server Components" },
  { color: "purple", time: "Yesterday", text: "Followed @priya.design and @rahul.codes" },
  { color: "", time: "2 days ago", text: "Liked 12 posts in the #webdev community" },
  { color: "muted", time: "4 days ago", text: "Updated profile bio and cover photo" },
  { color: "purple", time: "1 week ago", text: "Joined the Open Source India community" },
];

const SUGGESTIONS = [
  { name: "Priya Nair", role: "UI Designer", init: "PN", color: "#7b61ff" },
  { name: "Rahul Mehta", role: "Backend Dev", init: "RM", color: "#c8f04b" },
  { name: "Sneha Iyer", role: "Data Scientist", init: "SI", color: "#ff6b6b" },
];

// ── MAIN PROFILE
const TABS = ["Home", "Activity", "About"];

export default function Profile() {
  const [sidebar, setSidebar] = useState(window.innerWidth > 900);
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    const handleResized = () => setSidebar(window.innerWidth > 900);
    window.addEventListener("resize", handleResized);
    return () => window.removeEventListener("resize", handleResized);
  }, []);

  return (
    <div className="profile-root">
      <div className="profile-tab">
        {/* ── LEFT ── */}
        <div className="profile-left">

          {/* Header */}
          <div className="profile-header">
            <div className="profile-header-top">
              {/* Avatar shown only when sidebar hidden (mobile) */}
              {!sidebar && (
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "linear-gradient(135deg, #7b61ff, #c8f04b)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16, color: "#0e0e10",
                  flexShrink: 0
                }}>
                  {USER.initials}
                </div>
              )}
              <div className="profile-name-block">
                <h2  >{USER.name}</h2>
                <span>{USER.posts} posts</span>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="profile-nav">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Dynamic content */}
          <div className="profile-content">
            {activeTab === "Home"     && <HomeTab USER={USER} POSTS={POSTS} />}
            {activeTab === "Activity" && <ActivityTab />}
            {activeTab === "About"    && <AboutTab USER={USER} />}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        {sidebar && (
          <div className="profile-right">
            <ProfileSidebar user={USER} SUGGESTIONS={SUGGESTIONS} />
          </div>
        )}
      </div>
    </div>
  );
}