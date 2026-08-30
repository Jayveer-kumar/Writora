import { useEffect, useRef, useState, useCallback } from "react";
import "./WriteStory.css";

import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Marker from "@editorjs/marker";

export default function WriteStory() {
  const editorRef = useRef(null);
  const holderRef = useRef(null);
  const titleRef = useRef(null);

  // Session me is blog ke liye jitni images upload hui unke IDs track karne ke liye
  const uploadedImageIdsRef = useRef(new Set());

  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [publishing, setPublishing] = useState(false);

  /* ─── Debounced word count updater ─── */
  const debounceTimerRef = useRef(null);
  const scheduleWordCount = useCallback((editor, currentTitle) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await editor.save();
        const rawText = data.blocks
          .map((b) => {
            if (b.type === "paragraph") return b.data.text ?? "";
            if (b.type === "header") return b.data.text ?? "";
            if (b.type === "quote") return b.data.text ?? "";
            if (b.type === "code") return b.data.code ?? "";
            if (b.type === "list") return (b.data.items ?? []).join(" ");
            return "";
          })
          .join(" ")
          .replace(/<[^>]+>/g, "");

        const editorWords = rawText.trim().split(/\s+/).filter(Boolean).length;
        const titleWords = currentTitle.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(editorWords + titleWords);
      } catch (_) {}
    }, 400); // 400ms debounce
  }, []);

  /* ─── Editor.js initialize (StrictMode-safe) ─── */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (editorRef.current) return; // guard: already initialized

      const editor = new EditorJS({
        holder: holderRef.current,
        autofocus: false,
        placeholder: "Write your story...",

        tools: {
          paragraph: { class: Paragraph, inlineToolbar: true },
          header: {
            class: Header,
            config: { levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
            shortcut: "CMD+SHIFT+H",
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: { defaultStyle: "unordered" },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file) {
                  const formData = new FormData();
                  formData.append("image", file);

                  const res = await fetch("/api/upload-image", {
                    method: "POST",
                    credentials: "include", // cookie/JWT session bhejne ke liye
                    body: formData,
                  });

                  if (!res.ok) {
                    return { success: 0 };
                  }

                  const data = await res.json();
                  // data = { url, public_id }  -- backend se aana chahiye

                  uploadedImageIdsRef.current.add(data.public_id);

                  return {
                    success: 1,
                    file: {
                      url: data.url,
                      public_id: data.public_id, // custom field, EditorJS store kar lega block data me
                    },
                  };
                },
                async uploadByUrl(url) {
                  const res = await fetch("/api/upload-image-url", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url }),
                  });
                  const data = await res.json();
                  uploadedImageIdsRef.current.add(data.public_id);
                  return {
                    success: 1,
                    file: { url: data.url, public_id: data.public_id },
                  };
                },
              },
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Quote likhein…",
              captionPlaceholder: "— Lekhak",
            },
          },
          code: { class: Code, config: { placeholder: "// Write your code here..." } },
          delimiter: Delimiter,
          inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+C" },
          underline: { class: Underline, shortcut: "CMD+U" },
          marker: { class: Marker, shortcut: "CMD+SHIFT+M" },
        },

        onChange: (api) => {
          setSaved(false);
          scheduleWordCount(editorRef.current, title);
        },
      });

      await editor.isReady;

      if (!isMounted) {
        editor.destroy();
        return;
      }

      editorRef.current = editor;
      setReady(true);
    };

    init();

    return () => {
      isMounted = false;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      editorRef.current?.destroy?.();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setSaved(false);
    if (editorRef.current) scheduleWordCount(editorRef.current, e.target.value);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      holderRef.current?.querySelector("[contenteditable]")?.focus();
    }
  };

  /* ─── Helper: current blocks me se referenced image public_ids nikaalo ─── */
  const getReferencedImageIds = (content) => {
    const ids = new Set();
    content.blocks.forEach((b) => {
      if (b.type === "image" && b.data?.file?.public_id) {
        ids.add(b.data.file.public_id);
      }
    });
    return ids;
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    try {
      const content = await editorRef.current.save();
      const payload = { title, content, savedAt: new Date().toISOString() };

      const res = await fetch("/api/blogs/draft", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Draft save failed");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handlePublish = async () => {
    if (!editorRef.current) return;
    setPublishing(true);
    try {
      const content = await editorRef.current.save();
      const payload = { title, content };

      const res = await fetch("/api/blogs/publish", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Publish failed");

      // Publish safal — ab jo images actually block me hai wahi "confirmed" hai,
      // baaki uploaded-but-removed images backend cleanup job khud handle karega.
      alert("Blog published!");
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Publish nahi ho paaya, dobara try karein.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCancel = () => {
    const hasContent = title.trim() || editorRef.current;
    if (!hasContent) { window.history.back(); return; }
    if (window.confirm("Kya aap sure hain? Sabhi unsaved changes kho jayenge.")) {
      window.history.back();
    }
  };

  return (
    <div className="ws-root">
      <header className="ws-bar">
        <div className="ws-bar-l">
          <span className="ws-badge">Draft</span>
          <span className="ws-wc">{wordCount} words</span>
        </div>
        <div className="ws-bar-r">
          <button type="button" className="ws-btn ws-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`ws-btn ws-save ${saved ? "ok" : ""}`}
            onClick={handleSave}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
          <button
            type="button"
            className="ws-btn ws-publish"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </header>

      <main className="ws-area">
        <textarea
          ref={titleRef}
          className="ws-title"
          placeholder="Title"
          value={title}
          rows={1}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
        />
        <hr className="ws-rule" />

        {!ready && (
          <div className="ws-dots">
            <div className="ws-dot" /><div className="ws-dot" /><div className="ws-dot" />
          </div>
        )}

        <div
          id="editorjs"
          ref={holderRef}
          style={{ opacity: ready ? 1 : 0, transition: "opacity .3s ease" }}
        />

        <p className="ws-tip">
          Click "+" to add a new block &nbsp;·&nbsp; Select text for formatting
        </p>
      </main>
    </div>
  );
}




































// import { useEffect, useRef, useState } from "react";
// import "./WriteStory.css"

// import EditorJS from "@editorjs/editorjs";
// import Paragraph from "@editorjs/paragraph";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import ImageTool from "@editorjs/image";
// import Quote from "@editorjs/quote";
// import Code from "@editorjs/code";
// import Delimiter from "@editorjs/delimiter";
// import InlineCode from "@editorjs/inline-code";
// import Underline from "@editorjs/underline";
// import Marker from "@editorjs/marker";

// export default function WriteStory() {
//   const editorRef  = useRef(null);  // Editor.js instance
//   const holderRef  = useRef(null);  // DOM div jahan editor mount hoga
//   const titleRef   = useRef(null);  // Title textarea

//   const [title,     setTitle]     = useState("");
//   const [wordCount, setWordCount] = useState(0);
//   const [saved,     setSaved]     = useState(false);
//   const [ready,     setReady]     = useState(false);

//   /* ─── Editor.js initialize ─── */
//   useEffect(() => {
//     let editor;

//     const init = async () => {
//       /* Dynamic imports — build time pe alag chunks banega */
//       // const EditorJS   = (await import("@editorjs/editorjs")).default;
//       // const Paragraph = (await import("@editorjs/paragraph")).default;
//       // const Header     = (await import("@editorjs/header")).default;
//       // const List       = (await import("@editorjs/list")).default;
//       // const ImageTool  = (await import("@editorjs/image")).default;
//       // const Quote      = (await import("@editorjs/quote")).default;
//       // const Code       = (await import("@editorjs/code")).default;
//       // const Delimiter  = (await import("@editorjs/delimiter")).default;
//       // const InlineCode = (await import("@editorjs/inline-code")).default;
//       // const Underline  = (await import("@editorjs/underline")).default;
//       // const Marker     = (await import("@editorjs/marker")).default;

//       editor = new EditorJS({
//         holder: holderRef.current,
//         autofocus: false,
//         placeholder: "Write your story...",

//         tools: {
//           /* ── Block Tools ── */
//           paragraph : {
//             class : Paragraph,
//             inlineToolbar : true 
//           },
//           header: {
//             class: Header,
//             config: { levels: [1, 2, 3 , 4 , 5 , 6], defaultLevel: 2 },
//             shortcut: "CMD+SHIFT+H",
//           },

//           list: {
//             class: List,
//             inlineToolbar: true,
//             config: { defaultStyle: "unordered" },
//           },

//           image: {
//             class: ImageTool,
//             config: {
//               /**
//                * Production mein apna upload endpoint daalein:
//                *   endpoints: {
//                *     byFile: "/api/upload-image",
//                *     byUrl:  "/api/fetch-image-url",
//                *   }
//                *
//                * Abhi ke liye local FileReader + direct URL dono support hain.
//                */
//               uploader: {
//                 uploadByFile(file) {
//                   return new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onload = (e) =>
//                       resolve({ success: 1, file: { url: e.target.result } });
//                     reader.readAsDataURL(file);
//                   });
//                 },
//                 uploadByUrl(url) {
//                   return Promise.resolve({ success: 1, file: { url } });
//                 },
//               },
//             },
//           },

//           quote: {
//             class: Quote,
//             inlineToolbar: true,
//             config: {
//               quotePlaceholder:   "Quote likhein…",
//               captionPlaceholder: "— Lekhak",
//             },
//           },

//           code: {
//             class: Code,
//             config: { placeholder: "// Write your code here..." },
//           },

//           delimiter: Delimiter,

//           /* ── Inline Tools ── */
//           inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+C" },
//           underline:  { class: Underline,  shortcut: "CMD+U" },
//           marker:     { class: Marker,     shortcut: "CMD+SHIFT+M" },
//         },

//         /* Word count update on every change */
//         onChange: async () => {
//           setSaved(false);
//           try {
//             const data = await editor.save();
//             const rawText = data.blocks
//               .map((b) => {
//                 if (b.type === "paragraph") return b.data.text  ?? "";
//                 if (b.type === "header")    return b.data.text  ?? "";
//                 if (b.type === "quote")     return b.data.text  ?? "";
//                 if (b.type === "code")      return b.data.code  ?? "";
//                 if (b.type === "list")      return (b.data.items ?? []).join(" ");
//                 return "";
//               })
//               .join(" ")
//               .replace(/<[^>]+>/g, ""); // HTML strip

//             const editorWords = rawText.trim().split(/\s+/).filter(Boolean).length;
//             const titleWords  = title.trim().split(/\s+/).filter(Boolean).length;
//             setWordCount(editorWords + titleWords);
//           } catch (_) {}
//         },

//         onReady: () => setReady(true),
//       });
      
//       await editor.isReady;
//       editorRef.current = editor;
//       setReady(true);
//     };

//     init();

//     /* Cleanup on unmount */
//     return () => {
//       editorRef.current?.destroy?.();
//       editorRef.current = null;
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* ─── Title auto-resize ─── */
//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//     e.target.style.height = "auto";
//     e.target.style.height = `${e.target.scrollHeight}px`;
//     setSaved(false);

//     const titleWords  = e.target.value.trim().split(/\s+/).filter(Boolean).length;
//     setWordCount((prev) => {
//       /* Sirf title ka hissa update karte hain;
//          editor ka hissa onChange se aata hai */
//       return prev; // full recalc onChange pe hogi
//     });
//     void titleWords; // lint silence
//   };

//   /* Title Enter → editor focus */
//   const handleTitleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       holderRef.current?.querySelector("[contenteditable]")?.focus();
//     }
//   };

//   /* ─── Save ─── */
//   const handleSave = async () => {
//     console.log("editorRef.current:", editorRef.current);
//     // if (!editorRef.current) return;
//     if (!editorRef.current) {
//       console.log("Editor not ready yet!");
//       return;
//     }
//     try {
//       const content = await editorRef.current.save();
//       console.log("Raw content:", content);
//       console.log("Blocks:", content.blocks);
//       console.log("Blocks length:", content.blocks.length);
//       const payload = { title, content, savedAt: new Date().toISOString() };
//       console.log("✅ Saved:", payload);
//       // TODO: await fetch("/api/blogs", { method: "POST", body: JSON.stringify(payload) });
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } catch (err) {
//       console.error("Save failed:", err);
//     }
//   };

//   /* ─── Publish ─── */
//   const handlePublish = async () => {
//     if (!editorRef.current) return;
//     try {
//       const content = await editorRef.current.save();
//       const payload = { title, content };
//       console.log("🚀 Published:", payload);
//       // TODO: await fetch("/api/blogs/publish", { method: "POST", body: JSON.stringify(payload) });
//       alert("Blog publish ho gaya! Console mein data dekho.");
//     } catch (err) {
//       console.error("Publish failed:", err);
//     }
//   };

//   /* ─── Cancel ─── */
//   const handleCancel = () => {
//     const hasContent = title.trim() || editorRef.current;
//     if (!hasContent) { window.history.back(); return; }
//     if (window.confirm("Kya aap sure hain? Sabhi unsaved changes kho jayenge.")) {
//       window.history.back();
//     }
//   };

//   return (
//     <>

//       <div className="ws-root">

//         {/* ── Top Bar ── */}
//         <header className="ws-bar">
//           <div className="ws-bar-l">
//             <span className="ws-badge">Draft</span>
//             <span className="ws-wc">{wordCount} words</span>
//           </div>
//           <div className="ws-bar-r">
//             <button type="button" className="ws-btn ws-cancel" onClick={handleCancel}>
//               Cancel
//             </button>
//             <button
//               type="button"
//               className={`ws-btn ws-save ${saved ? "ok" : ""}`}
//               onClick={handleSave}
//             >
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
//                 <polyline points="17 21 17 13 7 13 7 21"/>
//                 <polyline points="7 3 7 8 15 8"/>
//               </svg>
//               {saved ? "Saved ✓" : "Save"}
//             </button>
//             <button type="button" className="ws-btn ws-publish" onClick={handlePublish}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="22" y1="2" x2="11" y2="13"/>
//                 <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//               </svg>
//               Publish
//             </button>
//           </div>
//         </header>

//         {/* ── Writing Area ── */}
//         <main className="ws-area">

//           {/* Title */}
//           <textarea
//             ref={titleRef}
//             className="ws-title"
//             placeholder="Title"
//             value={title}
//             rows={1}
//             onChange={handleTitleChange}
//             onKeyDown={handleTitleKeyDown}
//           />

//           <hr className="ws-rule" />

//           {/* Loading dots while editor mounts */}
//           {!ready && (
//             <div className="ws-dots">
//               <div className="ws-dot" /><div className="ws-dot" /><div className="ws-dot" />
//             </div>
//           )}

//           {/* Editor.js mount point */}
//           <div
//             id="editorjs"
//             ref={holderRef}
//             style={{ opacity: ready ? 1 : 0, transition: "opacity .3s ease" }}
//           />

//           <p className="ws-tip">
//             {/* "+" dabo naya block add karne ke liye &nbsp;·&nbsp;
//             Text select karo formatting ke liye */}
//             Click "+" to add a new block &nbsp; .&nbsp;
//             Select text for the formatting
//           </p>

//         </main>
//       </div>
//     </>
//   );
// }





































// import { useEffect, useRef, useState } from "react";
// import "./WriteStory.css"

// import EditorJS from "@editorjs/editorjs";
// import Paragraph from "@editorjs/paragraph";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import ImageTool from "@editorjs/image";
// import Quote from "@editorjs/quote";
// import Code from "@editorjs/code";
// import Delimiter from "@editorjs/delimiter";
// import InlineCode from "@editorjs/inline-code";
// import Underline from "@editorjs/underline";
// import Marker from "@editorjs/marker";

// export default function WriteStory() {
//   const editorRef  = useRef(null);  // Editor.js instance
//   const holderRef  = useRef(null);  // DOM div jahan editor mount hoga
//   const titleRef   = useRef(null);  // Title textarea

//   const [title,     setTitle]     = useState("");
//   const [wordCount, setWordCount] = useState(0);
//   const [saved,     setSaved]     = useState(false);
//   const [ready,     setReady]     = useState(false);

//   /* ─── Editor.js initialize ─── */
//   useEffect(() => {
//     // let editor;
//     if (holderRef.current.dataset.editorMounted) return;
//     holderRef.current.dataset.editorMounted = "true";
//     let cancelled = false;
//     let editorInstance = null;

//     const init = async () => {
//       /* Dynamic imports — build time pe alag chunks banega */
//       // const EditorJS   = (await import("@editorjs/editorjs")).default;
//       // const Paragraph = (await import("@editorjs/paragraph")).default;
//       // const Header     = (await import("@editorjs/header")).default;
//       // const List       = (await import("@editorjs/list")).default;
//       // const ImageTool  = (await import("@editorjs/image")).default;
//       // const Quote      = (await import("@editorjs/quote")).default;
//       // const Code       = (await import("@editorjs/code")).default;
//       // const Delimiter  = (await import("@editorjs/delimiter")).default;
//       // const InlineCode = (await import("@editorjs/inline-code")).default;
//       // const Underline  = (await import("@editorjs/underline")).default;
//       // const Marker     = (await import("@editorjs/marker")).default;

//       editorInstance = new EditorJS({
//         holder: holderRef.current,
//         autofocus: false,
//         placeholder: "Write your story...",

//         tools: {
//           /* ── Block Tools ── */
//           paragraph : {
//             class : Paragraph,
//             inlineToolbar : true 
//           },
//           header: {
//             class: Header,
//             config: { levels: [1, 2, 3 , 4 , 5 , 6], defaultLevel: 2 },
//             shortcut: "CMD+SHIFT+H",
//           },

//           list: {
//             class: List,
//             inlineToolbar: true,
//             config: { defaultStyle: "unordered" },
//           },

//           image: {
//             class: ImageTool,
//             config: {
//               /**
//                * Production mein apna upload endpoint daalein:
//                *   endpoints: {
//                *     byFile: "/api/upload-image",
//                *     byUrl:  "/api/fetch-image-url",
//                *   }
//                *
//                * Abhi ke liye local FileReader + direct URL dono support hain.
//                */
//               uploader: {
//                 uploadByFile(file) {
//                   return new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onload = (e) =>
//                       resolve({ success: 1, file: { url: e.target.result } });
//                     reader.readAsDataURL(file);
//                   });
//                 },
//                 uploadByUrl(url) {
//                   return Promise.resolve({ success: 1, file: { url } });
//                 },
//               },
//             },
//           },

//           quote: {
//             class: Quote,
//             inlineToolbar: true,
//             config: {
//               quotePlaceholder:   "Quote likhein…",
//               captionPlaceholder: "— Lekhak",
//             },
//           },

//           code: {
//             class: Code,
//             config: { placeholder: "// Write your code here..." },
//           },

//           delimiter: Delimiter,

//           /* ── Inline Tools ── */
//           inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+C" },
//           underline:  { class: Underline,  shortcut: "CMD+U" },
//           marker:     { class: Marker,     shortcut: "CMD+SHIFT+M" },
//         },

//         /* Word count update on every change */
//         onChange: async () => {
//           setSaved(false);
//           try {
//             const data = await editorInstance.save();
//             const rawText = data.blocks
//               .map((b) => {
//                 if (b.type === "paragraph") return b.data.text  ?? "";
//                 if (b.type === "header")    return b.data.text  ?? "";
//                 if (b.type === "quote")     return b.data.text  ?? "";
//                 if (b.type === "code")      return b.data.code  ?? "";
//                 if (b.type === "list")      return (b.data.items ?? []).join(" ");
//                 return "";
//               })
//               .join(" ")
//               .replace(/<[^>]+>/g, ""); // HTML strip

//             const editorWords = rawText.trim().split(/\s+/).filter(Boolean).length;
//             const titleWords  = title.trim().split(/\s+/).filter(Boolean).length;
//             setWordCount(editorWords + titleWords);
//           } catch (_) {}
//         },

//         onReady: () => setReady(true),
//       });
      
//       await editorInstance.isReady;
//       if(cancelled){
//         // Effect already cleaned up 
//         editorInstance.destroy();
//         return;
//       }
//       editorRef.current = editorInstance;
//       setReady(true);
//     };

//     init();

//     /* Cleanup on unmount */
//     return () => {
//       cancelled = true;
//       if(editorRef.current) {
//         editorRef.current.destroy();
//         editorRef.current = null;
//       } else if (editorInstance) {
//         editorInstance.destroy?.();
//       }
//     };
//   }, []);

//   /* ─── Title auto-resize ─── */
//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//     e.target.style.height = "auto";
//     e.target.style.height = `${e.target.scrollHeight}px`;
//     setSaved(false);

//     const titleWords  = e.target.value.trim().split(/\s+/).filter(Boolean).length;
//     setWordCount((prev) => {
//       /* Sirf title ka hissa update karte hain;
//          editor ka hissa onChange se aata hai */
//       return prev; // full recalc onChange pe hogi
//     });
//     void titleWords; // lint silence
//   };

//   /* Title Enter → editor focus */
//   const handleTitleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       holderRef.current?.querySelector("[contenteditable]")?.focus();
//     }
//   };

//   /* ─── Save ─── */
//   const handleSave = async () => {
//     console.log("editorRef.current:", editorRef.current);
//     // if (!editorRef.current) return;
//     if (!editorRef.current) {
//       console.log("Editor not ready yet!");
//       return;
//     }
//     try {
//       const content = await editorRef.current.save();
//       console.log("Raw content:", content);
//       console.log("Blocks:", content.blocks);
//       console.log("Blocks length:", content.blocks.length);
//       const payload = { title, content, savedAt: new Date().toISOString() };
//       console.log("✅ Saved:", payload);
//       // TODO: await fetch("/api/blogs", { method: "POST", body: JSON.stringify(payload) });
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } catch (err) {
//       console.error("Save failed:", err);
//     }
//   };

//   /* ─── Publish ─── */
//   const handlePublish = async () => {
//     if (!editorRef.current) return;
//     try {
//       const content = await editorRef.current.save();
//       const payload = { title, content };
//       console.log("🚀 Published:", payload);
//       // TODO: await fetch("/api/blogs/publish", { method: "POST", body: JSON.stringify(payload) });
//       alert("Blog publish ho gaya! Console mein data dekho.");
//     } catch (err) {
//       console.error("Publish failed:", err);
//     }
//   };

//   /* ─── Cancel ─── */
//   const handleCancel = () => {
//     const hasContent = title.trim() || editorRef.current;
//     if (!hasContent) { window.history.back(); return; }
//     if (window.confirm("Kya aap sure hain? Sabhi unsaved changes kho jayenge.")) {
//       window.history.back();
//     }
//   };

//   return (
//     <>

//       <div className="ws-root">

//         {/* ── Top Bar ── */}
//         <header className="ws-bar">
//           <div className="ws-bar-l">
//             <span className="ws-badge">Draft</span>
//             <span className="ws-wc">{wordCount} words</span>
//           </div>
//           <div className="ws-bar-r">
//             <button type="button" className="ws-btn ws-cancel" onClick={handleCancel}>
//               Cancel
//             </button>
//             <button
//               type="button"
//               className={`ws-btn ws-save ${saved ? "ok" : ""}`}
//               onClick={handleSave}
//             >
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
//                 <polyline points="17 21 17 13 7 13 7 21"/>
//                 <polyline points="7 3 7 8 15 8"/>
//               </svg>
//               {saved ? "Saved ✓" : "Save"}
//             </button>
//             <button type="button" className="ws-btn ws-publish" onClick={handlePublish}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="22" y1="2" x2="11" y2="13"/>
//                 <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//               </svg>
//               Publish
//             </button>
//           </div>
//         </header>

//         {/* ── Writing Area ── */}
//         <main className="ws-area">

//           {/* Title */}
//           <textarea
//             ref={titleRef}
//             className="ws-title"
//             placeholder="Title"
//             value={title}
//             rows={1}
//             onChange={handleTitleChange}
//             onKeyDown={handleTitleKeyDown}
//           />

//           <hr className="ws-rule" />

//           {/* Loading dots while editor mounts */}
//           {!ready && (
//             <div className="ws-dots">
//               <div className="ws-dot" /><div className="ws-dot" /><div className="ws-dot" />
//             </div>
//           )}

//           {/* Editor.js mount point */}
//           <div
//             id="editorjs"
//             ref={holderRef}
//             style={{ opacity: ready ? 1 : 0, transition: "opacity .3s ease" }}
//           />

//           <p className="ws-tip">
//             {/* "+" dabo naya block add karne ke liye &nbsp;·&nbsp;
//             Text select karo formatting ke liye */}
//             Click "+" to add a new block &nbsp; .&nbsp;
//             Select text for the formatting
//           </p>

//         </main>
//       </div>
//     </>
//   );
// }