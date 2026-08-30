import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
  $getNodeByKey,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $getNearestNodeOfType } from "@lexical/utils";
import { INSERT_IMAGE_COMMAND, fileToDataUrl } from "./ImagesPlugin";

const BLOCK_LABELS = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  quote: "Quote",
  code: "Code Block",
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  // ---- Toolbar state ko selection ke saath sync karna ----
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type === "bullet" ? "bullet" : "number");
        } else if ($isCodeNode(element)) {
          setBlockType("code");
        } else {
          const type = element.getType();
          if (type === "heading") {
            setBlockType(element.getTag());
          } else if (type === "quote") {
            setBlockType("quote");
          } else {
            setBlockType("paragraph");
          }
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  const formatBlock = (type) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (type === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (type === "h1" || type === "h2" || type === "h3") {
        $setBlocksType(selection, () => $createHeadingNode(type));
      } else if (type === "quote") {
        $setBlocksType(selection, () => $createQuoteNode());
      } else if (type === "code") {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  // ---- Image upload (file se) ----
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await fileToDataUrl(file);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: dataUrl,
      altText: file.name,
    });
    e.target.value = "";
    setShowImageMenu(false);
  };

  // ---- Image insert (URL se) ----
  const onInsertImageUrl = () => {
    if (!imageUrl.trim()) return;
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: imageUrl.trim(),
      altText: "image",
    });
    setImageUrl("");
    setShowUrlInput(false);
    setShowImageMenu(false);
  };

  return (
    <div className="blog-toolbar">
      <div className="blog-toolbar-group">
        <button
          type="button"
          className="blog-toolbar-btn"
          aria-label="Undo"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          ↶
        </button>
        <button
          type="button"
          className="blog-toolbar-btn"
          aria-label="Redo"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          ↷
        </button>
      </div>

      <div className="blog-toolbar-divider" />

      <div className="blog-toolbar-group">
        <select
          className="blog-toolbar-select"
          value={blockType in BLOCK_LABELS ? blockType : "paragraph"}
          onChange={(e) => formatBlock(e.target.value)}
          aria-label="Block type"
        >
          <option value="paragraph">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="quote">Quote</option>
          <option value="code">Code Block</option>
        </select>
      </div>

      <div className="blog-toolbar-divider" />

      <div className="blog-toolbar-group">
        <button
          type="button"
          className={`blog-toolbar-btn${isBold ? " active" : ""}`}
          aria-label="Bold"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className={`blog-toolbar-btn${isItalic ? " active" : ""}`}
          aria-label="Italic"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          className={`blog-toolbar-btn${isUnderline ? " active" : ""}`}
          aria-label="Underline"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        >
          <u>U</u>
        </button>
      </div>

      <div className="blog-toolbar-divider" />

      <div className="blog-toolbar-group">
        <button
          type="button"
          className={`blog-toolbar-btn${blockType === "bullet" ? " active" : ""}`}
          aria-label="Bullet list"
          onClick={formatBulletList}
        >
          • ‒
        </button>
        <button
          type="button"
          className={`blog-toolbar-btn${blockType === "number" ? " active" : ""}`}
          aria-label="Numbered list"
          onClick={formatNumberedList}
        >
          1. ‒
        </button>
      </div>

      <div className="blog-toolbar-divider" />

      <div className="blog-toolbar-group blog-toolbar-image">
        <button
          type="button"
          className="blog-toolbar-btn"
          aria-label="Insert image"
          onClick={() => setShowImageMenu((v) => !v)}
        >
          🖼
        </button>

        {showImageMenu && (
          <div className="blog-image-menu">
            <button
              type="button"
              className="blog-image-menu-item"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload from device
            </button>
            <button
              type="button"
              className="blog-image-menu-item"
              onClick={() => setShowUrlInput((v) => !v)}
            >
              Add image URL
            </button>

            {showUrlInput && (
              <div className="blog-image-url-row">
                <input
                  type="text"
                  className="blog-image-url-input"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onInsertImageUrl()}
                />
                <button type="button" className="blog-image-url-add" onClick={onInsertImageUrl}>
                  Add
                </button>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="blog-hidden-file-input"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}