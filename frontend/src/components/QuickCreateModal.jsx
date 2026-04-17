import React, { useState } from 'react';
import { X, Calendar, Tag, AlertCircle, Phone, Save } from 'lucide-react';

const QuickCreateModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'Work',
    priority: 'Medium',
    smsReminder: false
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          itemType: 'Task'
        })
      });
      
      if (response.ok) {
        await response.json();
        onTaskCreated();
        onClose();
        setFormData({
          title: '',
          description: '',
          deadline: '',
          category: 'Work',
          priority: 'Medium',
          smsReminder: false
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nordic-navy/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-nordic-navy">Quick Manual Entry</h2>
            <p className="text-xs text-nordic-muted font-bold uppercase tracking-widest mt-0.5">Define your goal precisely</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} className="text-nordic-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-nordic-navy uppercase tracking-widest mb-2">Title</label>
            <input
              type="text"
              required
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-nordic-mint focus:ring-4 focus:ring-nordic-mint/10 outline-none transition-all text-sm font-medium"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-nordic-navy uppercase tracking-widest mb-2">Description (Optional)</label>
            <textarea
              placeholder="Any specific details?"
              rows="2"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-nordic-mint focus:ring-4 focus:ring-nordic-mint/10 outline-none transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-nordic-navy uppercase tracking-widest mb-2">Deadline</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic-muted" />
                <input
                  type="datetime-local"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-nordic-mint focus:ring-4 focus:ring-nordic-mint/10 outline-none transition-all text-sm font-medium"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-nordic-navy uppercase tracking-widest mb-2">Category</label>
              <div className="relative">
                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic-muted" />
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-nordic-mint focus:ring-4 focus:ring-nordic-mint/10 outline-none transition-all text-sm font-bold bg-white cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Health</option>
                  <option>Learning</option>
                  <option>Finance</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-500 rounded-lg">
                <AlertCircle size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-nordic-navy uppercase tracking-wider">Priority</span>
                <div className="flex gap-2 mt-1">
                  {['Low', 'Medium', 'High', 'Critical'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`text-[0.6rem] font-black px-2 py-0.5 rounded uppercase tracking-tighter transition-all ${
                        formData.priority === p 
                          ? 'bg-nordic-navy text-white shadow-md' 
                          : 'bg-white text-slate-400 hover:text-nordic-navy border border-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-nordic-mint/5 rounded-2xl border border-nordic-mint/10 transition-all hover:bg-nordic-mint/10 cursor-pointer" onClick={() => setFormData({ ...formData, smsReminder: !formData.smsReminder })}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${formData.smsReminder ? 'bg-nordic-mint text-nordic-navy shadow-lg shadow-nordic-mint/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                <Phone size={18} className={formData.smsReminder ? 'animate-pulse' : ''} />
              </div>
              <div>
                <p className="text-[0.7rem] font-black text-nordic-navy uppercase tracking-widest">Enable SMS Reminder</p>
                <p className="text-[0.6rem] font-bold text-nordic-muted uppercase tracking-tighter">Receive alert 30 mins before</p>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.smsReminder ? 'bg-nordic-mint' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.smsReminder ? 'left-6' : 'left-1'}`}></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.title}
            className="w-full bg-nordic-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-nordic-navy/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-nordic-navy/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} className="text-nordic-mint" /> Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickCreateModal;
