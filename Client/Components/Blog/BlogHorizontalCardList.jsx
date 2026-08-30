import BlogHorizontalCard from "./BlogHorizontalCard"

export default function BlogHorizontalCardList({blogList}){
    return <section className="w-full max-w-5xl  mx-auto px-4 mt-10 blog-horizantal-card-list">
      <div className="flex items-center justify-between mb-8 border-b border-brand-border pb-4">
        <h2 className="text-2xl font-bold text-brand-text">Latest Stories</h2>
        <span className="text-sm text-brand-muted">{blogList.length} Stories found</span>
       </div>

        { blogList.length > 0 ? (
            <div className="blog">
                { blogList.map((blog) => (
                    <BlogHorizontalCard key={blog.id}  {...blog} />
                )) }
            </div>
        ) : (
            <div className="text-center py-20">
           <p className="text-brand-muted text-lg">No stories found matching your criteria. Try another keyword!</p>
         </div>
        ) }

    </section>
}