import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TrendingUp, AlertCircle, CheckCircle2, Download, BarChart2, Lightbulb, RefreshCw } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [summaryRes, tasksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks/summary'),
        axios.get('http://localhost:5000/api/tasks'),
      ]);
      setStats(summaryRes.data);
      setAllTasks(tasksRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch + auto-refresh every 30 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Export CSV
  const handleExportCSV = () => {
    if (allTasks.length === 0) return alert('No tasks to export.');
    const headers = ['Title', 'Category', 'Priority', 'Deadline', 'Completed', 'Subtasks'];
    const rows = allTasks.map(t => [
      `"${t.title}"`,
      t.category,
      t.priority,
      t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A',
      t.completed ? 'Yes' : 'No',
      t.subtasks?.length || 0,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-mint"></div>
      </div>
    );
  }

  // Dynamic calculations
  const total = stats?.total || 0;
  const completed = stats?.completed || 0;
  const completionRate = stats?.completionRate || 0;
  const urgentCount = stats?.urgentCount || 0;
  const donutPct = total > 0 ? completed / total : 0;
  const remaining = total - completed;

  // Category distribution for display
  const byCategory = stats?.byCategory || {};
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const categoryColors = {
    Work: 'bg-blue-500', Personal: 'bg-purple-500', Health: 'bg-green-500',
    Learning: 'bg-amber-500', Finance: 'bg-cyan-500', Other: 'bg-slate-400'
  };

  return (
    <div className="w-full max-w-screen-2xl pb-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <p className="text-xs font-bold text-nordic-muted tracking-widest uppercase mb-1">Operational Insights</p>
          <h2 className="text-3xl font-bold text-nordic-text">Performance Summary</h2>
        </div>
        <div className="flex gap-3 items-center">
          {lastUpdated && (
            <span className="text-xs text-nordic-muted mr-2">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchData(true)}
            className={`p-2 bg-white border border-nordic-border rounded-lg hover:bg-slate-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh data"
          >
            <RefreshCw size={16} className="text-nordic-muted" />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-nordic-border rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-nordic-muted tracking-wider uppercase">Total Tasks</span>
            <CheckCircle2 size={18} className="text-nordic-mint" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-nordic-text">{total}</h3>
            <span className="text-xs font-bold text-nordic-mint">
              {completed} completed
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-nordic-muted tracking-wider uppercase">Urgent Tasks</span>
            <AlertCircle size={18} className="text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-nordic-text">{String(urgentCount).padStart(2, '0')}</h3>
            <span className="text-xs font-bold text-rose-500 flex items-center gap-1 uppercase">
              {urgentCount > 0 ? <><AlertCircle size={10} /> Requires attention</> : 'All clear'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-nordic-muted tracking-wider uppercase">Completion Rate</span>
            <TrendingUp size={18} className="text-nordic-mint" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-nordic-text">{completionRate}%</h3>
            <span className="text-xs font-bold text-nordic-mint uppercase">
              {completionRate >= 75 ? 'Excellent pace' : completionRate >= 50 ? 'Good progress' : 'Keep pushing'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Weekly Productivity Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-bold text-nordic-text">Weekly Productivity</h4>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-nordic-navy"></div>
              <span className="text-xs font-semibold text-nordic-muted uppercase">Tasks Created</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end h-48 gap-4 px-4">
            {(() => {
              const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
              const dayCounts = new Array(7).fill(0);
              allTasks.forEach(t => {
                const day = new Date(t.createdAt).getDay();
                dayCounts[day]++;
              });
              // Reorder to MON-SUN
              const ordered = [...dayCounts.slice(1), dayCounts[0]];
              const orderedNames = [...dayNames.slice(1), dayNames[0]];
              const maxCount = Math.max(...ordered, 1);

              return orderedNames.map((day, i) => (
                <div key={day} className="flex flex-col items-center flex-1 gap-4">
                  <div 
                    className="w-full bg-nordic-navy rounded-t-sm transition-all duration-1000 relative group cursor-pointer hover:bg-nordic-teal" 
                    style={{ height: `${(ordered[i] / maxCount) * 100}%`, minHeight: ordered[i] > 0 ? '8px' : '2px' }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-nordic-text opacity-0 group-hover:opacity-100 transition-opacity">
                      {ordered[i]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-nordic-muted">{day}</span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Completion Donut (Dynamic) */}
        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm flex flex-col">
          <h4 className="font-bold text-nordic-text text-center mb-8 uppercase tracking-wide">Completion</h4>
          <div className="relative flex-1 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * donutPct)}
                className="text-nordic-mint transition-all duration-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-nordic-text">{completed}/{total}</span>
              <span className="text-xs font-bold text-nordic-muted uppercase tracking-wider">Tasks</span>
            </div>
          </div>
          <p className="text-sm text-center text-nordic-muted mt-6 leading-relaxed">
            {remaining > 0
              ? `You're ${remaining} task${remaining === 1 ? '' : 's'} away from 100%.`
              : 'All tasks completed! Great work.'}
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      {categoryEntries.length > 0 && (
        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-nordic-text">Category Breakdown</h4>
            <span className="text-xs text-nordic-muted">{categoryEntries.length} categories</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryEntries.map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="text-center p-4 bg-nordic-bg rounded-lg border border-nordic-border">
                  <p className="text-2xl font-bold text-nordic-text mb-1">{count}</p>
                  <p className="text-xs font-bold text-nordic-muted uppercase tracking-wider">{cat}</p>
                  <p className="text-xs text-nordic-mint font-semibold mt-1">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Insight Card */}
      <div className="bg-nordic-navy rounded-px p-8 text-white relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
           <BarChart2 size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-16 h-16 bg-nordic-mint/20 rounded-2xl flex items-center justify-center shrink-0">
             <Lightbulb className="text-nordic-mint" size={32} />
          </div>
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-nordic-mint text-nordic-navy text-xs font-black uppercase rounded-full tracking-wider">Productivity Insight</span>
                <h4 className="text-xl font-bold tracking-tight">Performance Summary</h4>
             </div>
             <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
               {stats?.insight || "Add more tasks to receive personalized productivity insights."}
             </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="px-6 py-3 bg-nordic-mint text-nordic-navy font-bold rounded-lg text-sm hover:brightness-110 active:scale-95 transition-all"
          >
            Refresh Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
