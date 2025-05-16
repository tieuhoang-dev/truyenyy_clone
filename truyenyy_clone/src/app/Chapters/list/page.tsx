"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import API_BASE_URL from "../../../../config";

type Chapter = {
    id: string;
    title: string;
    chapter_number: number;
    content: string;
    view_count: number;
    created_at: string; // ✅ thêm dòng này
    updated_at?: string;
};
const ChapterListPage = () => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [storyTitle, setStoryTitle] = useState<string>("");
    const [isAscending, setIsAscending] = useState(true);
    const [loading, setLoading] = useState(true);
    const [createdAt, setCreatedAt] = useState<string>("");

    const searchParams = useSearchParams();
    const storyId = searchParams.get("id");

    useEffect(() => {
        const fetchChapters = async () => {
            if (!storyId) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/stories/${storyId}/chapters`);
                const data = await res.json();
                setChapters(data.chapters || []);
            } catch (err) {
                console.error("Lỗi lấy danh sách chương:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchStoryTitle = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/stories/${storyId}`);
                const data = await res.json();
                setStoryTitle(data.title || "");
            } catch (err) {
                console.error("Lỗi lấy tên truyện:", err);
            }
        };

        fetchChapters();
        fetchStoryTitle();
    }, [storyId]);

    const sortedChapters = [...chapters].sort((a, b) =>
        isAscending ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* PHẦN 1 - HEADER */}
            <div className="flex justify-between items-center p-4 bg-white shadow">
                <h1 className="text-xl font-semibold text-gray-800">{storyTitle}</h1>
                <Link href={`/stories/Content?id=${storyId}`} className="text-xl text-gray-500 hover:text-gray-800">✖</Link>
            </div>

            {/* PHẦN 2 - TAB BAR */}
            <div className="flex justify-around bg-white shadow-sm py-2 border-t border-b">
                <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Danh sách chương</button>
                <button className="text-gray-500">Đang đọc</button>
                <button className="text-gray-500">Đánh dấu</button>
            </div>

            {/* PHẦN 3: Danh sách chương */}
            <div className="mt-2 px-4">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setIsAscending(!isAscending)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {isAscending ? '⬆️ Từ đầu đến cuối' : '⬇️ Từ cuối lên đầu'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {sortedChapters.map((chapter) => (
                        <Link
                            key={chapter.id}
                            href={`/Chapters?id=${chapter.id}`}
                            className="py-2 border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                            <div className="font-medium text-blue-700 text-sm">
                                Chương {chapter.chapter_number}: {chapter.title}
                            </div>
                            <div className="text-xs text-gray-500">
                                Ngày đăng: {new Date(chapter.created_at).toLocaleDateString('vi-VN')}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChapterListPage;
