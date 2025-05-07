'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../Header';
import Link from 'next/link';

type Chapter = {
    id: string;
    title: string;
    content: string;
    chapter_number: number;
    view_count: number;
    updated_at?: string;
    story_id: string;
};

type Story = {
    _id: string;
    title: string;
    author: string;
};

const ChapterDetail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chapterID = searchParams.get('id');

    const hasFetched = useRef(false); // Ref giúp theo dõi việc đã gọi API hay chưa

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [story, setStory] = useState<Story | null>(null);
    const [previousChapterID, setPreviousChapterID] = useState<string | null>(null);
    const [nextChapterID, setNextChapterID] = useState<string | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [showChapters, setShowChapters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [storyID, setStoryID] = useState<string | null>(null);

    // Load chương mỗi khi URL thay đổi, nhưng chỉ fetch API 1 lần duy nhất
    useEffect(() => {
        if (!chapterID || hasFetched.current) return;  // Kiểm tra nếu API đã được gọi

        hasFetched.current = true;  // Đánh dấu là đã gọi API

        const fetchData = async () => {
            setLoading(true);

            try {
                const chapterRes = await fetch(`http://192.168.16.104:8080/stories/chapters/id/${chapterID}`);
                const chapterJson = await chapterRes.json();
                const chapterData = chapterJson.chapter;
                setChapter(chapterData);
                setPreviousChapterID(chapterJson.previous?.id || null);
                setNextChapterID(chapterJson.next?.id || null);
                setStoryID(chapterData.story_id); // Lưu ID truyện để sử dụng sau này
                const storyRes = await fetch(`http://192.168.16.104:8080/stories/${chapterData.story_id}`);
                const storyData = await storyRes.json();
                setStory(storyData);

                const chaptersRes = await fetch(`http://192.168.16.104:8080/stories/${chapterData.story_id}/chapters`);
                const chaptersJson = await chaptersRes.json();
                setChapters(chaptersJson.chapters);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                setChapter(null);
                setStory(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [chapterID]); // Chỉ chạy lại khi `chapterID` thay đổi

    const handleChangeChapter = (newId: string) => {
        hasFetched.current = false;  // Đánh dấu lại là chưa gọi API để tránh gọi lại lần sau
        router.push(`/Chapters?id=${newId}`);
    };

    if (loading) return <div className="text-center py-10">Đang tải chương...</div>;
    if (!chapter || !story) return <div className="text-center py-10 text-red-500">Không tìm thấy chương.</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />

            <div className="py-6 text-center">
                <Link href={`/stories/Content/?id=${storyID}`}>
                    <h2 className="text-xl font-bold text-gray-800 cursor-pointer hover:underline">{story.title}</h2>
                </Link>
                <p className="text-sm text-gray-600 mt-1">Tác giả: {story.author}</p>

                <div className="flex items-center justify-center space-x-4 mt-4 text-gray-700">
                    {previousChapterID && (
                        <button
                            onClick={() => handleChangeChapter(previousChapterID)}
                            className="text-yellow-700 hover:text-yellow-800 text-xl"
                        >
                            ◀
                        </button>
                    )}
                    <span className="text-sm">
                        Chương {chapter.chapter_number}: {chapter.title}
                    </span>
                    {nextChapterID && (
                        <button
                            onClick={() => handleChangeChapter(nextChapterID)}
                            className="text-yellow-700 hover:text-yellow-800 text-xl"
                        >
                            ▶
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                    <button className="border px-4 py-1 rounded hover:bg-gray-200 text-sm">⚙️ Cấu hình</button>
                    <button
                        onClick={() => setShowChapters(!showChapters)}
                        className="border px-4 py-1 rounded hover:bg-gray-200 text-sm"
                    >
                        📋 Mục lục
                    </button>
                    <button className="border px-4 py-1 rounded hover:bg-gray-200 text-sm">🔖 Đánh dấu</button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Chương {chapter.chapter_number}: {chapter.title}
                </h1>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: chapter.content.replace(/\n/g, '<br />'),
                    }}
                />
                <div className="mt-4 text-sm text-gray-500">
                    {chapter.updated_at && <>Cập nhật lúc: {new Date(chapter.updated_at).toLocaleString()}</>}
                    <br />
                    Lượt xem: {chapter.view_count}
                </div>
            </div>

            {showChapters && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative">
                        <button
                            onClick={() => setShowChapters(false)}
                            className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900"
                        >
                            ✖
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Mục Lục</h3>
                        <ul className="list-disc pl-6 max-h-[400px] overflow-y-auto">
                            {chapters.map((ch) => (
                                <li key={ch.id}>
                                    <button
                                        onClick={() => {
                                            setShowChapters(false);
                                            handleChangeChapter(ch.id);
                                        }}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Chương {ch.chapter_number}: {ch.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterDetail;