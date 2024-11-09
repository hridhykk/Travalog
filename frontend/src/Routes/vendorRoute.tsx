
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VendorLogin from '../pages/vendor/VendorLogin';
import VendorRegister from '../pages/vendor/VendorRegister';
import VendorHome from '../pages/vendor/VendorHome';
import { RootState } from '../redux/store';

const ProtectedVendorRoute = () => {
 
  const isAuthenticated = useSelector((state: RootState) => {
    return state.vendor.isAuthenticated ;
  });

  if (!isAuthenticated) {
    return <Navigate to="/vendor" />;
  }
  return <Outlet />;
};

const PublicVendorRoute = () => {
  
  const isAuthenticated = useSelector((state: RootState) => {
    return state.vendor.isAuthenticated ;
  });
  if (isAuthenticated) {
    return <Navigate to={'/vendor/home'}  />;
  }

  return <Outlet />;
};

const VendorRoutes = () => {
  return (
    <Routes>
     
      <Route element={<PublicVendorRoute />}>
        <Route path="/" element={<VendorLogin />} />
        <Route path="/register" element={<VendorRegister />} />
      </Route>

    
      <Route element={<ProtectedVendorRoute />}>
        <Route path="home" element={<VendorHome />} />
       
      </Route>
    </Routes>
  );
};

export default VendorRoutes;