"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Header from "../../Header";

type Story = {
    id: string;
    title: string;
    author?: string;
    chapters_count?: number;
};

const SearchPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [results, setResults] = useState<Story[]>([]);
    const name = searchParams.get("name");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/search?name=${encodeURIComponent(name || "")}`,
                );

                if (!res.ok) {
                    throw new Error(`Lỗi server: ${res.status}`);
                }

                const data: Story[] = await res.json();
                console.log("Dữ liệu trả về từ API:", data);

                if (data.length > 0) {
                    setResults(data);
                } else {
                    setResults([]); 
                }
            } catch (err) {
                console.error("Lỗi khi gọi API:", err);
                setResults([]);
            }
        };

        if (!name) return;
        fetchData();
    }, [name]);

    const handleStoryClick = (id: string) => {
        console.log("Đang chuyển hướng đến truyện với ID:", id);

        if (id) {
            router.push(`/stories/Content?id=${id}`);
        } else {
            console.error("Không có ID truyện hợp lệ.");
        }
    };

    return (
        <div>
            <Header />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Kết quả tìm kiếm cho: &quot;{name}&quot;
                </h2>
                {results.length > 0 ? (
                    <ul className="space-y-2">
                        {results.map((story) => (
                            <li
                                key={story.id}
                                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleStoryClick(story.id)}  
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

const SearchPage = () => {
    return (
        <Suspense fallback={<p className="text-center py-10">Đang tải...</p>}>
            <SearchPageContent />
        </Suspense>
    );
};

export default SearchPage;