'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../Header';
import Link from 'next/link';
type Story = {
    id: string;
    title: string;
    cover_url?: string;
    view_count: number;
    author?: string;
};

export default function GenrePage() {
    const { genre } = useParams();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!genre) return;

        const fetchStories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/genre/${genre}`);
                if (!res.ok) throw new Error('Lỗi khi gọi API');
                const data = await res.json();
                setStories(data);
            } catch (err) {
                console.error(err);
                setError('Không thể tải truyện của thể loại này.');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [genre]);

    if (loading) return <p>Đang tải truyện...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <Header />
            <h1 className="text-2xl font-bold mb-4">Thể loại: {decodeURIComponent(String(genre))}</h1>
            <ul className="space-y-4">
                {stories.map((story) => (
                    <Link key={story.id} href={`/stories/Content?id=${story.id}`} className="block">

                        <li key={story.id} className="flex items-center bg-white rounded shadow p-4">
                            {story.cover_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={story.cover_url ? process.env.NEXT_PUBLIC_API_BASE_URL + story.cover_url : "/placeholder.png"}
                                    alt={story.title}
                                    className="w-24 h-32 object-cover rounded mr-4"
                                />
                            )}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-800">{story.title}</h2>
                                <p className="text-sm text-gray-600 mt-1">👁️ {story.view_count} lượt xem</p>
                                {story.author && <p className="text-sm text-gray-500 mt-1">✍️ Tác giả: {story.author}</p>}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}