import { Link } from 'react-router-dom'
import './BlogCard.css'




function EyeIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
}
function CommentIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>
}
function HeartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
}

function BlogCard({ blog }) {
  const date = new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <Link to={`/blog/${blog.slug}`} className="blogcard">
      <div className="blogcard-media">
        <img src={blog.coverImage} alt={blog.title} />
        <img
          className="blogcard-avatar"
          src={blog.authorId.avatar}
          // src='https://s3-eu-west-1.amazonaws.com/blog-ecotree/blog/0001/01/ad46dbb447cd0e9a6aeecd64cc2bd332b0cbcb79.jpeg'
          alt={blog.authorId.name}
          // alt='Test'
        />
        <span className="blogcard-readtime">{blog.readTime} min Read</span>
      </div>

      <div className="blogcard-content">
        <div>
          <span className="blogcard-tag">
            {blog.category} 
          </span>
          <h3 className="blogcard-title">{blog.title}</h3>
          {/* <p className="blogcard-desc">{blog.description} Hello </p> */}
          <p className="blogcard-desc">{blog.excerpt} </p>
        </div>

        <div className="blogcard-meta">
          <span><EyeIcon /> {blog.views} 300 </span>
          <span><CommentIcon /> {blog.commentsCount} 30 </span>
          <span><HeartIcon /> {blog.likesCount} 100 </span>
          <span className="blogcard-date">{date}</span>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard