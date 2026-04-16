import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-nordic-bg transition-all duration-300 relative">
      {/* Mobile Header (No Hamburger, Just Logo) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md z-[40] lg:hidden flex items-center justify-center border-b border-nordic-border/50">
        <h1 className="font-black text-nordic-navy tracking-tight text-xl">Curator <span className="text-nordic-mint">.</span></h1>
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block fixed h-screen z-50">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Content Area */}
      <main 
        className={`flex-1 p-4 md:p-8 lg:p-12 transition-all duration-300 min-w-0 overflow-x-hidden ${
          collapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
        }`}
      >
        {/* Extra padding at bottom on mobile to clear BottomNav */}
        <div className="w-full pt-20 lg:pt-0 pb-24 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;

