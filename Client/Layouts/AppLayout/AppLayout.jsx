import Navbar from "../../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../../Components/Sidebar/LeftSidebar";
import RightSidebar from "../../Components/Sidebar/RightSidebar";
import LeftMobileSidebar from "../../Components/Sidebar/LeftMobileSidebar";

import { useState , useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function AppLayout() {

  const [sidebarOpen , setSidebarOpen ] = useState(true);
  const [mobileLeftSidebar , setMobileLeftSidebar] = useState(false);
  const [isMobile , setIsMobile] = useState(window.innerWidth<1080);
  const [ isRightSidebar , setIsRightSidebar ] = useState(true);
  const location = useLocation();
  const hideSidebar = location.pathname === "/write";
  useEffect(()=>{
    if(location.pathname === "/home"){
      setIsRightSidebar(true);
    }else{
      setIsRightSidebar(false);
    }
  },[location.pathname])

  useEffect(()=>{
    const handleResized = () =>{
      setIsMobile(window.innerWidth<1080);
    }
    window.addEventListener("resize",handleResized);
    return () => window.removeEventListener("resize",handleResized);
  },[]);

  const handleToggle = ()=> {
    if(isMobile){
      setMobileLeftSidebar(prev => !prev);
    } else{
      setSidebarOpen(prev => !prev);
    }
  }

  

  return (
    <>
      <div className="AppLayout">
        <Navbar toggle={handleToggle} />
        <div className="main-layout-box" style={{ display: "flex" }}>
          {/* Desktop Sidebar */}
          {!isMobile && !hideSidebar && (
            <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
              <LeftSidebar />
            </div>
          )}

          {/* Mobile Sidebar (Overlay) */}
          {isMobile && !hideSidebar && (
            <LeftMobileSidebar
              visible={mobileLeftSidebar}
              onClose={() => setMobileLeftSidebar(false)}
            />
          )}

          <main id="main-content" style={{ flex: 1 }} className="bg-brand-bg">
            <Outlet />
          </main>

          {/* { isRightSidebar && <RightSidebar /> } */}

          {/* Right Sidebar (FIXED) */}
          {isRightSidebar && !isMobile && (
            <div className="right-sidebar-container">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </>
  );
}