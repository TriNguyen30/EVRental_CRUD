import Image from "next/image";
import { IdCard, AlertCircle, ImageIcon, Car, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Renter, DriverLicense } from "@/app/types/api";
import { useEffect, useState } from "react";
import axios from "@/app/lib/axios";

interface RenterDetailModalProps {
  renter: Renter;
  onClose: () => void;
  onPhotoZoom: (url: string, type: "front" | "back") => void;
  isOpen?: boolean;
}

export default function RenterDetailModal({
  isOpen = true,
  renter,
  onClose,
  onPhotoZoom,
}: RenterDetailModalProps) {
  const [driverLicenses, setDriverLicenses] = useState<DriverLicense[]>([]);
  const [loadingLicense, setLoadingLicense] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setDriverLicenses([]);
      setLoadingLicense(false);
      return;
    }

    // Lưu lại scrollbar width và padding hiện tại
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalOverflow = document.body.style.overflow;

    // Ẩn scrollbar và thêm padding để tránh layout shift
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Fetch driver licenses when modal opens
    const fetchDriverLicenses = async () => {
      setLoadingLicense(true);
      try {
        const res = await axios.get<{ data: DriverLicense[] }>(
          `/renters/${renter.RenterID}/driver-license`
        );
        setDriverLicenses(res.data.data);
      } catch (err) {
        console.error("Error fetching driver licenses:", err);
        setDriverLicenses([]);
      } finally {
        setLoadingLicense(false);
      }
    };

    fetchDriverLicenses();

    return () => {
      // Khôi phục lại trạng thái ban đầu
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, renter.RenterID]);
  const formatDate = (date: string | null) => {
    if (!date) return <span className="text-gray-400">Chưa có</span>;
    return new Date(date).toLocaleDateString("vi-VN");
  };

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

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-5xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-primary text-primary-content p-6 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <IdCard className="h-7 w-7" />
            Hồ Sơ Chi Tiết - {renter.Account.FullName}
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

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-info" />
                Thông Tin Cá Nhân
              </h4>
              <div className="bg-base-200 rounded-lg p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Họ tên:</span>
                  <span>{renter.Account.FullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{renter.Account.Email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Số điện thoại:</span>
                  <span>{renter.Account.PhoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">CMND/CCCD:</span>
                  <span className="font-mono">
                    {renter.IdentityNumber || "Chưa có"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ngày sinh:</span>
                  <span>{formatDate(renter.DateOfBirth)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">Địa chỉ:</span>
                  <span className="text-right max-w-xs">
                    {renter.Address || (
                      <span className="text-gray-400">Chưa có</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Trạng thái:</span>
                  <span
                    className={`badge ${getStatusBadgeClass(
                      renter.Account.Status
                    )}`}
                  >
                    {getStatusText(renter.Account.Status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ảnh CMND */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-info" />
                Ảnh CMND/CCCD
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {/* Mặt trước */}
                <div>
                  <p className="text-sm font-medium mb-2 text-center">
                    Mặt trước
                  </p>
                  {renter.FrontIdentityImageUrl &&
                  renter.FrontIdentityImageUrl.trim() ? (
                    <div
                      className="cursor-zoom-in relative group overflow-hidden rounded-lg border-2 border-base-300 shadow-md"
                      onClick={() =>
                        onPhotoZoom(renter.FrontIdentityImageUrl!, "front")
                      }
                    >
                      <Image
                        src={renter.FrontIdentityImageUrl}
                        alt="CMND mặt trước"
                        width={400}
                        height={250}
                        className="rounded-lg object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500 text-sm">
                      Chưa có ảnh
                    </div>
                  )}
                </div>

                {/* Mặt sau */}
                <div>
                  <p className="text-sm font-medium mb-2 text-center">
                    Mặt sau
                  </p>
                  {renter.BackIdentityImageUrl &&
                  renter.BackIdentityImageUrl.trim() ? (
                    <div
                      className="cursor-zoom-in relative group overflow-hidden rounded-lg border-2 border-base-300 shadow-md"
                      onClick={() =>
                        onPhotoZoom(renter.BackIdentityImageUrl!, "back")
                      }
                    >
                      <Image
                        src={renter.BackIdentityImageUrl}
                        alt="CMND mặt sau"
                        width={400}
                        height={250}
                        className="rounded-lg object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500 text-sm">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Driver License Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Car className="h-5 w-5 text-info" />
              Bằng Lái Xe
            </h4>
            {loadingLicense ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-base-content/70">
                  Đang tải thông tin bằng lái...
                </span>
              </div>
            ) : driverLicenses.length === 0 ? (
              <div className="bg-base-200 rounded-lg p-6 text-center text-base-content/50">
                Khách hàng chưa có bằng lái xe
              </div>
            ) : (
              <div className="space-y-4">
                {driverLicenses.map((license) => (
                  <div
                    key={license.LicenseID}
                    className="bg-base-200 rounded-lg p-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Số bằng lái:</span>
                          <span className="font-mono">
                            {license.LicenseNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Loại bằng:</span>
                          <span>
                            {license.LicenseType === "Car"
                              ? "Ô tô"
                              : license.LicenseType === "Motorcycle"
                              ? "Xe máy"
                              : license.LicenseType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Ngày cấp:</span>
                          <span>{formatDate(license.IssuedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Ngày hết hạn:</span>
                          <span>{formatDate(license.ExpiryDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Nơi cấp:</span>
                          <span className="text-right max-w-xs">
                            {license.IssuedBy || "Chưa có"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Trạng thái xác thực:</span>
                          <span
                            className={`badge ${
                              license.VerifiedStatus === "Verified"
                                ? "badge-success"
                                : license.VerifiedStatus === "Rejected"
                                ? "badge-error"
                                : "badge-warning"
                            } flex items-center gap-1`}
                          >
                            {license.VerifiedStatus === "Verified" ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Đã xác thực
                              </>
                            ) : license.VerifiedStatus === "Rejected" ? (
                              <>
                                <XCircle className="h-3 w-3" />
                                Từ chối
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Chờ xác thực
                              </>
                            )}
                          </span>
                        </div>
                        {license.VerifiedAt && (
                          <div className="flex justify-between">
                            <span className="font-medium">Ngày xác thực:</span>
                            <span>{formatDate(license.VerifiedAt)}</span>
                          </div>
                        )}
                      </div>
                      {/* License Image */}
                      <div>
                        <p className="text-sm font-medium mb-2 text-center">
                          Ảnh bằng lái xe
                        </p>
                        {license.LicenseImageUrl &&
                        license.LicenseImageUrl.trim() ? (
                          <div
                            className="cursor-zoom-in relative group overflow-hidden rounded-lg border-2 border-base-300 shadow-md"
                            onClick={() =>
                              onPhotoZoom(license.LicenseImageUrl!, "front")
                            }
                          >
                            <Image
                              src={license.LicenseImageUrl}
                              alt="Bằng lái xe"
                              width={400}
                              height={250}
                              className="rounded-lg object-cover w-full h-85 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500 text-sm">
                            Chưa có ảnh
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Backdrop để đóng modal khi click bên ngoài */}
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
