'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Header from '../Header';
import API_BASE_URL from '../../../config';

type Story = {
    id: string;
    title: string;
    description?: string;
};

export default function StoryManagePage() {
    const [token, setToken] = useState<string | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cookieToken = Cookies.get('token');
        if (!cookieToken) return;

        setToken(cookieToken);

        const fetchStories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/stories`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin truyện.');
                }

                const data = await response.json();
                setStories(data.stories || []);
            } catch (err) {
                setError('Đã xảy ra lỗi khi lấy danh sách truyện.');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (!token) {
        return <p className="text-center mt-10 text-red-500">Vui lòng đăng nhập để quản lý truyện.</p>;
    }

    if (loading) {
        return <p className="text-center mt-10">Đang tải danh sách truyện...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    return (
        <div className="p-6">
            <Header />
            <h2 className="text-2xl font-semibold mb-6">Quản lý truyện của bạn</h2>

            {stories.length === 0 ? (
                <p>Không có truyện nào để hiển thị.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <div key={story.id} className="p-4 border rounded-lg shadow-sm">
                            <h3 className="font-semibold text-lg">{story.title}</h3>
                            <p className="mt-2 text-gray-600">{story.description || 'Không có mô tả.'}</p>
                            <div className="mt-4">
                                <Link
                                    href={`/addchapter?id=${story.id}`}
                                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    Thêm chương
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
