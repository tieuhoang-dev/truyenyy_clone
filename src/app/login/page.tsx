"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";  

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint =
      mode === "login" ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/login` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`;

    const payload: Record<string, string> = { username, password };
    if (mode === "register") payload.email = email;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        return;
      }

      if (mode === "login") {
        // Lưu token vào cookie
        Cookies.set("token", data.token, { expires: 7 });
        setSuccess("Đăng nhập thành công!");
        setTimeout(() => router.back(), 1500);
      } else {
        setSuccess("Đăng ký thành công! Đang chuyển sang đăng nhập...");
        setTimeout(() => setMode("login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới máy chủ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          {mode === "login" ? "🔐 Đăng nhập" : "📝 Đăng ký"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-gray-700">Email (không bắt buộc)</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition"
          >
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {mode === "login" ? (
            <>Bạn chưa có tài khoản?{' '}
              <button onClick={() => setMode("register")} className="text-indigo-600 font-medium hover:underline">
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>Đã có tài khoản?{' '}
              <button onClick={() => setMode("login")} className="text-indigo-600 font-medium hover:underline">
                Đăng nhập ngay
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
