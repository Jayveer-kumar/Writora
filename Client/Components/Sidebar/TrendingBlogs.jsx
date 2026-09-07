import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrendingBlogs } from "../../Services/BlogService";

export default function TrendingBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingBlogs()
      .then((res) => setBlogs(res.data.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && blogs.length === 0) return null; // kuch bhi trending nahi to section hi mat dikhao

  return (
    <div className="sidebar-section">
      <h4 className="sidebar-heading">Trending</h4>

      {loading ? (
        <div className="sidebar-skeleton-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sidebar-skeleton-line" />
          ))}
        </div>
      ) : (
        <ul className="trending-list">
          {blogs.map((blog, i) => (
            <li key={blog._id} className="trending-item">
              <span className="trending-rank">{i + 1}</span>
              <div className="trending-body">
                <Link to={`/blog/${blog.slug}`} className="trending-title">
                  {blog.title}
                </Link>
                <span className="trending-meta">
                  {blog.authorId?.name} · {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}