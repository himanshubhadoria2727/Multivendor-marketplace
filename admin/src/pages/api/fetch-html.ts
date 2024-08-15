// pages/api/fetch-html.js
export default async function handler(req:any, res:any) {
  const { url, searchString } = req.query;

  if (!url || !searchString) {
    return res.status(400).json({ message: 'URL and searchString are required.' });
  }

  try {
    // Ensure the URL has the correct protocol
    const formattedUrl = !/^https?:\/\//i.test(url) ? `https://${url}` : url;

    // Fetch the HTML content
    const response = await fetch(formattedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();

    // Check if the HTML includes the search string
    if (html.includes(searchString)) {
      res.status(200).json({ found: true, message: `"${searchString}" found in the HTML content!` });
    } else {
      res.status(200).json({ found: false, message: `"${searchString}" not found in the HTML content.` });
    }
  } catch (error) {
    res.status(500).json({ found: false, message: 'An error occurred while fetching the URL.' });
  }
}
