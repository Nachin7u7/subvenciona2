import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../layout/Layout";
import DashboardPage from "../pages/Dashboard";
import AdminDashboardPage from "../pages/AdminDashboard";
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
          <Route path="AdminDashboard" element={<AdminDashboardPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/app/AdminDashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
