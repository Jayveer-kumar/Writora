import React, { useState } from 'react';

export default function ImageUploadDialog({ onInsert, onClose }) {
  const [tab, setTab] = useState('upload'); // 'upload' | 'url'
  const [urlValue, setUrlValue] = useState('');
  const [preview, setPreview] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError('');
    setUploading(true);

    // ---------------------------------------------------------------
    // Demo behaviour: convert the file to base64 so it works out of
    // the box with zero backend setup.
    //
    // For a real blog app, replace this block with an actual upload
    // call to your server/storage (S3, Cloudinary, your own API,
    // etc.) and use the returned hosted URL instead of base64 —
    // base64 makes your saved post JSON huge and slow to load.
    //
    // Example:
    //   const formData = new FormData();
    //   formData.append('image', file);
    //   const res = await fetch('/api/upload', { method: 'POST', body: formData });
    //   const { url } = await res.json();
    //   setFileData(url);
    //   setPreview(url);
    // ---------------------------------------------------------------
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setFileData(reader.result);
      setUploading(false);
    };
    reader.onerror = () => {
      setError('File read nahi ho paayi, dobara try karein.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInsertClick = () => {
    if (tab === 'upload') {
      if (!fileData) {
        setError('Pehle ek image select karein.');
        return;
      }
      onInsert({ src: fileData, altText: 'blog image' });
    } else {
      if (!urlValue.trim()) {
        setError('Image URL daalein.');
        return;
      }
      onInsert({ src: urlValue.trim(), altText: 'blog image' });
    }
  };

  return (
    <div className="image-dialog-overlay" onMouseDown={onClose}>
      <div className="image-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="image-dialog-tabs">
          <button
            type="button"
            className={tab === 'upload' ? 'active' : ''}
            onClick={() => {
              setTab('upload');
              setError('');
            }}
          >
            Upload
          </button>
          <button
            type="button"
            className={tab === 'url' ? 'active' : ''}
            onClick={() => {
              setTab('url');
              setError('');
            }}
          >
            By URL
          </button>
          <button type="button" className="image-dialog-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="image-dialog-body">
          {tab === 'upload' ? (
            <>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {uploading && <p className="image-dialog-hint">Loading...</p>}
              {preview && <img src={preview} alt="preview" className="image-dialog-preview" />}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                className="image-dialog-input"
              />
              {urlValue && (
                <img
                  src={urlValue}
                  alt="preview"
                  className="image-dialog-preview"
                  onError={() => setError('Image load nahi ho paayi, URL check karein.')}
                  onLoad={() => setError('')}
                />
              )}
            </>
          )}
          {error && <p className="image-dialog-error">{error}</p>}
        </div>

        <div className="image-dialog-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleInsertClick} className="btn-primary">
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}