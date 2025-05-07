import Sidebar from "./categories";
import Main_Banner from "./main_banner";

export default function HomePage() {
    return (
        <div className="grid grid-cols-14 gap-4 p-4">
            <div className="col-span-2"><Sidebar /></div>

            <main className="col-span-10 flex flex-col items-center">
                <Main_Banner />
            </main>

            <aside className="col-span-2 bg-gray-100 p-4 rounded-lg text-center h-full">
                <h3 className="text-lg font-semibold">Bạn muốn đăng truyện lên TruyenYY?</h3>
                <p className="text-sm text-gray-600 mt-2">
                    Chúng tôi sẵn sàng hỗ trợ bạn bất cứ lúc nào.
                </p>
                <button className="w-full bg-blue-500 text-white p-2 mt-3 rounded">
                    Hướng Dẫn Đăng Truyện
                </button>
                <button className="w-full bg-blue-400 text-white p-2 mt-2 rounded">
                    Trung Tâm Xuất Bản
                </button>
            </aside>
        </div>

    );
};