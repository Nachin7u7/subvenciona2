import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientDashboard from '../pages/clientDashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;