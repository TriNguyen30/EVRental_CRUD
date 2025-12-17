"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const items = [
  {
    label: "Thống kê",
    key: "dashboard",
    href: "/",
  },
  {
    label: "Hồ sơ khách hàng",
    key: "admin_renters",
    href: "/admin/renters",
  },
  {
    label: "Lịch sử thuê xe",
    key: "rent_history",
    href: "/admin/rent-history",
  },
  {
    label: "Phản hồi",
    key: "complaints",
    href: "/admin/complaints",
  },
  {
    label: "Cài đặt",
    key: "settings",
    href: "/admin/setting-profile",
  },
  {
    label: "Lịch sử & phân tích",
    key: "renter_history",
    href: "/renter/history",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công");
    router.replace("/login");
  };

  // Get current route label
  const getCurrentLabel = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      return items.find((item) => item.key === "dashboard")?.label;
    }

    if (pathSegments[0] === "admin") {
      if (pathSegments[1] === "renters") {
        return items.find((item) => item.key === "admin_renters")?.label;
      }
      if (pathSegments[1] === "rent-history") {
        return items.find((item) => item.key === "rent_history")?.label;
      }
    }

    return items.find((item) => item.href === pathname)?.label;
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-10">
      <div className="navbar-start">
        {/* Drawer toggle on mobile */}
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost btn-circle lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
        <Link href="/" className="btn btn-ghost text-xl rounded-3xl">
          EV Rental
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <p className="text-lg font-semibold">{getCurrentLabel()}</p>
      </div>
      <div className="navbar-end gap-2">
        <div className="flex items-center gap-2">
          Welcome,{" "}
          {JSON.parse(localStorage.getItem("user") as string)?.FullName}
          <button
            className="btn btn-outline rounded-3xl border-red-500 hover:bg-red-600 hover:border-red-500 hover:text-white btn-xm"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
