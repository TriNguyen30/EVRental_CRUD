"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import {
  Search,
  Loader2,
  Eye,
  Calendar,
  MapPin,
  IdCard,
  AlertCircle,
  Trash2,
  RefreshCw,
  Check,
} from "lucide-react";
import Image from "next/image.js";
import { Renter, ApiResponse } from "@/app/types/api";
import RenterDetailModal from "@/components/RenterDetailModal";
import ImageZoomModal from "@/components/ImageZoomModal";

export default function AdminRenters() {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Pending" | "Inactive"
  >("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Renter | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reactivating, setReactivating] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [photoZoom, setPhotoZoom] = useState<{
    url: string;
    type: "front" | "back";
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    accountId: string;
    renterId: string;
    name: string;
  } | null>(null);

  const limit = 5;

  const fetchRenters = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get<ApiResponse>("/renters", {
        params: {
          page,
          limit,
          search: search.trim() || undefined,
          status: statusFilter === "All" ? undefined : statusFilter,
        },
      });
      setRenters(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter]);

  const requestDelete = (accountId: string, renterId: string, name: string) => {
    setConfirmDelete({ accountId, renterId, name });
  };

  const confirmDeleteNow = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.renterId);
    try {
      await axios.delete(`/admin/accounts/${confirmDelete.accountId}`);
      setConfirmDelete(null);
      fetchRenters();
    } catch (err) {
      // Keep modal open to allow retry or cancel
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleReactivate = async (accountId: string, renterId: string) => {
    setReactivating(renterId);
    try {
      await axios.put(`/admin/accounts/${accountId}/reactivate`);
      fetchRenters();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Không thể mở lại tài khoản. Vui lòng thử lại."
      );
      console.error(err);
    } finally {
      setReactivating(null);
    }
  };

  const handleApprove = async (accountId: string, renterId: string) => {
    setApproving(renterId);
    try {
      await axios.put(`/admin/accounts/${accountId}/approve`);
      fetchRenters();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Không thể duyệt tài khoản. Vui lòng thử lại."
      );
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return <span className="text-gray-400">Chưa có</span>;
    return new Date(date).toLocaleDateString("vi-VN");
  };

  // CHUYỂN TRẠNG THÁI SANG TIẾNG VIỆT
  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "Hoạt động";
      case "Pending":
        return "Chờ duyệt";
      case "Inactive":
        return "Vô hiệu hóa";
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "badge-success";
      case "Pending":
        return "badge-warning";
      case "Inactive":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-base-content">
          Quản Lý Hồ Sơ Khách Hàng
        </h1>
        <p className="text-base-content/70 mt-1">
          Xem, tìm kiếm và quản lý thông tin renter
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md group">
          <input
            type="text"
            placeholder="Tìm theo tên, email, CMND..."
            className="input input-bordered w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
          {/* Nút Xóa – chỉ hiện khi có nội dung */}
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
      </div>
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Badge Filter – TIẾNG VIỆT */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: "All", label: "Tất cả" },
          { key: "Active", label: "Hoạt động" },
          { key: "Pending", label: "Chờ duyệt" },
          { key: "Inactive", label: "Vô hiệu hóa" },
        ].map((item) => {
          const count =
            item.key === "All"
              ? renters.length
              : renters.filter((r) => r.Account.Status === item.key).length;

          return (
            <button
              key={item.key}
              onClick={() => {
                setStatusFilter(item.key as any);
                setPage(1);
              }}
              className={`badge badge-lg ${
                statusFilter === item.key
                  ? item.key === "Active"
                    ? "badge-success"
                    : item.key === "Pending"
                    ? "badge-warning"
                    : item.key === "Inactive"
                    ? "badge-error"
                    : "badge-primary"
                  : "badge-ghost"
              } hover:badge-outline transition-all`}
            >
              {item.label}
              <span className="ml-1 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>
      {/* Table */}
      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="w-48">Họ Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>CMND</th>
                <th>Ngày Sinh</th>
                <th>Trạng Thái</th>
                <th className="text-center w-32">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : renters.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-base-content/50"
                  >
                    Không tìm thấy renter nào
                  </td>
                </tr>
              ) : (
                renters.map((r) => (
                  <tr key={r.RenterID} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold">
                            {r.Account.FullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{r.Account.Email}</td>
                    <td className="text-sm">{r.Account.PhoneNumber}</td>
                    <td className="font-mono text-sm">
                      {r.IdentityNumber || (
                        <span className="text-gray-400">Chưa có</span>
                      )}
                    </td>
                    <td>{formatDate(r.DateOfBirth)}</td>
                    <td>
                      <span
                        className={`badge badge-xm ${getStatusBadgeClass(
                          r.Account.Status
                        )}`}
                      >
                        {getStatusText(r.Account.Status)}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          className="btn btn-ghost btn-xs text-info"
                          onClick={() => setSelected(r)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {r.Account.Status === "Pending" ? (
                          <button
                            className="btn btn-ghost btn-xs text-success"
                            onClick={() =>
                              handleApprove(r.Account.AccountID, r.RenterID)
                            }
                            disabled={approving === r.RenterID}
                            title="Duyệt tài khoản"
                          >
                            {approving === r.RenterID ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Check className="h-5 w-5" />
                            )}
                          </button>
                        ) : r.Account.Status === "Inactive" ? (
                          <button
                            className="btn btn-ghost btn-xs text-success"
                            onClick={() =>
                              handleReactivate(r.Account.AccountID, r.RenterID)
                            }
                            disabled={reactivating === r.RenterID}
                            title="Mở lại tài khoản"
                          >
                            {reactivating === r.RenterID ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <RefreshCw className="h-5 w-5" />
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() =>
                              requestDelete(
                                r.Account.AccountID,
                                r.RenterID,
                                r.Account.FullName
                              )
                            }
                            disabled={deleting === r.RenterID}
                            title="Xóa (vô hiệu hóa)"
                          >
                            {deleting === r.RenterID ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
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
      {/* Modal Chi Tiết – Tách riêng */}
      {selected && (
        <RenterDetailModal
          renter={selected}
          onClose={() => setSelected(null)}
          onPhotoZoom={(url, type) => setPhotoZoom({ url, type })}
        />
      )}

      {/* Popup Ảnh Lớn – Tách riêng */}
      {photoZoom && (
        <ImageZoomModal
          url={photoZoom.url}
          type={photoZoom.type}
          onClose={() => setPhotoZoom(null)}
        />
      )}

      {confirmDelete && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Xác nhận xóa</h3>
            <p className="py-4">
              Bạn có chắc muốn xóa renter "{confirmDelete.name}"? Tài khoản sẽ
              bị vô hiệu hóa.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setConfirmDelete(null)}
                disabled={!!deleting}
              >
                Hủy
              </button>
              <button
                className={`btn btn-error ${deleting ? "btn-disabled" : ""}`}
                onClick={confirmDeleteNow}
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xóa...
                  </span>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
