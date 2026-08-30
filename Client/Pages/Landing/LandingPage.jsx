import SearchInput from "../../Components/Ui/SearchInput";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

import BlogHorizontalCardList from "../../Components/Blog/BlogHorizontalCardList";
import FeaturesSection from "../../Components/Ui/FeaturesSection";
import StayTuned from "../../Components/Ui/StayTuned";
import WhyChooseWritora from "../../Components/Ui/WhyChooseWritora";
import FooterSection from "../../Components/Ui/FooterSection";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email , setEmail] = useState("")
  const categories = ["All", "Technology", "Cricket", "Economics",  "Health"];

    const allBlogs = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence in 2024",
      description: "Exploring how LLMs and generative AI are reshaping the creative industry and software development forever.",
      category: "Technology",
      readTime: "5 min read",
      postDate: "Oct 12, 2023",
      image: "https://www.shutterstock.com/image-photo/ai-brain-processes-big-data-260nw-2675851087.jpg"
    },
    {
      id: 2,
      title: "Why Economics is Shifting Towards Digital Assets",
      description: "A deep dive into how decentralized finance is challenging traditional banking systems globally.",
      category: "Economics",
      readTime: "8 min read",
      postDate: "Sep 28, 2023",
      image: "https://internationalbanker.com/wp-content/uploads/2019/06/Chart_1.png"
    }
  ];

  const filteredBlogs = allBlogs.filter((blog)=>{
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase())||
                          blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  })

  const handleSubscribe = () =>{
    console.log(email);
    setEmail("");
  }

  const handleSearch = () =>{
    console.log(searchQuery);
    setSearchQuery("");
  }

  return (
    <div className="LandingPage min-h-[100vh] flex flex-col items-center justify-center px-4 py-16 bg-brand-bg transition-colors duration-300">
      
      {/* 1. Main Heading */}
      <div className="max-w-4xl text-center space-y-5 mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-brand-text tracking-tighter leading-tight">
          Write your <span className="text-brand-accent italic">ideas</span> and <br /> 
          <span className="bg-gradient-to-r from-brand-accent to-brand-green bg-clip-text text-transparent">
            spread to the world.
          </span>
        </h1>

        {/* 2. Subtitle / Suitable Text */}
        <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Writora is the place where thoughts turn into stories. Join a community of curious 
          minds and share your unique perspective with millions.
        </p>
      </div>

      {/* 3. Search Input Section */}
      <div className="w-full max-w-2xl mb-5">
        <SearchInput onHandleSearch={handleSearch} value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}      />
      </div>

      {/* 4. Trending Topics / Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
        <span className="flex items-center gap-1 text-sm font-semibold text-brand-muted mr-2">
          <TrendingUp className="w-4 h-4 text-brand-green" /> Trending:
        </span>
        
        {categories.map((cat, index) => (
          <button 
            key={index}
            onClick={ () => setSelectedCategory(cat) }
            className={ ` px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border 
                ${ selectedCategory === cat
                    ? " bg-brand-text text-brand-bg border-brand-text " 
                    : " border-brand-border text-brand-text hover:bg-brand-hover hover:border-brand-accent "
                 }  ` }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Lists Section */}
 
      <BlogHorizontalCardList blogList={filteredBlogs} />

      {/* Feature Section */}

      <FeaturesSection />

      {/* Why Choose Writora Section  */}

      <WhyChooseWritora />

      {/* Stay Tuned Section  */}

      <StayTuned value={email} onHandleSubscribe={handleSubscribe} onChange={(e)=> setEmail(e.target.value)}  />

      

      {/* Footer section */}

      <FooterSection />



    </div>
  );
}
