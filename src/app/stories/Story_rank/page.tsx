'use client';

import { useEffect, useState } from 'react';
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

    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/ranking?limit=10`);
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
                                // eslint-disable-next-line @next/next/no-img-element
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