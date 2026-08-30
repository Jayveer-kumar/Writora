import { useRef, useState } from "react";
// import { BlockEditor } from "./editor";
import BlockEditor from "./BlockEditor";
import "./WriteStory.css";
import "./editorMain.css";

export default function WriteStory() {
  const editorRef = useRef(null); // BlockEditor imperative handle (save/getBlocks/replaceAll)
  const titleRef = useRef(null);

  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);

  /**
   * uploadImage: called by the image block on select/replace.
   * previousPublicId is passed when this is a *replace* — the backend
   * marks the old id for delayed cleanup instead of deleting it inline
   * (see the earlier discussion: instant delete breaks undo).
   */
  const uploadImage = async (file, previousPublicId) => {
    const formData = new FormData();
    formData.append("image", file);
    if (previousPublicId) formData.append("replaces", previousPublicId);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json(); // { url, public_id }
    return data;
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setSaved(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      editorRef.current?.focus();
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    try {
      const payload = { ...editorRef.current.save(), savedAt: new Date().toISOString() };
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
      const payload = editorRef.current.save();
      const res = await fetch("/api/blogs/publish", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Publish failed");
      alert("Blog published!");
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Publish nahi ho paaya, dobara try karein.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCancel = () => {
    const blocks = editorRef.current?.getBlocks() || [];
    const hasContent = title.trim() || blocks.some((b) => JSON.stringify(b.data).length > 20);
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

        <BlockEditor ref={editorRef} title={title} uploadImage={uploadImage} onChange={setWordCount} />

        <p className="ws-tip">
          Click "+" to add a new block &nbsp;·&nbsp; Select text for formatting
        </p>
      </main>
    </div>
  );
}