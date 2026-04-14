import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tasks" element={<div style={{ padding: '40px' }}><h2>All Tasks (Coming Soon)</h2></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
