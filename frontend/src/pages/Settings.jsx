import React from 'react';
import { Settings as SettingsIcon, Bell, Palette, Lock, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-nordic-text">System Preferences</h2>
        <p className="text-nordic-muted mt-1">Configure your application settings and appearance.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Palette size={20} className="text-nordic-mint" />
            <h4 className="text-lg font-bold">Appearance</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-sm font-semibold text-nordic-text mb-2">Interface Theme</p>
              <div className="flex gap-4">
                <div className="flex-1 p-4 border-2 border-nordic-mint rounded-xl bg-slate-50 text-center cursor-pointer">
                  <div className="w-full h-12 bg-white rounded border border-slate-200 mb-2"></div>
                  <span className="text-xs font-bold text-nordic-navy">Modern Light</span>
                </div>
                <div className="flex-1 p-4 border border-slate-200 rounded-xl bg-slate-50 text-center cursor-pointer opacity-50 hover:opacity-100 transition-all">
                  <div className="w-full h-12 bg-gray-900 rounded mb-2"></div>
                  <span className="text-xs font-bold text-nordic-muted">Nordic Dark</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={20} className="text-nordic-mint" />
            <h4 className="text-lg font-bold">Notifications</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold">Browser Notifications</p>
                <p className="text-xs text-nordic-muted">Receive alerts directly on your desktop.</p>
              </div>
              <div className="w-10 h-5 bg-nordic-mint rounded-full flex items-center px-1">
                <div className="w-3.5 h-3.5 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold">Audio Reminders</p>
                <p className="text-xs text-nordic-muted">Play a sound when a task reaches its deadline.</p>
              </div>
              <div className="w-10 h-5 bg-nordic-mint rounded-full flex items-center px-1">
                <div className="w-3.5 h-3.5 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
           <button className="px-6 py-2.5 text-xs font-bold text-nordic-muted hover:text-nordic-navy transition-all">Cancel</button>
           <button className="px-8 py-2.5 bg-nordic-navy text-white text-xs font-bold rounded-lg shadow-lg hover:brightness-110 transition-all">Apply Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
