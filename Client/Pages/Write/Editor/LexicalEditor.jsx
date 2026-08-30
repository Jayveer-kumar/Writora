import { useState, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { $getRoot } from "lexical";

import editorTheme from "./theme/editorTheme";
import { ImageNode } from "./nodes/ImageNode";
import ImagesPlugin from "./plugins/ImagesPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

import "./Lexicaleditor.css";

function onError(error) {
  console.error(error);
}

/**
 * BlogEditor
 *
 * Props:
 *  - onChange(editorStateJSON, plainText) -> jab bhi content change ho
 *  - initialState (optional) -> saved lexical JSON state string, editing ke liye
 *  - placeholder (optional) -> default placeholder text
 */
export default function LexicalEditor({ onChange, initialState, placeholder = "Apni blog post yahan likhna shuru karein…" }) {
  const initialConfig = {
    namespace: "BlogEditor",
    theme: editorTheme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, CodeHighlightNode, LinkNode, ImageNode],
    editorState: initialState || undefined,
  };

  const handleChange = useCallback(
    (editorState, editor) => {
      if (!onChange) return;
      editorState.read(() => {
        const plainText = $getRoot().getTextContent();
        onChange(JSON.stringify(editorState.toJSON()), plainText);
      });
    },
    [onChange]
  );

  return (
    <div className="blog-editor-shell">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="blog-editor-scroll-area">
          <div className="blog-editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="blog-editor-content" aria-placeholder={placeholder} placeholder={
                  <div className="blog-editor-placeholder">{placeholder}</div>
                } />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TabIndentationPlugin />
        <ImagesPlugin />
        {onChange && <OnChangePlugin onChange={handleChange} ignoreSelectionChange />}
      </LexicalComposer>
    </div>
  );
}