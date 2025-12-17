"use client";
import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Car,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Stats, RecentBooking, RecentReport } from "@/app/types/api";


export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, reportsRes] = await Promise.all([
        axios.get("/admin/stats"),
        axios.get("/bookings/recent"),
        axios.get("/reports/recent"),
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.data);
      setRecentReports(reportsRes.data.data);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Dữ liệu biểu đồ
  const revenueData = [
    { month: "Tháng 7", revenue: 12000000 },
    { month: "Tháng 8", revenue: 18000000 },
    { month: "Tháng 9", revenue: 15000000 },
    { month: "Tháng 10", revenue: 22000000 },
    { month: "Tháng 11", revenue: 28000000 },
  ];

  const reportTypeData = [
    { name: "Incident", value: 12, color: "#ef4444" },
    { name: "Renter", value: 8, color: "#f59e0b" },
    { name: "Handover", value: 5, color: "#10b981" },
  ];

  const bookingStatusData = [
    { name: "Hoàn thành", value: 45, color: "#10b981" },
    { name: "Đang thuê", value: 20, color: "#3b82f6" },
    { name: "Hủy", value: 8, color: "#ef4444" },
    { name: "Chờ xác nhận", value: 12, color: "#f59e0b" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">
          Dashboard Quản trị
        </h1>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <Calendar className="w-5 h-5" /> Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-primary">
            <Car className="w-8 h-8" />
          </div>
          <div className="stat-title">Tổng xe</div>
          <div className="stat-value">{stats?.totalVehicles}</div>
          <div className="stat-desc">Sẵn sàng cho thuê</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Khách hoạt động</div>
          <div className="stat-value">{stats?.activeRenters}</div>
          <div className="stat-desc">Trong 30 ngày</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-success">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Doanh thu</div>
          <div className="stat-value">
            {(stats?.totalRevenue || 0).toLocaleString()}đ
          </div>
          <div className="stat-desc">Tháng này</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-info">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Đơn thuê</div>
          <div className="stat-value">{stats?.totalBookings}</div>
          <div className="stat-desc">Tổng cộng</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-warning">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="stat-title">Báo cáo chờ</div>
          <div className="stat-value">{stats?.pendingReports}</div>
          <div className="stat-desc">Cần xử lý</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-error">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Khách rủi ro</div>
          <div className="stat-value">{stats?.highRiskRenters}</div>
          <div className="stat-desc">Cảnh báo cao</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doanh thu */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Doanh thu theo tháng</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loại báo cáo */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Phân loại báo cáo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bảng gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Đơn thuê gần đây */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Clock className="w-5 h-5" /> Đơn thuê gần đây
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Khách</th>
                    <th>Xe</th>
                    <th>Trạng thái</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.BookingID}>
                      <td>{b.Renter.FullName}</td>
                      <td>{b.Vehicle.LicensePlate}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            b.Status === "Completed"
                              ? "badge-success"
                              : b.Status === "Confirmed"
                              ? "badge-info"
                              : b.Status === "Cancelled"
                              ? "badge-error"
                              : "badge-warning"
                          }`}
                        >
                          {b.Status}
                        </span>
                      </td>
                      <td>{b.TotalCost.toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Báo cáo gần đây */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Báo cáo mới
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Loại</th>
                    <th>Khách</th>
                    <th>Trạng thái</th>
                    <th>Rủi ro</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((r) => (
                    <tr key={r.ReportID}>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            r.ReportType === "Incident"
                              ? "badge-error"
                              : r.ReportType === "Renter"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {r.ReportType}
                        </span>
                      </td>
                      <td>{r.Renter?.FullName || "—"}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            r.Status === "Closed"
                              ? "badge-success"
                              : r.Status === "Pending"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {r.Status}
                        </span>
                      </td>
                      <td>
                        {r.IsHighRisk ? (
                          <AlertTriangle className="w-5 h-5 text-error" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Trạng thái đơn thuê */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Trạng thái đơn thuê</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bookingStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6">
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
