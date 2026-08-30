import { DecoratorNode } from 'lexical';
import React from 'react';
import ImageComponent from './ImageComponent';

// A DecoratorNode lets us render a real React component inside the
// Lexical document while still keeping the image as a first-class,
// serializable block (src/alt/width/height survive save + reload).
export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  // Restoring a saved post: this turns saved JSON back into a real node.
  static importJSON(serializedNode) {
    const { src, altText, width, height } = serializedNode;
    return $createImageNode({ src, altText, width, height });
  }

  // Saving a post: this is what gets stored in your DB as part of
  // editorState.toJSON().
  exportJSON() {
    return {
      type: 'image',
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
    this.__altText = altText || '';
    this.__width = width || 'auto';
    this.__height = height || 'auto';
  }

  createDOM() {
    const div = document.createElement('div');
    div.className = 'editor-image-wrapper';
    return div;
  }

  updateDOM() {
    return false;
  }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
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