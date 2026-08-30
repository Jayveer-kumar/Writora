import { useEffect, useState } from "react";

/**
 * Listens for text selection anywhere inside the editor and shows a small
 * floating toolbar above it. Uses document.execCommand for the handful of
 * simple inline styles — deprecated but still broadly supported for exactly
 * this narrow use (bold/italic/underline on a contentEditable selection).
 * If you need to drop execCommand later, swap applyCommand's body for a
 * manual Range-wrapping implementation; the rest of this component doesn't change.
 */
export default function InlineToolbar({ containerRef }) {
  const [pos, setPos] = useState(null); // { top, left } or null = hidden

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPos(null);
        return;
      }
      const anchorNode = sel.anchorNode;
      if (!containerRef.current || !containerRef.current.contains(anchorNode)) {
        setPos(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPos(null);
        return;
      }
      const containerRect = containerRef.current.getBoundingClientRect();
      setPos({
        top: rect.top - containerRect.top - 42,
        left: rect.left - containerRect.left + rect.width / 2,
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [containerRef]);

  const applyCommand = (command) => {
    document.execCommand(command, false, null);
  };

  if (!pos) return null;

  return (
    <div className="eb-inline-toolbar" style={{ top: pos.top, left: pos.left }}>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("bold")}>
        <b>B</b>
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("italic")}>
        <i>I</i>
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("underline")}>
        <u>U</u>
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const sel = window.getSelection();
          if (!sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          const code = document.createElement("code");
          code.className = "eb-inline-code";
          code.textContent = range.toString();
          range.deleteContents();
          range.insertNode(code);
        }}
      >
        {"</>"}
      </button>
    </div>
  );
}