import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CaptureBox from '../components/CaptureBox';
import TaskCard from '../components/TaskCard';
import { Search, Bell, Calendar as CalIcon, Plus, X } from 'lucide-react';
import Calendar from '../components/Calendar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/suggestions');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Initial fetch + auto-refresh tasks every 30 seconds
  useEffect(() => {
    fetchTasks();
    fetchSuggestions();
    const interval = setInterval(() => fetchTasks(), 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const handleDecompose = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/tasks/${id}/decompose`);
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (error) {
      console.error('Error decomposing task:', error);
    }
  };

  const handleAcceptSuggestion = async (suggestion) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', suggestion);
      setTasks([response.data, ...tasks]);
      setSuggestions(suggestions.filter(s => s.title !== suggestion.title));
    } catch (error) {
      console.error('Error accepting suggestion:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskCaptured = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  // Filter tasks by search query AND selected date
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || (t.deadline && new Date(t.deadline).toDateString() === selectedDate.toDateString());
    return matchesSearch && matchesDate;
  });

  // Dynamic completion %
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full max-w-screen-2xl">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center bg-white px-4 py-2.5 rounded-lg shadow-sm w-[400px] gap-3 border border-nordic-border">
          <Search size={18} className="text-nordic-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none outline-none text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-6 relative">
          <Bell size={20} className="text-nordic-muted cursor-pointer hover:text-nordic-navy transition-colors" />
          <div className="relative">
            <CalIcon 
              size={20} 
              className={`cursor-pointer transition-colors ${showCalendar || selectedDate ? 'text-nordic-navy' : 'text-nordic-muted hover:text-nordic-navy'}`} 
              onClick={(e) => { e.stopPropagation(); setShowCalendar(!showCalendar); }} 
            />
            {showCalendar && (
              <Calendar 
                tasks={tasks} 
                selectedDate={selectedDate} 
                onSelectDate={(date) => { setSelectedDate(date); setShowCalendar(false); }}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-200"></div>
        </div>
      </header>

      <section className="mb-5">
        <h2 className="text-3xl font-bold text-nordic-text">Good morning, User.</h2>
        <p className="text-nordic-muted text-base font-medium mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </section>

      <CaptureBox onTaskCaptured={handleTaskCaptured} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 mt-8">
        <div>
          <div className="flex justify-between items-baseline mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-nordic-text">
                {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Today's Focus"}
              </h3>
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="flex items-center gap-1 text-[0.65rem] font-bold text-nordic-mint uppercase tracking-widest hover:brightness-90 transition-all bg-nordic-mint/10 px-2 py-0.5 rounded"
                >
                  <X size={10} /> Clear Filter
                </button>
              )}
            </div>
            <span className="text-xs font-bold text-nordic-muted tracking-wide uppercase">
              {filteredTasks.filter(t => !t.completed).length} TASKS REMAINING
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-10 text-nordic-muted">Loading tasks...</p>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onToggleStatus={handleToggleStatus} 
                  onDecompose={handleDecompose}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-px border border-dashed border-nordic-border text-nordic-muted">
                {searchQuery ? 'No tasks match your search.' : 'No tasks found. Try capturing one above!'}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-px p-6 shadow-sm border border-nordic-border">
            <h4 className="text-xs font-bold text-nordic-mint tracking-[1px] mb-6 uppercase">Suggested Actions</h4>
            <div className="space-y-4">
              {loadingSuggestions ? (
                <p className="text-sm text-nordic-muted italic">Analyzing patterns...</p>
              ) : suggestions.length > 0 ? (
                suggestions.map((sug, i) => (
                  <div key={i} className="flex gap-4 p-3 border border-slate-100 rounded-lg hover:border-nordic-mint transition-colors group">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-nordic-text leading-snug">{sug.title}</p>
                      <p className="text-xs font-bold text-nordic-muted uppercase tracking-wider mt-2">{sug.category} • {sug.priority}</p>
                    </div>
                    <button 
                      onClick={() => handleAcceptSuggestion(sug)}
                      className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-nordic-mint opacity-0 group-hover:opacity-100 transition-all hover:bg-nordic-mint hover:text-white shrink-0"
                      title="Accept Suggestion"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-nordic-muted">No current suggestions.</p>
              )}
            </div>
          </div>
          
          <div className="bg-nordic-navy rounded-px p-6 text-white overflow-hidden relative group cursor-pointer transition-transform active:scale-95">
             <div className="absolute top-0 right-0 w-32 h-32 bg-nordic-mint/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
             <h4 className="text-xs font-bold text-nordic-mint tracking-wider mb-2">WEEKLY PULSE</h4>
             <p className="text-xl font-bold leading-tight relative z-10">Task Progress</p>
             <div className="mt-6">
               <div className="flex justify-between items-end mb-1">
                 <span className="text-xs font-bold uppercase text-nordic-mint">Completion</span>
                 <span className="text-lg font-bold">{completionPct}%</span>
               </div>
               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-nordic-mint transition-all duration-500" style={{ width: `${completionPct}%` }}></div>
               </div>
             </div>
             <p className="text-xs text-white/50 mt-4 leading-relaxed">
               {completedCount} of {tasks.length} tasks completed. {completionPct >= 75 ? 'Excellent focus!' : 'Stay consistent.'}
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
