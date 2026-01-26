import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TimerPage } from './features/timer';
import { DashboardPage } from './features/dashboard';
import { RecordsPage } from './features/records';
import { InsightsPage } from './features/insights';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/timer" replace />} />
          <Route path="timer" element={<TimerPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
