import { useEffect, useState , useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import './BlogRead.css'
import { getBlogBySlug , recordBlogView , toggleBlogLike , addComment } from '../../Services/BlogService'
import BlogRenderer from './BlogRenderer'
import BlogReadSkeleton from '../../Components/Blog/BlogReadSkeleton'
import { MessageCircle , Heart , Share2 } from "lucide-react"
import FollowButton from '../../Components/Blog/FollowButton'
import BlogComments from './BlogComments'
import  useAuthStore from "../../Store/authStore"
import ErrorState from '../../Components/Common/ErrorState/ErrorState'
import BlogOptionsMenu from '../../Components/Blog/BlogOptionMenu'
import useRequireAuth from '../../Hooks/useRequireAuth'

function BlogRead() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null);  
  const [ followState , setFollowState ] = useState(null);
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments , setComments] = useState([]);
  const [comment, setComment] = useState('')  
  const [ loading , setLoading ] = useState(false);
  const [ error , setError ] = useState("");
  const [ commentPosting , setCommentPosting ] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();

  const viewRecordedRef = useRef(false); // to prevent from double effect strictMode

  const getBlog = async (slug) =>{
       try {
        setLoading(true);
        setError("");
        const blg = await getBlogBySlug(slug);        
        setBlog(blg.data.blog);  
        setFollowState(blg.data.followState);  
        setLiked(blg.data.isLiked);
        setLikeCount(blg.data.likeCount);
        setComments(blg.data.comments || []);

        console.log("Here is Blog",blg.data.blog);
        console.log("current user : ",currentUser);

        // count blog only if blog is render and only one time
        if(!viewRecordedRef.current) {
          viewRecordedRef.current = true
          recordBlogView(blg.data.blog._id).catch(() => {}) // fail-silent , it doesn't block UI
        }
       } catch (err) {
        console.error(err || "Some Error while fetching blog");
        setError(err.message || "Some Error while fetching blog");
       } finally {
        setTimeout(()=>{
            setLoading(false);
        },2000);
       }
    }

  useEffect(()=>{    
    if(slug) getBlog(slug);
  },[slug]);

  const formattedDate = new Date(blog?.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const handleLike = () => requireAuth( async () => {
    if(!blog?._id) return
    // optimistic update - instant UI update , revert in case of fail
    const prevLiked = liked
    const prevCount = likeCount
    setLiked(!prevLiked);
    setLikeCount((c) => (prevLiked ? c -1 : c + 1 ));

    try {
      const res = await toggleBlogLike(blog._id)
      setLiked(res.data.data.isLiked)
      setLikeCount(res.data.data.likeCount)
    } catch (err) {
      setLiked(prevLiked)
      setLikeCount(prevCount);
    }

  } );

  const handlePostComment = () => requireAuth(  async () => {
    if(!comment.trim() || !blog?._id) return;
    setCommentPosting(true);
    try {
      const res = await addComment(blog._id,comment.trim())
      setComments((prev) => [res.data.data , ...prev]) // new comment on the top
      setComment('')
    } catch (err) {
      console.error(err)
    } finally {
      setCommentPosting(false);
    }
  }  );

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: blog.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if(error) {
    return (
      <ErrorState message={error} onRetry={()=> getBlog(slug)} showHomeButton={true} />
    )
  }


  return (
    <div>
      {loading ? (
        <BlogReadSkeleton />
      ) : (
        <article className="blogread">
          <div className="blogread-cover">
            <img src={blog?.coverImage} alt={blog?.title} />
          </div>

          <div className="blogread-container">
            <h1 className="blogread-title">{blog?.title}</h1>

            <div className="blogread-meta">
              <div className="blogread-meta-left">
                <img
                  className="blogread-avatar"
                  src={blog?.authorId.avatar}
                  alt={blog?.authorId.name}
                />
                <div className="blogread-meta-text">
                  <div className="blogread-author-follow-b">
                    <span className="blogread-author">
                      {blog?.authorId.name}
                    </span>
                    {currentUser?._id !== blog?.authorId?._id && (
                      <FollowButton
                        authorId={blog?.authorId?._id}
                        authorName={blog?.authorId?.name}
                        initialIsFollowing={followState?.isFollowing}
                        initialNotifyByEmail={followState?.notifyByEmail}
                      />
                    )}
                  </div>
                  <span className="blogread-meta-sub">
                    {formattedDate} · {blog?.readTime} min read ·{" "}
                    {blog?.views ?? 0} views
                  </span>
                </div>
              </div>

              {currentUser?._id === blog?.authorId?._id && (
                <BlogOptionsMenu
                  blogId={blog?._id}
                  onDeleted={() => navigate("/home")}
                />
              )}
            </div>

            {/* <div className="blogread-meta">
              <img
                className="blogread-avatar"
                src={blog?.authorId.avatar}
                alt={blog?.authorId.name}
              />
              <div className="blogread-meta-text">
                <div className="blogread-author-follow-b">
                  <span className="blogread-author">{blog?.authorId.name}</span>

                  {currentUser?._id !== blog?.authorId?._id && (
                    <FollowButton
                      authorId={blog?.authorId?._id}
                      authorName={blog?.authorId?.name}
                      initialIsFollowing={followState?.isFollowing}
                      initialNotifyByEmail={followState?.notifyByEmail}
                    />
                  )}
                </div>
                <span className="blogread-meta-sub">
                  {formattedDate} · {blog?.readTime} min read .{" "}
                  {blog?.views ?? 0} views{" "}
                </span>
              </div>
              {currentUser?._id === blog?.authorId?._id && (
                <button className='blogread-blog-edit-btn' >Edit</button>
              )}
            </div> */}

            <div className="blogread-actionbar">
              <button
                className={`blogread-action ${liked ? "is-active" : ""}`}
                onClick={handleLike}
              >
                <Heart
                  size={16}
                  fill={liked ? "#e11d48" : "none"}
                  color={liked ? "#e11d48" : "currentColor"}
                />{" "}
                {likeCount}
              </button>
              <button
                className="blogread-action"
                onClick={() =>
                  document
                    .getElementById("comments")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <MessageCircle size={16} /> Comment
              </button>
              <button className="blogread-action" onClick={handleShare}>
                <Share2 size={16} /> Share
              </button>
            </div>

            <div className="blogread-content">
              <BlogRenderer content={blog?.content} />
            </div>

            <section id="comments" className="blogread-comments">
              <h3>Comments ({comments?.length}) </h3>
              <div className="blogread-comment-input">
                <input
                  type="text"
                  placeholder="Add a comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                />
                <button
                  disabled={!comment.trim() || commentPosting}
                  onClick={handlePostComment}
                >
                  {" "}
                  {commentPosting ? "Posting..." : "Post"}{" "}
                </button>
              </div>

              <BlogComments
                comments={comments}
                setComments={setComments}
                currentUserId={currentUser?._id}
              />
            </section>
          </div>
        </article>
      )}
    </div>
  );
}

export default BlogRead