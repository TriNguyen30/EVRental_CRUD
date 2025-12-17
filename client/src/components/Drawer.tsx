"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CogIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ScrollText, ChartColumnDecreasing, MailWarning, NotepadText } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const r = userStr ? (JSON.parse(userStr)?.Role as string | undefined) : undefined;
    setRole(r);
  }, []);

  const adminItems = [
    { label: "Thống kê", icon: <ChartColumnDecreasing className="w-5 h-5" />, key: "dashboard", href: "/" },
    { label: "Hồ sơ khách hàng", icon: <UserGroupIcon className="w-5 h-5" />, key: "admin_renters", href: "/admin/renters" },
    { label: "Lịch sử thuê xe", icon: <NotepadText className="w-5 h-5" />, key: "rent_history", href: "/admin/rent-history" },
    { label: "Phản hồi", icon: <MailWarning className="w-5 h-5" />, key: "complaints", href: "/admin/complaints" },
    { label: "Cài đặt", icon: <CogIcon className="w-5 h-5" />, key: "settings", href: "/admin/setting-profile" },
  ];

  const renterItems = [
    { label: "Lịch sử & phân tích", icon: <NotepadText className="w-5 h-5" />, key: "renter_history", href: "/renter/history" },
    { label: "Cài đặt", icon: <CogIcon className="w-5 h-5" />, key: "settings", href: "/admin/setting-profile" },
  ];

  // Update active key based on pathname
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) {
      setActiveKey("dashboard");
    } else if (pathSegments[0] === "admin" && pathSegments[1] === "renters") {
      setActiveKey("admin_renters");
    } else if (
      pathSegments[0] === "admin" &&
      pathSegments[1] === "rent-history"
    ) {
      setActiveKey("rent_history");
    } else if (
      pathSegments[0] === "admin" &&
      pathSegments[1] === "complaints"
    ) {
      setActiveKey("complaints");
    } else if (
      pathSegments[0] === "admin" &&
      pathSegments[1] === "setting-profile"
    ) {
      setActiveKey("settings");
    } else if (
      pathSegments[0] === "renter" &&
      pathSegments[1] === "history"
    ) {
      setActiveKey("renter_history");
    } else if (
      pathSegments[0] === "renter" &&
      pathSegments[1] === "setting-profile"
    ) {
      setActiveKey("settings");
    } else {
      setActiveKey(pathSegments[0]);
    }
  }, [pathname]);

  const [activeKey, setActiveKey] = useState("home");

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />

      {/* Content area */}
      <div className="drawer-content">
        {/* Only show hamburger on mobile */}
        <div className="lg:hidden">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost drawer-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
      </div>

      {/* Sidebar content */}
      <aside className="drawer-side">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
          onClick={() => setIsOpen(false)}
        ></label>
        <div className="flex flex-col bg-neutral text-neutral-content min-h-full w-60 shadow-xl border-r border-base-300">
          {/* Logo Section */}
          <div className="flex items-center justify-center">
            <img
              src="/EvRental2.png"
              alt="Logo"
              className="w-35 h-auto transition-transform hover:scale-110"
            />
          </div>

          {/* Menu Items */}
          <ul className="flex-1 px-4 py-2 space-y-2">
            {(role === "Admin" ? adminItems : renterItems).map((item) => (
              <li key={item.key}>
                <Link href={item.href}>
                  <button
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${
                        activeKey === item.key
                          ? "bg-primary text-primary-content font-medium shadow-md"
                          : "hover:bg-primary/70 hover:text-base"
                      }`}
                    onClick={() => {
                      setActiveKey(item.key);
                      setIsOpen(false);
                    }}
                    aria-current={activeKey === item.key ? "page" : undefined}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="text-center text-xs opacity-60 py-4 border-t border-base-300 bg-neutral text-neutral-content">
            <p>EV Rental System</p>
            <p>v1.0.0 © 2025</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
