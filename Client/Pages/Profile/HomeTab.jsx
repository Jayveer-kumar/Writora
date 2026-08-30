export default function HomeTab( { USER , POSTS } ) {
       
  return (
    <>
      <div className="home-banner">
        <div className="home-banner-pattern" />
        <div className="home-avatar-wrap">
          <div className="home-avatar">{USER.initials}</div>
        </div>
      </div> 
      <div className="home-bio">
        <h3>{USER.name}</h3>
        <p>{USER.handle}</p>
        <p style={{ marginTop: 8 }}>{USER.bio}</p>
      </div>
      <div className="home-stats">
        <div className="stat-item"><strong>{USER.posts}</strong><span>Posts</span></div>
        <div className="stat-item"><strong>{USER.followers}</strong><span>Followers</span></div>
        <div className="stat-item"><strong>{USER.following}</strong><span>Following</span></div>
      </div>
      <div className="home-posts">
        {POSTS.map((p, i) => (
          <div className="post-card" key={i}>
            <div className="post-card-top">
              <span className="post-tag">{p.tag}</span>
              <span>{p.time}</span>
            </div>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}