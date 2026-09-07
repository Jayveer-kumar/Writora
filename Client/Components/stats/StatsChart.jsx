/**
 * StatsChart — lightweight custom bar chart, no chart library dependency.
 *
 * Props:
 *  - data: [{ date: "2026-09-01", count: number }, ...]
 */
export default function StatsChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.count), 1); // avoid divide-by-zero
  const width = 900;
  const height = 220;
  const barGap = 4;
  const barWidth = data.length ? width / data.length - barGap : 0;

  return (
    <div className="stats-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="stats-chart-svg" preserveAspectRatio="none">
        {/* baseline */}
        <line x1="0" y1={height - 20} x2={width} y2={height - 20} stroke="var(--border-color, #e6e4df)" strokeWidth="1" />

        {data.map((d, i) => {
          const barHeight = (d.count / max) * (height - 40);
          const x = i * (barWidth + barGap);
          const y = height - 20 - barHeight;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="2"
                fill={d.count > 0 ? "var(--accent-color, #121212)" : "var(--border-color, #eeece7)"}
              >
                <title>{`${d.date}: ${d.count} views`}</title>
              </rect>
            </g>
          );
        })}
      </svg>

      <div className="stats-chart-labels">
        <span>{data[0]?.date?.slice(8)}</span>
        <span>{data[Math.floor(data.length / 2)]?.date?.slice(8)}</span>
        <span>{data[data.length - 1]?.date?.slice(8)}</span>
      </div>
    </div>
  );
}