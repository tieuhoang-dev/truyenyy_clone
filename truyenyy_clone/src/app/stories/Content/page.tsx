"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../Header";
import Link from "next/link";
import API_BASE_URL from "../../../../config";

type Story = {
    _id: string;
    title: string;
    author?: string;
    description?: string;
    cover_url?: string;
    chapters_count: number;
    view_count: number;
    genres: string[];
    content: string;
};

type Chapter = {
    _id: string;
    title: string;
    number: number;
    updatedAt?: string;
};

const StoryDetail = () => {
    const searchParams = useSearchParams();
    const storyID = searchParams.get("id");

    const [story, setStory] = useState<Story | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!storyID) return;

        const fetchStory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/stories/${storyID}`);
                if (!res.ok) throw new Error("Không thể lấy dữ liệu truyện");
                const data = await res.json();
                setStory(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        const fetchChapters = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/stories/${storyID}/chapters`);
                const data = await res.json();

                if (data && Array.isArray(data.chapters)) {
                    const sortedChapters = data.chapters
                        .map((chapter: any) => ({
                            _id: chapter.id,
                            title: chapter.title,
                            number: chapter.chapter_number,
                            updatedAt: chapter.updated_at,
                        }))
                        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                    const latestChapters = sortedChapters.slice(0, 3); // Hiển thị 3 chương mới nhất
                    setChapters(latestChapters);
                } else {
                    setChapters([]);
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách chương:", err);
            }
        };

        fetchStory();
        fetchChapters();
    }, [storyID]);

    if (loading) return <p>Đang tải thông tin truyện...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!story) return <p>Không tìm thấy truyện.</p>;

    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto p-6">
                {/* Thông tin truyện và ảnh */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    {story.cover_url && (
                        <img
                            src={story.cover_url}
                            alt={story.title}
                            className="w-48 h-64 object-cover rounded shadow"
                        />
                    )}
                    <div className="flex-1 space-y-2 text-gray-700">
                        {/* Tên truyện và các thông tin */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                            <h1 className="text-3xl font-bold">{story.title}</h1>
                        </div>
                        <p className="text-sm text-gray-500">{story.author}</p>
                        {/* Đưa số chương và số lượt xem vào giữa tên và thể loại */}
                        <div className="flex sm:flex-row gap-2 text-sm text-gray-500 mt-2">
                            <p>{story.chapters_count} Chương</p>
                            <p>{story.view_count} Lượt xem</p>
                        </div>

                        <Link href={`/Chapters/list/?id=${storyID}`} >
                            <div className="my-3">

                                <button className="flex items-center gap-2 bg-white text-black text-base px-4 py-2 border border-gray-400 rounded shadow w-fit">
                                    <span className="text-xl font-bold leading-none">⋮</span>
                                    Mục lục
                                </button>

                            </div>
                        </Link>
                        {/* Thể loại truyện */}
                        {Array.isArray(story.genres) && story.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-18"> {/* Tăng margin-top để kéo thể loại xuống thêm */}
                                {story.genres.map((genre, index) => (
                                    <Link
                                        key={index}
                                        href={`/stories/category/${encodeURIComponent(genre)}`}
                                        className="inline-block bg-transparent text-cyan-600 text-sm px-4 py-2 rounded-none border-2 border-cyan-600"
                                    >
                                        {genre}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chương mới */}
                <div className="mt-8  border border-black-500 rounded p-4">
                    <div className="flex justify-between items-center bg-blue-200 px-4 py-2 rounded">
                        <h2 className="text-xl font-bold">Chương mới</h2>
                        <Link
                            href={`/Chapters/list/?id=${storyID}`}
                            className="text-sm text-black hover:text-white transition"
                        >
                            xem tất cả &gt;&gt;
                        </Link>
                    </div>
                    {chapters.length === 0 ? (
                        <p className="text-gray-500">Chưa có chương nào.</p>
                    ) : (
                        <div className="flex justify-between mt-4 space-x-1">
                            {chapters.map((chapter) => (
                                <Link
                                    key={chapter._id}
                                    href={`/Chapters?id=${chapter._id}`}
                                    className="bg-white text-amber-700 text-sm px-4 py-2 border-b-2 border-cyan-500 w-full text-center transition"
                                >
                                    {chapter.title}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mô tả truyện - Chuyển xuống dưới danh sách chương mới */}
                {story.description && (
                    <div className="mt-6 border border-cyan-500 rounded p-4">
                        <h3 className="text-xl font-semibold mb-2 bg-blue-200 px-4 py-2">Mô tả</h3>
                        <p className="italic text-gray-600">{story.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryDetail;