import { Menu, Search, PenSquare, Bell, User , Sun ,Moon } from "lucide-react";
import useAuthStore from "../../Store/authStore";
import ProfileDropdown from "./ProfileDropdown";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useState , useEffect } from "react";

export default function Navbar({ toggle  }) {
  const { user, logout } = useAuthStore();
  // const { isDark , setIsDark } = useState(()=>{
  //   return localStorage.getItem("theme") === "dark";
  // });

  const [ isDark , setIsDark ] = useState(localStorage.getItem("theme")==="dark");

  useEffect(()=>{
    if(isDark){
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme","dark");
    }else{
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme","light");
    }
  },[isDark])

  const openDropdown = useRef(null);

  const toggleMode = ()=>{
    setIsDark(!isDark);
  };

  // const toggleMode = () => {
  //   document.documentElement.classList.toggle("dark");
  //   const isDark = document.documentElement.classList.contains("dark");
  //   localStorage.setItem("theme", isDark ? "dark" : "light");
  // };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b  border-brand-border/10 bg-brand-bg px-4 md:px-8 transition-colors duration-300">
      
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle} 
          className="cursor-pointer  text-gray-500 hover:text-gray-800 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6 text-brand-text" />
        </button>
        <h2 className="text-3xl font-bold text-brand-text tracking-tight cursor-pointer">
          Writora
        </h2>
      </div>

      {/* Center: Search Bar (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search stories..."
            className="w-full rounded-full border border-brand-border bg-brand-bg py-2 pl-10 pr-4 text-brand-text focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
          />
        </div>
      </div>

      {/* Right: Write, Notifications, Profile */}
     
      <div className="flex items-center gap-2 md:gap-5">

         <button onClick={toggleMode} className=" darkModeButton  cursor-pointer p-2  text-brand-text hover:text-brand-hover rounded-full relative">
          
          {/* <Sun className="w-6 h-6" /> */}
          { isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" /> }

        </button>

        <Link to="/write" >
        <button className=" cursor-pointer hidden sm:flex items-center gap-2  text-brand-text hover:text-brand-hover font-medium">
          <PenSquare className="w-5 h-5" />
          <span className="hidden lg:inline">Write</span>
        </button>
        </Link>

        
        <button className=" cursor-pointer p-2  text-brand-text hover:text-brand-hover rounded-full relative">
          <Bell className="w-6 h-6" />
          {/* <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-bg"></span> */}
        </button>

        <div onClick={(e)=> openDropdown.current.toggle(e)} className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer overflow-hidden border border-brand-border">
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <ProfileDropdown ref={openDropdown} />
        </div>
      </div>
    </nav>
  );
}
