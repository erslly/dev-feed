import { NextResponse } from "next/server";

const RSS_FEEDS = [
  { name: "Hacker News", url: "https://news.ycombinator.com/rss" },
  { name: "Dev.to", url: "https://dev.to/feed" },
  { name: "Reddit - Programming", url: "https://www.reddit.com/r/programming/.rss" },
];

export async function GET() {
  const results = await Promise.all(
    RSS_FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url);
        const text = await res.text();
        return { name: feed.name, data: text };
      } catch (error) {
        return { name: feed.name, error: "Error fetching data" };
      }
    })
  );

  return NextResponse.json(results);
}
