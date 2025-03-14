"use client";
import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";

const categories = [
    { name: "Huyền Huyễn", count: "6.1k", icon: "🌀" },
    { name: "Kiếm Hiệp", count: "1.6k", icon: "⚔️" },
    { name: "Lịch Sử", count: "783", icon: "📜" },
    { name: "Ngôn Tình", count: "8.8k", icon: "🌿" },
    { name: "Tiên Hiệp", count: "3.7k", icon: "✨" },
    { name: "Dị Giới", count: "2.4k", icon: "🌙" },
    { name: "Đô Thị", count: "5.4k", icon: "🏙️" },
    { name: "Huyền Ảo", count: "3.3k", icon: "🔮" },
    { name: "Trinh Thám", count: "554", icon: "🐱" },
    { name: "Cổ Đại", count: "1.6k", icon: "🏯" },
    { name: "Hệ Thống", count: "1.4k", icon: "⚙️" },
    { name: "Khoa Huyễn", count: "1.6k", icon: "🚀" },
    { name: "Quân Sự", count: "581", icon: "🎖️" },
    { name: "Võng Du", count: "1.6k", icon: "🎮" },
];

export default function Sidebar() {
    const [showMore, setShowMore] = useState(false);

    return (
        <aside className="relative w-60 bg-gray-800 text-white p-3 rounded-lg">
            <ul className="grid grid-cols-2 gap-3">
                {categories.slice(0, showMore ? categories.length : 10).map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                            <span className="font-medium">{item.name}</span>
                            <p className="text-xs text-gray-400">{item.count}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* ✅ Đưa nút "..." xuống góc phải */}
            <button
                className="absolute bottom-2 right-2 text-gray-400 hover:text-white transform rotate-135"
                onClick={() => setShowMore(!showMore)}
            >
                <FaEllipsisH className="text-xl" />
            </button>
        </aside>
    );
}

