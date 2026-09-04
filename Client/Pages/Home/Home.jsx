import BlogCard from "../../Components/Blog/BlogCard"

import { useState , useEffect } from "react";
import { getAllBlog } from "../../Services/BlogService.js";
import BlogCardSkeleton from "../../Components/Blog/BlogCardSkeleton.jsx";

export default function Home(){
    const [ loading , setLoading ] = useState(false);
    const [ error , setError ] = useState("");
    const [ allBlog , setAllBlog ] = useState([]);

    useEffect(()=>{
       const fetchAllBlog = async () =>{
        try {
        setLoading(true);
        setError("");
        const allB = await getAllBlog();
        console.log(allB);
        setAllBlog(allB.data.blogs);
       } catch (err) {
         console.error("Some Error in Home.jsx while fetching all blog : ",err);
         setError(
          err.response?.data?.message ||
          err.message ||
          "Some Error while fetching blogs..."
        );
       } finally {
        // setLoading(false);
        setTimeout(()=>{
            setLoading(false);
        },2000)
       }
       }
       fetchAllBlog();
    },[])

    return    <div className="Home bg-brand-bg ">
        {
            loading? Array.from({ length : 6}).map((_,i) => <BlogCardSkeleton key={i} />)
            : allBlog.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        }
    </div>
}