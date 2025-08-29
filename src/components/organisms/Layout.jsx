import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet context={{ sidebarOpen, toggleSidebar }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;