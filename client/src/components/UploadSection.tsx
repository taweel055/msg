import React, { useState, useRef } from 'react';
import { api } from '../api';
import { Screenshot, Group } from '../types';

interface Props {
  groups: Group[];
  onUploadSuccess: (screenshot: Screenshot) => void;
  selectedGroup: string | null;
}

export default function UploadSection({ groups, onUploadSuccess, selectedGroup }: Props) {
  const [uploading, setUploading] = useState(false);
  const [provider, setProvider] = useState<'claude' | 'deepseek'>('claude');
  const [groupId, setGroupId] = useState<string>(selectedGroup || '');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);
      const screenshot = await api.uploadScreenshot(file, provider, groupId || undefined);
      onUploadSuccess(screenshot);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      alert('Failed to upload screenshot');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'text/plain')) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="card">
      <h2>Upload Screenshot or WhatsApp Chat</h2>

      <div className="form-group">
        <label>AI Provider</label>
        <select value={provider} onChange={(e) => setProvider(e.target.value as 'claude' | 'deepseek')}>
          <option value="claude">Claude Haiku 4.5 (Recommended)</option>
          <option value="deepseek">DeepSeek (Chat Analysis Only)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Group (Optional)</label>
        <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="">No Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`upload-area ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.txt"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <p>Uploading and processing...</p>
        ) : (
          <>
            <p>Drop file here or click to browse</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              Images: JPG, PNG, GIF, WebP | WhatsApp Chats: TXT
            </p>
          </>
        )}
      </div>
    </div>
  );
}
