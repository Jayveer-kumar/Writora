import BlogWriteForm from './BlogWriteForm';
import {useNavigate} from "react-router-dom";
import { publishBlog } from '../../../Services/BlogService';
import { useToast } from '../../../Components/Ui/AlertToast';

function WriteBlogPage() {
  const navigate = useNavigate();  
  const toast = useToast();
  const handleCancel = () => {
    // navigate wapas kahi aur
    navigate('/home');
  };

  const handleSaveDraft = async ({ title, content }) => {
    // title aur content already tumhe mil gaya BlogWriteForm se
    try {
      await fetch('/api/blogs/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, status: 'draft' }),
      });
      alert('Draft saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async ({ title, content , category }) => {
    console.log("Recieved Blog Title : ");
    console.log(title);
    console.log("Recieved Content : ");
    console.log(content);
    if(!category.trim()){
      toast.error("Please Select Category Before Publishing the story!.");
      return;
    }

    try {
      const res = await publishBlog(title , content , category);
      toast.success(res.message || "Blog Published Successfully!...");
      console.log("Data is Saved Successfully : Let's celibrate this moment!");
      console.log(res);
      // navigate()
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      toast.error(err.response?.data?.error || err.message);
    }

  };

  return (
    <BlogWriteForm
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onSubmit={handleSubmit}
    />
  );
}

export default WriteBlogPage;