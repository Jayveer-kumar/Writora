import { useCallback, useRef, useState } from "react";
import { newBlockId } from "./serialize";

const EMPTY_PARAGRAPH = () => ({ id: newBlockId(), type: "paragraph", data: { text: "" } });

/**
 * useEditorState
 * Single source of truth for the block list. All block components call
 * these functions instead of touching state directly — keeps BlockEditor
 * dumb and blocks.jsx components stateless.
 */
export function useEditorState(initialBlocks) {
  const [blocks, setBlocks] = useState(
    initialBlocks && initialBlocks.length ? initialBlocks : [EMPTY_PARAGRAPH()]
  );

  // Which block should receive focus after the next render (set by add/merge/delete)
  const focusRequestRef = useRef(null);

  const requestFocus = (blockId, caret = "end") => {
    focusRequestRef.current = { blockId, caret };
  };

  const consumeFocusRequest = () => {
    const req = focusRequestRef.current;
    focusRequestRef.current = null;
    return req;
  };

  const updateBlock = useCallback((id, data) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)));
  }, []);

  const changeBlockType = useCallback((id, type, extraData = {}) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, type, data: extraData } : b)));
  }, []);

  /** Insert a new block right after `afterId` (or at end if afterId is null) */
  const insertBlockAfter = useCallback((afterId, type = "paragraph", data = { text: "" }) => {
    const id = newBlockId();
    setBlocks((prev) => {
      if (afterId == null) return [...prev, { id, type, data }];
      const idx = prev.findIndex((b) => b.id === afterId);
      if (idx === -1) return [...prev, { id, type, data }];
      const next = [...prev];
      next.splice(idx + 1, 0, { id, type, data });
      return next;
    });
    requestFocus(id, "start");
    return id;
  }, []);

  const deleteBlock = useCallback((id) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      if (prev.length === 1) {
        // Never leave zero blocks — reset to a single empty paragraph
        const fresh = EMPTY_PARAGRAPH();
        requestFocus(fresh.id, "start");
        return [fresh];
      }
      const next = prev.filter((b) => b.id !== id);
      const focusIdx = Math.max(0, idx - 1);
      requestFocus(next[focusIdx].id, "end");
      return next;
    });
  }, []);

  /** Backspace at start of an empty-ish block: merge its text into the previous block */
  const mergeWithPrevious = useCallback((id) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      const current = prev[idx];
      const previous = prev[idx - 1];

      // Only merge text-bearing blocks; otherwise just delete current and focus previous
      const currentText = current.data?.text ?? "";
      const canMergeText = ["paragraph", "header"].includes(previous.type) && "text" in (previous.data || {});

      const next = [...prev];
      if (canMergeText) {
        next[idx - 1] = {
          ...previous,
          data: { ...previous.data, text: (previous.data.text || "") + currentText },
        };
      }
      next.splice(idx, 1);
      requestFocus(previous.id, canMergeText ? "merge" : "end");
      return next;
    });
  }, []);

  const moveBlock = useCallback((id, direction) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const targetIdx = idx + direction;
      if (idx === -1 || targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  }, []);

  const replaceAll = useCallback((newBlocks) => {
    setBlocks(newBlocks && newBlocks.length ? newBlocks : [EMPTY_PARAGRAPH()]);
  }, []);

  return {
    blocks,
    updateBlock,
    changeBlockType,
    insertBlockAfter,
    deleteBlock,
    mergeWithPrevious,
    moveBlock,
    replaceAll,
    requestFocus,
    consumeFocusRequest,
  };
}