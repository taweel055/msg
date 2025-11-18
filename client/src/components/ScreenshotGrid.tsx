import React, { useState } from 'react';
import { Screenshot, Group, Task } from '../types';
import { api } from '../api';

interface Props {
  screenshots: Screenshot[];
  groups: Group[];
  onDelete: (id: string) => void;
  onTaskCreated: (task: Task) => void;
}

export default function ScreenshotGrid({ screenshots, groups, onDelete, onTaskCreated }: Props) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScreenshot) return;

    try {
      const task = await api.createTask({
        title: taskTitle,
        description: taskDescription,
        screenshot_id: selectedScreenshot.id,
        group_id: selectedScreenshot.group_id,
        priority: taskPriority,
      });

      onTaskCreated(task);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setShowTaskForm(false);
      setSelectedScreenshot(null);
    } catch (err) {
      alert('Failed to create task');
      console.error(err);
    }
  };

  if (screenshots.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No screenshots yet</div>;
  }

  return (
    <>
      <div className="screenshot-grid">
        {screenshots.map((screenshot) => {
          const group = groups.find((g) => g.id === screenshot.group_id);

          return (
            <div key={screenshot.id} className="screenshot-card">
              <div className="screenshot-info">
                <h3>
                  {screenshot.ocr_provider.toUpperCase()} OCR
                  {group && (
                    <span style={{ marginLeft: '10px', fontSize: '12px', color: group.color || '#667eea' }}>
                      {group.name}
                    </span>
                  )}
                </h3>

                {screenshot.summary && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#e8f4fd', borderRadius: '4px' }}>
                    <strong>Summary:</strong>
                    <p style={{ fontSize: '13px', marginTop: '5px' }}>{screenshot.summary}</p>
                  </div>
                )}

                {screenshot.extracted_text && (
                  <div className="screenshot-text">
                    <strong>Extracted Text:</strong>
                    <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{screenshot.extracted_text}</p>
                  </div>
                )}

                <div style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
                  {new Date(screenshot.created_at).toLocaleString()}
                </div>

                <div className="screenshot-actions">
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => {
                      setSelectedScreenshot(screenshot);
                      setShowTaskForm(true);
                    }}
                  >
                    Create Task
                  </button>
                  <button className="btn btn-danger btn-small" onClick={() => onDelete(screenshot.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showTaskForm && selectedScreenshot && (
        <div className="modal" onClick={() => setShowTaskForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Task</h2>
              <button className="close-btn" onClick={() => setShowTaskForm(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  placeholder="Task title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Task description"
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button type="submit" className="btn" style={{ width: '100%' }}>
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
