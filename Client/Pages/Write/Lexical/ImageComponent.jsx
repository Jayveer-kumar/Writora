import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';

export default function ImageComponent({ src, altText, width, height, nodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [selected, setSelected] = useState(false);

  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) node.remove();
    });
  };

  return (
    <div
      className={`editor-image-inner${selected ? ' selected' : ''}`}
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      tabIndex={-1}
    >
      <img src={src} alt={altText} style={{ width, height }} draggable={false} />
      {selected && (
        <button
          type="button"
          className="image-delete-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleDelete}
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  );
}