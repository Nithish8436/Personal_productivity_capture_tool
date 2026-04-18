import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, CreditCard, BellRing, LogOut, ArrowRightCircle, Phone, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile({ name, email, phone });
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setIsUpdating(false);
  };

  return (
    <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-nordic-navy tracking-tight">Account Profile</h2>
        <p className="text-nordic-muted mt-1 font-medium">Manage your personal information and SMS reminder preferences.</p>
      </header>

      {message.text && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-nordic-mint/10 border border-nordic-mint/20 text-nordic-teal' : 'bg-red-50 border border-red-100 text-red-600'
        }`}>
          {message.type === 'success' && <CheckCircle2 size={18} />}
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-nordic-border/50 text-center relative overflow-hidden shadow-sm">
            <div className="w-24 h-24 bg-nordic-mint rounded-full mx-auto mb-6 flex items-center justify-center text-nordic-navy text-3xl font-black shadow-xl shadow-nordic-mint/20 border-4 border-white z-10 relative">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-xl font-black text-nordic-navy">{user?.name || 'User Name'}</h3>
            <p className="text-xs font-bold text-nordic-muted mt-2 uppercase tracking-[0.2em]">Verified Identity</p>
            
            <button 
              onClick={logout}
              className="mt-10 w-full flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-500 text-sm font-black rounded-xl transition-all group"
            >
              Terminate Session <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white p-8 md:p-10 rounded-2xl border border-nordic-border/50 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nordic-mint/10 flex items-center justify-center text-nordic-teal">
                <User size={20} />
              </div>
              <h4 className="text-xl font-black text-nordic-navy tracking-tight">Personal Details</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-nordic-navy uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-nordic-navy focus:bg-white focus:ring-4 focus:ring-nordic-mint/10 focus:border-nordic-mint/50 transition-all outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-nordic-navy uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-nordic-navy focus:bg-white focus:ring-4 focus:ring-nordic-mint/10 focus:border-nordic-mint/50 transition-all outline-none" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-nordic-navy uppercase tracking-widest ml-1">Phone Number (For SMS reminders)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-nordic-navy focus:bg-white focus:ring-4 focus:ring-nordic-mint/10 focus:border-nordic-mint/50 transition-all outline-none" 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUpdating}
              className="px-8 py-4 bg-nordic-navy text-white text-sm font-black rounded-xl hover:bg-nordic-navy/90 hover:shadow-lg hover:shadow-nordic-navy/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isUpdating ? 'Saving Changes...' : 'Save Member Information'}
            </button>
          </form>

          <div className="bg-white p-8 md:p-10 rounded-2xl border border-nordic-border/50 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-3 mb-4 text-rose-500">
               <Shield size={24} />
               <h4 className="text-xl font-black tracking-tight">Danger Zone</h4>
             </div>
             <p className="text-sm font-semibold text-nordic-muted mb-8 max-w-md">Deleting your account will purge all tasks, AI summaries, and your saved phone number. This action is irreversible.</p>
             <button className="px-6 py-3 bg-white border-2 border-rose-100 text-rose-500 text-sm font-black rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all">
               Erase Entire Profile
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
