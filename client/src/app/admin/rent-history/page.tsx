"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import { Search, Loader2 } from "lucide-react";
import BookingTable from "@/components/BookingTable";
import BookingModal from "@/components/BookingModal";
import { Booking, ApiResponse } from "@/app/types/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Booking | null>(null);

  const limit = 5;

  useEffect(() => {
    fetchBookings();
  }, [page, search, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse<Booking>>("/bookings", {
        params: {
          page,
          limit,
          search: search || undefined,
          status: statusFilter === "All" ? undefined : statusFilter,
        },
      });
      setBookings(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lịch Sử Thuê Xe</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Tìm tên, biển số..."
            className="input input-bordered w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-circle btn-xs hover:bg-error/20 text-base-content/50 hover:text-error transition-all"
              title="Xóa tìm kiếm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">Tất cả</option>
          <option value="Pending">Chờ xác nhận</option>
          <option value="Confirmed">Đã xác nhận</option>
          <option value="Completed">Hoàn thành</option>
          <option value="Cancelled">Đã hủy</option>
          <option value="Expired">Hết hạn</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Không có dữ liệu</div>
      ) : (
        <>
          <BookingTable bookings={bookings} onView={setSelected} />
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                className="btn btn-square btn-sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                title="Trang trước"
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
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                      ? totalPages - 4 + i
                      : page - 2 + i;
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${
                        page === pageNum ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-2 text-sm text-base-content/60">...</span>
                )}
              </div>

              <button
                className="btn btn-square btn-sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                title="Trang sau"
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
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
      {selected && (
        <BookingModal booking={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
