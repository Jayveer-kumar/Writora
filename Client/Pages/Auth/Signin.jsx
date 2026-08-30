import { useState , useRef, useEffect } from "react";
import { Link } from "react-router-dom"
import googleImage from "../../src/assets/Google png img.webp"
export default function Signin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    imageFile: null,
    imageUrl: "",
  });

  const fileInputRef = useRef(null);

  const handleCustomFileInputClick = () =>{
    fileInputRef.current.click();
  }

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file, imageUrl: "" });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrl = (e) => {
    const url = e.target.value;
    setForm({ ...form, imageUrl: url, imageFile: null });
    setPreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In Clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-bg)] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-brand-border)] shadow-[var(--shadow-card)]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-brand-text)]">
          Create your account
        </h2>

        {/* Preview */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-[var(--color-brand-hover)] overflow-hidden">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full text-brand-text p-2 rounded-lg border  border-[var(--color-brand-border)] bg-transparent outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm "
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full text-brand-text p-2 rounded-lg border border-[var(--color-brand-border)] bg-transparent outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full text-brand-text p-2 rounded-lg border border-[var(--color-brand-border)] bg-transparent outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm"
            required
          />

          {/* Image Upload */}
          <div>
            <label className="text-sm text-[var(--color-brand-muted)]">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={form.imageUrl !== ""}
              // className="w-full text-sm text-[var(--color-brand-muted)] mt-1 outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm"
              className="hidden"
            />
            {/* Custom Button Clicked */}
            <button
              type="button"
              onClick={handleCustomFileInputClick}
              disabled={form.imageUrl !== ""}
              className="w-full cursor-pointer text-sm py-2 px-4 bg-white border border-gray-300 rounded-md text-[var(--color-brand-muted)] transition-all duration-300 hover:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] shadow-sm disabled:opacity-50"
            >
              {/* { form.imageUrl ? "Image Uploaded" :"Select Image" } */}
              {form.imageFile
                ? "Image Uploaded"
                : form.imageUrl
                  ? "URL Provided"
                  : "Select Image"}
            </button>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm text-[var(--color-brand-muted)]">
              Or Image URL
            </label>
            <input
              type="text"
              placeholder="Paste image link"
              value={form.imageUrl}
              onChange={handleImageUrl}
              disabled={form.imageFile !== null}
              className="w-full text-brand-text p-2 mt-1 rounded-lg border border-[var(--color-brand-border)] bg-transparent outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer py-2 rounded-lg bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green-hover)] transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-[var(--color-brand-border)]" />
          <span className="text-sm text-[var(--color-brand-muted)]">or</span>
          <div className="flex-1 h-px bg-[var(--color-brand-border)]" />
        </div>

        {/* Google Sign In */}

        <div className="w-full flex items-center justify-center gap-2 cursor-pointer py-2 rounded-lg text-brand-text border border-[var(--color-brand-border)] hover:bg-[var(--color-brand-hover)] transition">
          <img
            src={googleImage}
            className=" h-6 w-6 rounded-full "
            alt="Google Image"
          />
          <span>Continue With Google</span>
        </div>

        {/* Login Redirect */}
        <p className="text-center text-sm mt-4 text-[var(--color-brand-muted)]">
          Already have an account?
          {/* <a href="/login" className="text-[var(--color-brand-accent)] ml-1">
            Login
          </a> */}
          <Link to="/login" className="text-[var(--color-brand-accent)] ml-1">
            <span>Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
