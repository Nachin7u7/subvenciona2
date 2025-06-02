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
