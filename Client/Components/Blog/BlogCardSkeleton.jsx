import './BlogCardSkeleton.css'

function BlogCardSkeleton() {
  return (
    <div className="blogcard-skeleton">
      <div className="sk-media sk-shimmer" />
      <div className="sk-content">
        <div>
          <div className="sk-tag sk-shimmer" />
          <div className="sk-title-line sk-shimmer" />
          <div className="sk-title-line short sk-shimmer" />
          <div className="sk-desc-line sk-shimmer" />
          <div className="sk-desc-line short sk-shimmer" />
        </div>
        <div className="sk-meta">
          <div className="sk-meta-pill sk-shimmer" />
          <div className="sk-meta-pill sk-shimmer" />
          <div className="sk-meta-pill sk-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default BlogCardSkeleton