
export default function ProfileSidebar({ user = USER , SUGGESTIONS }) { 
  return (
    <div className="profile-sidebar">
      {/* User card */}
      <div className="sidebar-card">
        <div className="sidebar-avatar-block">
          <div className="sidebar-avatar">{user.initials}</div>
          <h3>{user.name}</h3>
          <span>{user.handle}</span>
        </div>
        <button className="follow-btn">Follow</button>
      </div>

      {/* Stats */}
      <div className="sidebar-card">
        <h4>Stats</h4>
        <div className="sidebar-stat-row">
          <span>Posts</span><strong>{user.posts}</strong>
        </div>
        <div className="sidebar-stat-row">
          <span>Followers</span><strong>{user.followers}</strong>
        </div>
        <div className="sidebar-stat-row">
          <span>Following</span><strong>{user.following}</strong>
        </div>
      </div>

      {/* Suggestions */}
      <div className="sidebar-card">
        <h4>People to follow</h4>
        {SUGGESTIONS.map((s) => (
          <div className="suggest-item" key={s.name}>
            <div className="suggest-avatar" style={{ color: s.color }}>{s.init}</div>
            <div className="suggest-info">
              <strong>{s.name}</strong>
              <span>{s.role}</span>
            </div>
            <button className="suggest-follow">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}