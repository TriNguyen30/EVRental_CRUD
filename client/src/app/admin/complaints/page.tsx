"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import {
  Search,
  Loader2,
  Eye,
  AlertCircle,
  Check,
  Clock,
  AlertTriangle,
  X,
  Filter,
} from "lucide-react";
import { Report, ApiResponse } from "@/app/types/api";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Open" | "Pending" | "Closed"
  >("All");
  const [typeFilter, setTypeFilter] = useState<
    "All" | "Incident" | "Renter" | "Handover"
  >("All");
  const [riskFilter, setRiskFilter] = useState<"All" | "true" | "false">("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Report | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const limit =10;

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {
        page,
        limit,
      };

      if (search.trim()) {
        params.searchDetails = search.trim();
      }
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }
      if (typeFilter !== "All") {
        params.type = typeFilter;
      }
      if (riskFilter !== "All") {
        params.isHighRisk = riskFilter;
      }

      const res = await axios.get<ApiResponse<Report>>("/reports", { params });
      setReports(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, typeFilter, riskFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchReports();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await axios.put(`/reports/${id}/status`, { status });
      fetchReports();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái.");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return <span className="text-gray-400">Chưa có</span>;
    return new Date(date).toLocaleString("vi-VN");
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Open":
        return "Mở";
      case "Pending":
        return "Đang xử lý";
      case "Closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Open":
        return "badge-warning";
      case "Pending":
        return "badge-info";
      case "Closed":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "Incident":
        return "Sự cố";
      case "Renter":
        return "Khách thuê";
      case "Handover":
        return "Bàn giao";
      default:
        return type;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "Incident":
        return "badge-error";
      case "Renter":
        return "badge-warning";
      case "Handover":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-base-content">
          Quản Lý Báo Cáo Rủi Ro
        </h1>
        <p className="text-base-content/70 mt-1">
          Xem, tìm kiếm và quản lý các báo cáo rủi ro
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md group">
          <input
            type="text"
            placeholder="Tìm kiếm theo nội dung báo cáo..."
            className="input input-bordered w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-circle btn-xs hover:bg-error/20 text-base-content/50 hover:text-error transition-all"
              title="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-base-content/50" />
          <select
            className="select select-bordered select-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Open">Mở</option>
            <option value="Pending">Đang xử lý</option>
            <option value="Closed">Đã đóng</option>
          </select>
        </div>

        <select
          className="select select-bordered select-sm"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="All">Tất cả loại</option>
          <option value="Incident">Sự cố</option>
          <option value="Renter">Khách thuê</option>
          <option value="Handover">Bàn giao</option>
        </select>

        <select
          className="select select-bordered select-sm"
          value={riskFilter}
          onChange={(e) => {
            setRiskFilter(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="All">Tất cả mức độ rủi ro</option>
          <option value="true">Rủi ro cao</option>
          <option value="false">Rủi ro thấp</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="w-20">ID</th>
                <th className="w-32">Loại</th>
                <th>Khách hàng</th>
                <th>Nhân viên</th>
                <th>Xe</th>
                <th>Chi tiết</th>
                <th className="w-32">Rủi ro</th>
                <th className="w-32">Trạng thái</th>
                <th className="w-32">Ngày tạo</th>
                <th className="text-center w-40">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-12 text-base-content/50"
                  >
                    Không tìm thấy báo cáo nào
                  </td>
                </tr>
              ) : (
                reports.map((rep) => (
                  <tr key={rep.ReportID} className="hover">
                    <td className="font-mono text-sm">{rep.ReportID}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${getTypeBadgeClass(
                          rep.ReportType
                        )}`}
                      >
                        {getTypeText(rep.ReportType)}
                      </span>
                    </td>
                    <td>
                      {rep.Renter?.Account?.FullName || (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td>{rep.Staff?.Account?.FullName || "—"}</td>
                    <td className="font-mono text-sm">
                      {rep.Vehicle?.LicensePlate || (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="max-w-xs">
                      <div className="truncate" title={rep.ReportDetails}>
                        {rep.ReportDetails}
                      </div>
                    </td>
                    <td>
                      {rep.IsHighRisk ? (
                        <span className="badge badge-error badge-sm gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Cao
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">Thấp</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${getStatusBadgeClass(
                          rep.Status
                        )}`}
                      >
                        {getStatusText(rep.Status)}
                      </span>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {formatDate(rep.CreatedAt)}
                    </td>
                    <td className="text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          className="btn btn-ghost btn-xs text-info"
                          onClick={() => setSelected(rep)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {rep.Status !== "Closed" && (
                          <button
                            className="btn btn-ghost btn-xs text-success"
                            onClick={() => updateStatus(rep.ReportID, "Closed")}
                            disabled={updating === rep.ReportID}
                            title="Đóng báo cáo"
                          >
                            {updating === rep.ReportID ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        {rep.Status === "Open" && (
                          <button
                            className="btn btn-ghost btn-xs text-warning"
                            onClick={() =>
                              updateStatus(rep.ReportID, "Pending")
                            }
                            disabled={updating === rep.ReportID}
                            title="Chuyển sang đang xử lý"
                          >
                            {updating === rep.ReportID ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Clock className="h-4 w-4" />
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

      {/* Detail Modal */}
      {selected && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              Chi tiết báo cáo #{selected.ReportID}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Loại báo cáo: &nbsp;
                    </span>
                  </label>
                  <span
                    className={`badge ${getTypeBadgeClass(
                      selected.ReportType
                    )}`}
                  >
                    {getTypeText(selected.ReportType)}
                  </span>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Trạng thái: &nbsp;
                    </span>
                  </label>
                  <span
                    className={`badge ${getStatusBadgeClass(selected.Status)}`}
                  >
                    {getStatusText(selected.Status)}
                  </span>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Mức độ rủi ro: &nbsp;
                    </span>
                  </label>
                  {selected.IsHighRisk ? (
                    <span className="badge badge-error gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Rủi ro cao
                    </span>
                  ) : (
                    <span className="badge badge-ghost">Rủi ro thấp</span>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Ngày tạo: &nbsp;
                    </span>
                  </label>
                  <span className="text-sm">
                    {formatDate(selected.CreatedAt)}
                  </span>
                </div>

                {selected.ResolvedAt && (
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Ngày giải quyết
                      </span>
                    </label>
                    <span className="text-sm">
                      {formatDate(selected.ResolvedAt)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Khách hàng</span>
                </label>
                <div className="text-sm">
                  {selected.Renter && selected.Renter.Account ? (
                    <>
                      {selected.Renter.Account.FullName}
                      {selected.Renter.Account.Email && (
                        <div className="text-gray-500">
                          {selected.Renter.Account.Email}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Nhân viên</span>
                </label>
                <div className="text-sm">
                  {selected.Staff?.Account?.FullName || "—"}
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Xe</span>
                </label>
                <div className="text-sm font-mono">
                  {selected.Vehicle?.LicensePlate || (
                    <span className="text-gray-400">Không có</span>
                  )}
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Nội dung chi tiết
                  </span>
                </label>
                <div className="p-4 bg-base-200 rounded-lg text-sm whitespace-pre-wrap">
                  {selected.ReportDetails}
                </div>
              </div>
            </div>

            <div className="modal-action">
              {selected.Status !== "Closed" && (
                <>
                  {selected.Status === "Open" && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        updateStatus(selected.ReportID, "Pending");
                        setSelected(null);
                      }}
                      disabled={updating === selected.ReportID}
                    >
                      {updating === selected.ReportID ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Clock className="h-4 w-4" />
                          Chuyển sang đang xử lý
                        </>
                      )}
                    </button>
                  )}
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      updateStatus(selected.ReportID, "Closed");
                      setSelected(null);
                    }}
                    disabled={updating === selected.ReportID}
                  >
                    {updating === selected.ReportID ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Đóng báo cáo
                      </>
                    )}
                  </button>
                </>
              )}
              <button className="btn" onClick={() => setSelected(null)}>
                Đóng
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
