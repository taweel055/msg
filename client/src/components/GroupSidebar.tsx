import React, { useState } from 'react';
import { api } from '../api';
import { Group } from '../types';

interface Props {
  groups: Group[];
  selectedGroup: string | null;
  onSelectGroup: (id: string | null) => void;
  onGroupCreated: (group: Group) => void;
}

export default function GroupSidebar({ groups, selectedGroup, onSelectGroup, onGroupCreated }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#667eea');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const group = await api.createGroup({ name, description, color });
      onGroupCreated(group);
      setName('');
      setDescription('');
      setColor('#667eea');
      setShowForm(false);
    } catch (err) {
      alert('Failed to create group');
      console.error(err);
    }
  };

  return (
    <div className="sidebar">
      <h2>Groups</h2>

      <button className="btn" style={{ width: '100%', marginBottom: '15px' }} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'New Group'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            Create
          </button>
        </form>
      )}

      <ul className="group-list">
        <li
          className={`group-item ${selectedGroup === null ? 'active' : ''}`}
          onClick={() => onSelectGroup(null)}
        >
          <span>All Items</span>
        </li>

        {groups.map((group) => (
          <li
            key={group.id}
            className={`group-item ${selectedGroup === group.id ? 'active' : ''}`}
            onClick={() => onSelectGroup(group.id)}
          >
            <span>
              <span className="group-color" style={{ backgroundColor: group.color || '#667eea' }} />
              {group.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
