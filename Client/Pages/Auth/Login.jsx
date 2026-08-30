import useAuthStore from "../../Store/authStore"
import { LoginUser } from "../../Services/AuthService"
import  {Eye , EyeOff  } from "lucide-react";


import { useState } from "react";
import { Link , useNavigate } from "react-router-dom"

import googleImage from "../../src/assets/Google png img.webp"  

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [ passwordIsVisible , setPasswordIsVisible ] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await LoginUser(form);
      console.log("Recieved Data From Login Server Route : ");
      console.log(res);
      
      const { user , token } = res.data;
      
      // Store These Values
      login(user,token);
      navigate("/");


    } catch (e) {
      const msg = e.response?.data?.message; 
      console.log(msg);      
    } finally{
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google Login Clicked");
  };

  const togglePassword = () =>{
    setPasswordIsVisible(!passwordIsVisible);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-bg)] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-brand-border)] shadow-[var(--shadow-card)]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-brand-text)]">
          Welcome Back 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-brand-text border border-[var(--color-brand-border)] bg-transparent outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm"
            required
          />

          <div className="w-full flex items-center gap-1 px-2 text-white rounded-lg border border-[var(--color-brand-border)] transition-all duration-300 focus-within:border-brand-green focus-within:ring-4 focus-within:ring-[var(--green-glow)] shadow-sm " >
            <input name="password" type={ passwordIsVisible ? "text" : "password" } value={form.password} onChange={handleChange}  required className=" w-full py-2 outline-none placeholder:text-brand-muted/60 text-brand-text " placeholder="Password"  />
            { passwordIsVisible ? <Eye size={20} onClick={togglePassword} className="cursor-pointer text-brand-text " /> : <EyeOff size={20} onClick={togglePassword} className="cursor-pointer text-brand-text" /> }
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer py-2 rounded-lg bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green-hover)] transition flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-[var(--color-brand-border)]" />
          <span className="text-sm text-[var(--color-brand-muted)]">or</span>
          <div className="flex-1 h-px bg-[var(--color-brand-border)]" />
        </div>

        {/* Google Login */}

        <div className="w-full flex items-center justify-center gap-2 cursor-pointer py-2 rounded-lg text-brand-text border border-[var(--color-brand-border)] hover:bg-[var(--color-brand-hover)] transition" >
          <img src={googleImage} className=" h-6 w-6 rounded-full " alt="Google Image" />
          <span>Continue With Google</span>
        </div>

        {/* <button
          onClick={handleGoogleLogin}
          className="w-full cursor-pointer py-2 rounded-lg text-brand-text border border-[var(--color-brand-border)] hover:bg-[var(--color-brand-hover)] transition"
        >
          Continue with Google
        </button> */}


        {/* Signup Redirect */}
        <p className="text-center text-sm mt-4 text-[var(--color-brand-muted)]">
          Don't have an account?
          {/* <a href="/signup" className="text-[var(--color-brand-accent)] ml-1">
            Sign Up
          </a> */}
          <Link to="/signin" className="text-[var(--color-brand-accent)] ml-1">
          <span>Sign In</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
