import React from "react";
import {
  Search,
  Bell,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";

const Navbar = ({ setMobileOpen, dark, setDark }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all dark:border-gray-800 dark:bg-gray-800/50">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm outline-none placeholder:text-gray-500 dark:text-gray-200"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-sans text-[10px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDark(!dark)}
          className="text-gray-500 dark:text-gray-400"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 dark:text-gray-400"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-end text-right hidden sm:flex">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.name || "User"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user.role || "Admin"}
            </span>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-gray-100 p-0.5 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
