export default async function handler(req:any, res:any) {
  const { url, metaName, metaContent } = req.query;

  if (!url || !metaName || !metaContent) {
    return res.status(400).json({ message: 'URL, metaName, and metaContent are required.' });
  }

  try {
    const formattedUrl = !/^https?:\/\//i.test(url) ? `https://${url}` : url;

    const response = await fetch(formattedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();

    // Search for the specific meta tag
    const metaTagPattern = new RegExp(`<meta[^>]+name=["']${metaName}["'][^>]+content=["']${metaContent}["'][^>]*>`, 'i');
    const found = metaTagPattern.test(html);

    if (found) {
      res.status(200).json({ found: true, message: `Meta tag found with name "${metaName}" and content "${metaContent}".` });
    } else {
      res.status(200).json({ found: false, message: `Meta tag not found with name "${metaName}" and content "${metaContent}".` });
    }
  } catch (error) {
    res.status(500).json({ found: false, message: 'Website or meta tag not found' });
  }
}
