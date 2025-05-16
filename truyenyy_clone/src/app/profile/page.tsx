'use client';

import { useEffect, useState } from 'react';
import Header from '../Header';
import Link from 'next/link';
import Cookies from 'js-cookie';
import API_BASE_URL from '../../../config'; // Đường dẫn đến file config chứa API_BASE_URL

type User = {
  username: string;
  role: string;
  status?: string;
  created_at?: string;
};

type Story = {
  id: string;
  title: string;
};

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [formattedDate, setFormattedDate] = useState<string>("Không rõ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) return;
    setToken(cookieToken);

    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${cookieToken}` },
        });
        if (!userRes.ok) throw new Error('Lỗi khi lấy thông tin người dùng');
        const userData = await userRes.json();
        setUserInfo(userData);

        if (userData.created_at) {
          const dateStr = new Date(userData.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          setFormattedDate(dateStr);
        }

        const storyRes = await fetch(`${API_BASE_URL}/users/stories`, {
          headers: { Authorization: `Bearer ${cookieToken}` },
        });
        const storyData = await storyRes.json();
        setStories(storyData.stories || []);
      } catch (err) {
        setError("Không thể tải thông tin.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!token) return <p className="text-center mt-10 text-red-500">Vui lòng đăng nhập.</p>;
  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header />
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="md:w-1/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Thông tin người dùng</h2>
          {userInfo ? (
            <div className="space-y-2">
              <p><strong>Tên người dùng:</strong> {userInfo.username}</p>
              <p><strong>Vai trò:</strong> {userInfo.role}</p>
              <p><strong>Trạng thái:</strong> {userInfo.status || 'Không rõ'}</p>
              <p><strong>Ngày tạo:</strong> {formattedDate}</p>
            </div>
          ) : (
            <p>Không tìm thấy thông tin người dùng.</p>
          )}
        </div>
        <div className="md:w-2/3 bg-white p-4 rounded-lg shadow mt-6 md:mt-0">
          <h2 className="text-xl font-bold mb-4">Danh sách truyện của bạn</h2>
          {stories.length === 0 ? (
            <p>Bạn chưa có truyện nào.</p>
          ) : (
            <ul className="space-y-4">
              {stories.map((story) => (
                <li key={story.id}>
                  <Link href={`/stories/Content?id=${story.id}`} className="block">
                    <div className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition">
                      <h3 className="text-lg font-semibold text-gray-800">{story.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
