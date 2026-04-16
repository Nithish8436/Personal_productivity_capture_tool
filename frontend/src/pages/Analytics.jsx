import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TrendingUp, AlertCircle, CheckCircle2, Download, BarChart2, BarChart3, RefreshCw, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <p className="text-[0.65rem] md:text-xs font-bold text-nordic-muted tracking-widest uppercase mb-1">Operational Insights</p>
          <h2 className="text-3xl font-bold text-nordic-text leading-none mt-1">Performance Summary</h2>
        </div>
        <div className="flex gap-2 md:gap-3 items-center w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
          {lastUpdated && (
            <span className="text-[0.65rem] md:text-xs text-nordic-muted md:mr-2">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => fetchData(true)}
              className={`p-2 bg-white border border-nordic-border rounded-lg hover:bg-slate-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh data"
            >
              <RefreshCw size={16} className="text-nordic-muted" />
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 md:px-4 py-2 bg-white border border-nordic-border rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={16} /> <span className="hidden md:inline">Export CSV</span>
            </button>
          </div>
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
        <div className="lg:col-span-2 bg-white p-8 rounded-px border border-nordic-border shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-bold text-nordic-text uppercase tracking-widest text-sm">Weekly Productivity</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-nordic-mint"></div>
                <span className="text-[0.65rem] font-bold text-nordic-muted uppercase tracking-wider text-xs">Tasks Created</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 h-[400px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={(() => {
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const dayCounts = new Array(7).fill(0);
                  allTasks.forEach(t => {
                    const day = new Date(t.createdAt).getDay();
                    dayCounts[day]++;
                  });
                  // Order: Mon, Tue, Wed, Thu, Fri, Sat, Sun
                  const orderedIndices = [1, 2, 3, 4, 5, 6, 0];
                  return orderedIndices.map(idx => ({
                    name: dayNames[idx],
                    count: dayCounts[idx]
                  }));
                })()}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F5D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-nordic-navy text-white px-3 py-2 rounded-lg shadow-xl border border-white/10">
                          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-nordic-mint mb-0.5">{payload[0].payload.name}</p>
                          <p className="text-sm font-bold">{payload[0].value} Tasks</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#00F5D4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
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
             <BarChart3 className="text-nordic-mint" size={32} />
          </div>
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-nordic-mint text-nordic-navy text-xs font-black uppercase rounded-full tracking-wider">Strategic Analysis</span>
                <h4 className="text-xl font-bold tracking-tight">Performance Summary</h4>
             </div>
             <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {stats?.insight || "Add more tasks to receive personalized performance insights."}
             </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="px-6 py-3 bg-nordic-mint text-nordic-navy font-bold rounded-lg text-sm hover:brightness-110 active:scale-95 transition-all"
          >
            Update Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
