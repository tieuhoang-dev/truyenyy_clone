"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Banner = {
    title: string;
    description: string;
    image: string;
    storyId: string;
};

export default function Main_Banner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/ranking?limit=3`);
                const data = await res.json();

                const formatted: Banner[] = data.map((story: { title: string; description?: string; cover_url?: string; id: string }) => ({
                    title: story.title,
                    description: story.description || "Không có mô tả",
                    image: story.cover_url ? (story.cover_url.startsWith('http') ? story.cover_url : `${process.env.NEXT_PUBLIC_API_BASE_URL}${story.cover_url}`) : "/default-banner.jpg",
                    storyId: story.id,
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

    const isValidImageDomain = (url: string) => {
        const validDomains = ["demo-production-fbf4.up.railway.app", "anotherdomain.com"];

        try {
            const urlObj = new URL(url, window.location.origin);
            return validDomains.includes(urlObj.hostname);
        } catch (err) {
            console.error(err);
            return false;
        }
    };
    if (banners.length === 0) {
        return <div className="text-center py-10">Đang tải banner...</div>;
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
            <Link href={`/stories/Content?id=${currentBanner.storyId}`} className="block w-full h-full">
                <div className="relative w-full h-full min-h-[16rem] md:min-h-[24rem] flex justify-center items-center">
                    {isValidImageDomain(currentBanner.image) ? (
                        <Image
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            fill
                            unoptimized
                            className="object-cover rounded-lg"
                        />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}

                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
                        <h2 className="text-xl font-bold">{currentBanner.title}</h2>
                        <p className="text-sm">{currentBanner.description}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}