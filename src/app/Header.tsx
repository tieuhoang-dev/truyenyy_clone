import Image from "next/image";
import Link from "next/link";
import { Bell, BookOpen, Mail, Search, Home } from "lucide-react";

const Header = () => {
    return (
        <header className="bg-cyan shadow-md">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo & Website Name */}
                <div className="flex items-center">
                    <Link href="/logo">
                        <Image src="/logo.jpg" alt="TruyenYY" width={40} height={40} />
                    </Link>
                    <Link href="/logo">
                        <span className="ml-2 text-xl font-bold">TRUYENYY</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                    <input
                        type="text"
                        placeholder="Tìm tên truyện, tác giả..."
                        className="px-4 py-2 w-96 border-none outline-none"
                    />
                    <button className="bg-white-500 p-2 text-blue">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Right Section - Icons */}
                <div className="flex items-center space-x-4">
                    <Link href="/home"><Mail className="w-6 h-6 text-gray-600" /></Link>
                    <Link href="/thongbao"><Bell className="w-6 h-6 text-gray-600" /></Link>
                    <Link href="/tusach"><BookOpen className="w-6 h-6 text-gray-600" /></Link>
                    <div className="relative w-8 h-8">
                        <Link href="/user"><Image src="/user.jpg" alt="User" width={32} height={32} className="rounded-full" /></Link>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-gray-900 text-white py-2">
                <div className="flex justify-center space-x-6">
                    <Link href="/main page">
                        <Home className="hover:underline cursor_pointer bg-blue "></Home>
                    </Link>
                    <Link className="hover:underline cursor-pointer" href="/ktb">Kim Thánh Bảng</Link>
                    <Link className="hover:underline cursor-pointer" href="/stb">Sáng Tác Bảng</Link>
                    <Link className="hover:underline cursor-pointer" href="/full">Truyện Full</Link>
                    <Link className="hover:underline cursor-pointer" href="/new">Mới Cập Nhật</Link>
                    <Link className="hover:underline cursor-pointer" href="/trans">Truyện Dịch</Link>
                    <Link className="hover:underline cursor-pointer flex items-center" href="/forum"> Diễn Đàn
                        <span className="bg-green-500 text-xs ml-1 px-0.5 mb-2 rounded-full ">99+</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
