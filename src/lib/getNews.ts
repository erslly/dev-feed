export async function getNews() {
    const urls = [
      "https://hnrss.org/frontpage", 
      "https://dev.to/feed", 
      "https://www.reddit.com/r/programming/.rss", 
    ];
  
    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url);
      return response.text();
    });
  
    const responses = await Promise.all(fetchPromises);
    return responses;
  }
  
