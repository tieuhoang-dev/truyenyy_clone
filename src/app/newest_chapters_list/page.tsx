"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

type Story = {
    id: string;
    title: string;
    view_count: number;
    updated_at: string;
    created_at?: string;
    cover_url?: string;
    chapters_count?: number;
    latest_chapter_id?: string;
    latest_chapter_title?: string;
};

const NewestChaptersList = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                // Gửi request kèm theo params page và limit lên Backend
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories?page=${currentPage}&limit=10`);
                if (!res.ok) throw new Error("Lỗi khi gọi API");
                const data = await res.json();

                let fetchedStories: Story[] = [];

                if (data && data.stories) {
                    fetchedStories = data.stories;
                    // Tính tổng số trang (số truyện / 10)
                    setTotalPages(Math.ceil(data.total / data.limit));
                } else if (Array.isArray(data)) { // Fallback nếu API vẫn trả thẳng array
                    fetchedStories = data;
                }

                const sortedStories = fetchedStories.sort((a, b) => {
                    const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
                    const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
                    return timeB - timeA;
                });

                setStories(sortedStories);
            } catch (err) {
                console.error("❌", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [currentPage]);

    if (loading) return <div className="text-center py-4">⏳ Đang tải...</div>;

    return (
        <div className="p-3 bg-[#0e1320] rounded shadow text-white">
            <h2 className="text-xl font-semibold mb-4">📚 Truyện mới cập nhật</h2>
            <div className="space-y-4">
                {stories.map((story, index) => {
                    const handleClick = () => {
                        router.push(`/stories/Content?id=${story.id}`);
                    };

                    return (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.015 }}
                            onClick={handleClick}
                            className="flex bg-[#1a1f2e] rounded-md p-3 hover:bg-[#2a3044] transition cursor-pointer"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={story.cover_url ? process.env.NEXT_PUBLIC_API_BASE_URL + story.cover_url : "/placeholder.png"}
                                alt={story.title}
                                className="w-16 h-24 object-cover rounded mr-4"
                            />
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <h3 className="text-lg font-bold truncate">{story.title}</h3>
                                    {story.chapters_count && story.chapters_count > 0 ? (
                                        <Link
                                            href={story.latest_chapter_id ? `/Chapters?id=${story.latest_chapter_id}` : `/Chapters/list?id=${story.id}`}
                                            className="text-sm text-gray-300 hover:text-gray-100 transition underline truncate block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Chương {story.chapters_count}{story.latest_chapter_title ? `: ${story.latest_chapter_title}` : ""}
                                        </Link>
                                    ) : (
                                        <p className="text-sm text-gray-400">Chưa có chương</p>
                                    )}
                                </div>
                                <div className="flex items-center text-xs text-gray-400 mt-2 gap-4">
                                    <div className="flex items-center gap-1">
                                        <Eye size={14} /> {(story.view_count ?? 0).toLocaleString()} lượt xem
                                    </div>
                                    <div className="ml-auto">{timeAgo(story.updated_at || story.created_at || new Date().toISOString())}</div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Phân trang đánh số từ 1 -> số truyện / 10 */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: "smooth" }); // Tự cuộn lên đầu khi chuyển trang
                            }}
                            className={`px-3 py-1 rounded-md text-sm font-semibold transition ${currentPage === page
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-[#1a1f2e] text-gray-400 hover:bg-[#2a3044] hover:text-white"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
}

export default NewestChaptersList;
