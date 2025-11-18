import React, { useState, useEffect } from 'react';
import { api } from './api';
import { Screenshot, Group, Task } from './types';
import UploadSection from './components/UploadSection';
import GroupSidebar from './components/GroupSidebar';
import ScreenshotGrid from './components/ScreenshotGrid';
import TaskList from './components/TaskList';

function App() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'screenshots' | 'tasks'>('screenshots');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [screenshotsData, groupsData, tasksData] = await Promise.all([
        api.getScreenshots(),
        api.getGroups(),
        api.getTasks(),
      ]);
      setScreenshots(screenshotsData);
      setGroups(groupsData);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (screenshot: Screenshot) => {
    setScreenshots([screenshot, ...screenshots]);
  };

  const handleGroupCreated = (group: Group) => {
    setGroups([group, ...groups]);
  };

  const handleTaskCreated = (task: Task) => {
    setTasks([task, ...tasks]);
  };

  const handleDeleteScreenshot = async (id: string) => {
    try {
      await api.deleteScreenshot(id);
      setScreenshots(screenshots.filter((s) => s.id !== id));
    } catch (err) {
      setError('Failed to delete screenshot');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    try {
      const updated = await api.updateTask(id, data);
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const filteredScreenshots = selectedGroup
    ? screenshots.filter((s) => s.group_id === selectedGroup)
    : screenshots;

  const filteredTasks = selectedGroup
    ? tasks.filter((t) => t.group_id === selectedGroup)
    : tasks;

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Screenshot OCR App</h1>
        <p>Process screenshots with Claude or DeepSeek AI, organize into groups, and create tasks</p>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="main-content">
        <GroupSidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          onGroupCreated={handleGroupCreated}
        />

        <div className="content-area">
          <UploadSection
            groups={groups}
            onUploadSuccess={handleUploadSuccess}
            selectedGroup={selectedGroup}
          />

          <div className="card">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'screenshots' ? 'active' : ''}`}
                onClick={() => setActiveTab('screenshots')}
              >
                Screenshots ({filteredScreenshots.length})
              </button>
              <button
                className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                Tasks ({filteredTasks.length})
              </button>
            </div>

            {activeTab === 'screenshots' ? (
              <ScreenshotGrid
                screenshots={filteredScreenshots}
                groups={groups}
                onDelete={handleDeleteScreenshot}
                onTaskCreated={handleTaskCreated}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                screenshots={screenshots}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
