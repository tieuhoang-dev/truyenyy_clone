'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 thêm dòng này
import Header from '../../Header';
import Link from 'next/link';

type Story = {
    id: string;
    title: string;
    cover_url?: string;
    view_count: number;
    author?: string;
};

const TopStories = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // 👈 thêm dòng này

    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const res = await fetch('http://192.168.16.104:8080/stories/ranking?limit=10');
                const data = await res.json();
                setStories(data);
            } catch (error) {
                console.error('Lỗi khi tải top truyện:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopStories();
    }, []);

    if (loading) return <p>Đang tải top truyện...</p>;

    // Hàm xử lý sự kiện click vào truyện để chuyển hướng
    const handleStoryClick = (id: string) => {
        // Kiểm tra ID trong console
        console.log("Đang chuyển hướng đến truyện với ID:", id);

        if (id) {
            // Nếu có ID hợp lệ, chuyển hướng đến trang chi tiết truyện
            router.push(`/stories/Content?id=${id}`);
        } else {
            // Nếu không có ID, log lỗi và không thực hiện chuyển trang
            console.error("Không có ID truyện hợp lệ.");
        }
    };
    return (
        <div className="p-4">
            <Header />
            <h2 className="text-2xl font-bold mb-4">Top Truyện</h2>
            <ul className="space-y-4">
                {stories.map((story, index) => (
                    <Link key={story.id} href={`/stories/Content?id=${story.id}`}>
                        <li
                            key={story.id}
                            className="flex items-center bg-white rounded shadow p-4 cursor-pointer hover:bg-gray-100"
                        >
                            <span className="text-xl font-bold w-8">{index + 1}</span>
                            {story.cover_url && (
                                <img
                                    src={story.cover_url}
                                    alt={story.title}
                                    className="w-16 h-20 object-cover rounded mr-4"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{story.title}</h3>
                                <p className="text-sm text-gray-500">Lượt xem: {story.view_count}</p>
                                {story.author && <p className="text-sm text-gray-400">Tác giả: {story.author}</p>}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default TopStories;