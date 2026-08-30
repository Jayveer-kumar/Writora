import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { useEditorState } from "./useEditorState";
import { BLOCK_COMPONENTS } from "./Blocks";
import AddBlockMenu from "./AddBlockMenu";
import InlineToolbar from "./InlineToolbar";
import { buildPayload, countWords } from "./serialize";
import "./editor.css";

/**
 * BlockEditor
 * Drop-in replacement for the old EditorJS mount point. Exposes an
 * imperative `save()` via ref (same shape old code expected from
 * editorRef.current.save()), plus onChange(wordCount) for the page's
 * word-count display.
 *
 * Required props:
 *   uploadImage(file, previousPublicId) -> Promise<{ url, public_id }>
 * Optional props:
 *   initialBlocks, title, onChange
 */
const BlockEditor = forwardRef(function BlockEditor({ uploadImage, title = "", initialBlocks, onChange }, ref) {
  const containerRef = useRef(null);
  const state = useEditorState(initialBlocks);
  const {
    blocks,
    updateBlock,
    changeBlockType,
    insertBlockAfter,
    deleteBlock,
    mergeWithPrevious,
    moveBlock,
    replaceAll,
    consumeFocusRequest,
  } = state;

  // Report word count upward whenever blocks or title change
  useEffect(() => {
    onChange?.(countWords(title, blocks));
  }, [blocks, title, onChange]);

  useImperativeHandle(ref, () => ({
    save: () => buildPayload(title, blocks),
    getBlocks: () => blocks,
    replaceAll,
    focus: () => containerRef.current?.querySelector("[contenteditable]")?.focus(),
  }));

  const focusRequest = consumeFocusRequest();

  return (
    <div className="eb-root" ref={containerRef}>
      <InlineToolbar containerRef={containerRef} />

      {blocks.map((block, idx) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;

        const api = {
          updateBlock,
          changeBlockType,
          insertBlockAfter,
          deleteBlock,
          mergeWithPrevious,
          moveBlock,
          uploadImage,
          focusCaret: focusRequest?.blockId === block.id ? focusRequest.caret : null,
        };

        return (
          <div className="eb-block-row" key={block.id}>
            <div className="eb-block-controls">
              <button
                type="button"
                className="eb-ctrl"
                onClick={() => moveBlock(block.id, -1)}
                disabled={idx === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="eb-ctrl"
                onClick={() => moveBlock(block.id, 1)}
                disabled={idx === blocks.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="eb-ctrl eb-ctrl-danger"
                onClick={() => deleteBlock(block.id)}
                title="Delete block"
              >
                ×
              </button>
            </div>

            <div className="eb-block-body">
              <Component block={block} api={api} />
            </div>
          </div>
        );
      })}

      <AddBlockMenu onPick={(type, data) => insertBlockAfter(blocks[blocks.length - 1]?.id ?? null, type, data)} />
    </div>
  );
});

export default BlockEditor;