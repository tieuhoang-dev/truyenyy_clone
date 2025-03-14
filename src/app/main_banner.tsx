"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const banners = [
    { title: "Ổn Trụ Biệt Lãng", description: "Tu Tiên: Khi Người Làm Một Việc Đến Cực Hạn", image: "/banner1.jpg" },
    { title: "Thần Ma Hệ Thống", description: "Xuyên Không, Kỳ Ngộ, Hệ Thống Tu Luyện", image: "/banner3.jpg" },
    { title: "Đại Đạo Độc Hành", description: "Con Đường Tu Tiên Cô Độc Nhưng Đầy Kỳ Bí", image: "/banner4.jpg" },
    { title: "Nhất Kiếm Độc Tôn", description: "Kiếm Đạo Chí Tôn, Một Người Một Kiếm", image: "/banner2.jpg" },
];

export default function Main_Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // Chuyển banner sau mỗi 15 giây

        return () => clearInterval(interval); // Xóa interval khi component unmount
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg h-full">
            <div className="relative w-full h-full">
                <Image
                    src={banners[currentIndex].image}
                    alt={banners[currentIndex].title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white p-4">
                    <h2 className="text-xl font-bold">{banners[currentIndex].title}</h2>
                    <p className="text-sm">{banners[currentIndex].description}</p>
                </div>
            </div>
        </div>
    );
}
