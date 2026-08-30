export default function ActivityTab() {
  const ACTIVITY = [
  { color: "", time: "2 hours ago", text: "Posted a new update about React Server Components" },
  { color: "purple", time: "Yesterday", text: "Followed @priya.design and @rahul.codes" },
  { color: "", time: "2 days ago", text: "Liked 12 posts in the #webdev community" },
  { color: "muted", time: "4 days ago", text: "Updated profile bio and cover photo" },
  { color: "purple", time: "1 week ago", text: "Joined the Open Source India community" },
];  
  return (
    <div className="activity-list">
      {ACTIVITY.map((a, i) => (
        <div className="activity-item" key={i}>
          <div className={`activity-dot ${a.color}`} />
          <div className="activity-text">
            <p>{a.text}</p>
            <span>{a.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}