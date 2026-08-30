import { DecoratorNode } from "lexical";
import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

// ---------- React component that actually renders <img> inside the editor ----------
function ImageComponent({ src, altText, nodeKey, width, height }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const imgRef = useRef(null);

  const onDelete = useCallback(
    (event) => {
      if (isSelected) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node) node.remove();
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey]
  );

  React.useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (event.target === imgRef.current) {
            setIsSelected(true);
            return true;
          }
          setIsSelected(false);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
    );
  }, [editor, onDelete]);

  return (
    <div className={`blog-editor-image-wrapper${isSelected ? " is-selected" : ""}`}>
      <img
        ref={imgRef}
        src={src}
        alt={altText}
        className="blog-editor-image"
        style={{ width: width || "auto", height: height || "auto" }}
        draggable={false}
      />
      {isSelected && (
        <button
          type="button"
          className="blog-editor-image-remove"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if (node) node.remove();
            })
          }
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ---------- The actual Lexical node definition ----------
export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  static importJSON(serializedNode) {
    const { src, altText, width, height } = serializedNode;
    return new ImageNode(src, altText, width, height);
  }

  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  constructor(src, altText, width, height, key) {
    super(key);
    this.__src = src;
    this.__altText = altText || "image";
    this.__width = width;
    this.__height = height;
  }

  createDOM(config) {
    const div = document.createElement("div");
    div.className = "blog-editor-image-container";
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        nodeKey={this.getKey()}
        width={this.__width}
        height={this.__height}
      />
    );
  }
}

export function $createImageNode({ src, altText, width, height }) {
  return new ImageNode(src, altText, width, height);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}