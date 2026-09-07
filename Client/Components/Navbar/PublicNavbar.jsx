import { Menu, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import MobileSidebar from "../Sidebar/MobileSidebar";

export default function PublicNavbar() {
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 770);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth > 770);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: 1, name: "Our Story", link: "/about" },
    { id: 2, name: "Membership", link: "/membership" },
    { id: 3, name: "Write", link: "/write" },
    { id: 4, name: "Signin", link: "/auth?currentAction=login" },
  ];

  const toggleMode = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <nav className="PublicNavbar shadow-lg sticky top-0 z-50 flex h-16 items-center justify-between  border-brand-border bg-brand-bg px-8  transition-colors duration-300">
      <Link to={"/"}>
      <div className="logo  ">
        <h2 className="text-3xl font-bold text-brand-text tracking-tight cursor-pointer">
          Writora
        </h2>
      </div>
      </Link>

      {isDesktopView ? (
        <>
          <div className="nav-right nav-right-desktop  flex items-center gap-2 text-brand-text ">
            <button
              onClick={toggleMode}
              className=" darkModeButton  cursor-pointer p-2  text-gray-500 hover:text-gray-400 rounded-full relative"
            >
              <Sun className="w-6 h-6" />
            </button>

            {menuItems.map((item) => (
              <Link className=" p-2   " key={item.id} to={item.link}>
                <span className="  transition-colors"> {item.name} </span>
              </Link>
            ))}

            <Link to={"/auth?currentAction=signup"} >
             <button className="border cursor-pointer bg-brand-surface text-brand-primary px-4 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition-transform active:scale-95 ">
              {" "}
              <span>Get Started </span>
            </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="nav-mobile .nav-right-mobile flex items-center justify-end gap-5 flex-1 ">
          <button
            onClick={toggleMode}
            className="p-2 text-gray-500 cursor-pointer "
          >
            <Sun className="w-6 h-6" />
          </button>

          <Menu
            className="w-6 h-6 cursor-pointer text-brand-text"
            onClick={() => setSidebarVisible(true)}
          />

          <MobileSidebar
            visible={sidebarVisible}
            onHide={() => setSidebarVisible(false)}
          />
        </div>
      )}
    </nav>
  );
}
