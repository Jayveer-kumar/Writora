import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { User, Mail, LogOut, ExternalLink } from 'lucide-react';
import useAuthStore from "../../Store/authStore"; // Aapka auth store

const ProfileDropdown = forwardRef((props, ref) => {
    const { user, logout } = useAuthStore();
    const currentUser = useAuthStore((state) => state.user);

    return (
      <OverlayPanel
        ref={ref}
        showCloseIcon
        closeOnEscape
        className="shadow-xl  border-brand-border bg-brand-bg rounded-2xl overflow-hidden"
        style={{ width: "280px" }}
      >
        <style jsx="true">
          {`
            .p-overlaypanel-close {
              position: absolute !important;
              top: 10px !important;
              right: 10px !important;
              background: #f1f5f9; /* Light background for visibility */
              border-radius: 50%;
              padding: 4px;
              z-index: 10;
            }
            .dark .p-overlaypanel-close {
              background: #1e293b;
              color: white;
            }
          `}
        </style>
        <div className="flex flex-col items-center p-4">
          {/* 1. User Image (Top Center) */}
          <div className="relative mb-3">
            <div className="h-20 w-20 rounded-full border-4 border-blue-500/20 p-1">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-600">
                  <User size={40} />
                </div>
              )}
            </div>
          </div>

          {/* 2. Name and Email */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
              {user?.name || "Guest User"}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400">
              <Mail size={14} />
              <span className="text-xs truncate max-w-[180px]">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="w-full flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            {/* Visit Profile Button */}
            <button className="flex items-center justify-between cursor-pointer w-full px-4 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-hover/20  rounded-lg transition-colors group">
              <Link to={`profile/${currentUser?._id}`} >
              <div className="flex items-center gap-3">
                <User size={18} className="text-brand-text" />
                <span>Visit Profile</span>
              </div>
              </Link>
              <ExternalLink
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-3 cursor-pointer w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </OverlayPanel>
    );
});

ProfileDropdown.displayName = 'ProfileDropdown';

export default ProfileDropdown;

