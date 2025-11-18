import React from 'react';
import { Task, Screenshot } from '../types';

interface Props {
  tasks: Task[];
  screenshots: Screenshot[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Task>) => void;
}

export default function TaskList({ tasks, screenshots, onDelete, onUpdate }: Props) {
  const handleStatusChange = (taskId: string, status: Task['status']) => {
    onUpdate(taskId, { status });
  };

  if (tasks.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No tasks yet</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const screenshot = screenshots.find((s) => s.id === task.screenshot_id);

        return (
          <li
            key={task.id}
            className={`task-item ${task.status} ${task.priority === 'high' ? 'high-priority' : ''}`}
          >
            <div className="task-header">
              <div className="task-title">{task.title}</div>
              <div className="task-status">{task.status}</div>
            </div>

            {task.description && <div className="task-description">{task.description}</div>}

            <div className="task-meta">
              Priority: {task.priority}
              {screenshot && ` | From screenshot (${screenshot.ocr_provider})`}
              {task.created_at && ` | Created: ${new Date(task.created_at).toLocaleDateString()}`}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button className="btn btn-danger btn-small" onClick={() => onDelete(task.id)}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
