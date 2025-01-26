"use client";

import { createClient } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

const Navbar = () => {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Don't show navbar on root page and auth pages
  if (pathname === "/" || pathname.startsWith("/auth")) {
    return null;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    window.location.href = "/";
  };

  return (
    <>
      <nav className="w-[99%] bg-slate-200 shadow m-2 rounded-lg shadow-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-slate-500">
                Skill Test App
              </h1>
            </div>
            <div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
