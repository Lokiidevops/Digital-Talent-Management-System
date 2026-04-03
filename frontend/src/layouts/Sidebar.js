import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
} from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "../components/ui/Button";

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
        active
          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 transition-colors",
          active
            ? "text-primary-600 dark:text-primary-400"
            : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
        )}
      />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const [user, setUser] = React.useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  React.useEffect(() => {
    const handleUpdate = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("profileUpdate", handleUpdate);
    return () => window.removeEventListener("profileUpdate", handleUpdate);
  }, []);

  const isAdmin = user.role === "admin" || user.role === "superadmin";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  if (user.role === "superadmin") {
    menuItems.push({ icon: Briefcase, label: "Approvals", href: "/admin-approval" });
  }

  const filteredItems = menuItems;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
          <Briefcase size={20} />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            DTMS
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {filteredItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 dark:text-gray-400 dark:hover:bg-red-900/10 dark:hover:text-red-400 group",
          )}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out lg:translate-x-0",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
