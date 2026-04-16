import React from 'react';
import { HelpCircle, MessageSquare, BookOpen, Mail, Terminal } from 'lucide-react';

const Support = () => {
  return (
    <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-nordic-text">Support & Resource Center</h2>
        <p className="text-nordic-muted mt-1">Get help, learn more about Curator, or contact our team.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm hover:border-nordic-mint/50 transition-colors cursor-pointer group">
          <BookOpen className="text-nordic-mint mb-4 group-hover:scale-110 transition-transform" size={24} />
          <h4 className="text-lg font-bold mb-2">Documentation</h4>
          <p className="text-sm text-nordic-muted leading-relaxed">
            Comprehensive guides on how to make the most of your productivity engine, from task capture to semantic search.
          </p>
        </div>

        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm hover:border-nordic-mint/50 transition-colors cursor-pointer group">
          <MessageSquare className="text-nordic-mint mb-4 group-hover:scale-110 transition-transform" size={24} />
          <h4 className="text-lg font-bold mb-2">Community Forum</h4>
          <p className="text-sm text-nordic-muted leading-relaxed">
            Join other Curator users to share tips, tricks, and best practices for high-performance organization.
          </p>
        </div>

        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm hover:border-nordic-mint/50 transition-colors cursor-pointer group">
          <Terminal className="text-nordic-mint mb-4 group-hover:scale-110 transition-transform" size={24} />
          <h4 className="text-lg font-bold mb-2">API Access</h4>
          <p className="text-sm text-nordic-muted leading-relaxed">
            Documentation and keys for developers looking to integrate Curator's semantic intelligence into their own tools.
          </p>
        </div>

        <div className="bg-white p-8 rounded-px border border-nordic-border shadow-sm hover:border-nordic-mint/50 transition-colors cursor-pointer group">
          <Mail className="text-nordic-mint mb-4 group-hover:scale-110 transition-transform" size={24} />
          <h4 className="text-lg font-bold mb-2">Direct Contact</h4>
          <p className="text-sm text-nordic-muted leading-relaxed">
            Need high-priority assistance? Our support team is ready to help you resolve any technical issues.
          </p>
        </div>
      </div>

      <div className="mt-12 p-8 bg-nordic-navy rounded-px text-white text-center">
        <h4 className="text-xl font-bold mb-2">Curator v1.0.4</h4>
        <p className="text-nordic-muted text-xs uppercase tracking-widest font-bold mb-6">Built for high-velocity focus.</p>
        <p className="text-xs text-slate-400">© 2026 Nordic Productivity Systems. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Support;
