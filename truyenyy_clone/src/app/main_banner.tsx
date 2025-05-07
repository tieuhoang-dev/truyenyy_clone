"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";  // Import Link từ Next.js

type Banner = {
    title: string;
    description: string;
    image: string;
    storyId: string; // Thêm `storyId` để liên kết với truyện
};

export default function Main_Banner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const res = await fetch("http://192.168.16.104:8080/stories/ranking?limit=3");
                const data = await res.json();

                const formatted: Banner[] = data.map((story: any) => ({
                    title: story.title,
                    description: story.description || "Không có mô tả",
                    image: story.cover_url || "/default-banner.jpg",
                    storyId: story.id,  // Sử dụng `id` thay vì `_id`
                }));

                setBanners(formatted);
            } catch (error) {
                console.error("Lỗi khi gọi API top truyện:", error);
            }
        };

        fetchTopStories();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (banners.length > 0) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [banners]);

    // Kiểm tra xem domain của hình ảnh có hợp lệ không
    const isValidImageDomain = (url: string) => {
        const validDomains = ["yourdomain.com", "anotherdomain.com"]; // Cấu hình các domain hợp lệ của bạn
        const urlObj = new URL(url);
        return validDomains.includes(urlObj.hostname);
    };

    if (banners.length === 0) {
        return <div className="text-center py-10">Đang tải banner...</div>;
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg h-full">
            {/* Bao quanh phần banner với Link để dẫn đến trang chi tiết */}
            <Link href={`/stories/Content?id=${currentBanner.storyId}`} className="block w-full h-full">
                <div className="relative w-full h-64 md:h-96 flex justify-center items-center">
                    {isValidImageDomain(currentBanner.image) ? (
                        <Image
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            width={600} // Đặt width và height cho hình ảnh
                            height={400}
                            style={{ objectFit: "contain" }} // Điều chỉnh objectFit để hình ảnh không bị kéo giãn
                            className="rounded-lg"
                        />
                    ) : (
                        <img
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            className="rounded-lg object-contain"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain", // Giữ tỷ lệ hình ảnh và không bị kéo giãn
                            }}
                        />
                    )}

                    {/* Tiêu đề và mô tả vẫn giữ nguyên nhưng nằm dưới cùng của banner */}
                    <div className="absolute bottom-[-60px] w-full bg-black bg-opacity-70 text-white p-4">
                        <h2 className="text-xl font-bold">{currentBanner.title}</h2>
                        <p className="text-sm">{currentBanner.description}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}