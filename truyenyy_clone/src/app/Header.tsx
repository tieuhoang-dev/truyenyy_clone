"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, BookOpen, Mail, Search, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Cookies from "js-cookie";  // Import js-cookie

const Header = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");  // Lấy token từ cookie
    setIsLoggedIn(!!token);  // Nếu có token thì người dùng đã đăng nhập
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/stories/search?name=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    Cookies.remove("token");  // Xóa token khỏi cookie
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router.push("/");  // Chuyển hướng về trang chủ
  };

  return (
    <header className="bg-blue shadow-md">
      <div className="flex items-center justify-between px-6 py-3 bg-[url('/bg.jpg')]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.jpg" alt="TruyenYY" width={40} height={40} />
          <span className="ml-2 text-xl font-bold text-white">TRUYENYY</span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center border rounded-lg overflow-hidden bg-white shadow-md"
        >
          <input
            type="text"
            placeholder="Tìm tên truyện, tác giả..."
            className="px-4 py-2 w-96 border-none outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="bg-white-500 p-2 text-blue">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/home">
            <Mail className="w-6 h-6 text-gray-200 hover:text-white" />
          </Link>
          <Link href="/thongbao">
            <Bell className="w-6 h-6 text-gray-200 hover:text-white" />
          </Link>
          <Link href="/tusach">
            <BookOpen className="w-6 h-6 text-gray-200 hover:text-white" />
          </Link>

          {/* User avatar / login */}
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="focus:outline-none">
                <Image
                  src="/user.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white cursor-pointer"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black/10 z-50 animate-fadeIn">
                  <ul className="text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push("/profile");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-xl"
                      >
                        Trang cá nhân
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm space-x-2 text-white">
              <Link href="/login" className="hover:underline">
                Đăng nhập
              </Link>
              <span>|</span>
              <Link href="/register" className="hover:underline">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-blue-900 text-white py-2">
        <div className="flex justify-center space-x-8">
          <Link href="/">
            <Home className="hover:underline cursor-pointer" />
          </Link>
          <Link className="hover:underline cursor-pointer" href="/stories/Story_rank">
            Kim Thánh Bảng
          </Link>
          <Link className="hover:underline cursor-pointer" href="/stb">
            Sáng Tác Bảng
          </Link>
          <Link className="hover:underline cursor-pointer" href="/full">
            Truyện Full
          </Link>
          <Link className="hover:underline cursor-pointer" href="/new">
            Mới Cập Nhật
          </Link>
          <Link className="hover:underline cursor-pointer" href="/trans">
            Truyện Dịch
          </Link>
          <Link className="hover:underline cursor-pointer flex items-center" href="/forum">
            Diễn Đàn
            <span className="bg-green-500 text-xs ml-1 px-1 py-0.5 rounded-full">
              99+
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
