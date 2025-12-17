"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import { format } from "date-fns";
import { Calendar, Car, Clock, DollarSign, TrendingUp } from "lucide-react";
import { MyBooking, MyStats } from "@/app/types/api";


export default function RenterHistory() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [stats, setStats] = useState<MyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const role = userStr ? (JSON.parse(userStr)?.Role as string | undefined) : undefined;
    if (role !== "Renter") {
      router.replace("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        axios.get("/renters/history"),
        axios.get("/renters/stats"),
      ]);
      setBookings(historyRes.data.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Lịch sử thuê xe</h1>

      {/* Thống kê */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat bg-base-200 rounded-box">
            <div className="stat-figure text-primary">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="stat-title">Tổng chuyến</div>
            <div className="stat-value">{stats.totalTrips}</div>
          </div>
          <div className="stat bg-base-200 rounded-box">
            <div className="stat-figure text-success">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="stat-title">Tổng chi phí</div>
            <div className="stat-value">
              {stats.totalCost.toLocaleString()}đ
            </div>
          </div>
          <div className="stat bg-base-200 rounded-box">
            <div className="stat-figure text-info">
              <Clock className="w-8 h-8" />
            </div>
            <div className="stat-title">Giờ cao điểm</div>
            <div className="stat-value">{stats.peakHours[0]?.hour || 0}h</div>
            <div className="stat-desc">Thường thuê nhất</div>
          </div>
        </div>
      )}

      {/* Biểu đồ giờ cao điểm */}
      {stats && stats.peakHours.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Giờ thuê xe thường xuyên
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {stats.peakHours.map((h, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold">{h.hour}h</div>
                  <div className="text-sm text-base-content/70">
                    {h.count} lần
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Danh sách lịch sử */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Các chuyến đã thuê</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Xe</th>
                  <th>Thời gian</th>
                  <th>Thời lượng</th>
                  <th>Chi phí</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.BookingID}>
                    <td>{b.BookingID.slice(-6)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        <div>
                          <div>{b.Vehicle.LicensePlate}</div>
                          <div className="text-xs text-base-content/70">
                            {b.Vehicle.Brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {format(new Date(b.StartTime), "dd/MM HH:mm")} -<br />
                      {format(new Date(b.EndTime), "dd/MM HH:mm")}
                    </td>
                    <td>{b.Duration}h</td>
                    <td>{b.TotalAmount.toLocaleString()}đ</td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          b.Status === "Completed"
                            ? "badge-success"
                            : b.Status === "Cancelled"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {b.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
