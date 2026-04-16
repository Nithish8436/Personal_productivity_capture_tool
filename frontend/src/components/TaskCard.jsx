import React from 'react';
import { Calendar, Tag, MoreVertical, CheckCircle, Circle, Layers, FileText, AlarmClock, ListChecks, Hash, Trash2, Edit3, Link2, History, Lightbulb } from 'lucide-react';
import axios from 'axios';

const TaskCard = ({ task, onToggleStatus, onDecompose, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showRelated, setShowRelated] = React.useState(false);
  const [related, setRelated] = React.useState([]);
  const [loadingRelated, setLoadingRelated] = React.useState(false);
  const priorityStyles = {
    Low: 'bg-slate-100 text-slate-500',
    Medium: 'bg-nordic-mint/20 text-nordic-mint',
    High: 'bg-rose-100 text-rose-500',
    Critical: 'bg-rose-200 text-rose-600',
  };

  const typeIcons = {
    Task: (completed) => completed ? <CheckCircle size={22} className="text-nordic-mint" /> : <Circle size={22} className="text-slate-300" />,
    Note: () => <FileText size={22} className="text-amb-500 text-orange-400" />,
    Reminder: () => <AlarmClock size={22} className="text-indigo-400" />,
    'To-do': () => <ListChecks size={22} className="text-nordic-mint" />,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const progress = task.subtasks && task.subtasks.length > 0 
    ? (task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100 
    : 0;

  const isNote = task.itemType === 'Note';

  return (
    <div className={`bg-white rounded-px p-5 shadow-sm border flex gap-4 transition-all hover:shadow-md mb-4 ${
      isNote ? 'border-orange-100 bg-orange-50/10' : 'border-nordic-border'
    }`}>
      <div 
        className={`flex items-start pt-0.5 ${!isNote ? 'cursor-pointer' : ''}`}
        onClick={() => !isNote && onToggleStatus(task._id)}
      >
        {(typeIcons[task.itemType] || typeIcons.Task)(task.completed)}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2.5">
          <div className="flex-1">
            <h4 className={`text-xl font-bold leading-tight transition-all ${
              task.completed ? 'text-slate-400 line-through' : 'text-nordic-navy'
            }`}>
              {task.title}
            </h4>
            {task.description && (
              <p className={`mt-2 text-lg leading-relaxed ${task.completed ? 'text-slate-300' : 'text-slate-600'}`}>
                {task.description}
              </p>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {task.tags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 text-xs font-bold text-slate-500 rounded-md uppercase tracking-wider">
                    <Hash size={12} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {/* Decompose moved to menu */}
            <div className="relative">
              <MoreVertical 
                size={18} 
                className={`transition-colors cursor-pointer ${showMenu ? 'text-nordic-navy' : 'text-slate-300 hover:text-slate-500'}`} 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              />
              {showMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-nordic-border rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-text hover:bg-slate-50 transition-colors text-left font-medium">
                    <Edit3 size={16} className="text-slate-400" /> Edit Details
                  </button>
                  {!isNote && (!task.subtasks || task.subtasks.length === 0) && onDecompose && (
                    <button 
                      onClick={() => { onDecompose(task._id); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-mint hover:bg-slate-50 transition-colors text-left font-semibold"
                    >
                      <Layers size={16} /> Smart Break Down
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      setShowMenu(false);
                      setLoadingRelated(true);
                      try {
                        const res = await axios.get(`http://localhost:5000/api/tasks/${task._id}/related`);
                        setRelated(res.data);
                        setShowRelated(true);
                      } catch (err) {
                        console.error('Recall error:', err);
                      } finally {
                        setLoadingRelated(false);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-navy hover:bg-slate-50 transition-colors text-left font-semibold"
                  >
                    <History size={16} className="text-nordic-mint" /> Recall References
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(task.title);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-text hover:bg-slate-50 transition-colors text-left font-medium"
                  >
                    <Link2 size={16} className="text-slate-400" /> Copy Title
                  </button>
                  <div className="border-t border-slate-50 my-1"></div>
                  <button 
                    onClick={() => { onDelete(task._id); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors text-left font-semibold"
                  >
                    <Trash2 size={16} /> Delete Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global click listener to close menu */}
        {showMenu && (
          <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)}></div>
        )}

        <div className="flex items-center gap-4 flex-wrap mt-3">
          <div className="flex items-center gap-1.5 text-nordic-muted text-sm">
            <Calendar size={14} />
            <span>{formatDate(task.deadline) || (isNote ? 'Fact entry' : 'No deadline')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-nordic-muted text-sm">
            <Tag size={14} />
            <span>{task.category}</span>
          </div>
          <div className={`px-2 py-0.5 rounded text-sm font-bold tracking-wider uppercase ${priorityStyles[task.priority]}`}>
            {task.priority || 'MEDIUM'}
          </div>
          <div className="px-2 py-0.5 bg-nordic-navy/5 text-nordic-navy/60 rounded text-xs font-black uppercase tracking-widest">
            {task.itemType || 'TASK'}
          </div>
        </div>

        {!isNote && task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-4 flex items-center gap-2.5">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-nordic-mint transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-nordic-muted font-medium whitespace-nowrap">
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
            </span>
          </div>
        )}

        {/* AI Recall Past Context */}
        {loadingRelated && (
          <div className="mt-4 flex items-center gap-2 text-sm text-nordic-mint animate-pulse font-bold">
            <History size={16} /> Digging through your past thoughts...
          </div>
        )}

        {showRelated && related.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-black text-nordic-navy uppercase tracking-widest">
                <Lightbulb size={14} className="text-amber-500" /> Past Wisdom Recall
              </div>
              <button onClick={() => setShowRelated(false)} className="text-xs font-bold text-nordic-muted hover:text-nordic-navy">CLOSE</button>
            </div>
            <div className="space-y-3">
              {related.map((item, idx) => (
                <div key={item._id || idx} className="p-3 bg-white rounded-lg shadow-sm border border-slate-50">
                   <p className="text-sm font-bold text-nordic-text mb-1">{item.title}</p>
                   <p className="text-xs leading-relaxed text-slate-500 italic">"{item.reason || 'Related background context found.'}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showRelated && related.length === 0 && !loadingRelated && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-center text-xs text-nordic-muted italic">
            No specific semantic links found in your past entries.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
