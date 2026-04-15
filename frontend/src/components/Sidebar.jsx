import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, ListTodo, Settings, HelpCircle, Plus } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-[260px] h-screen bg-nordic-navy text-white fixed left-0 top-0 flex flex-col p-10">
      <div className="mb-10">
        <h1 className="text-white text-2xl font-bold tracking-tight">Curator</h1>
        <p className="text-xs text-nordic-muted tracking-[2px] mt-1 uppercase">Productivity Engine</p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full flex items-center justify-center gap-2.5 p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all mb-10 cursor-pointer active:scale-95"
      >
        <Plus size={18} />
        <span>New Entry</span>
      </button>

      <nav className="flex flex-col gap-2.5 flex-1">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-4 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
              isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span>DASHBOARD</span>
        </NavLink>
        <NavLink 
          to="/analytics" 
          className={({ isActive }) => 
            `flex items-center gap-4 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
              isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <BarChart3 size={20} />
          <span>ANALYTICS</span>
        </NavLink>
        <NavLink 
          to="/tasks" 
          className={({ isActive }) => 
            `flex items-center gap-4 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
              isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <ListTodo size={20} />
          <span>TASKS</span>
        </NavLink>
      </nav>

      <div className="flex flex-col gap-2.5 mb-8">
        <button className="flex items-center gap-4 px-4 py-2 text-slate-400 hover:text-white text-xs font-medium transition-all text-left">
          <Settings size={18} />
          <span>SETTINGS</span>
        </button>
        <button className="flex items-center gap-4 px-4 py-2 text-slate-400 hover:text-white text-xs font-medium transition-all text-left">
          <HelpCircle size={18} />
          <span>SUPPORT</span>
        </button>
      </div>

      <div className="flex items-center gap-3 pt-5 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-nordic-mint"></div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">User Name</p>
          <p className="text-xs text-slate-400">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
