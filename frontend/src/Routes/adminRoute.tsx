import { Route, Routes ,Navigate,Outlet} from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUser from '../pages/admin/AdminUser';
import AdminVendor from '../pages/admin/AdminVendor';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProtectedAdminRoute = () => {
 
  const isAuthenticated = useSelector((state: RootState) => {
    return state.admin.isAuthenticated ;
  });

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }
  return <Outlet />;
};

const PublicAdminRoute = () => {
  
  const isAuthenticated = useSelector((state: RootState) => {
    return state.admin.isAuthenticated ;
  });
  if (isAuthenticated) {
    return <Navigate to={'/admin/home'}  />;
  }

  return <Outlet />;
};

const AdminRoutes = () => {
  return (
    <Routes>

      <Route  element={<PublicAdminRoute/>}>
          <Route path="/" element={<AdminLogin />} />
      </Route>
   
      <Route  element={<ProtectedAdminRoute/>}>
          <Route path="/home" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUser />} />
          <Route path="/vendors" element={<AdminVendor />} />
      </Route>

      
    </Routes>
  );
};

export default AdminRoutes;