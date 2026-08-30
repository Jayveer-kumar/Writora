import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin';
import ImageUploadDialog from './ImageUploadDialog';

const MENU_ITEMS = [
  { key: 'h1', label: 'Heading 1', icon: 'H1' },
  { key: 'h2', label: 'Heading 2', icon: 'H2' },
  { key: 'h3', label: 'Heading 3', icon: 'H3' },
  { key: 'paragraph', label: 'Text', icon: '¶' },
  { key: 'ul', label: 'Bulleted list', icon: '•' },
  { key: 'ol', label: 'Numbered list', icon: '1.' },
  { key: 'quote', label: 'Quote', icon: '”' },
  { key: 'code', label: 'Code block', icon: '</>' },
  { key: 'image', label: 'Image', icon: '🖼' },
];

export default function InsertMenuPlugin() {
  const [editor] = useLexicalComposerContext();
  const [buttonTop, setButtonTop] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // Track the cursor: whenever it sits on an empty block (an empty
  // line), position the "+" button right next to that line — this is
  // the same interaction Notion/Medium-style editors use.
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          setButtonTop(null);
          setMenuOpen(false);
          return;
        }

        const anchorNode = selection.anchor.getNode();
        const topLevel = anchorNode.getTopLevelElementOrThrow();
        const isEmpty = topLevel.getTextContent() === '';

        if (!isEmpty) {
          setButtonTop(null);
          setMenuOpen(false);
          return;
        }

        const key = topLevel.getKey();
        const domNode = editor.getElementByKey(key);
        const rootNode = editor.getRootElement();
        if (!domNode || !rootNode) {
          setButtonTop(null);
          return;
        }

        const rect = domNode.getBoundingClientRect();
        const rootRect = rootNode.getBoundingClientRect();
        setButtonTop(rect.top - rootRect.top);
      });
    });
  }, [editor]);

  const applyBlock = useCallback(
    (type) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        switch (type) {
          case 'h1':
          case 'h2':
          case 'h3':
            $setBlocksType(selection, () => $createHeadingNode(type));
            break;
          case 'paragraph':
            $setBlocksType(selection, () => $createParagraphNode());
            break;
          case 'quote':
            $setBlocksType(selection, () => $createQuoteNode());
            break;
          case 'code':
            $setBlocksType(selection, () => $createCodeNode());
            break;
          default:
            break;
        }
      });

      if (type === 'ul') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else if (type === 'ol') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }

      setMenuOpen(false);
    },
    [editor]
  );

  const handleMenuSelect = (item) => {
    if (item.key === 'image') {
      setShowImageDialog(true);
      setMenuOpen(false);
      return;
    }
    applyBlock(item.key);
  };

  const handleImageInsert = ({ src, altText }) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText });
    setShowImageDialog(false);
  };

  if (buttonTop === null) return null;

  return (
    <>
      <div className="insert-menu-anchor" style={{ top: buttonTop }} contentEditable={false}>
        <button
          type="button"
          className="insert-plus-button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Insert block"
        >
          +
        </button>
        {menuOpen && (
          <div className="insert-dropdown">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className="insert-dropdown-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleMenuSelect(item)}
              >
                <span className="insert-dropdown-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {showImageDialog &&
        createPortal(
          <ImageUploadDialog onInsert={handleImageInsert} onClose={() => setShowImageDialog(false)} />,
          document.body
        )}
    </>
  );
}