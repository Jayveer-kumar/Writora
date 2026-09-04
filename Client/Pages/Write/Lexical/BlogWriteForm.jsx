import React, { useCallback, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';

import { $getRoot } from 'lexical';

import theme from './theme';
import { ImageNode } from './ImageNode';
import ImagesPlugin from './ImagesPlugin';
import InsertMenuPlugin from './InsertMenuPlugin';
import BlogCategoryDropDown from './BlogCategoryDropDown';
import { useToast } from '../../../Components/Ui/AlertToast';

import './Editor.css';

function onError(error) {
  console.error(error);
}

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * BlogWriteForm
 *
 * The complete "write a blog post" screen: a separate title input on
 * top, and a Lexical-powered body editor below it where the user
 * clicks the "+" next to any empty line to insert Heading 1/2/3,
 * plain text, bulleted/numbered list, quote, code block, or image
 * (upload or by URL).
 *
 * Fetching posts from your server and rendering them elsewhere is
 * intentionally NOT handled here — this component only produces the
 * data you need to send to your own save/publish API:
 *
 *   onChange({ title, content })
 *
 *   - title: plain string
 *   - content: a JSON string (Lexical's serialized editor state).
 *     Store this string as-is in your DB. Since it captures the
 *     exact block structure (which paragraphs, how many headings,
 *     images with their src/alt), you can rebuild the exact same
 *     content later by feeding this string back into a Lexical
 *     instance (editable or read-only) — no separate parsing logic
 *     needed on the render side.
 *
 * Props:
 *  - initialTitle?: string
 *  - initialContent?: string (a previously saved JSON string, to resume editing)
 *  - onChange?: ({ title, content, wordCount }) => void   // fired on every keystroke
 *  - onCancel?: () => void                                 // Cancel button
 *  - onSaveDraft?: ({ title, content }) => void             // Save Draft button
 *  - onSubmit?: ({ title, content }) => void                // Publish button
 *  - cancelLabel?: string (default: "Cancel")
 *  - saveDraftLabel?: string (default: "Save Draft")
 *  - submitLabel?: string (default: "Publish")
 */
export default function BlogWriteForm({
  initialTitle = '',
  initialContent,
  onChange,
  onCancel,
  onSaveDraft,
  onSubmit,
  cancelLabel = 'Cancel',
  saveDraftLabel = 'Save Draft',
  submitLabel = 'Publish',
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || null);
  const [wordCount, setWordCount] = useState(0);
  const [category, setCategory] = useState("");
  

  const initialConfig = {
    namespace: 'BlogWriteForm',
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode, ImageNode],
    editorState: initialContent || undefined,
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (onChange) onChange({ title: value, content, wordCount });
  };

  const handleEditorChange = useCallback(
    (editorState) => {
      const json = JSON.stringify(editorState.toJSON());
      let plainText = '';
      editorState.read(() => {
        plainText = $getRoot().getTextContent();
      });
      const count = countWords(plainText);

      setContent(json);
      setWordCount(count);
      if (onChange) onChange({ title, content: json, wordCount: count });
    },
    [onChange, title]
  );

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) onSaveDraft({ title, content });
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ title, content , category });
  };

  return (
    <div className="blog-write-form">

      <div className="blog-write-actions">
        <span className="blog-word-count">{wordCount} words</span>

        <div className="blog-write-actions-right"> 
          <BlogCategoryDropDown value={category} onChange={setCategory}/>
          {onCancel && (
            <button type="button" className="btn-secondary blog-action-btn btn-cancel " onClick={handleCancel}>
              {cancelLabel}
            </button>
          )}
          {onSaveDraft && (
            <button type="button" className="btn-secondary blog-action-btn" onClick={handleSaveDraft}>
              {saveDraftLabel}
            </button>
          )}
          {onSubmit && (
            <button type="button" className="btn-primary blog-action-btn" onClick={handleSubmit}>
              {submitLabel}
            </button>
          )}
        </div>
      </div>
      <hr className='blog-header-devider' />


      <input
        type="text"
        className="blog-title-input"
        placeholder="Enter Your Blog Title Here..."
        value={title}
        onChange={handleTitleChange}
      />

      <div className="editor-shell">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="editor-container">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">Apni kahani likhna shuru karein...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <ImagesPlugin />
            <InsertMenuPlugin />
            <OnChangePlugin onChange={handleEditorChange} ignoreSelectionChange />
          </div>
        </LexicalComposer>
      </div>

      
    </div>
  );
}