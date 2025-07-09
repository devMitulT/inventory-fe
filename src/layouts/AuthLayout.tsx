import React from "react";
import { Outlet } from "react-router-dom";

import DashboardTopNav from "./Navbar";
import DashboardSideNav from "./Sidebar";
import { useAuth } from "./hooks/useLayout";

const AuthLayout = () => {
  useAuth();
  return (
    <React.Fragment>
      <main className="h-full bg-gray-50">
        <div className="grid h-full grid-cols-[1fr] lg:grid-cols-[248px_1fr]">
          <aside className="hidden lg:block">
            <DashboardSideNav />
          </aside>

          {/* Main Content */}
          <div className="flex w-full flex-col">
            <DashboardTopNav />
            <Outlet />
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default AuthLayout;
