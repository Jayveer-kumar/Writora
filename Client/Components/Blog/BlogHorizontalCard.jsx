import { useState } from "react";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import SearchInput from "../../Components/Ui/SearchInput";

// 1. Single Blog Card Component (Props oriented)
export default function BlogHorizontalCard({ image, title, description, readTime, postDate, category }) {
  return (
    <div className="group flex flex-col md:flex-row gap-6 p-4 rounded-3xl border border-brand-border bg-brand-bg hover:bg-brand-hover hover:shadow-[var(--card-shadow)] transition-all duration-300 cursor-pointer mb-6">
      
      {/* Image Section */}
      <div className="w-full md:w-56 h-44 shrink-0 overflow-hidden rounded-2xl border border-brand-border">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between py-1 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-md">
              {category}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-brand-text mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-brand-muted text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-brand-muted font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {postDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {readTime}
            </span>
          </div>
          <span className="flex items-center gap-0.5 text-brand-text font-bold group-hover:translate-x-1 transition-transform">
            Read More <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}