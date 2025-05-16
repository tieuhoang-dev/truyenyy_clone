"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext"; 
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Header from "../Header"; 
import { FaTrashAlt } from "react-icons/fa"; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../../../config"; 

type Book = {
    story_title: string;
    chapter_number: string;
    chapter_title: string;
    updated_at: string;
    story_id: string;
    last_chapter_id: string;
};

const BookshelfPage = () => {
    const { user, token, isAuthenticated } = useContext(AuthContext)!;
    const [bookshelf, setBookshelf] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const cookieToken = Cookies.get("token");
        if (!cookieToken) {
            router.push("/login");
            return;
        }

        const fetchBookshelf = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/bookshelf`, {
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                    mode: "cors",
                });

                if (!res.ok) {
                    throw new Error("Không thể tải dữ liệu tủ sách.");
                }

                const data = await res.json();
                setBookshelf(data);
            } catch (err: any) {
                console.error("Fetch error:", err); // để debug
                setError(err.message || "Đã xảy ra lỗi.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookshelf();
    }, [router]);

    const removeBookFromBookshelf = async (storyId: string) => {
        const cookieToken = Cookies.get("token");
        if (!cookieToken) {
            toast.error("Vui lòng đăng nhập."); // Thông báo nếu chưa đăng nhập
            return;
        }

        try {
            const res = await fetch(`http://192.168.222.13:8080/bookshelf/${storyId}`, {
                method: "DELETE", // Gửi yêu cầu xóa
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Không thể xóa truyện khỏi tủ sách.");
            }

            // Cập nhật lại danh sách bookshelf sau khi xóa
            setBookshelf(bookshelf.filter((book) => book.story_id !== storyId));
            toast.success("Truyện đã được xóa khỏi tủ sách."); // Thông báo xóa thành công
        } catch (err: any) {
            console.error("Remove error:", err);
            toast.error("Đã xảy ra lỗi khi xóa truyện."); // Thông báo lỗi khi xóa không thành công
        }
    };

    if (loading) return <p>Đang tải tủ sách...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <Header />
            <h1 className="text-2xl font-semibold mb-4">Tủ sách của bạn</h1>
            {bookshelf.length === 0 ? (
                <p>Bạn chưa đánh dấu chương nào.</p>
            ) : (
                <ul className="space-y-3">
                    {bookshelf.map((book, index) => (
                        <li key={index} className="border p-4 rounded shadow flex justify-between items-center">
                            <div className="flex flex-col space-y-2">
                                <Link href={`/stories/Content?id=${book.story_id}`}>
                                    <p className="font-medium">{book.story_title}</p>
                                </Link>
                                <Link href={`/Chapters?id=${book.last_chapter_id}`}>
                                    <p>Chương: {book.chapter_number} - {book.chapter_title}</p>
                                </Link>
                                <p className="text-sm text-gray-500">
                                    Cập nhật: {new Date(book.updated_at).toLocaleString()}
                                </p>
                            </div>
                            
                            {/* Nút xóa ở phía bên phải */}
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeBookFromBookshelf(book.story_id)}
                            >
                                <FaTrashAlt size={20} /> {/* Biểu tượng thùng rác */}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Thêm ToastContainer ở cuối trang */}
            <ToastContainer 
                position="bottom-right"
                autoClose={5000} // Thời gian hiển thị thông báo (ms)
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default BookshelfPage;
