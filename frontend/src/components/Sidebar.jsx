import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BarChart3, ListTodo, Settings, HelpCircle, Plus, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, onNavigate }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleNav = (to) => {
    navigate(to);
    if (onNavigate) onNavigate();
  };

  return (
    <aside 
      className={`h-screen bg-nordic-navy text-white flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-[80px] p-4' : 'w-[260px] p-10'
      }`}
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-nordic-mint rounded-full hidden lg:flex items-center justify-center text-nordic-navy shadow-lg hover:scale-110 transition-transform cursor-pointer"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`mb-10 transition-all duration-300 ${collapsed ? 'items-center overflow-hidden' : ''}`}>
        <h1 className={`text-white font-bold tracking-tight transition-all duration-300 ${collapsed ? 'text-xl' : 'text-3xl'}`}>C</h1>
        {!collapsed && (
          <>
            <h1 className="text-white text-3xl font-bold tracking-tight absolute left-14 top-10">urator</h1>
            <p className="text-sm text-nordic-muted tracking-[1.5px] mt-1 uppercase whitespace-nowrap">Productivity Engine</p>
          </>
        )}
      </div>

      <button
        onClick={() => { navigate('/'); if (onNavigate) onNavigate(); }}
        className={`flex items-center justify-center gap-2.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-base font-semibold transition-all mb-10 cursor-pointer active:scale-95 overflow-hidden ${
          collapsed ? 'p-3 w-12 mx-auto' : 'p-3 w-full'
        }`}
      >
        <Plus size={18} />
        {!collapsed && <span className="whitespace-nowrap">New Entry</span>}
      </button>

      <nav className={`flex flex-col gap-2.5 flex-1 ${collapsed ? 'items-center' : ''}`}>
        {[
          { to: '/', icon: <LayoutDashboard size={20} />, label: 'DASHBOARD' },
          { to: '/analytics', icon: <BarChart3 size={20} />, label: 'ANALYTICS' },
          { to: '/tasks', icon: <ListTodo size={20} />, label: 'TASKS' },
        ].map((item) => (
          <NavLink 
            key={item.to}
            to={item.to} 
            onClick={() => { if (onNavigate) onNavigate(); }}
            className={({ isActive }) => 
              `flex items-center transition-all ${collapsed ? 'justify-center p-3 rounded-xl' : 'gap-4 px-4 py-3 rounded-lg'} ${
                isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              } ${collapsed ? 'w-12 h-12' : 'w-full text-base font-semibold'}`
            }
          >
            {item.icon}
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`flex flex-col gap-2.5 mb-8 ${collapsed ? 'items-center' : ''}`}>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center transition-all ${collapsed ? 'justify-center p-3 rounded-xl' : 'gap-4 px-4 py-2 rounded-lg'} ${
              isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            } ${collapsed ? 'w-12 h-12' : 'w-full text-sm font-semibold'}`
          }
        >
          <Settings size={18} />
          {!collapsed && <span className="whitespace-nowrap">SETTINGS</span>}
        </NavLink>
        <button 
          onClick={logout}
          className={`flex items-center transition-all text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer ${
            collapsed ? 'justify-center p-3 rounded-xl w-12 h-12' : 'gap-4 px-4 py-2 rounded-lg w-full text-sm font-semibold'
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="whitespace-nowrap">LOG OUT</span>}
        </button>
      </div>

      <div 
        onClick={() => { navigate('/profile'); if (onNavigate) onNavigate(); }}
        className={`flex items-center pt-5 border-t border-white/10 cursor-pointer hover:bg-white/5 rounded-lg transition-all group overflow-hidden ${
          collapsed ? 'justify-center p-2 w-12 mx-auto' : 'gap-3 p-2'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-nordic-mint flex items-center justify-center text-nordic-navy font-bold group-hover:scale-105 transition-transform shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <p className="text-base font-semibold truncate w-24">{user?.name || 'User'}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
