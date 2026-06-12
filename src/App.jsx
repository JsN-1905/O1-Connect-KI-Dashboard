import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EscalationToast from './components/EscalationToast';
import Dashboard from './pages/Dashboard';
import Queue from './pages/Queue';
import TicketDetail from './pages/TicketDetail';
import { startSimulator, stopSimulator } from './utils/simulator';

export default function App() {
  useEffect(() => {
    startSimulator();
    return () => stopSimulator();
  }, []);

  return (
    <HashRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </main>
        <EscalationToast />
      </div>
    </HashRouter>
  );
}
