"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../Header";
import API_BASE_URL from "../../../../config"; // Đường dẫn đến file config chứa API_BASE_URL

type Story = {
    id: string;
    title: string;
    author?: string;
    chapters_count?: number;
};

const SearchPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [results, setResults] = useState<Story[]>([]);
    const name = searchParams.get("name");

    // Hàm fetch dữ liệu truyện từ API
    const fetchData = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/stories/search?name=${encodeURIComponent(name || "")}`,
            );

            if (!res.ok) {
                throw new Error(`Lỗi server: ${res.status}`);
            }

            const data: Story[] = await res.json();
            console.log("Dữ liệu trả về từ API:", data); // Kiểm tra dữ liệu trả về từ API

            if (data.length > 0) {
                setResults(data);
            } else {
                setResults([]); // Nếu không có kết quả trả về
            }
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            setResults([]);
        }
    };

    useEffect(() => {
        if (!name) return;
        fetchData(); // Gọi fetchData khi có tên truyện
    }, [name]);

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
        <div>
            <Header />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Kết quả tìm kiếm cho: "{name}"
                </h2>
                {results.length > 0 ? (
                    <ul className="space-y-2">
                        {results.map((story) => (
                            <li
                                key={story.id}
                                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleStoryClick(story.id)}  // Truyền đúng ID khi click vào truyện
                            >
                                <h3 className="text-lg font-semibold">{story.title}</h3>
                                {story.author && <p>Tác giả: {story.author}</p>}
                                {story.chapters_count !== undefined && (
                                    <p>Số chương: {story.chapters_count}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Không tìm thấy truyện nào.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;