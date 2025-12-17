// components/BookingTable.tsx
import { Booking } from "@/app/types/api";
import { Eye } from "lucide-react";

interface Props {
  bookings: Booking[];
  onView: (booking: Booking) => void;
}

export default function BookingTable({ bookings, onView }: Props) {
  const getStatusBadge = (status: Booking["Status"]) => {
    const map: Record<Booking["Status"], string> = {
      Completed: "badge-success",
      Confirmed: "badge-info",
      Pending: "badge-warning",
      Cancelled: "badge-error",
      Expired: "badge-error",
    };
    return map[status] || "badge-ghost";
  };

  const getStatusText = (status: Booking["Status"]) => {
    const map: Record<Booking["Status"], string> = {
      Pending: "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy",
      Expired: "Hết hạn",
    };
    return map[status];
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Khách</th>
            <th>Xe</th>
            <th>Thời gian</th>
            <th>Thời lượng</th>
            <th>Chi phí</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.BookingID}>
              <td>
                <div className="font-medium">{b.Renter.FullName}</div>
                <div className="text-xs text-gray-500">{b.Renter.Email}</div>
              </td>
              <td>
                {b.Vehicle.LicensePlate}
                <br />
                <span className="text-xs">
                  {b.Vehicle.Brand} {b.Vehicle.Model}
                </span>
              </td>
              <td>
                {new Date(b.StartTime).toLocaleString("vi-VN")}
                <br />→ {new Date(b.EndTime).toLocaleTimeString("vi-VN")}
              </td>
              <td>{b.Duration} giờ</td>
              <td className="font-mono">{b.TotalCost.toLocaleString()}₫</td>
              <td>
                <span className={`badge badge-xm ${getStatusBadge(b.Status)}`}>
                  {getStatusText(b.Status)}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => onView(b)}
                >
                  <Eye className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
