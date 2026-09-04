import './BlogReadSkeleton.css'

function BlogReadSkeleton() {
  return (
    <article className="blogread">
      <div className="blogread-cover sk-shimmer" />

      <div className="blogread-container">
        <div className="sk-title-line sk-shimmer" />
        <div className="sk-title-line sk-shimmer" style={{ width: '70%' }} />

        <div className="blogread-meta">
          <div className="sk-avatar sk-shimmer" />
          <div className="blogread-meta-text">
            <div className="sk-line sk-shimmer" style={{ width: '120px', height: '13px' }} />
            <div className="sk-line sk-shimmer" style={{ width: '160px', height: '11px', marginTop: '6px' }} />
          </div>
        </div>

        <div className="blogread-actionbar">
          <div className="sk-pill sk-shimmer" />
          <div className="sk-pill sk-shimmer" />
          <div className="sk-pill sk-shimmer" />
        </div>

        <div className="blogread-content">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="sk-para-line sk-shimmer"
              style={{ width: i % 3 === 2 ? '60%' : '100%' }}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

export default BlogReadSkeleton