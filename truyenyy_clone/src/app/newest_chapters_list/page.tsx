"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Bookmark } from "lucide-react";
import API_BASE_URL from "../../../config";

type Story = {
    id: string;
    title: string;
    view_count: number;
    updated_at: string;
    cover_url?: string;
    latest_chapter?: {
        id: string;
        chapter_number: number;
        created_at: string;
        views?: number;
        comments?: number;
    };
};

const NewestChaptersList = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/stories/newest?limit=10`);
                if (!res.ok) throw new Error("Lỗi khi gọi API");
                const data = await res.json();
                if (!Array.isArray(data)) throw new Error("Dữ liệu sai định dạng");
                setStories(data);
            } catch (err) {
                console.error("❌", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading) return <div className="text-center py-4">⏳ Đang tải...</div>;

    return (
        <div className="p-3 bg-[#0e1320] rounded shadow text-white">
            <h2 className="text-xl font-semibold mb-4">📚 Truyện mới cập nhật</h2>
            <div className="space-y-4">
                {stories.map((story, index) => {
                    const chap = story.latest_chapter;
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
                            <img
                                src={story.cover_url || "/placeholder.png"}
                                alt={story.title}
                                className="w-16 h-24 object-cover rounded mr-4"
                            />
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">{story.title}</h3>
                                    {chap ? (
                                        <Link
                                            href={`/Chapters?id=${chap.id}`}
                                            className="text-sm text-gray-300 hover:text-gray-100 transition underline"
                                            onClick={(e) => e.stopPropagation()} // Không để lan click ra ngoài
                                        >
                                            Chapter {chap.chapter_number}
                                        </Link>
                                    ) : (
                                        <p className="text-sm text-gray-400">Chưa có chương</p>
                                    )}
                                </div>
                                {chap && (
                                    <div className="flex items-center text-xs text-gray-400 mt-2 gap-4">
                                        <div className="flex items-center gap-1">
                                            <Bookmark size={14} /> {chap.comments ?? 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye size={14} /> {(story.view_count ?? 0).toLocaleString()}
                                        </div>
                                        <div className="ml-auto">{timeAgo(chap.created_at)}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
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
