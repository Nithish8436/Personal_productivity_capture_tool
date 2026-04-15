import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Calendar = ({ tasks, selectedDate, onSelectDate, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to get days in month
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    // Previous month padding
    const prevMonthDays = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      prevMonthDays.push({ day: prevMonthLastDay - i, current: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= totalDays; i++) {
      currentMonthDays.push({ day: i, current: true, date: new Date(year, month, i) });
    }

    // Next month padding
    const nextMonthDays = [];
    const remainingSlots = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingSlots; i++) {
      nextMonthDays.push({ day: i, current: false, date: new Date(year, month + 1, i) });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentDate]);

  const taskCounts = useMemo(() => {
    const counts = {};
    tasks.forEach(task => {
      if (task.deadline) {
        const dateStr = new Date(task.deadline).toDateString();
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div 
      className="absolute top-14 right-0 z-50 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-nordic-border shadow-2xl p-5 select-none animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-bold text-nordic-text uppercase tracking-widest">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-nordic-muted"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-nordic-muted"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[0.6rem] font-black text-nordic-muted uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthData.map((item, idx) => {
          const dateStr = item.date.toDateString();
          const count = taskCounts[dateStr] || 0;
          
          return (
            <div 
              key={idx}
              onClick={() => onSelectDate(item.date)}
              className={`
                relative h-9 flex items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-all group
                ${!item.current ? 'text-slate-300' : 'text-nordic-text hover:bg-nordic-bg'}
                ${isSelected(item.date) ? 'bg-nordic-navy text-white hover:bg-nordic-navy shadow-lg' : ''}
                ${isToday(item.date) && !isSelected(item.date) ? 'border-2 border-nordic-mint' : ''}
              `}
            >
              {item.day}
              
              {count > 0 && !isSelected(item.date) && (
                <div className="absolute bottom-1 w-1 h-1 bg-nordic-mint rounded-full"></div>
              )}

              {/* Tooltip */}
              {count > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-nordic-navy text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-xl">
                  {count} task{count > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-nordic-border flex justify-between items-center">
        <button 
          onClick={() => onSelectDate(new Date())}
          className="text-[0.65rem] font-bold text-nordic-mint uppercase tracking-wider hover:underline"
        >
          Go to Today
        </button>
        <button 
          onClick={() => onSelectDate(null)}
          className="text-[0.65rem] font-bold text-nordic-muted uppercase tracking-wider hover:underline"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default Calendar;
