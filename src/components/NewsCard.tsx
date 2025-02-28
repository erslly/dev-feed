import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

type NewsCardProps = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

export default function NewsCard({ title, link, source, pubDate }: NewsCardProps) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition transform hover:-translate-y-1"
    >
      <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-sm">{source}</p>
      <p className="text-gray-500 text-xs mt-1">
        🕒 {formatDistanceToNow(new Date(pubDate), { addSuffix: true, locale: tr })}
      </p>
      <div className="mt-3 text-blue-400 text-sm font-semibold">Haberi Oku →</div>
    </a>
  );
}
