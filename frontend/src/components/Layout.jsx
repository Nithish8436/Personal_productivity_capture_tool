import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-nordic-bg">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-10 max-w-[calc(100vw-260px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
