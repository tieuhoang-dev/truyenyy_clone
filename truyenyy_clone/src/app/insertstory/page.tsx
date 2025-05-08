'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Header';
import Cookies from 'js-cookie';

export default function InsertStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleCreateStory = async () => {
    if (!title.trim() || !author.trim() || !genre.trim() || !coverUrl.trim() || !description.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Không tìm thấy token, vui lòng đăng nhập lại.');
        return;
      }

      const response = await fetch('http://192.168.16.104:8080/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          author,
          cover_url: coverUrl,
          description,
          genres: genre.split(',').map((g) => g.trim()), // <-- xử lý genres đúng kiểu
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo truyện mới.');
      }

      router.push('/profile');
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header />
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Đăng truyện mới</h2>

        <input
          type="text"
          placeholder="Tiêu đề truyện"
          className="p-2 w-full border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tác giả"
          className="p-2 w-full border rounded mb-4"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Thể loại (ngăn cách bằng dấu phẩy, ví dụ: Tiên hiệp, Huyền ảo)"
          className="p-2 w-full border rounded mb-4"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL ảnh bìa"
          className="p-2 w-full border rounded mb-4"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />

        <textarea
          placeholder="Giới thiệu truyện"
          className="p-2 w-full border rounded mb-4 h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleCreateStory}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Đăng truyện mới'}
        </button>
      </div>
    </div>
  );
}
