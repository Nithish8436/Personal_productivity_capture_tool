import React from 'react';
import { Calendar, Tag, MoreVertical, CheckCircle, Circle, Layers } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus, onDecompose }) => {
  const priorityStyles = {
    Low: 'bg-slate-100 text-slate-500',
    Medium: 'bg-nordic-mint/20 text-nordic-mint',
    High: 'bg-rose-100 text-rose-500',
    Critical: 'bg-rose-200 text-rose-600',
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const progress = task.subtasks && task.subtasks.length > 0 
    ? (task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100 
    : 0;

  return (
    <div className="bg-white rounded-px p-5 shadow-sm border border-nordic-border flex gap-4 transition-all hover:shadow-md mb-4 bg-white">
      <div 
        className="flex items-start pt-0.5 cursor-pointer" 
        onClick={() => onToggleStatus(task._id)}
      >
        {task.completed ? (
          <CheckCircle size={22} className="text-nordic-mint" />
        ) : (
          <Circle size={22} className="text-slate-300" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2.5">
          <h4 className={`text-base font-semibold transition-all ${
            task.completed ? 'line-through text-slate-400' : 'text-nordic-text'
          }`}>
            {task.title}
          </h4>
          <div className="flex gap-2">
            {(!task.subtasks || task.subtasks.length === 0) && onDecompose && (
              <Layers 
                size={16} 
                className="text-slate-400 cursor-pointer hover:text-nordic-mint transition-colors" 
                onClick={(e) => { e.stopPropagation(); onDecompose(task._id); }} 
                title="Break into subtasks"
              />
            )}
            <MoreVertical size={18} className="text-slate-300 cursor-pointer hover:text-slate-500" />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-nordic-muted text-[0.75rem]">
            <Calendar size={14} />
            <span>{formatDate(task.deadline) || 'No deadline'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-nordic-muted text-[0.75rem]">
            <Tag size={14} />
            <span>{task.category}</span>
          </div>
          <div className={`px-2 py-0.5 rounded text-[0.65rem] font-bold tracking-wider uppercase ${priorityStyles[task.priority]}`}>
            {task.priority || 'MEDIUM'}
          </div>
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-4 flex items-center gap-2.5">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-nordic-mint transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[0.7rem] text-nordic-muted font-medium whitespace-nowrap">
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
