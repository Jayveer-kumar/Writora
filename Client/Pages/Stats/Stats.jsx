import { useEffect, useState } from "react";
import "./Stats.css";
import { getAuthorStats } from "../../Services/AuthService";
import StatsChart from "../../Components/stats/StatsChart";
import { ChevronDown, ArrowUp } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Stats() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState("stories");

  useEffect(() => {
    setLoading(true);
    getAuthorStats(month, year)
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [month, year]);

  // pichhle 6 mahine ki list dropdown ke liye
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return { month: d.getMonth() + 1, year: d.getFullYear() };
  });

  const handleSelectMonth = (m, y) => {
    setMonth(m);
    setYear(y);
    setPickerOpen(false);
  };

  const daysElapsed = new Date().toISOString().slice(0, 7) === `${year}-${String(month).padStart(2, "0")}`
    ? new Date().getDate()
    : new Date(year, month, 0).getDate();
  const rangeLabel = `${MONTH_NAMES[month - 1]} 1, ${year} – ${
    new Date().getMonth() + 1 === month && new Date().getFullYear() === year
      ? "Today"
      : `${daysElapsed} ${MONTH_NAMES[month - 1]}`
  } (UTC)`;

  return (
    <div className="stats-page">
      <h1 className="stats-title">Stats</h1>

      <div className="stats-tabs">
        <button className={tab === "stories" ? "is-active" : ""} onClick={() => setTab("stories")}>
          Stories
        </button>
        <button className={tab === "audience" ? "is-active" : ""} onClick={() => setTab("audience")}>
          Audience
        </button>
      </div>

      {tab === "stories" ? (
        <>
          <div className="stats-monthly-header">
            <div>
              <h2 className="stats-monthly-title">Monthly</h2>
              <span className="stats-monthly-range">{rangeLabel} · Updated hourly</span>
            </div>

            <div className="stats-month-picker">
              <button className="stats-month-btn" onClick={() => setPickerOpen((o) => !o)}>
                {MONTH_NAMES[month - 1]} {year}
                <ChevronDown size={14} />
              </button>
              {pickerOpen && (
                <div className="stats-month-dropdown">
                  {monthOptions.map((opt) => (
                    <button key={`${opt.month}-${opt.year}`} onClick={() => handleSelectMonth(opt.month, opt.year)}>
                      {MONTH_NAMES[opt.month - 1]} {opt.year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="stats-loading">Loading stats…</div>
          ) : (
            <>
              <div className="stats-summary-row">
                <StatCard label="Views" value={stats?.totalViewsThisMonth ?? 0} />
                <StatCard label="Likes" value={stats?.totalLikes ?? 0} />
                <StatCard label="Comments" value={stats?.totalComments ?? 0} />
                <StatCard
                  label="Followers"
                  value={stats?.followersGained ?? 0}
                  delta={stats?.followersGained > 0}
                />
                <StatCard label="Stories" value={stats?.totalStories ?? 0} />
              </div>

              <StatsChart data={stats?.dailyViews || []} />
            </>
          )}
        </>
      ) : (
        <div className="stats-audience-placeholder">
          Audience insights coming soon.
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, delta }) {
  return (
    <div className="stats-card">
      <div className="stats-card-value">
        {delta ? "+" : ""}
        {value}
        {delta && <ArrowUp size={14} className="stats-card-arrow" />}
      </div>
      <div className="stats-card-label">{label}</div>
    </div>
  );
}