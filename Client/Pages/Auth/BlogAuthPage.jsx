// import { useState, useEffect } from "react";
// import { Eye, EyeOff, ArrowLeft, ArrowRight, Quote } from "lucide-react";
// import { useSearchParams } from "react-router-dom";
// import { LoginUser } from "../../Services/AuthService";

// /**
//  * Editorial auth screen for a blog app.
//  *
//  * Palette (map these to your CSS vars):
//  *   ink        #121212  -> --color-brand-text
//  *   ink-soft   #6B6B6B  -> --color-brand-muted
//  *   paper      #FFFFFF  -> --color-brand-bg
//  *   line       #E6E4DF  -> --color-brand-border
//  *   ink-hover  #2A2A2A  -> --color-brand-green-hover (reused as the single accent)
//  *   press      #0B0B0B  -> right panel background
//  *
//  * True monochrome on purpose — no accent color. The only "color" is the
//  * inversion between the paper-white form panel and the ink-black quote panel.
//  */

// const QUOTES = [
//   {
//     text: "I stopped scrolling and started reading again. This is the first blog I've followed post to post in years.",
//     name: "Ananya Rao",
//     role: "Reader, since 2023",
//   },
//   {
//     text: "Publishing here feels like writing in a notebook someone actually wants to read. No noise, just words.",
//     name: "Dev Malhotra",
//     role: "Writer, 40+ essays",
//   },
//   {
//     text: "The kind of place you bookmark and actually come back to. Clean, fast, and it never gets in the way of the writing.",
//     name: "Sara Iqbal",
//     role: "Reader, since 2024",
//   },
// ];

// export default function BlogAuthPage() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [formData , setFormData] = useState({
//     fullName : "",
//     email : "",
//     password : ""
//   })

//   const handleInputChange = (e) => {
//     const {name , value} = e.target;
//     setFormData(prev =>({...prev , [name]:value}));
//   }

//   const handleLoginClick = async () =>{
//     console.log("Login Clicked : ");
//   }

//   const handleSignupClick = async () => {
//     console.log("Sign up Clicked : ");
//   }

//   const mode = searchParams.get("currentAction") || "login";

//   // Change login , signup mode
//   const handleChangeMode = (newMode) => {
//     setSearchParams({currentAction : newMode});
//   }

//   const [showPassword, setShowPassword] = useState(false);

//   const [quoteIndex, setQuoteIndex] = useState(0);

//   useEffect(() => {
//     const t = setInterval(
//       () => setQuoteIndex((i) => (i + 1) % QUOTES.length),
//       6000
//     );
//     return () => clearInterval(t);
//   }, []);

//   const goQuote = (dir) => {
//     setQuoteIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);
//   };

//   const q = QUOTES[quoteIndex];

//   return (
//     <div className="min-h-screen w-full flex" style={{ background: "#FFFFFF" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
//         .font-display { font-family: 'Fraunces', serif; }
//         .font-body { font-family: 'Inter', sans-serif; }
//       `}</style>

//       {/* LEFT — form panel */}
//       <div className="w-full lg:w-[46%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 font-body">
//         <div className="w-full max-w-sm mx-auto">
//           {/* wordmark */}
//           <div className="flex items-center gap-2 mb-10">
//             <div
//               className="w-7 h-7 rounded-sm flex items-center justify-center font-display font-semibold text-sm"
//               style={{ background: "#121212", color: "#FFFFFF" }}
//             >
//               M
//             </div>
//             <span className="font-display text-lg" style={{ color: "#121212" }}>
//               The Margin
//             </span>
//           </div>

//           {/* mode tabs */}
//           <div
//             className="inline-flex p-1 rounded-full mb-8"
//             style={{ background: "#F4F3F0" }}
//           >
//             {["login", "signup"].map((m) => (
//               <button
//                 key={m}
//                 onClick={() => handleChangeMode(m)}
//                 className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
//                 style={
//                   mode === m
//                     ? { background: "#121212", color: "#FFFFFF" }
//                     : { background: "transparent", color: "#6B6B6B" }
//                 }
//               >
//                 {m === "login" ? "Log in" : "Sign up"}
//               </button>
//             ))}
//           </div>

//           <h1
//             className="font-display text-3xl leading-tight mb-2"
//             style={{ color: "#121212" }}
//           >
//             {mode === "login" ? "Welcome back." : "Start writing."}
//           </h1>
//           <p className="text-sm mb-8" style={{ color: "#6B6B6B" }}>
//             {mode === "login"
//               ? "Enter your details to pick up where you left off."
//               : "Create an account to publish and follow writers you like."}
//           </p>

//           <form
//             className="space-y-4"
//             onSubmit={(e) => e.preventDefault()}
//           >
//             {mode === "signup" && (
//               <Field label="Full name" type="text" placeholder="Enter your full name" />
//             )}
//             <Field label="Email address" type="email" placeholder="Enter your email address" />

//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="text-sm font-medium" style={{ color: "#121212" }}>
//                   Password
//                 </label>
//                 {mode === "login" && (
//                   <a
//                     href="#"
//                     className="text-xs font-medium underline underline-offset-2"
//                     style={{ color: "#6B6B6B" }}
//                   >
//                     Forgot password?
//                   </a>
//                 )}
//               </div>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 pr-10"
//                   style={{
//                     border: "1px solid #E6E4DF",
//                     color: "#121212",
//                     background: "transparent",
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#121212")}
//                   onBlur={(e) => (e.target.style.borderColor = "#E6E4DF")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((s) => !s)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                   style={{ color: "#6B6B6B" }}
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-90"
//               style={{ background: "#121212", color: "#FFFFFF" }}
//             >
//               {mode === "login" ? "Log in" : "Create account"}
//             </button>
//           </form>

//           <div className="flex items-center gap-3 my-6">
//             <div className="flex-1 h-px" style={{ background: "#E6E4DF" }} />
//             <span className="text-xs" style={{ color: "#9A9A9A" }}>
//               OR
//             </span>
//             <div className="flex-1 h-px" style={{ background: "#E6E4DF" }} />
//           </div>

//           <button
//             className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-colors duration-200"
//             style={{ border: "1px solid #E6E4DF", color: "#121212" }}
//           >
//             <svg width="16" height="16" viewBox="0 0 48 48">
//               <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
//               <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
//               <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.4 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
//               <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.7 5.4-6.9 6.5l6.3 5.3C38.6 37.5 44 31.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
//             </svg>
//             Continue with Google
//           </button>

//           <p className="text-center text-sm mt-8" style={{ color: "#6B6B6B" }}>
//             {mode === "login" ? "New here? " : "Already have an account? "}
//             <button
//               onClick={() => setMode(mode === "login" ? "signup" : "login")}
//               className="font-medium underline underline-offset-2"
//               style={{ color: "#121212" }}
//             >
//               {mode === "login" ? "Sign up" : "Log in"}
//             </button>
//           </p>
//         </div>
//       </div>

//       {/* RIGHT — editorial quote panel, hidden on small screens */}
//       <div
//         className="hidden lg:flex lg:w-[54%] relative overflow-hidden p-14 flex-col justify-between"
//         style={{ background: "#0B0B0B" }}
//       >
//         {/* faint ruled lines, referencing a manuscript page */}
//         <div
//           className="absolute inset-0 opacity-[0.06]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(0deg, transparent, transparent 39px, #FFFFFF 40px)",
//           }}
//         />

//         <div className="relative">
//           <span
//             className="font-body text-xs tracking-[0.2em] uppercase"
//             style={{ color: "#7A7A7A" }}
//           >
//             From the readers
//           </span>
//         </div>

//         <div className="relative max-w-md">
//           <Quote size={40} strokeWidth={1.2} style={{ color: "#3A3A3A" }} />
//           <p
//             key={quoteIndex}
//             className="font-display text-2xl leading-snug mt-4 mb-8"
//             style={{ color: "#F5F4F1" }}
//           >
//             {q.text}
//           </p>
//           <div className="mb-1 font-body text-sm font-medium" style={{ color: "#FFFFFF" }}>
//             {q.name}
//           </div>
//           <div className="font-body text-xs" style={{ color: "#7A7A7A" }}>
//             {q.role}
//           </div>
//         </div>

//         <div className="relative flex items-center justify-between">
//           <span className="font-body text-xs" style={{ color: "#7A7A7A" }}>
//             {String(quoteIndex + 1).padStart(2, "0")} / {String(QUOTES.length).padStart(2, "0")}
//           </span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => goQuote(-1)}
//               className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
//               style={{ border: "1px solid #333333", color: "#F5F4F1" }}
//             >
//               <ArrowLeft size={15} />
//             </button>
//             <button
//               onClick={() => goQuote(1)}
//               className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
//               style={{ border: "1px solid #333333", color: "#F5F4F1" }}
//             >
//               <ArrowRight size={15} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, type, placeholder }) {
//   return (
//     <div>
//       <label className="text-sm font-medium mb-1.5 block" style={{ color: "#121212" }}>
//         {label}
//       </label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
//         style={{ border: "1px solid #E6E4DF", color: "#121212", background: "transparent" }}
//         onFocus={(e) => (e.target.style.borderColor = "#121212")}
//         onBlur={(e) => (e.target.style.borderColor = "#E6E4DF")}
//       />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Quote,
  Loader2,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoginUser, SignupUser } from "../../Services/AuthService";
import useAuthStore from "../../Store/authStore";

/**
 * Editorial auth screen for a blog app.
 *
 * Palette (map these to your CSS vars):
 *   ink        #121212  -> --color-brand-text
 *   ink-soft   #6B6B6B  -> --color-brand-muted
 *   paper      #FFFFFF  -> --color-brand-bg
 *   line       #E6E4DF  -> --color-brand-border
 *   ink-hover  #2A2A2A  -> --color-brand-green-hover (reused as the single accent)
 *   press      #0B0B0B  -> right panel background
 */

const QUOTES = [
  {
    text: "I stopped scrolling and started reading again. This is the first blog I've followed post to post in years.",
    name: "Ananya Rao",
    role: "Reader, since 2023",
  },
  {
    text: "Publishing here feels like writing in a notebook someone actually wants to read. No noise, just words.",
    name: "Dev Malhotra",
    role: "Writer, 40+ essays",
  },
  {
    text: "The kind of place you bookmark and actually come back to. Clean, fast, and it never gets in the way of the writing.",
    name: "Sara Iqbal",
    role: "Reader, since 2024",
  },
];

export default function BlogAuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {login} = useAuthStore()

  const mode = searchParams.get("currentAction") || "login";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // field-level errors
  const [formError, setFormError] = useState(""); // top-level / server error
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear that field's error as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (formError) setFormError("");
  };

  // Change login / signup mode — also reset the form + errors so stale
  // data/errors from one mode don't leak into the other
  const handleChangeMode = (newMode) => {
    setSearchParams({ currentAction: newMode });
    setFormData({ fullName: "", email: "", password: "" });
    setErrors({});
    setFormError("");
  };

  const validate = () => {
    const next = {};
    if (mode === "signup" && !formData.fullName.trim()) {
      next.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      next.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      next.email = "Enter a valid email address";
    }
    if (!formData.password) {
      next.password = "Password is required";
    } else if (mode === "signup" && formData.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setFormError("");

    try {
      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const response =
        mode === "login" ? await LoginUser(payload) : await SignupUser(payload);

      // Adjust these keys to whatever shape your backend actually returns.
      const { token, user } = response.data;
      if(token && user) {
        login(user , token);        
      }
      navigate("/home"); // send them to the home/dashboard route after auth

      
    } catch (err) {
      // Adjust to match your API's error response shape
      console.log(err);
      console.dir(err);
      const message =
        err?.response?.data?.message ||
        (mode === "login"
          ? "Invalid email or password."
          : "Could not create your account. Try again.");
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setQuoteIndex((i) => (i + 1) % QUOTES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  const goQuote = (dir) => {
    setQuoteIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);
  };

  const q = QUOTES[quoteIndex];

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#FFFFFF" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* LEFT — form panel */}
      <div className="w-full lg:w-[46%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 font-body">
        <div className="w-full max-w-sm mx-auto">
          {/* wordmark */}
          <div className="flex items-center gap-2 mb-10">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center font-display font-semibold text-sm"
              style={{ background: "#121212", color: "#FFFFFF" }}
            >
              M
            </div>
            <span className="font-display text-lg" style={{ color: "#121212" }}>
              The Margin
            </span>
          </div>

          {/* mode tabs */}
          <div
            className="inline-flex p-1 rounded-full mb-8"
            style={{ background: "#F4F3F0" }}
          >
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleChangeMode(m)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
                style={
                  mode === m
                    ? { background: "#121212", color: "#FFFFFF" }
                    : { background: "transparent", color: "#6B6B6B" }
                }
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1
            className="font-display text-3xl leading-tight mb-2"
            style={{ color: "#121212" }}
          >
            {mode === "login" ? "Welcome back." : "Start writing."}
          </h1>
          <p className="text-sm mb-8" style={{ color: "#6B6B6B" }}>
            {mode === "login"
              ? "Enter your details to pick up where you left off."
              : "Create an account to publish and follow writers you like."}
          </p>

          {/* top-level / server error */}
          {formError && (
            <div
              className="text-sm rounded-lg px-3.5 py-2.5 mb-4"
              style={{ background: "#FBEAEA", color: "#B3261E" }}
            >
              {formError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {mode === "signup" && (
              <Field
                label="Full name"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
              />
            )}

            <Field
              label="Email address"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#121212" }}
                >
                  Password
                </label>
                {mode === "login" && (
                  <a
                    href="#"
                    className="text-xs font-medium underline underline-offset-2"
                    style={{ color: "#6B6B6B" }}
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 pr-10"
                  style={{
                    border: `1px solid ${errors.password ? "#B3261E" : "#E6E4DF"}`,
                    color: "#121212",
                    background: "transparent",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#121212")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.password
                      ? "#B3261E"
                      : "#E6E4DF")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6B6B6B" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "#B3261E" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "#121212", color: "#FFFFFF" }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "#E6E4DF" }} />
            <span className="text-xs" style={{ color: "#9A9A9A" }}>
              OR
            </span>
            <div className="flex-1 h-px" style={{ background: "#E6E4DF" }} />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-colors duration-200"
            style={{ border: "1px solid #E6E4DF", color: "#121212" }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.4 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.7 5.4-6.9 6.5l6.3 5.3C38.6 37.5 44 31.5 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm mt-8" style={{ color: "#6B6B6B" }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={() =>
                handleChangeMode(mode === "login" ? "signup" : "login")
              }
              className="font-medium underline underline-offset-2"
              style={{ color: "#121212" }}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT — editorial quote panel, hidden on small screens */}
      <div
        className="hidden lg:flex lg:w-[54%] relative overflow-hidden p-14 flex-col justify-between"
        style={{ background: "#0B0B0B" }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, #FFFFFF 40px)",
          }}
        />

        <div className="relative">
          <span
            className="font-body text-xs tracking-[0.2em] uppercase"
            style={{ color: "#7A7A7A" }}
          >
            From the readers
          </span>
        </div>

        <div className="relative max-w-md">
          <Quote size={40} strokeWidth={1.2} style={{ color: "#3A3A3A" }} />
          <p
            key={quoteIndex}
            className="font-display text-2xl leading-snug mt-4 mb-8"
            style={{ color: "#F5F4F1" }}
          >
            {q.text}
          </p>
          <div
            className="mb-1 font-body text-sm font-medium"
            style={{ color: "#FFFFFF" }}
          >
            {q.name}
          </div>
          <div className="font-body text-xs" style={{ color: "#7A7A7A" }}>
            {q.role}
          </div>
        </div>

        <div className="relative flex items-center justify-between">
          <span className="font-body text-xs" style={{ color: "#7A7A7A" }}>
            {String(quoteIndex + 1).padStart(2, "0")} /{" "}
            {String(QUOTES.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => goQuote(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ border: "1px solid #333333", color: "#F5F4F1" }}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={() => goQuote(1)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ border: "1px solid #333333", color: "#F5F4F1" }}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, name, placeholder, value, onChange, error }) {
  return (
    <div>
      <label
        className="text-sm font-medium mb-1.5 block"
        style={{ color: "#121212" }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
        style={{
          border: `1px solid ${error ? "#B3261E" : "#E6E4DF"}`,
          color: "#121212",
          background: "transparent",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#121212")}
        onBlur={(e) =>
          (e.target.style.borderColor = error ? "#B3261E" : "#E6E4DF")
        }
      />
      {error && (
        <p className="text-xs mt-1" style={{ color: "#B3261E" }}>
          {error}
        </p>
      )}
    </div>
  );
}
