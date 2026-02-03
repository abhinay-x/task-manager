import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const POLL_INTERVAL_MS = 5000;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [loadingState, setLoadingState] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTasks = useCallback(async () => {
    const { data } = await getTasks();
    setTasks(data);
    setLastUpdated(new Date());

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tasks:updated', { detail: data }));
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTasks();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchTasks]);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError('');
    const taskData = { title, description, status, priority, dueDate };
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      await fetchTasks();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoadingState(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setPriority('Medium');
    setDueDate('');
    setEditingTask(null);
    setIsCreating(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority || 'Medium');
    setDueDate(task.dueDate || '');
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleToggleComplete = async (task) => {
    await updateTask(task._id, {
      ...task,
      status: task.status === 'Completed' ? 'Pending' : 'Completed'
    });
    fetchTasks();
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) =>
      filterStatus === 'All' ? true : task.status === filterStatus
    )
    .filter((task) =>
      filterPriority === 'All' ? true : task.priority === filterPriority
    );

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Tasks</h2>
          <p className="text-muted text-sm">Create and manage your focus items</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <div className="flex items-center gap-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live updates
          </div>
          {lastUpdated && (
            <span className="text-muted/80">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Inline Task Creation */}
      <div className="mb-8">
        {!isCreating && !editingTask ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-4 add-task-trigger flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add a new task...
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 task-form-panel p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-primary">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button type="button" onClick={resetForm} className="themed-icon-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-slide-up">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="field">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-glass"
                placeholder=" "
                required
              />
              <label className="floating-label">Title</label>
            </div>

            <div className="field">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-glass h-24"
                placeholder=" "
                rows={4}
              ></textarea>
              <label className="floating-label">Description</label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="field" data-filled={(status || '').length > 0}>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-glass"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <label className="floating-label">Status</label>
              </div>

              <div className="field" data-filled={(priority || '').length > 0}>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="input-glass"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <label className="floating-label">Priority</label>
              </div>

              <div className="field col-span-2" data-filled={Boolean(dueDate)}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-glass"
                  placeholder=" "
                />
                <label className="floating-label">Due Date</label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loadingState} className="btn-primary flex-1">
                {loadingState ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center">
        <div className="relative flex-1 group">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-glass pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-glass w-full md:w-40"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="input-glass w-full md:w-40"
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {(filterStatus !== 'All' || filterPriority !== 'All' || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('All');
              setFilterPriority('All');
            }}
            className="clear-filters-btn text-sm"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 themed-icon-button flex items-center justify-center text-primary">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-secondary mb-2">You're all caught up 🎉</p>
            <p className="text-muted text-sm">Add your first task to stay productive.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`task-card p-4 group ${
                task.status === 'Completed' ? 'task-card--completed' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.status === 'Completed'
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gray-400 hover:border-white'
                  }`}
                >
                  {task.status === 'Completed' && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-lg text-primary truncate ${task.status === 'Completed' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <span className={`priority-badge ${
                      task.priority === 'High' ? 'priority-badge--high' :
                      task.priority === 'Medium' ? 'priority-badge--medium' :
                      'priority-badge--low'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-muted text-sm mb-2 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className={`status-badge ${
                      task.status === 'Completed'
                        ? 'status-badge--completed'
                        : 'status-badge--active'
                    }`}>
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(task)}
                    className="task-action-button"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="task-action-button task-action-button--danger"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.413A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
