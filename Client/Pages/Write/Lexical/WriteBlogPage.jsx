// import BlogWriteForm from './BlogWriteForm';
// import {useNavigate} from "react-router-dom";
// import { publishBlog } from '../../../Services/BlogService';
// import { useToast } from '../../../Components/Ui/AlertToast';

// function WriteBlogPage() {
//   const navigate = useNavigate();  
//   const toast = useToast();
//   const handleCancel = () => {
//     // navigate wapas kahi aur
//     navigate('/home');
//   };

//   const handleSaveDraft = async ({ title, content }) => {
//     // title aur content already tumhe mil gaya BlogWriteForm se
//     try {
//       await fetch('/api/blogs/draft', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title, content, status: 'draft' }),
//       });
//       alert('Draft saved!');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSubmit = async ({ title, content , category }) => {
//     console.log("Recieved Blog Title : ");
//     console.log(title);
//     console.log("Recieved Content : ");
//     console.log(content);
//     if(!category.trim()){
//       toast.error("Please Select Category Before Publishing the story!.");
//       return;
//     }

//     try {
//       const res = await publishBlog(title , content , category);
//       toast.success(res.message || "Blog Published Successfully!...");
//       console.log("Data is Saved Successfully : Let's celibrate this moment!");
//       console.log(res);
//       navigate("/home")
//     } catch (err) {
//       console.error(err.response?.data?.error || err.message);
//       toast.error(err.response?.data?.error || err.message);
//     }

//   };

//   return (
//     <BlogWriteForm
//       onCancel={handleCancel}
//       onSaveDraft={handleSaveDraft}
//       onSubmit={handleSubmit}
//     />
//   );
// }

// export default WriteBlogPage;



import { useEffect, useState } from 'react';
import BlogWriteForm from './BlogWriteForm';
import { useNavigate, useParams } from "react-router-dom";
import { publishBlog, getBlogForEdit, updateBlog } from '../../../Services/BlogService';
import { useToast } from '../../../Components/Ui/AlertToast';

function WriteBlogPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { blogId } = useParams();
  const isEditMode = Boolean(blogId);

  const [initialData, setInitialData] = useState(null); // { title, content, category }
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const res = await getBlogForEdit(blogId);
        const blog = res.data.data;
        setInitialData({
          title: blog.title,
          content: blog.content, // Lexical JSON string, jaisa hai waisa hi
          category: blog.category,
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Couldn't load this story for editing.");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleCancel = () => {
    navigate(isEditMode ? `/blog/${blogId}` : '/home');
    // note: agar edit mode me slug chahiye redirect ke liye, blog.slug bhi initialData me save kar lena
  };

  const handleSaveDraft = async ({ title, content, category }) => {
    try {
      if (isEditMode) {
        await updateBlog(blogId, { title, content, category, status: 'draft' });
      } else {
        await publishBlog(title, content, category, 'draft'); // apna publishBlog signature check kar lena
      }
      toast.success('Draft saved!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save draft.');
    }
  };

  const handleSubmit = async ({ title, content, category }) => {
    if (!category?.trim()) {
      toast.error("Please Select Category Before Publishing the story!.");
      return;
    }

    try {
      if (isEditMode) {
        const res = await updateBlog(blogId, { title, content, category, status: 'published' });
        toast.success("Story updated successfully!");
        navigate(`/blog/${res.data.data.slug}`);
      } else {
        const res = await publishBlog(title, content, category);
        toast.success(res.message || "Blog Published Successfully!...");
        navigate("/home");
      }
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      toast.error(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div className="write-loading">Loading your story…</div>; // apna skeleton bhi laga sakte ho

  return (
    <BlogWriteForm
      key={blogId || "new"} // 👈 zaroori — edit se new pe navigate karo to form fresh-mount ho
      initialTitle={initialData?.title}
      initialContent={initialData?.content}
      initialCategory={initialData?.category}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onSubmit={handleSubmit}
    />
  );
}

export default WriteBlogPage;