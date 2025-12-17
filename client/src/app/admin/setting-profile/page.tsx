// app/setting-profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";
export default function SettingProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    FullName: "",
    Email: "",
    PhoneNumber: "",
    Address: "",
    DateOfBirth: "",
    IdentityNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const role = (typeof window !== "undefined" && localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user") as string)?.Role as string | undefined)
    : undefined) || undefined;

  // LẤY PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile");
        setProfile(res.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Không tải được hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // CẬP NHẬT
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put("/profile", profile);
      toast.success("Cập nhật thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Họ tên</label>
              <input
                type="text"
                value={profile.FullName}
                onChange={(e) =>
                  setProfile({ ...profile, FullName: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={profile.Email}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Số điện thoại</label>
              <input
                type="text"
                value={profile.PhoneNumber || ""}
                onChange={(e) =>
                  setProfile({ ...profile, PhoneNumber: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={saving}
              />
            </div>
          </div>
        </section>

        {role === "Renter" && (
          <section className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-4">Thông tin thuê</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={profile.Address || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, Address: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={profile.DateOfBirth || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, DateOfBirth: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">CMND/CCCD</label>
                <input
                  type="text"
                  value={profile.IdentityNumber || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, IdentityNumber: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  disabled={saving}
                />
              </div>
            </div>
          </section>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Đăng xuất
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
