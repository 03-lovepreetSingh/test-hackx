"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Archive,
  Users,
  BookOpen,
  MessageSquare,
  Award,
  Trophy,
  MoreHorizontal,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isMobileOpen, onClose }: SidebarProps) {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  interface MenuItem {
    icon?: React.ComponentType<{ className?: string }>;
    label?: string;
    path?: string;
    active?: boolean;
    divider?: boolean;
  }

  const navItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Judge Dashboard",
      path: "/dashboard/judge",
    },
    {
      icon: Trophy,
      label: "My Hackathons",
      path: "/dashboard/my-hackathons",
    },
    {
      divider: true,
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: Globe,
      label: "Explore Hackathons",
      path: "/dashboard/hackathons",
      active: currentPath === "/dashboard/hackathons",
    },
    {
      icon: Archive,
      label: "Project Archive",
      path: "/dashboard/projects",
    },
    {
      divider: true,
    },
    {
      icon: Users,
      label: "Community Events",
      path: "/dashboard/communityEvents",
    },
    {
      icon: BookOpen,
      label: "Learning Camps",
      path: "/dashboard/learningCamp",
    },
    {
      icon: MessageSquare,
      label: "Discussion & Support",
      path: "/dashboard/discussion&support",
    },
    {
      icon: Award,
      label: "Advocate Program",
      path: "/dashboard/advocate",
    },
    {
      icon: User,
      label: "Profile",
      path: "/dashboard/profile",
    },
    {
      icon: MoreHorizontal,
      label: "More",
      path: "#",
    },
  ];

  const sidebarClasses = cn(
    "bg-[#121212] border-r border-[#2a2a2a] flex-shrink-0 h-screen transition-all duration-300",
    "md:w-64 md:static",
    isMobileOpen
      ? "fixed inset-y-0 left-0 w-64 z-50"
      : "fixed -left-64 w-64 z-50",
    className
  );

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div className={sidebarClasses}>
        <div className="p-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="https://uploadthingy.s3.us-west-1.amazonaws.com/mYgiYyPcu6TU6BGQmV74hq/Logo_Container_%281%29.png"
              alt="HackX Logo"
              className="h-6 w-auto"
            />
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav
          className="mt-4 overflow-y-auto"
          style={{
            maxHeight: "calc(100vh - 70px)",
          }}
        >
          {navItems.map((item, index) =>
             item.divider ? (
               <div key={index} className="h-px bg-[#2a2a2a] my-4" />
             ) : (
               <Link
                 key={index}
                 href={item.path || "#"}
                 className={cn(
                   "flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1e1e1e] hover:text-white transition-colors",
                   (item.active || currentPath === item.path) && "text-blue-500 bg-[#1e1e1e]"
                 )}
                 onClick={isMobileOpen ? onClose : undefined}
               >
                 {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                 <span>{item.label}</span>
               </Link>
             )
           )}
        </nav>
      </div>
    </>
  );
}

// Keep backward compatibility with default export
export default Sidebar;