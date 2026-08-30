/**
 * serialize.js
 * Blocks array <-> save payload, and word-count calculation.
 * Kept separate from state logic so it can be unit-tested / reused
 * (e.g. same shape needed by a backend renderer later).
 */

/** Strip a single block down to plain text for word counting / previews */
function blockToText(block) {
  switch (block.type) {
    case "paragraph":
    case "header":
    case "quote":
      return block.data.text || "";
    case "code":
      return block.data.code || "";
    case "list":
      return (block.data.items || []).join(" ");
    case "image":
      return block.data.caption || "";
    case "delimiter":
      return "";
    default:
      return "";
  }
}

/** Count words across title + all blocks */
export function countWords(title, blocks) {
  const bodyText = blocks.map(blockToText).join(" ").replace(/<[^>]+>/g, " ");
  const titleWords = title.trim().split(/\s+/).filter(Boolean).length;
  const bodyWords = bodyText.trim().split(/\s+/).filter(Boolean).length;
  return titleWords + bodyWords;
}

/** Build the exact payload sent to the backend for draft/publish */
export function buildPayload(title, blocks, extra = {}) {
  return {
    title,
    content: {
      blocks: blocks.map(({ id, type, data }) => ({ id, type, data })),
    },
    ...extra,
  };
}

/** Pull out every image public_id currently referenced in the blocks */
export function getReferencedImageIds(blocks) {
  const ids = new Set();
  blocks.forEach((b) => {
    if (b.type === "image" && b.data?.public_id) ids.add(b.data.public_id);
  });
  return ids;
}

/** Generate a short unique id for a new block */
export function newBlockId() {
  return `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}