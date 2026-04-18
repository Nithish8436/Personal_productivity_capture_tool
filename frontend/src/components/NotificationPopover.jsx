import React, { useMemo } from 'react';
import { AlertCircle, Clock, CheckCircle2, X, BellOff } from 'lucide-react';

const NotificationPopover = ({ tasks, onClose, onMarkDone }) => {
  const notifications = useMemo(() => {
    const now = new Date();
    const alerts = [];

    tasks.forEach(task => {
      if (task.completed) return;

      const deadline = task.deadline ? new Date(task.deadline) : null;
      
      // 1. Overdue
      if (deadline && deadline < now) {
        alerts.push({
          id: task._id,
          type: 'overdue',
          title: task.title,
          message: 'This task is past its deadline!',
          icon: <AlertCircle className="text-rose-500" size={16} />
        });
      }
      
      // 2. Urgent Priority
      else if (task.priority === 'Critical' || task.priority === 'High') {
        alerts.push({
          id: task._id,
          type: 'urgent',
          title: task.title,
          message: 'High priority task requires attention.',
          icon: <Clock className="text-amber-500" size={16} />
        });
      }
      
      // 3. Due Soon (Next 24h)
      else if (deadline && (deadline - now) < 24 * 60 * 60 * 1000) {
        alerts.push({
          id: task._id,
          type: 'soon',
          title: task.title,
          message: 'Due within 24 hours.',
          icon: <Clock className="text-nordic-mint" size={16} />
        });
      }
    });

    return alerts;
  }, [tasks]);

  return (
    <div className="absolute top-12 right-0 w-80 bg-white/95 backdrop-blur-md border border-nordic-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-nordic-border flex justify-between items-center bg-nordic-bg/50">
        <h4 className="text-xs font-bold text-nordic-text uppercase tracking-widest">Notifications</h4>
        <button onClick={onClose} className="text-nordic-muted hover:text-nordic-text transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif, i) => (
            <div 
              key={`${notif.id}-${i}`} 
              className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative"
            >
              <div className="flex gap-3">
                <div className="mt-0.5">{notif.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-nordic-text leading-tight mb-1">{notif.title}</p>
                  <p className="text-[0.7rem] text-nordic-muted font-medium">{notif.message}</p>
                </div>
                <button 
                  onClick={() => onMarkDone(notif.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-nordic-mint hover:bg-nordic-mint/10 p-1 rounded"
                  title="Mark as Done"
                >
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <BellOff className="mx-auto text-slate-200 mb-3" size={32} />
            <p className="text-sm font-semibold text-nordic-muted">All caught up!</p>
            <p className="text-[0.7rem] text-slate-400 mt-1">No urgent alerts found.</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 bg-nordic-bg/30 text-center">
          <button className="text-[0.65rem] font-bold text-nordic-muted uppercase tracking-wider hover:text-nordic-text transition-colors">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
