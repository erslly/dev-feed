"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { Search, ArrowUp } from "lucide-react";
import { ClipLoader } from "react-spinners";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedSource, setSelectedSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch("/api/rss");
      const data = await res.json();

      const parsedNews: NewsItem[] = data.flatMap((feed: any) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(feed.data, "application/xml");
        const items = xml.querySelectorAll("item");

        return Array.from(items).map((item) => {
          const title = item.querySelector("title")?.textContent?.trim() || "No title";
          const link = item.querySelector("link")?.textContent?.trim() || "#";
          const source = feed.name?.trim() || "Unknown Source";
          const pubDate = item.querySelector("pubDate")?.textContent?.trim() || new Date().toISOString();

          return { title, link, source, pubDate };
        });
      });

      setNews(parsedNews);
    }

    fetchNews();

    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedNews = [...news].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      : new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
  });

  const filteredNews = sortedNews.filter((item) => {
    return (selectedSource === "all" || item.source === selectedSource) &&
           (item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <main className="max-w-4xl mx-auto p-4 relative">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white dark:text-white">📡 Yazılım Haberleri</h1>
      </header>

      <div className="flex items-center bg-gray-800 text-white rounded p-2 mb-4">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Haberlerde ara..."
          className="bg-transparent outline-none ml-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex justify-between mb-4">
        <select 
          className="p-2 rounded bg-gray-800 text-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">📅 En Yeni</option>
          <option value="oldest">📅 En Eski</option>
        </select>

        <select 
          className="p-2 rounded bg-gray-800 text-white"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option value="all">🌍 Tüm Kaynaklar</option>
          <option value="Hacker News">🚀 Hacker News</option>
          <option value="Dev.to">✍️ Dev.to</option>
          <option value="Reddit - Programming">💬 Reddit</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {news.length === 0 ? (
    <div className="flex justify-center items-center w-full col-span-3">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  ) : filteredNews.length > 0 ? (
    filteredNews.map((item, index) => <NewsCard key={index} {...item} />)
  ) : (
    <p className="text-gray-500 text-center col-span-3">Hiç haber bulunamadı...</p>
  )}
</div>


      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
        className={`fixed bottom-6 right-6 bg-gray-700 text-white p-3 rounded-full shadow-lg transition-transform duration-300 ${
          showScroll ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <ArrowUp size={24} />
      </button>

      <footer className="mt-10 text-center text-gray-500 text-sm pb-4">
        Made By{" "}
        <a 
          href="https://erslly.xyz/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:underline"
        >
          Erslly
        </a>
      </footer>
    </main>
  );
}
