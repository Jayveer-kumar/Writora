const ALLOWED_PROTOCOLS = ["http:", "https:"];

// Optional: restrict images to your own CDN/trusted domains.
// Leave empty to allow any http(s) URL.
const ALLOWED_DOMAINS = [];

function isValidImageUrl(url) {
  try {
    const parsed = new URL(url);

    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return false;

    if (
      ALLOWED_DOMAINS.length > 0 &&
      !ALLOWED_DOMAINS.some((domain) => parsed.hostname.endsWith(domain))
    ) {
      return false;
    }

    return true;
  } catch {
    return false; // malformed URL
  }
}

// Walks the Lexical JSON tree and pulls out every image node's src
function extractImageUrls(node, urls = []) {
  if (!node) return urls;

  if (node.type === "image" && node.src) urls.push(node.src);

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => extractImageUrls(child, urls));
  }

  return urls;
}

// Also useful for setting coverImage automatically
 function extractFirstImageUrl(contentJson) {
  const parsed = typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson;
  const urls = extractImageUrls(parsed.root);
  return urls[0] || null;
}

 function validateContentImages(contentJson) {
  const parsed = typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson;
  const urls = extractImageUrls(parsed.root);
  const invalidUrls = urls.filter((url) => !isValidImageUrl(url));
  return { valid: invalidUrls.length === 0, invalidUrls };
}

export { validateContentImages , extractFirstImageUrl }