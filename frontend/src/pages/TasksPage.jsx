import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Filter, Trash2, CheckCircle, Circle, Calendar, Tag,
  ChevronDown, Layers, X
} from 'lucide-react';

const CATEGORIES = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-500',
  Medium: 'bg-nordic-mint/20 text-nordic-mint',
  High: 'bg-rose-100 text-rose-500',
  Critical: 'bg-rose-200 text-rose-600',
};

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // All | Active | Completed
  const [decomposing, setDecomposing] = useState(null); // task id being decomposed

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleToggle = async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${id}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDecompose = async (id) => {
    setDecomposing(id);
    try {
      const res = await axios.post(`http://localhost:5000/api/tasks/${id}/decompose`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Decompose error:', err);
    } finally {
      setDecomposing(null);
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskIndex) => {
    const task = tasks.find(t => t._id === taskId);
    const updatedSubtasks = task.subtasks.map((s, i) =>
      i === subtaskIndex ? { ...s, completed: !s.completed } : s
    );
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, {
        subtasks: updatedSubtasks
      });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error('Subtask toggle error:', err);
    }
  };

  const filtered = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'All' || task.category === filterCategory;
    const matchPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Active' && !task.completed) ||
      (filterStatus === 'Completed' && task.completed);
    return matchSearch && matchCategory && matchPriority && matchStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs font-bold text-nordic-muted tracking-widest uppercase mb-1">Task Management</p>
          <h2 className="text-3xl font-bold text-nordic-text">All Tasks</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-nordic-muted uppercase tracking-wider mb-1">
              {completedCount} / {tasks.length} Complete
            </p>
            <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-nordic-mint transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white rounded-px border border-nordic-border shadow-sm p-4 mb-8 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-nordic-bg rounded-lg px-3 py-2 border border-nordic-border">
          <Search size={16} className="text-nordic-muted shrink-0" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none border-none text-sm flex-1 text-nordic-text"
          />
          {searchQuery && (
            <X size={14} className="text-nordic-muted cursor-pointer" onClick={() => setSearchQuery('')} />
          )}
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 bg-nordic-bg rounded-lg p-1 border border-nordic-border">
          {['All', 'Active', 'Completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                filterStatus === s
                  ? 'bg-nordic-navy text-white'
                  : 'text-nordic-muted hover:text-nordic-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-nordic-muted">
          <Filter size={14} />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-nordic-bg border border-nordic-border rounded-lg px-2 py-1.5 text-xs font-semibold outline-none cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-nordic-muted">
          <ChevronDown size={14} />
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-nordic-bg border border-nordic-border rounded-lg px-2 py-1.5 text-xs font-semibold outline-none cursor-pointer"
          >
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <p className="text-xs text-nordic-muted ml-auto">
          Showing <span className="font-bold text-nordic-text">{filtered.length}</span> tasks
        </p>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-mint" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-px border border-dashed border-nordic-border">
          <p className="text-nordic-muted text-sm font-medium">No tasks match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(task => {
            const progress = task.subtasks?.length > 0
              ? (task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100
              : null;

            return (
              <div
                key={task._id}
                className="bg-white rounded-px border border-nordic-border shadow-sm hover:shadow-md transition-all"
              >
                {/* Main Row */}
                <div className="flex items-start gap-4 p-5">
                  <button
                    onClick={() => handleToggle(task._id)}
                    className="mt-0.5 shrink-0"
                  >
                    {task.completed
                      ? <CheckCircle size={22} className="text-nordic-mint" />
                      : <Circle size={22} className="text-slate-300" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-semibold mb-2 ${
                      task.completed ? 'line-through text-slate-400' : 'text-nordic-text'
                    }`}>
                      {task.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-[0.75rem] text-nordic-muted">
                        <Calendar size={13} /> {formatDate(task.deadline)}
                      </span>
                      <span className="flex items-center gap-1 text-[0.75rem] text-nordic-muted">
                        <Tag size={13} /> {task.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold tracking-wider uppercase ${priorityStyles[task.priority] || 'bg-slate-100 text-slate-500'}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Subtask Progress Bar */}
                    {progress !== null && (
                      <div className="flex items-center gap-2.5 mt-3">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-nordic-mint transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[0.7rem] text-nordic-muted font-medium whitespace-nowrap">
                          {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(!task.subtasks || task.subtasks.length === 0) && (
                      <button
                        onClick={() => handleDecompose(task._id)}
                        disabled={decomposing === task._id}
                        title="Break into subtasks"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-nordic-mint hover:bg-nordic-bg transition-all disabled:opacity-40"
                      >
                        {decomposing === task._id
                          ? <div className="w-4 h-4 border-2 border-nordic-mint border-t-transparent rounded-full animate-spin" />
                          : <Layers size={16} />
                        }
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task._id)}
                      title="Delete task"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Subtask List (Expanded) */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="border-t border-nordic-border px-5 pb-4 pt-3 space-y-2.5">
                    {task.subtasks.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleSubtaskToggle(task._id, idx)}
                      >
                        {sub.completed
                          ? <CheckCircle size={16} className="text-nordic-mint shrink-0" />
                          : <Circle size={16} className="text-slate-300 group-hover:text-slate-400 shrink-0" />
                        }
                        <span className={`text-sm ${sub.completed ? 'line-through text-slate-400' : 'text-nordic-text'}`}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
