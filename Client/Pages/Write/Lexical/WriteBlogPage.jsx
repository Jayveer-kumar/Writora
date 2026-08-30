import BlogWriteForm from './BlogWriteForm';
import {useNavigate} from "react-router-dom"

function WriteBlogPage() {
  const navigate = useNavigate();  
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

  const handleSubmit = async ({ title, content }) => {
    console.log("Recieved Blog Title : ");
    console.log(title);
    console.log("Recieved Content : ");
    console.log(content);

    // try {
    //   await fetch('/api/blogs/publish', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ title, content, status: 'published' }),
    //   });
    //   navigate('/home');
    // } catch (err) {
    //   console.error(err);
    // }

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