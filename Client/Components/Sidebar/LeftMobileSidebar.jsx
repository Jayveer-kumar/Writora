import { Link , NavLink } from "react-router-dom";
import {
  User,
  House,
  BookmarkCheck,
  NotebookText,
  ChartNoAxesColumnDecreasing,
  X, // Close icon ke liye
} from "lucide-react";
import { Sidebar } from "primereact/sidebar";

export default function LeftMobileSidebar({ visible, onClose }) {
  const menuItems = [
    { name: "Home", path: "/home", icon: <House size={22} /> },
    { name: "Library", path: "/library", icon: <BookmarkCheck size={22} /> },
    { name: "Your Story", path: "/yourstory", icon: <NotebookText size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
    { name: "Stats", path: "/stats", icon: <ChartNoAxesColumnDecreasing size={22} /> },
  ];

  const customHeader = (
    <div className="flex bg-brand-bg  dark:bg-stone-900 items-center justify-between w-full px-3 pt-2">
      <h2 className="text-3xl px-3 font-bold text-brand-text tracking-tight cursor-pointer">
        Writora
      </h2>

      <button 
        onClick={onClose} 
        className="p-2 cursor-pointer rounded-full hover:bg-brand-hover/20 text-brand-text transition-colors"
      >
        <X size={28} />
      </button>
    </div>
  );

  return (
    <Sidebar
      visible={visible}
      onHide={onClose}
      header={customHeader}
      showCloseIcon={false}
      className="w-[220px] text-brand-text bg-brand-bg  dark:bg-stone-900 border-r border-brand-border shadow-[10px_0_30px_-5px_rgba(0,0,0,0.1)] dark:shadow-[10px_0_30px_-5px_rgba(0,0,0,0.5)]"
      pt={{
        header: { className: "bg-brand-bg p-0" },
        content: { className: "p-0 px-4" },
      }}
    >
      <div className="flex flex-col h-full  text-brand-text">
        {/* Divider line logo ke niche */}
        <div className="mt-4 border-b border-brand-border/50"></div>

        {/* Menu List */}
        <nav className="flex flex-col gap-2 mt-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              // className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-hover/10 text-brand-text transition-all active:scale-95 group"
              className={({
                isActive,
              }) => `flex items-center gap-3 p-3 rounded-xl transition-all 
            ${isActive ? " dark:bg-stone-700 bg-stone-200 " : "text-brand-text hover:bg-brand-hover/10"}
            `}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Version Footer */}
        <div className="mt-auto pb-6 text-[10px] text-brand-muted uppercase tracking-widest opacity-50">
          Writora Engine v1.0.0
        </div>
      </div>
    </Sidebar>
  );
}
