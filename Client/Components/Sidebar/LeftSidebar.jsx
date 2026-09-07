import { Link , NavLink } from "react-router-dom";
import { User, House, BookmarkCheck, NotebookText, ChartNoAxesColumnDecreasing } from "lucide-react";
import useAuthStore from "../../Store/authStore";

export default function LeftSidebar() { 
  const currentUser = useAuthStore((state) => state.user);
  const menuItems = [
    { name: "Home", path: "/home", icon: <House size={20} /> },
    { name: "Library", path: "/library", icon: <BookmarkCheck size={20} /> },
    { name: "Your Story", path: "/yourstory", icon: <NotebookText size={20} /> },
    { name: "Profile", path: `/profile/${currentUser?._id}`, icon: <User size={20} /> },
    { name: "Stats", path: "/stats", icon: <ChartNoAxesColumnDecreasing size={20} /> },
  ];

  return (
    // bg-brand-bg (Humaara variable) aur border-brand-border use kiya hai
    <div className="LeftSidebar  h-full w-64 bg-brand-bg text-brand-text border-r border-brand-border/10 p-4 transition-colors duration-300">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            // className={`  flex items-center gap-3 p-3 rounded-lg hover:bg-brand-hover/20 transition-colors`}
            className={({isActive})=> `flex items-center gap-3 p-3 rounded-lg transition-colors 
            ${isActive ? " dark:bg-stone-700 bg-stone-200 " : "text-brand-text hover:bg-brand-hover/10"}
            ` }
          >
            <span >{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
