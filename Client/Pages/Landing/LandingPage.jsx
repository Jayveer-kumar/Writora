import SearchInput from "../../Components/Ui/SearchInput";
import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

import BlogHorizontalCardList from "../../Components/Blog/BlogHorizontalCardList";
import FeaturesSection from "../../Components/Ui/FeaturesSection";
import StayTuned from "../../Components/Ui/StayTuned";
import WhyChooseWritora from "../../Components/Ui/WhyChooseWritora";
import FooterSection from "../../Components/Ui/FooterSection";
import { getAllBlog } from "../../Services/BlogService";
import { CATEGORIES } from "../../src/Constants/categories";
import BlogCardSkeleton from "../../Components/Blog/BlogCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const VISIBLE_COUNT = 5;
  const primaryCategories = CATEGORIES.slice(0, VISIBLE_COUNT);
  const extraCategories = CATEGORIES.slice(VISIBLE_COUNT);
  const hasMore = extraCategories.length > 0;

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllBlog();
      setAllBlogs(res.data.blogs);
      console.log("Server response  : ", res);
    } catch (err) {
      console.error("Some Error occured while fetching blogs..");
      setError(err.message || "Some Error occured while fetching blogs... ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchInput.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = () => {
    console.log(email);
    setEmail("");
  };

  const handleSearchSubmit = (e) => {
    return;
  };

  return (
    <div className="LandingPage min-h-[100vh] flex flex-col items-center justify-center px-4 py-16 bg-brand-bg transition-colors duration-300">
      {/* 1. Main Heading */}
      <div className="max-w-4xl text-center space-y-5 mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-brand-text tracking-tighter leading-tight">
          Write your <span className="text-brand-accent italic">ideas</span> and{" "}
          <br />
          <span className="bg-gradient-to-r from-brand-accent to-brand-green bg-clip-text text-transparent">
            spread to the world.
          </span>
        </h1>

        {/* 2. Subtitle / Suitable Text */}
        <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Writora is the place where thoughts turn into stories. Join a
          community of curious minds and share your unique perspective with
          millions.
        </p>
      </div>

      {/* 3. Search Input Section */}
      <div className="w-full max-w-2xl mb-5">
        <SearchInput
          onHandleSearch={handleSearchSubmit}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
        <span className="flex items-center gap-1 text-sm font-semibold text-brand-muted mr-2">
          <TrendingUp className="w-4 h-4 text-brand-green" /> Trending:
        </span>

        {/* Hamesha visible categories — inko animate karne ki zaroorat nahi */}
        {primaryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border
        ${
          selectedCategory === cat
            ? "bg-brand-text text-brand-bg border-brand-text"
            : "border-brand-border text-brand-text hover:bg-brand-surface hover:border-brand-accent"
        }`}
          >
            {cat}
          </button>
        ))}

        
        <AnimatePresence>
          {showAllCategories &&
            extraCategories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.8, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -6 }}
                transition={{ duration: 0.2, delay: i * 0.03 }} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium border cursor-pointer
            ${
              selectedCategory === cat
                ? "bg-brand-text text-brand-bg border-brand-text"
                : "border-brand-border text-brand-text hover:bg-brand-surface hover:border-brand-accent"
            }`}
              >
                {cat}
              </motion.button>
            ))}
        </AnimatePresence>

        {hasMore && (
          <button
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium border border-dashed border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent transition-colors duration-300 cursor-pointer"
          >
            {showAllCategories ? "Show less" : "See more"}
            <motion.span
              animate={{ rotate: showAllCategories ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>
        )}
      </div>

      {/* Blog Lists Section */}

      {loading ? (
        Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
      ) : (
        <BlogHorizontalCardList allBlogs={filteredBlogs} />
      )}

      {/* Feature Section */}

      <FeaturesSection />

      {/* Why Choose Writora Section  */}

      <WhyChooseWritora />

      {/* Stay Tuned Section  */}

      <StayTuned
        value={email}
        onHandleSubscribe={handleSubscribe}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Footer section */}

      <FooterSection />
    </div>
  );
}
