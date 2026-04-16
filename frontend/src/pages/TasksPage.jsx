import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import TaskCard from '../components/TaskCard';

const CATEGORIES = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); 

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
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDecompose = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/tasks/${id}/decompose`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Decompose error:', err);
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

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <p className="text-xs font-bold text-nordic-muted tracking-widest uppercase mb-1">Task Management</p>
          <h2 className="text-3xl md:text-4xl font-black text-nordic-text tracking-tight">All Tasks</h2>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-left md:text-right w-full">
            <p className="text-[0.65rem] font-bold text-nordic-muted uppercase tracking-wider mb-1">
              {completedCount} / {tasks.length} Complete
            </p>
            <div className="w-full md:w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-nordic-mint transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white rounded-px border border-nordic-border shadow-sm p-3 md:p-4 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex items-center gap-2 flex-1 bg-nordic-bg rounded-lg px-3 py-2 border border-nordic-border">
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 bg-nordic-bg rounded-lg p-1 border border-nordic-border flex-1 md:flex-none">
            {['All', 'Active', 'Completed'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex-1 md:flex-none px-3 py-1.5 text-[0.65rem] font-bold rounded-md transition-all ${
                  filterStatus === s
                    ? 'bg-nordic-navy text-white'
                    : 'text-nordic-muted hover:text-nordic-text'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-1 md:flex-none">
            <div className="flex items-center gap-1.5 text-xs font-bold text-nordic-muted flex-1 md:flex-none">
              <Filter size={14} className="shrink-0" />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-nordic-bg border border-nordic-border rounded-lg px-2 py-1.5 text-[0.65rem] font-bold outline-none cursor-pointer w-full"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-nordic-muted flex-1 md:flex-none">
              <ChevronDown size={14} className="shrink-0" />
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="bg-nordic-bg border border-nordic-border rounded-lg px-2 py-1.5 text-[0.65rem] font-bold outline-none cursor-pointer w-full"
              >
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
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
        <div className="space-y-4">
          {filtered.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onToggleStatus={handleToggle}
              onDecompose={handleDecompose}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
