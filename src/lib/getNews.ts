export async function getNews() {
    const urls = [
      "https://hnrss.org/frontpage", // Hacker News
      "https://dev.to/feed", // Dev.to
      "https://www.reddit.com/r/programming/.rss", // Reddit Programming
    ];
  
    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url);
      return response.text();
    });
  
    const responses = await Promise.all(fetchPromises);
    return responses;
  }
  