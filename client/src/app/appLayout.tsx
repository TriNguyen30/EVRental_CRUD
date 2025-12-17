"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Drawer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const noLayoutRoutes = ["/login"];
  const isNoLayoutPage = noLayoutRoutes.includes(pathname);

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token && pathname !== "/login") {
      router.replace("/login");
      setIsAuthChecked(true);
      return;
    }

    if (token && pathname === "/login") {
      router.replace("/");
      setIsAuthChecked(true);
      return;
    }

    setIsAuthChecked(true);
  }, [pathname, router]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <>
      {isNoLayoutPage ? (
        <main className="fixed inset-0 w-full h-full overflow-hidden">{children}</main>
      ) : (
        <div className="drawer lg:drawer-open">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col bg-gray-100 min-h-screen">
            <Navbar />
            <main className="p-6">{children}</main>
          </div>
          <Sidebar />
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} newestOnTop closeOnClick />
    </>
  );
}
