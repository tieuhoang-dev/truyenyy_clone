"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEllipsisH } from "react-icons/fa";

type Genre = {
  _id: string;
  count: number;
};

export default function Sidebar() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("http://192.168.16.104:8080/stories/genre");
        if (!res.ok) throw new Error("Không thể tải thể loại");
        const data = await res.json();
        setGenres(data);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) return <div className="text-white p-4">Đang tải thể loại...</div>;
  if (error) return <div className="text-red-400 p-4">Lỗi: {error}</div>;

  // Hàm xử lý sự kiện click vào thể loại
  const handleCategoryClick = (genre: string) => {
    router.push(`/stories/category/${genre}`);
  };

  return (
    <aside className="relative w-60 bg-gray-800 text-white p-3 rounded-lg">
      <ul className="grid grid-cols-1 gap-3">
        {genres.slice(0, showMore ? genres.length : 10).map((item, index) => (
          <li
            key={index}
            className="flex flex-col leading-tight cursor-pointer"
            onClick={() => handleCategoryClick(item._id)}
          >
            <span className="font-medium">{item._id}</span>
            <span className="text-xs text-gray-400">{item.count.toLocaleString()} truyện</span>
          </li>
        ))}
      </ul>

      <button
        className="absolute bottom-2 right-2 text-gray-400 hover:text-white transform rotate-135"
        onClick={() => setShowMore(!showMore)}
      >
        <FaEllipsisH className="text-xl" />
      </button>
    </aside>
  );
}