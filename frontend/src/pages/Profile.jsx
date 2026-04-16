import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, CreditCard, BellRing, LogOut, ArrowRightCircle } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-nordic-text">Account Profile</h2>
        <p className="text-nordic-muted mt-1">Manage your personal information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-px border border-nordic-border text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-nordic-mint rounded-full mx-auto mb-4 flex items-center justify-center text-nordic-navy text-3xl font-black shadow-xl shadow-nordic-mint/20 border-4 border-white z-10 relative">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-xl font-black text-nordic-navy">{user?.name || 'User Name'}</h3>
            
            <button 
              onClick={logout}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-sm font-black rounded-xl transition-all group"
            >
              Sign Out Session <ArrowRightCircle size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User size={20} className="text-nordic-mint" />
              <h4 className="text-lg font-bold">Personal Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-nordic-navy uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input type="text" readOnly value={user?.name || ''} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-nordic-text outline-none cursor-not-allowed opacity-80" />
              </div>
              <div>
                <label className="block text-xs font-black text-nordic-navy uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input type="email" readOnly value={user?.email || ''} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-nordic-text outline-none cursor-not-allowed opacity-80" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-3 mb-4 text-rose-500">
               <Shield size={24} />
               <h4 className="text-xl font-black">Danger Zone</h4>
             </div>
             <p className="text-sm font-semibold text-nordic-muted mb-6 max-w-md">Permanently deleting your account will erase all tasks, AI analytics, and past productivity data. This cannot be undone.</p>
             <button className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-500 text-sm font-black rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all">
               Delete Account Archive
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
