import { Sidebar } from 'primereact/sidebar';
import { Link , NavLink } from "react-router-dom";
import {  Copyright } from "lucide-react";

export default function MobileSidebar({ visible, onHide }) {
    const menuItems = [
        { id: 1, name: "Our Story", link: "/about" },
        { id: 2, name: "Membership", link: "/membership" },
        { id: 3, name: "Write", link: "/write" },
        { id: 4, name: "Signin", link: "/auth?currentAction=login" }
    ];

    return (
      <Sidebar
        visible={visible}
        position="right"
        onHide={onHide}
        className="w-full md:w-[350px] bg-brand-bg  border-brand-border"
        pt={{
          root: { className: "bg-brand-bg shadow-2xl" },
          header: { className: "p-6 border-b border-brand-border bg-brand-bg" },
          content: { className: "p-0 bg-brand-bg" },
          closeButton: {
            className:
              "text-brand-text hover:bg-brand-hover rounded-full transition-all",
          },
        }}
      >
        <div className="flex flex-col h-full bg-brand-bg pt-4">
          {/* Logo Section */}
          <div className="px-6 mb-8">
            <h2 className="text-3xl font-bold text-brand-text tracking-tight">
              Writora<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-sm text-brand-muted mt-1">
              Explore your creativity
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.link}
                onClick={onHide}
                className="flex items-center px-4 py-4 text-lg font-medium text-brand-text rounded-xl transition-all duration-200 hover:bg-brand-hover hover:pl-6 group"
            //     className={({
            //       isActive,
            //     }) => `flex items-center gap-3 p-3 rounded-lg transition-colors 
            // ${isActive ? " bg-brand-bg/70" : "text-brand-text hover:bg-brand-hover/10"}
            // `}
              >
                <span className="group-hover:text-brand-accent transition-colors">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Section / CTA */}
          <div className="mt-auto p-6 border-t border-brand-border mb-4">
            <Link to="/auth?currentAction=signup">
            <button className="w-full cursor-pointer bg-brand-text text-brand-bg py-4 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition-transform active:scale-95">
              Get Started
            </button>
            </Link>
            <div className=" flex items-center gap-3 justify-center text-center text-xs text-brand-muted mt-4">
              <Copyright className="h-3 w-3" />{" "}
              <span> {new Date().getFullYear()} Writora Inc.</span>
            </div>
          </div>
        </div>
      </Sidebar>
    );
}
