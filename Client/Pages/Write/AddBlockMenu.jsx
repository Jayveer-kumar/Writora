import { useEffect, useRef, useState } from "react";

const OPTIONS = [
  { type: "paragraph", data: { text: "" }, label: "Text", icon: "¶" },
  { type: "header", data: { text: "", level: 2 }, label: "Heading", icon: "H" },
  { type: "list", data: { style: "unordered", items: [""] }, label: "List", icon: "•" },
  { type: "quote", data: { text: "", caption: "" }, label: "Quote", icon: "❝" },
  { type: "code", data: { code: "" }, label: "Code", icon: "</>" },
  { type: "image", data: { url: "", public_id: "", caption: "" }, label: "Image", icon: "🖼" },
  { type: "delimiter", data: {}, label: "Divider", icon: "—" },
];

export default function AddBlockMenu({ onPick }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="eb-add-wrap" ref={wrapRef}>
      <button
        type="button"
        className="eb-add-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Add block"
      >
        +
      </button>
      {open && (
        <div className="eb-add-menu">
          {OPTIONS.map((opt) => (
            <button
              key={opt.type + opt.label}
              type="button"
              className="eb-add-option"
              onClick={() => {
                onPick(opt.type, opt.data);
                setOpen(false);
              }}
            >
              <span className="eb-add-icon">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}