import Header from "./Header";
import Pre_content from "./precontent";
import NewestChaptersList from "./newest_chapters_list/page";
export default function Home() {
  return (
    <div>
      <Header />
      <div className="w-full max-w-7xl mx-auto">
        <Pre_content />
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl p-4">
          <NewestChaptersList />
        </div>
      </div>
    </div>
  );
}