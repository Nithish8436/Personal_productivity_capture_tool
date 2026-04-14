import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaptureBox from '../components/CaptureBox';
import TaskCard from '../components/TaskCard';
import { Search, Bell, Calendar as CalIcon } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center bg-white px-4 py-2.5 rounded-lg shadow-sm w-[400px] gap-3 border border-nordic-border">
          <Search size={18} className="text-nordic-muted" />
          <input type="text" placeholder="Search operations..." className="border-none outline-none text-sm flex-1" />
        </div>
        <div className="flex items-center gap-6">
          <Bell size={20} className="text-nordic-muted cursor-pointer hover:text-nordic-navy transition-colors" />
          <CalIcon size={20} className="text-nordic-muted cursor-pointer hover:text-nordic-navy transition-colors" />
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
            <h3 className="text-xl font-bold text-nordic-text">Today's Focus</h3>
            <span className="text-[0.7rem] font-bold text-nordic-muted tracking-wide uppercase">
              {tasks.filter(t => !t.completed).length} TASKS REMAINING
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-10 text-nordic-muted">Loading tasks...</p>
            ) : tasks.length > 0 ? (
              tasks.map(task => (
                <TaskCard key={task._id} task={task} onToggleStatus={handleToggleStatus} />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-px border border-dashed border-nordic-border text-nordic-muted">
                No tasks found. Try capturing one above!
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-px p-6 shadow-sm border border-nordic-border">
            <h4 className="text-[0.75rem] font-bold text-nordic-mint tracking-[1px] mb-6 uppercase">Curator Insights</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-nordic-mint mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-nordic-text">Focus Window</p>
                  <p className="text-[0.8rem] text-nordic-muted leading-relaxed mt-1">
                    Your energy peaks between 10am-12pm. We've blocked this for deep work.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-nordic-mint mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-nordic-text">Weekly Pulse</p>
                  <p className="text-[0.8rem] text-nordic-muted leading-relaxed mt-1">
                    You are tracking 15% faster than last week. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-nordic-navy rounded-px p-6 text-white overflow-hidden relative group cursor-pointer transition-transform active:scale-95">
             <div className="absolute top-0 right-0 w-32 h-32 bg-nordic-mint/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
             <h4 className="text-[0.7rem] font-bold text-nordic-mint tracking-wider mb-2">WEEKLY PULSE</h4>
             <p className="text-xl font-bold leading-tight relative z-10">Syncing Operations</p>
             <div className="mt-6">
               <div className="flex justify-between items-end mb-1">
                 <span className="text-[0.65rem] font-bold uppercase text-nordic-mint">Completion</span>
                 <span className="text-lg font-bold">82%</span>
               </div>
               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-nordic-mint w-[82%]"></div>
               </div>
             </div>
             <p className="text-[0.7rem] text-white/50 mt-4 leading-relaxed">
               You are tracking 15% faster than last week. Focus remains high.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
