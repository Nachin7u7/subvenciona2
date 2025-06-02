import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientHome from '../pages/userClient/clientHome';
import MyFichasPage from '../pages/userClient/MyFichasPage';
import UserClientLayout from '../layout/userClient/userClientLayout';
import PerfilPage from '../pages/userClient/perfilPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserClientLayout />}>
          <Route index element={<ClientHome />} />
          <Route path="misFichas" element={<MyFichasPage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
};

export default AppRoutes;

{/* import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../layout/Layout";
import DashboardPage from "../pages/Dashboard";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ProtectedRoutes from "../guards/protectedRoutes";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}; */}