import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BarChart3, ListTodo, Plus } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-nordic-border/50 lg:hidden z-[60] px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe-offset-3">
      {[
        { to: '/', icon: <LayoutDashboard size={22} />, label: 'Home' },
        { to: '/analytics', icon: <BarChart3 size={22} />, label: 'Stats' },
      ].map((item) => (
        <NavLink 
          key={item.to}
          to={item.to} 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-nordic-mint scale-110' : 'text-slate-400 hover:text-nordic-text'
            }`
          }
        >
          {item.icon}
          <span className="text-[0.6rem] font-bold tracking-wider uppercase">{item.label}</span>
        </NavLink>
      ))}

      {/* Primary Action Button (Floating feel) */}
      <div className="relative -top-6">
        <button
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="w-14 h-14 bg-nordic-navy text-white rounded-full flex items-center justify-center shadow-lg shadow-nordic-navy/30 border-4 border-nordic-bg active:scale-95 transition-transform"
        >
          <Plus size={28} />
        </button>
      </div>

      {[
        { to: '/tasks', icon: <ListTodo size={22} />, label: 'Tasks' },
        { to: '/profile', icon: <div className="w-6 h-6 rounded-full bg-nordic-mint flex items-center justify-center text-nordic-navy font-bold text-[0.6rem]">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>, label: 'Profile' },
      ].map((item) => (
        <NavLink 
          key={item.to}
          to={item.to} 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-nordic-mint scale-110' : 'text-slate-400 hover:text-nordic-text'
            }`
          }
        >
          {item.icon}
          <span className="text-[0.6rem] font-bold tracking-wider uppercase">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
