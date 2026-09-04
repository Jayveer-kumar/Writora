import React from "react";
import "./BlogRenderer.css";

/**
 * BlogRenderer
 *
 * Renders a saved Lexical content JSON string back to HTML/JSX,
 * preserving the exact order the author wrote it in (headings,
 * paragraphs, images, lists — whatever order they appear in the
 * `children` array is the order they render in).
 *
 * This is a plain renderer — it does NOT need Lexical installed on
 * the read/display side. It just walks the JSON tree you already
 * get back from your API.
 *
 * Usage:
 *   <BlogRenderer content={blog.content} />
 *   // blog.content can be the raw JSON string OR already-parsed object
 */
export default function BlogRenderer({ content }) {
  if (!content) return null;

  const parsed = typeof content === "string" ? JSON.parse(content) : content;
  const children = parsed?.root?.children || [];

  return (
    <div className="blog-rendered-content">
      {children.map((node, i) => (
        <BlockNode key={i} node={node} />
      ))}
    </div>
  );
}

// Renders one top-level block (heading, paragraph, list, quote, code...)
function BlockNode({ node }) {
  switch (node.type) {
    case "heading": {
      const Tag = node.tag || "h2"; // 'h1' | 'h2' | 'h3'
      return <Tag>{renderInline(node.children)}</Tag>;
    }

    case "paragraph":
      // A paragraph can contain plain text AND an inline image
      // (e.g. "image + caption text" like in your sample data).
      return <p>{renderInline(node.children)}</p>;

    case "quote":
      return <blockquote>{renderInline(node.children)}</blockquote>;

    case "code":
      return (
        <pre>
          <code>{getPlainText(node.children)}</code>
        </pre>
      );

    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
        <ListTag>
          {(node.children || []).map((li, i) => (
            <li key={i}>{renderInline(li.children)}</li>
          ))}
        </ListTag>
      );
    }

    default:
      return null;
  }
}

// Renders inline content within a block — handles plain text runs
// AND image nodes that sit alongside text (your caption pattern).
function renderInline(children = []) {
  return children.map((child, i) => {
    if (child.type === "image") {
      return (
        <img
          key={i}
          src={child.src}
          alt={child.altText || ""}
          style={{ maxWidth: "100%", display: "block", margin: "12px 0" }}
        />
      );
    }

    if (child.type === "text") {
      let text = child.text;
      // Lexical's `format` is a bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code
      if (child.format & 1) text = <strong key={i}>{text}</strong>;
      if (child.format & 2) text = <em key={i}>{text}</em>;
      return <React.Fragment key={i}>{text}</React.Fragment>;
    }

    return null;
  });
}

function getPlainText(children = []) {
  return children.map((c) => c.text || "").join("");
}