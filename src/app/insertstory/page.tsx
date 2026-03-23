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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Hàm xử lý khi người dùng chọn file ảnh
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setCoverUrl(data.url);
      } else {
        setError(data.error || 'Tải ảnh lên thất bại.');
      }
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi kết nối tới server tải ảnh.');
    } finally {
      setUploadingImage(false);
    }
  };

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories`, {
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
          genres: genre.split(',').map((g) => g.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo truyện mới.');
      }

      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Đăng Truyện Mới</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề truyện</label>
            <input
              type="text"
              placeholder="Nhập tiêu đề truyện"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
            <input
              type="text"
              placeholder="Tên tác giả"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
            <input
              type="text"
              placeholder="Ngăn cách bằng dấu phẩy (vd: Tiên hiệp, Huyền ảo)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">hoặc</span>
              <input
                type="text"
                placeholder="Nhập URL ảnh"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />
            </div>
            {uploadingImage && <p className="text-sm text-blue-500 mt-2">Đang tải ảnh lên...</p>}
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Cover Preview" className="mt-4 w-32 h-44 object-cover rounded-md shadow-md border" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu truyện</label>
            <textarea
              placeholder="Nhập giới thiệu truyện..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-32 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

          <button
            onClick={handleCreateStory}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || uploadingImage}
          >
            {loading ? 'Đang tạo truyện...' : 'Đăng truyện mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
