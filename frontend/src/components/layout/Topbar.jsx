import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Topbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full z-50 flex justify-end items-center px-6 py-4 bg-gray-900 text-white border-b border-white/10">
      
      <div className="relative">
        {/* User Info */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 p-2 bg-white/10 rounded-lg"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=6d28d9&color=fff`}
            className="w-10 h-10 rounded-full"
          />

          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-300">{user?.email}</p>
          </div>

          <ChevronDown />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-lg p-3">
            <button
              onClick={onLogout}
              className="w-full text-left p-2 rounded hover:bg-red-500/30 text-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
