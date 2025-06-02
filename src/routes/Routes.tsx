import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ClientHome from "../pages/userClient/clientHome";
import MyFichasPage from "../pages/userClient/MyFichasPage";
import PerfilPage from "../pages/userClient/perfilPage";
import UserClientLayout from "../layout/userClient/userClientLayout";
import AdminPage from "../pages/userAdmin/AdminDashboard";
import ProtectedRoutes from "../guards/protectedRoutes";
import { useAuth } from "../services/authService";

const RoleBasedRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.rol === "admin") return <AdminPage />;
  if (user.rol === "customer") {
    return (
      <UserClientLayout>
        <Outlet />
      </UserClientLayout>
    );
  }
  return <Navigate to="/login" replace />;
};

const ClientRoutes = () => (
  <>
    <Route index element={<ClientHome />} />
    <Route path="misFichas" element={<MyFichasPage />} />
    <Route path="perfil" element={<PerfilPage />} />
  </>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoutes children={undefined} />}>
        <Route path="/" element={<RoleBasedRoutes />}>
          <Route path="/" element={<Outlet />}>
            <ClientRoutes />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;