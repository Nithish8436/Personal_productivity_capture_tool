import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, AlertCircle, CheckCircle2, Calendar, Download, Sparkles } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
       // axios v1.6.8
      const response = await axios.get('http://localhost:5000/api/tasks/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-mint"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <p className="text-xs font-bold text-nordic-muted tracking-widest uppercase mb-1">Operational Insights</p>
          <h2 className="text-3xl font-bold text-nordic-text">Weekly Summary</h2>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-nordic-border rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Download size={16} /> Export CSV
          </button>
          <button className="px-4 py-2 bg-nordic-navy text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
            Date Range
          </button>
        </div>
      </header>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[0.65rem] font-bold text-nordic-muted tracking-wider uppercase">Total Tasks</span>
            <CheckCircle2 size={18} className="text-nordic-mint" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-nordic-text">{stats?.total || 0}</h3>
            <span className="text-[0.7rem] font-bold text-nordic-mint flex items-center gap-0.5">
              <TrendingUp size={12} /> +12% from last week
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[0.65rem] font-bold text-nordic-muted tracking-wider uppercase">Urgent Tasks</span>
            <AlertCircle size={18} className="text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-nordic-text">{String(stats?.urgentCount || 0).padStart(2, '0')}</h3>
            <span className="text-[0.7rem] font-bold text-rose-500 flex items-center gap-1 uppercase">
              <AlertCircle size={10} /> Requires attention
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[0.65rem] font-bold text-nordic-muted tracking-wider uppercase">Completion Rate</span>
            <TrendingUp size={18} className="text-nordic-mint" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-nordic-text">{stats?.completionRate || 0}%</h3>
            <span className="text-[0.7rem] font-bold text-nordic-mint uppercase">Peak efficiency achieved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Weekly Productivity Charts (Simplified) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-px border border-nordic-border shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-bold text-nordic-text">Weekly Productivity</h4>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-nordic-navy"></div>
              <span className="text-xs font-semibold text-nordic-muted uppercase">Completed</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end h-48 gap-4 px-4">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
              <div key={day} className="flex flex-col items-center flex-1 gap-4">
                <div 
                  className="w-full bg-nordic-navy rounded-t-sm transition-all duration-1000" 
                  style={{ height: `${[40, 65, 85, 55, 90, 30, 20][i]}%` }}
                ></div>
                <span className="text-[0.65rem] font-bold text-nordic-muted">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories / Goals */}
        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm flex flex-col">
          <h4 className="font-bold text-nordic-text text-center mb-8 uppercase tracking-wide">Daily Goals</h4>
          <div className="relative flex-1 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.75)} className="text-nordic-mint" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-nordic-text">6/8</span>
              <span className="text-[0.6rem] font-bold text-nordic-muted uppercase tracking-wider">Tasks</span>
            </div>
          </div>
          <p className="text-[0.75rem] text-center text-nordic-muted mt-6 leading-relaxed">
            You're 2 tasks away from your daily streak. Keep going.
          </p>
        </div>
      </div>

      {/* AI Insight Box (Image 3 Style) */}
      <div className="bg-nordic-navy rounded-px p-8 text-white relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
           <Sparkles size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-16 h-16 bg-nordic-mint/20 rounded-2xl flex items-center justify-center shrink-0">
             <Sparkles className="text-nordic-mint" size={32} />
          </div>
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-nordic-mint text-nordic-navy text-[0.6rem] font-black uppercase rounded-full tracking-wider">AI Insight</span>
                <h4 className="text-xl font-bold tracking-tight">Your Focus Peak: 10:30 AM</h4>
             </div>
             <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
               {stats?.insight || "Analyzing your productivity patterns... Our engine indicates your cognitive performance is 45% higher in the morning window."}
             </p>
          </div>
          <button className="px-6 py-3 bg-nordic-mint text-nordic-navy font-bold rounded-lg text-sm hover:brightness-110 active:scale-95 transition-all">
            Optimize Calendar
          </button>
        </div>
      </div>

      <footer className="mt-12 flex justify-between items-center text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">
        <span>Data updated 2 minutes ago • Curator v1.2.0</span>
        <div className="flex gap-6">
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-nordic-mint"></div> System Sync Active</span>
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Archive Status: Clean</span>
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
