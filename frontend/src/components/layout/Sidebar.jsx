import { NavLink } from "react-router-dom";
import { Home, FileText, BookOpen, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(true);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false); // mobile = collapse
      } else {
        setOpen(true); // desktop = open
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-gray-900 text-white h-screen p-5 pt-8 fixed transition-all duration-300`}
    >
      {/* Toggle Menu (Mobile only) */}
      <button
        onClick={() => setOpen(!open)}
        className="
         -right-3 top-9 bg-purple-600 p-1 rounded-full 
          md:hidden
          mb-6
        "
      >
        <Menu size={20} />
      </button>

      <div className="space-y-12">
        {/* Logo */}
        <div
          className={`flex items-center gap-3 transition-all duration-300 
    ${open ? "justify-start" : "justify-center"}`}
        >
          {/* Mini Icon when collapsed */}
          <div
            className="
      bg-purple-600 text-white p-2 rounded-xl 
      shadow-lg shadow-purple-500/30
      transition-all duration-300
      hover:scale-110
    "
          >
            ✨
          </div>

          {/* Full Logo Name when open */}
          {open && (
            <h1
              className="
        text-3xl font-bold text-purple-400 
        tracking-wide 
        transition-all duration-300 
        hover:scale-105 hover:text-purple-300
      "
            >
              MoodGrocer
            </h1>
          )}
        </div>

        {/* Links */}
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 ${
                isActive ? "bg-white/10 border border-white/10" : ""
              }`
            }
          >
            <Home />
            {open && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/generate-plan"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 ${
                isActive ? "bg-white/10 border border-white/10" : ""
              }`
            }
          >
            <FileText />
            {open && <span>Generate Plan</span>}
          </NavLink>

          <NavLink
            to="/saved-plans"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 ${
                isActive ? "bg-white/10 border border-white/10" : ""
              }`
            }
          >
            <BookOpen />
            {open && <span>Saved Plans</span>}
          </NavLink>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400"
          >
            <LogOut />
            {open && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
