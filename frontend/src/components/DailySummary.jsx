import React, { useMemo } from 'react';
import { Calendar, Zap, Layout } from 'lucide-react';

const DailySummary = ({ tasks }) => {
  const briefing = useMemo(() => {
    const todayActive = tasks.filter(t => !t.completed);
    
    // Grouping tasks into time buckets
    const morning = todayActive.filter(t => {
      const h = t.deadline ? new Date(t.deadline).getHours() : 0;
      return (h >= 5 && h < 12) || (t.priority === 'Critical' && !t.deadline);
    });
    
    const evening = todayActive.filter(t => {
      const h = t.deadline ? new Date(t.deadline).getHours() : 0;
      return (h >= 12 && h < 20);
    });

    const night = todayActive.filter(t => {
      const h = t.deadline ? new Date(t.deadline).getHours() : 0;
      return (h >= 20 || h < 5) || (t.priority === 'Low' && !t.deadline);
    });

    if (todayActive.length === 0) return { story: "Your schedule is clear for today. Ready for new thoughts!", isEmpty: true };

    let story = "Today, ";
    
    if (morning.length > 0) {
      story += `you have "${morning[0].title}" this morning`;
    }

    if (evening.length > 0) {
      story += morning.length > 0 ? " and " : "you have ";
      story += `"${evening[0].title}" in the evening`;
    }

    if (night.length > 0 && evening.length === 0) {
      story += morning.length > 0 ? " and " : "you have ";
      story += `"${night[0].title}" tonight`;
    } else if (night.length > 0) {
      story += `, and "${night[0].title}" to wrap up tonight`;
    }

    story += ".";

    return { story, activeCount: todayActive.length, isEmpty: false };
  }, [tasks]);

  return (
    <div className="bg-white rounded-px p-6 border border-nordic-border shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs font-bold text-nordic-mint tracking-[1.5px] uppercase">Daily Summary</h4>
        <Zap size={14} className="text-nordic-mint fill-nordic-mint" />
      </div>

      <div className="space-y-6">
        <p className={`text-xl font-bold text-nordic-text leading-tight break-words ${briefing.isEmpty ? 'text-slate-400 italic font-medium text-lg' : ''}`}>
          {briefing.story}
        </p>

        {!briefing.isEmpty && (
          <div className="pt-4 border-t border-slate-50">
            <p className="text-[0.65rem] font-bold text-nordic-muted uppercase tracking-widest mb-4">Focus List</p>
            <div className="space-y-3">
              {tasks.filter(t => !t.completed).slice(0, 3).map((task, i) => (
                <div key={task._id || i} className="flex gap-3 items-start group text-left">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'Critical' || task.priority === 'High' ? 'bg-rose-500' : 'bg-nordic-mint'}`}></div>
                  <div>
                    <p className="text-xs font-semibold text-nordic-text leading-snug group-hover:text-nordic-navy transition-colors">{task.title}</p>
                    <p className="text-[0.6rem] font-bold text-nordic-muted uppercase mt-0.5">{task.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySummary;
