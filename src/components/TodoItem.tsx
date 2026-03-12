'use client';

import { useState } from 'react';

export interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setEditing(false);
    } catch {
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setError('');
    setEditing(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (editing) {
    return (
      <div className="todo-item todo-item--editing">
        {error && <p className="item-error">{error}</p>}
        <div className="form-group">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="form-input"
            placeholder="Title"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="form-textarea"
            placeholder="Description (optional)"
            rows={2}
            disabled={loading}
          />
        </div>
        <div className="item-actions">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-success btn-sm"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}>
      <div className="todo-item__left">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={loading}
          className="todo-checkbox"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="todo-content">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <span className="todo-date">Created: {formatDate(todo.createdAt)}</span>
        </div>
      </div>
      <div className="item-actions">
        <button
          onClick={() => setEditing(true)}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          aria-label="Edit todo"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="btn btn-danger btn-sm"
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
