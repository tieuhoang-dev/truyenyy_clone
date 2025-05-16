'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Header from '../Header';
import API_BASE_URL from '../../../config';

export default function AddChapterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [storyId, setStoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const cookieToken = Cookies.get('token');
        if (!cookieToken) {
            router.push('/login');
            return;
        }
        setToken(cookieToken);

        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setStoryId(idFromUrl);
        }
    }, [searchParams, router]);

    const handleAddChapter = async () => {
        if (!title || !content || !storyId) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/stories/chapters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    story_id: storyId,
                }),
            });

            if (!response.ok) {
                throw new Error('Không thể thêm chương. Vui lòng thử lại.');
            }

            // ✅ Thành công → điều hướng về quản lý truyện
            router.push('/storymanage');
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div className="p-6 space-y-6">
            <Header />
            <h2 className="text-2xl font-semibold mb-6">Thêm chương mới</h2>

            <div>
                <label htmlFor="title" className="block text-sm font-medium">Tiêu đề chương</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tiêu đề chương"
                    className="mt-2 p-2 w-full border rounded-md shadow-sm"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium">Nội dung chương</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nội dung chương"
                    rows={5}
                    className="mt-2 p-2 w-full border rounded-md shadow-sm"
                />
            </div>

            <div>
                <label htmlFor="story_id" className="block text-sm font-medium">ID của truyện</label>
                <input
                    type="text"
                    id="story_id"
                    value={storyId}
                    onChange={(e) => setStoryId(e.target.value)}
                    placeholder="Nhập ID truyện"
                    className="mt-2 p-2 w-full border rounded-md shadow-sm"
                />
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="mt-6">
                <button
                    onClick={handleAddChapter}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    disabled={loading}
                >
                    {loading ? 'Đang thêm chương...' : 'Thêm chương'}
                </button>
            </div>
        </div>
    );
}
