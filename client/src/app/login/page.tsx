// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import axios from "@/app/lib/axios";
import { LoginResponse } from "@/app/types/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(4, "Mật khẩu tối thiểu 4 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: async (values: { email: string; password: string }) => {
      setError("");
      setLoading(true);
      try {
        const res = await axios.post<LoginResponse>("/auth/login", {
          email: values.email,
          password: values.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.Role;
        if (role !== "Renter" && role !== "Admin") {
          setError("Tài khoản của bạn không được phép truy cập.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }

        toast.success("Đăng nhập thành công!");
        if (role === "Renter") {
          router.push("/renter/history");
        } else {
          router.push("/");
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Đăng nhập thất bại. Vui lòng thử lại.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image với opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/CarBG.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay với opacity */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Gradient overlay để tạo độ sâu */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      </div>

      {/* Animated particles/glow effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="card-body p-8">
            {/* Logo/Icon với animation */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-primary to-secondary p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                  LOGIN
              </h1>
              <p className="text-base-content/70 mt-2 text-center animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
                Đăng nhập để tiếp tục
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error shadow-lg mb-4 animate-in slide-in-from-top-4 duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="email"
                    placeholder="abc@example.com"
                    className="input input-bordered w-full pl-10 pr-4 transition-all duration-300 focus:input-primary focus:scale-[1.02] focus:shadow-lg"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-error text-sm mt-2 animate-in slide-in-from-top-2 duration-300">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Mật khẩu
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-4 transition-all duration-300 focus:input-primary focus:scale-[1.02] focus:shadow-lg"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    disabled={loading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-error text-sm mt-2 animate-in slide-in-from-top-2 duration-300">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                <button
                  type="submit"
                  className="btn btn-primary w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  disabled={loading}
                >
                  {/* Animated background gradient */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[gradient_3s_ease_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  
                  {loading ? (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang đăng nhập...
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Đăng Nhập
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-base-300/50 animate-in fade-in duration-1000 delay-1000">
              <p className="text-sm text-base-content/60">
                © 2025 EVRental System
              </p>
              <p className="text-xs text-base-content/40 mt-1">
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
