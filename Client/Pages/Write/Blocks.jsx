import { useEffect, useRef } from "react";

/**
 * Every text-bearing block uses this shared contentEditable wrapper so
 * caret handling, Enter/Backspace, and focus requests behave consistently.
 */
function EditableText({
  html,
  placeholder,
  tag: Tag = "div",
  className = "",
  onInput,
  onEnter,
  onBackspaceAtStart,
  autoFocusCaret, // "start" | "end" | "merge" | null
  ...rest
}) {
  const ref = useRef(null);

  // IMPORTANT: this is deliberately uncontrolled. We only push `html` into the
  // DOM when it differs from what's already there — i.e. an external change
  // (initial mount, undo, merge-from-previous), never the echo of our own
  // onInput. Binding dangerouslySetInnerHTML straight to state on every
  // keystroke resets the DOM node each render, which resets the caret to
  // position 0 — that's what was causing the cursor-jump/growing-box bug.
  useEffect(() => {
    if (!ref.current) return;
    const incoming = html || "";
    if (incoming !== ref.current.innerHTML) {
      ref.current.innerHTML = incoming;
    }
  }, [html]);

  useEffect(() => {
    if (!autoFocusCaret || !ref.current) return;
    ref.current.focus();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    range.collapse(autoFocusCaret === "start"); // true = collapse to start, false = to end
    sel.removeAllRanges();
    sel.addRange(range);
  }, [autoFocusCaret]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter?.(ref.current.innerHTML);
      return;
    }
    if (e.key === "Backspace") {
      const sel = window.getSelection();
      const atStart =
        sel.isCollapsed &&
        sel.anchorOffset === 0 &&
        (sel.anchorNode === ref.current || sel.anchorNode?.parentNode === ref.current);
      if (atStart) {
        onBackspaceAtStart?.(ref.current.innerHTML);
      }
    }
  };

  return (
    <Tag
      ref={ref}
      className={`eb-editable ${className}`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={(e) => onInput?.(e.currentTarget.innerHTML)}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}

/**
 * Same uncontrolled-sync trick as EditableText, but lighter — used for
 * individual <li> text spans where we don't need Enter-creates-new-block
 * semantics, just item-level add/remove.
 */
function ListItemEditable({ html, onInput, onEnter, onBackspaceEmpty }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const incoming = html || "";
    if (incoming !== ref.current.innerHTML) {
      ref.current.innerHTML = incoming;
    }
  }, [html]);

  return (
    <span
      ref={ref}
      className="eb-list-item"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onInput(e.currentTarget.innerHTML)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter();
        } else if (e.key === "Backspace" && !ref.current.textContent) {
          e.preventDefault();
          onBackspaceEmpty();
        }
      }}
    />
  );
}

export function ParagraphBlock({ block, api }) {
  return (
    <EditableText
      html={block.data.text}
      placeholder="Write your story..."
      tag="p"
      className="eb-paragraph"
      autoFocusCaret={api.focusCaret}
      onInput={(html) => api.updateBlock(block.id, { text: html })}
      onEnter={() => api.insertBlockAfter(block.id, "paragraph", { text: "" })}
      onBackspaceAtStart={() => {
        const isEmpty = !block.data.text || block.data.text.replace(/<[^>]+>/g, "").trim() === "";
        if (isEmpty) api.mergeWithPrevious(block.id);
      }}
    />
  );
}

export function HeaderBlock({ block, api }) {
  const level = block.data.level || 2;
  return (
    <div className="eb-header-wrap">
      <select
        className="eb-header-level"
        value={level}
        onChange={(e) => api.updateBlock(block.id, { level: Number(e.target.value) })}
      >
        {[1, 2, 3, 4, 5, 6].map((l) => (
          <option key={l} value={l}>H{l}</option>
        ))}
      </select>
      <EditableText
        html={block.data.text}
        placeholder="Heading"
        tag={`h${level}`}
        className="eb-header"
        autoFocusCaret={api.focusCaret}
        onInput={(html) => api.updateBlock(block.id, { text: html })}
        onEnter={() => api.insertBlockAfter(block.id, "paragraph", { text: "" })}
        onBackspaceAtStart={() => {
          const isEmpty = !block.data.text || block.data.text.replace(/<[^>]+>/g, "").trim() === "";
          if (isEmpty) api.mergeWithPrevious(block.id);
        }}
      />
    </div>
  );
}

export function ListBlock({ block, api }) {
  const items = block.data.items && block.data.items.length ? block.data.items : [""];
  const ordered = block.data.style === "ordered";
  const Tag = ordered ? "ol" : "ul";

  const setItem = (idx, text) => {
    const next = [...items];
    next[idx] = text;
    api.updateBlock(block.id, { items: next });
  };

  const addItemAfter = (idx) => {
    const next = [...items];
    next.splice(idx + 1, 0, "");
    api.updateBlock(block.id, { items: next });
  };

  const removeItem = (idx) => {
    if (items.length === 1) {
      api.deleteBlock(block.id);
      return;
    }
    const next = items.filter((_, i) => i !== idx);
    api.updateBlock(block.id, { items: next });
  };

  return (
    <div className="eb-list-wrap">
      <button
        type="button"
        className="eb-list-toggle"
        onClick={() => api.updateBlock(block.id, { style: ordered ? "unordered" : "ordered" })}
        title="Toggle list style"
      >
        {ordered ? "1." : "•"}
      </button>
      <Tag className="eb-list">
        {items.map((text, idx) => (
          <li key={idx}>
            <ListItemEditable
              html={text}
              onInput={(html) => setItem(idx, html)}
              onEnter={() => addItemAfter(idx)}
              onBackspaceEmpty={() => removeItem(idx)}
            />
          </li>
        ))}
      </Tag>
    </div>
  );
}

export function QuoteBlock({ block, api }) {
  return (
    <blockquote className="eb-quote">
      <EditableText
        html={block.data.text}
        placeholder="Quote likhein…"
        tag="div"
        className="eb-quote-text"
        autoFocusCaret={api.focusCaret}
        onInput={(html) => api.updateBlock(block.id, { text: html })}
        onEnter={() => api.insertBlockAfter(block.id, "paragraph", { text: "" })}
        onBackspaceAtStart={() => api.mergeWithPrevious(block.id)}
      />
      <EditableText
        html={block.data.caption}
        placeholder="— Lekhak"
        tag="cite"
        className="eb-quote-caption"
        onInput={(html) => api.updateBlock(block.id, { caption: html })}
      />
    </blockquote>
  );
}

export function CodeBlock({ block, api }) {
  return (
    <textarea
      className="eb-code"
      placeholder="// Write your code here..."
      value={block.data.code || ""}
      onChange={(e) => api.updateBlock(block.id, { code: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const el = e.target;
          const start = el.selectionStart;
          const end = el.selectionEnd;
          const val = el.value;
          api.updateBlock(block.id, { code: val.slice(0, start) + "  " + val.slice(end) });
        }
      }}
      rows={Math.max(3, (block.data.code || "").split("\n").length)}
    />
  );
}

export function DelimiterBlock() {
  return <div className="eb-delimiter">* * *</div>;
}

/**
 * Image block: upload state machine lives here (idle -> uploading -> done/error).
 * api.uploadImage must return { url, public_id }.
 */
export function ImageBlock({ block, api }) {
  const fileInputRef = useRef(null);
  const { url, public_id, caption, status } = block.data;

  const handleFile = async (file) => {
    if (!file) return;
    api.updateBlock(block.id, { status: "uploading" });
    try {
      const result = await api.uploadImage(file, public_id); // pass previous public_id so caller can mark-for-replace
      api.updateBlock(block.id, {
        url: result.url,
        public_id: result.public_id,
        status: "done",
      });
    } catch (err) {
      api.updateBlock(block.id, { status: "error" });
    }
  };

  if (!url && status !== "uploading") {
    return (
      <div className="eb-image-placeholder" onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <span>+ Click to upload an image</span>
        {status === "error" && <span className="eb-image-error">Upload failed, try again</span>}
      </div>
    );
  }

  return (
    <figure className="eb-image">
      {status === "uploading" ? (
        <div className="eb-image-loading">Uploading…</div>
      ) : (
        <img src={url} alt={caption || ""} />
      )}
      <EditableText
        html={caption}
        placeholder="Caption (optional)"
        tag="figcaption"
        className="eb-image-caption"
        onInput={(html) => api.updateBlock(block.id, { caption: html })}
      />
      <div className="eb-image-actions">
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Replace
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </figure>
  );
}

export const BLOCK_COMPONENTS = {
  paragraph: ParagraphBlock,
  header: HeaderBlock,
  list: ListBlock,
  quote: QuoteBlock,
  code: CodeBlock,
  delimiter: DelimiterBlock,
  image: ImageBlock,
};















































// import { useEffect, useRef } from "react";

// /**
//  * Every text-bearing block uses this shared contentEditable wrapper so
//  * caret handling, Enter/Backspace, and focus requests behave consistently.
//  */
// function EditableText({
//   html,
//   placeholder,
//   tag: Tag = "div",
//   className = "",
//   onInput,
//   onEnter,
//   onBackspaceAtStart,
//   autoFocusCaret, // "start" | "end" | "merge" | null
//   ...rest
// }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     if (!autoFocusCaret || !ref.current) return;
//     ref.current.focus();
//     const sel = window.getSelection();
//     const range = document.createRange();
//     if (autoFocusCaret === "start") {
//       range.setStart(ref.current, 0);
//     } else {
//       // "end" or "merge" -> put caret at the end of existing content
//       range.selectNodeContents(ref.current);
//       range.collapse(false);
//     }
//     sel.removeAllRanges();
//     sel.addRange(range);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [autoFocusCaret]);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       onEnter?.(ref.current.innerHTML);
//       return;
//     }
//     if (e.key === "Backspace") {
//       const sel = window.getSelection();
//       const atStart =
//         sel.isCollapsed &&
//         sel.anchorOffset === 0 &&
//         (sel.anchorNode === ref.current || sel.anchorNode?.parentNode === ref.current);
//       if (atStart) {
//         onBackspaceAtStart?.(ref.current.innerHTML);
//       }
//     }
//   };

//   return (
//     <Tag
//       ref={ref}
//       className={`eb-editable ${className}`}
//       contentEditable
//       suppressContentEditableWarning
//       data-placeholder={placeholder}
//       onInput={(e) => onInput?.(e.currentTarget.innerHTML)}
//       onKeyDown={handleKeyDown}
//       dangerouslySetInnerHTML={{ __html: html || "" }}
//       {...rest}
//     />
//   );
// }

// export function ParagraphBlock({ block, api }) {
//   return (
//     <EditableText
//       html={block.data.text}
//       placeholder="Write your story..."
//       tag="p"
//       className="eb-paragraph"
//       autoFocusCaret={api.focusCaret}
//       onInput={(html) => api.updateBlock(block.id, { text: html })}
//       onEnter={() => api.insertBlockAfter(block.id, "paragraph", { text: "" })}
//       onBackspaceAtStart={() => {
//         const isEmpty = !block.data.text || block.data.text.replace(/<[^>]+>/g, "").trim() === "";
//         if (isEmpty) api.mergeWithPrevious(block.id);
//       }}
//     />
//   );
// }

// export function HeaderBlock({ block, api }) {
//   const level = block.data.level || 2;
//   return (
//     <div className="eb-header-wrap">
//       <select
//         className="eb-header-level"
//         value={level}
//         onChange={(e) => api.updateBlock(block.id, { level: Number(e.target.value) })}
//       >
//         {[1, 2, 3, 4, 5, 6].map((l) => (
//           <option key={l} value={l}>H{l}</option>
//         ))}
//       </select>
//       <EditableText
//         html={block.data.text}
//         placeholder="Heading"
//         tag={`h${level}`}
//         className="eb-header"
//         autoFocusCaret={api.focusCaret}
//         onInput={(html) => api.updateBlock(block.id, { text: html })}
//         onEnter={() => api.insertBlockAfter(block.id, "paragraph", { text: "" })}
//         onBackspaceAtStart={() => {
//           const isEmpty = !block.data.text || block.data.text.replace(/<[^>]+>/g, "").trim() === "";
//           if (isEmpty) api.mergeWithPrevious(block.id);
//         }}
//       />
//     </div>
//   );
// }

// export function ListBlock({ block, api }) {
//   const items = block.data.items && block.data.items.length ? block.data.items : [""];
//   const ordered = block.data.style === "ordered";
//   const Tag = ordered ? "ol" : "ul";

//   const setItem = (idx, text) => {
//     const next = [...items];
//     next[idx] = text;
//     api.updateBlock(block.id, { items: next });
//   };

//   const addItemAfter = (idx) => {
//     const next = [...items];
//     next.splice(idx + 1, 0, "");
//     api.updateBlock(block.id, { items: next });
//   };

//   const removeItem = (idx) => {
//     if (items.length === 1) {
//       api.deleteBlock(block.id);
//       return;
//     }
//     const next = items.filter((_, i) => i !== idx);
//     api.updateBlock(block.id, { items: next });
//   };

//   return (
//     <div className="eb-list-wrap">
//       <button
//         type="button"
//         className="eb-list-toggle"
//         onClick={() => api.updateBlock(block.id, { style: ordered ? "unordered" : "ordered" })}
//         title="Toggle list style"
//       >
//         {ordered ? "1." : "•"}
//       </button>
//       <Tag className="eb-list">
//         {items.map((text, idx) => (
//           <li key={idx}>
//             <span
//               className="eb-list-item"
//               contentEditable
//               suppressContentEditableWarning
//               onInput={(e) => setItem(idx, e.currentTarget.innerHTML)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   addItemAfter(idx);
//                 } else if (e.key === "Backspace" && !text) {
//                   e.preventDefault();
//                   removeItem(idx);
//                 }
//               }}
//               dangerouslySetInnerHTML={{ __html: text }}
//             />
//           </li>
//         ))}
//       </Tag>
//     </div>
//   );
// }

// export function QuoteBlock({ block, api }) {
//   return (
//     <blockquote className="eb-quote">
//       <EditableText
//         html={block.data.text}
//         placeholder="Quote likhein…"
//         tag="div"
//         className="eb-quote-text"
//         autoFocusCaret={api.focusCaret}
//         onInput={(html) => api.updateBlock(block.id, { text: html })}
//         onEnter={() => api.insertBlockAfter(block.id, "paragraph", { text: "" })}
//         onBackspaceAtStart={() => api.mergeWithPrevious(block.id)}
//       />
//       <EditableText
//         html={block.data.caption}
//         placeholder="— Lekhak"
//         tag="cite"
//         className="eb-quote-caption"
//         onInput={(html) => api.updateBlock(block.id, { caption: html })}
//       />
//     </blockquote>
//   );
// }

// export function CodeBlock({ block, api }) {
//   return (
//     <textarea
//       className="eb-code"
//       placeholder="// Write your code here..."
//       value={block.data.code || ""}
//       onChange={(e) => api.updateBlock(block.id, { code: e.target.value })}
//       onKeyDown={(e) => {
//         if (e.key === "Tab") {
//           e.preventDefault();
//           const el = e.target;
//           const start = el.selectionStart;
//           const end = el.selectionEnd;
//           const val = el.value;
//           api.updateBlock(block.id, { code: val.slice(0, start) + "  " + val.slice(end) });
//         }
//       }}
//       rows={Math.max(3, (block.data.code || "").split("\n").length)}
//     />
//   );
// }

// export function DelimiterBlock() {
//   return <div className="eb-delimiter">* * *</div>;
// }

// /**
//  * Image block: upload state machine lives here (idle -> uploading -> done/error).
//  * api.uploadImage must return { url, public_id }.
//  */
// export function ImageBlock({ block, api }) {
//   const fileInputRef = useRef(null);
//   const { url, public_id, caption, status } = block.data;

//   const handleFile = async (file) => {
//     if (!file) return;
//     api.updateBlock(block.id, { status: "uploading" });
//     try {
//       const result = await api.uploadImage(file, public_id); // pass previous public_id so caller can mark-for-replace
//       api.updateBlock(block.id, {
//         url: result.url,
//         public_id: result.public_id,
//         status: "done",
//       });
//     } catch (err) {
//       api.updateBlock(block.id, { status: "error" });
//     }
//   };

//   if (!url && status !== "uploading") {
//     return (
//       <div className="eb-image-placeholder" onClick={() => fileInputRef.current?.click()}>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           hidden
//           onChange={(e) => handleFile(e.target.files?.[0])}
//         />
//         <span>+ Click to upload an image</span>
//         {status === "error" && <span className="eb-image-error">Upload failed, try again</span>}
//       </div>
//     );
//   }

//   return (
//     <figure className="eb-image">
//       {status === "uploading" ? (
//         <div className="eb-image-loading">Uploading…</div>
//       ) : (
//         <img src={url} alt={caption || ""} />
//       )}
//       <EditableText
//         html={caption}
//         placeholder="Caption (optional)"
//         tag="figcaption"
//         className="eb-image-caption"
//         onInput={(html) => api.updateBlock(block.id, { caption: html })}
//       />
//       <div className="eb-image-actions">
//         <button type="button" onClick={() => fileInputRef.current?.click()}>
//           Replace
//         </button>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           hidden
//           onChange={(e) => handleFile(e.target.files?.[0])}
//         />
//       </div>
//     </figure>
//   );
// }

// export const BLOCK_COMPONENTS = {
//   paragraph: ParagraphBlock,
//   header: HeaderBlock,
//   list: ListBlock,
//   quote: QuoteBlock,
//   code: CodeBlock,
//   delimiter: DelimiterBlock,
//   image: ImageBlock,
// };