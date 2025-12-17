// components/BookingModal.tsx
import { Booking } from "@/app/types/api";

interface Props {
  booking: Booking;
  onClose: () => void;
}

export default function BookingModal({ booking, onClose }: Props) {
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-5xl p-0 overflow-hidden">
        <div className="bg-primary text-primary-content p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Chi Tiết Booking {booking.BookingID}
            </h3>
            <button onClick={onClose} className="btn btn-circle btn-ghost">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Thông tin khách</h4>
              <p>
                <strong>Họ tên:</strong> {booking.Renter.FullName}
              </p>
              <p>
                <strong>Email:</strong> {booking.Renter.Email}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Thông tin xe</h4>
              <p>
                <strong>Biển số:</strong> {booking.Vehicle.LicensePlate}
              </p>
              <p>
                <strong>Hãng:</strong> {booking.Vehicle.Brand}{" "}
                {booking.Vehicle.Model}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Thời gian thuê</h4>
            <p>
              <strong>Bắt đầu:</strong>{" "}
              {new Date(booking.StartTime).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Kết thúc:</strong>{" "}
              {new Date(booking.EndTime).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Thời lượng:</strong> {booking.Duration} giờ
            </p>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Chi phí</h4>
            <p className="text-xl font-bold text-success">
              {booking.TotalCost.toLocaleString()}₫
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
