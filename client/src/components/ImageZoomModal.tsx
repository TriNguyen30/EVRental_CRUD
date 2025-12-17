// components/admin/PhotoZoomModal.tsx
import Image from "next/image";

interface PhotoZoomModalProps {
  url: string;
  type: "front" | "back";
  onClose: () => void;
}

export default function ImageZoomModal({
  url,
  type,
  onClose,
}: PhotoZoomModalProps) {
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box p-0 max-w-4xl w-auto bg-transparent shadow-2xl">
        <div className="relative">
          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost absolute top-4 right-4 z-10 bg-base-100/80 hover:bg-base-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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

          {/* Tiêu đề */}
          <div className="text-center pt-16">
            <p className="text-sm text-base-content/70">
              {type === "front" ? "Mặt trước CMND/CCCD" : "Mặt sau CMND/CCCD"}
            </p>
          </div>

          {/* Ảnh lớn */}
          <div className="flex justify-center items-center p-4">
            <Image
              src={url}
              alt={type === "front" ? "CMND mặt trước" : "CMND mặt sau"}
              width={800}
              height={500}
              className="max-w-full max-h-screen object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Đóng khi click ngoài */}
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
