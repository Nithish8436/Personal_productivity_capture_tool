import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CaptureBox from '../components/CaptureBox';
import TaskCard from '../components/TaskCard';
import { Search, Bell, Calendar as CalIcon, Plus, X } from 'lucide-react';
import Calendar from '../components/Calendar';
import NotificationPopover from '../components/NotificationPopover';
import DailySummary from '../components/DailySummary';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [reminderTriggered, setReminderTriggered] = useState(false);
  
  // Track triggered notification IDs to avoid repeating animations
  const [triggeredIds, setTriggeredIds] = useState(new Set());
  
  // Calculate notification count for the badge
  const notificationCount = useMemo(() => {
    const now = new Date();
    return tasks.filter(t => {
      if (t.completed) return false;
      const deadline = t.deadline ? new Date(t.deadline) : null;
      return (deadline && deadline < now) || (t.priority === 'Critical' || t.priority === 'High');
    }).length;
  }, [tasks]);

  const fetchTasks = useCallback(async () => {
    try {
      const url = searchQuery 
        ? `http://localhost:5000/api/tasks/search?q=${encodeURIComponent(searchQuery)}`
        : 'http://localhost:5000/api/tasks';
      
      setIsSearching(!!searchQuery);
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

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
    const handleOutsideClick = () => {
      setShowCalendar(false);
      setShowNotifications(false);
    };
    window.addEventListener('click', handleOutsideClick);

    // Immediate fetch when searchQuery or fetchTasks changes
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, searchQuery ? 300 : 0);

    fetchSuggestions();
    const interval = setInterval(() => fetchTasks(), 30000);
    
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      clearTimeout(delayDebounceFn);
      clearInterval(interval);
    };
  }, [fetchTasks, searchQuery]);

  // Real-time reminder monitor
  useEffect(() => {
    const monitorInterval = setInterval(() => {
      const now = new Date();
      
      const justTriggered = tasks.find(t => {
        if (t.completed || triggeredIds.has(t._id)) return false;
        if (!t.deadline) return false;
        
        const deadline = new Date(t.deadline);
        // Trigger if deadline has passed within the last 5 minutes AND we haven't triggered it yet
        const diffMs = now - deadline;
        return diffMs > 0 && diffMs < 300000; 
      });

      if (justTriggered) {
        setReminderTriggered(true);
        setTriggeredIds(prev => new Set([...prev, justTriggered._id]));
        
        // Play notification sound
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.5;
          audio.play();
        } catch (err) {
          console.error('Audio playback failed:', err);
        }
        
        // Auto-stop the intense shake after 10 seconds unless it was critical
        if (justTriggered.priority !== 'Critical') {
            setTimeout(() => setReminderTriggered(false), 10000);
        }
      }
    }, 5000);

    return () => clearInterval(monitorInterval);
  }, [tasks, triggeredIds]);

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

  const handleToggleSms = async (id, newValue) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`, {
        smsReminder: newValue
      });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (error) {
      console.error('Error updating SMS reminder:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      setShowNotifications(false); // Close if open
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskCaptured = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  // Filter tasks by active tab AND selected date
  const filteredTasks = tasks.filter(t => {
    // Filter by tab
    if (activeTab === 'Tasks' && t.itemType !== 'Task' && t.itemType !== 'To-do') return false;
    if (activeTab === 'Notes' && t.itemType !== 'Note') return false;
    if (activeTab === 'Reminders' && t.itemType !== 'Reminder') return false;

    // Defaults to today if no date is selected from calendar
    const targetDate = selectedDate || new Date();
    const isToday = targetDate.toDateString() === new Date().toDateString();
    
    let matchesDate = false;
    if (isToday) {
      // Show tasks due today OR freshly captured tasks with no deadline
      matchesDate = !t.deadline || new Date(t.deadline).toDateString() === targetDate.toDateString();
    } else {
      // If specific date selected, only show items precisely on that date
      matchesDate = t.deadline && new Date(t.deadline).toDateString() === targetDate.toDateString();
    }
    
    return matchesDate;
  });

  const DISPLAY_LIMIT = 5;
  const hasMoreTasks = filteredTasks.length > DISPLAY_LIMIT;
  const visibleTasks = filteredTasks.slice(0, DISPLAY_LIMIT);

  // Filter tasks that are due TODAY for the summary
  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(t => {
      if (!t.deadline) return false;
      return new Date(t.deadline).toDateString() === today;
    });
  }, [tasks]);

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Combined metrics for the overall dashboard summary
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center bg-white px-4 py-2.5 rounded-lg shadow-sm w-full md:w-[400px] gap-3 border border-nordic-border order-2 md:order-1 shrink-0 min-w-0">
          <Search size={18} className="text-nordic-muted shrink-0" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none outline-none text-sm flex-1 bg-transparent min-w-0"
          />
        </div>
        <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6 relative order-1 md:order-2">
           <div className="flex items-center gap-4">
            <div className="relative">
              <Bell 
                size={20} 
                className={`cursor-pointer transition-colors ${showNotifications ? 'text-nordic-navy' : 'text-nordic-muted hover:text-nordic-navy'} ${reminderTriggered ? 'animate-bell-shake text-nordic-mint' : ''}`} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowNotifications(!showNotifications); 
                  setReminderTriggered(false); 
                }}
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-nordic-mint border-2 border-slate-50 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,245,212,0.6)]"></span>
              )}
              {showNotifications && (
                <NotificationPopover 
                  tasks={tasks} 
                  onClose={() => setShowNotifications(false)} 
                  onMarkDone={handleToggleStatus}
                />
              )}
            </div>
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
          </div>
          <div 
            onClick={() => navigate('/profile')}
            className="hidden md:flex w-9 h-9 rounded-lg bg-nordic-mint text-nordic-navy cursor-pointer hover:bg-nordic-teal transition-colors items-center justify-center font-bold text-xs shrink-0"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      <section className="mb-8 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="px-3 py-1 bg-nordic-navy text-nordic-mint text-[0.6rem] font-black uppercase tracking-[2px] rounded-full flex items-center gap-2 shadow-lg shadow-nordic-navy/10 border border-white/10 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="w-1.5 h-1.5 bg-nordic-mint rounded-full animate-pulse"></div>
            AI-Engine Active
          </div>
          <span className="text-[0.6rem] font-bold text-nordic-muted uppercase tracking-widest opacity-60">Professional Edition</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-nordic-navy tracking-tighter leading-none mb-4">
          {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'User'}.
        </h2>
        <p className="text-nordic-muted/80 text-lg md:text-xl font-medium max-w-2xl">
          Your intelligent workspace is optimized and ready for your next big breakthrough.
        </p>
      </section>

      <DailySummary tasks={todayTasks} />

      <CaptureBox onTaskCaptured={handleTaskCaptured} />

      <div className="flex items-center gap-1 mb-6 border-b border-nordic-border/50 overflow-x-auto no-scrollbar">
        {['All', 'Tasks', 'Notes', 'Reminders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 md:px-5 py-3 text-[0.65rem] md:text-xs font-bold uppercase tracking-widest transition-all relative shrink-0 ${
              activeTab === tab ? 'text-nordic-navy' : 'text-nordic-muted hover:text-nordic-navy'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nordic-navy" />
            )}
          </button>
        ))}
      </div>

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
            ) : visibleTasks.length > 0 ? (
              <>
                {visibleTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onToggleStatus={handleToggleStatus} 
                    onDecompose={handleDecompose}
                    onDelete={handleDeleteTask}
                    onToggleSms={handleToggleSms}
                  />
                ))}
                {hasMoreTasks && (
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="w-full py-4 bg-nordic-mint/10 hover:bg-nordic-mint/20 text-nordic-navy font-bold text-sm rounded-lg transition-all border border-nordic-mint/20 dashed"
                  >
                    View {filteredTasks.length - DISPLAY_LIMIT} additional tasks for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) : 'Today'} &rarr;
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-px border border-dashed border-nordic-border text-nordic-muted">
                {searchQuery ? 'No tasks match your search.' : "No focus items today. You're all caught up!"}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-px p-6 shadow-sm border border-nordic-border">
            <h4 className="text-sm font-bold text-nordic-navy tracking-[1px] mb-6 uppercase flex items-center gap-2">
              <div className="w-1 h-1 bg-nordic-mint rounded-full animate-pulse"></div>
              AI Recommendations
            </h4>
            <div className="space-y-4">
              {loadingSuggestions ? (
                <p className="text-base text-nordic-muted italic">Analyzing patterns...</p>
              ) : suggestions.length > 0 ? (
                suggestions.map((sug, i) => (
                  <div key={i} className="flex gap-4 p-3 border border-slate-100 rounded-lg hover:border-nordic-mint transition-colors group">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-nordic-text leading-snug">{sug.title}</p>
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
                <p className="text-base text-nordic-muted">No current suggestions.</p>
              )}
            </div>
          </div>
          
          <div className="bg-nordic-navy rounded-px p-6 text-white overflow-hidden relative group cursor-pointer transition-transform active:scale-95">
             <div className="absolute top-0 right-0 w-32 h-32 bg-nordic-mint/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
             <h4 className="text-xs font-bold text-nordic-mint tracking-wider mb-2">INTELLIGENCE SUMMARY</h4>
             <p className="text-xl font-bold leading-tight relative z-10">Productivity Pulse</p>
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
