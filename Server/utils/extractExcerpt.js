function extractPlainText(node, parts = []) {
  if (!node) return parts;

  if (node.type === "text" && node.text) {
    parts.push(node.text);
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => extractPlainText(child, parts));
    if (["paragraph", "heading", "listitem", "quote"].includes(node.type)) {
      parts.push(" "); // keep block boundaries from running words together
    }
  }

  return parts;
}

function getPlainText(contentJson) {
  const parsed = typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson;
  return extractPlainText(parsed.root).join("").replace(/\s+/g, " ").trim();
}

export function generateExcerpt(contentJson, maxLength = 200) {
  const text = getPlainText(contentJson);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function countWords(contentJson) {
  const text = getPlainText(contentJson);
  if (!text) return 0;
  return text.split(/\s+/).length;
}