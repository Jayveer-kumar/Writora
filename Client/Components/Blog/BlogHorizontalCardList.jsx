import BlogCard from "./BlogCard"
import "./BlogHorizontalCardList.css"

export default function BlogHorizontalCardList({ allBlogs }) {
  return (
    <section className="bhcl-section">
      <div className="bhcl-header">
        <h2 className="bhcl-title">Latest Stories</h2>
        <span className="bhcl-count">{allBlogs.length} Stories found</span>
      </div>

      {allBlogs.length > 0 ? (
        <div className="bhcl-list">
          {allBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="bhcl-empty">
          <p className="bhcl-empty-text">
            No stories found matching your criteria. Try another keyword!
          </p>
          <p className="text-center text-brand-text" >Or SignIn to unlock more stroies...</p>
        </div>
      )}
    </section>
  )
}