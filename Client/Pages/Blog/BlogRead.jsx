import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './BlogRead.css'
import { getBlogBySlug } from '../../Services/BlogService'
import BlogRenderer from './BlogRenderer'
import BlogReadSkeleton from '../../Components/Blog/BlogReadSkeleton'
import { MessageCircle , Heart , Share2 } from "lucide-react"
import FollowButton from '../../Components/Blog/FollowButton'

function BlogRead() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment] = useState('')
  const [ loading , setLoading ] = useState(false);
  const [ followState , setFollowState ] = useState(null);
  const [ error , setError ] = useState("");


  useEffect(()=>{
    const getBlog = async (slug) =>{
       try {
        setLoading(true);
        setError("");
        const blg = await getBlogBySlug(slug);
        console.log("Blog is Recieved : ",blg); 
        
        setBlog(blg.data.blog);  
        setFollowState(blg.data.followState);    
       } catch (err) {
        console.error(err || "Some Error while fetching blog");
        setError(err.message || "Some Error while fetching blog");
       } finally {
        setTimeout(()=>{
            setLoading(false);
        },2000);
       }
    }
    if(slug) getBlog(slug);
  },[slug]);

  const formattedDate = new Date(blog?.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: blog.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div>
    {loading? <BlogReadSkeleton /> : 
    <article className="blogread">
      <div className="blogread-cover">
        <img src={blog?.coverImage} alt={blog?.title} />
      </div>

      <div className="blogread-container">
        <h1 className="blogread-title">{blog?.title}</h1>

        <div className="blogread-meta">
          <img
            className="blogread-avatar"
            src={blog?.authorId.avatar}
            alt={blog?.authorId.name}
          />
          <div className="blogread-meta-text">
            <div  className='blogread-author-follow-b' >
              <span className="blogread-author">{blog?.authorId.name}</span>
              {/* <button className="blogread-author-follow-btn" > Follow </button> */}
              <FollowButton 
              authorId={blog?.authorId?._id}
              authorName={blog?.authorId?.name}
              initialIsFollowing={followState?.isFollowing}
              initialNotifyByEmail={followState?.notifyByEmail}
              />
            </div>
            <span className="blogread-meta-sub">{formattedDate} · {blog?.readTime} min read</span>
          </div>
        </div>

        <div className="blogread-actionbar">
          <button
            className={`blogread-action ${liked ? 'is-active' : ''}`}
            onClick={() => { setLiked(!liked); setLikeCount(c => liked ? c - 1 : c + 1) }}
          >
            <Heart size={16} /> {likeCount}
          </button>
          <button className="blogread-action" onClick={() => document.getElementById('comments')?.scrollIntoView({behavior:'smooth'})}>
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
          <h3>Comments</h3>
          <div className="blogread-comment-input">
            <input
              type="text"
              placeholder="Add a comment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button disabled={!comment.trim()}>Post</button>
          </div>
        </section>
      </div>
    </article>
    }
    </div>
  )
}

export default BlogRead