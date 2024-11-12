
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VendorLogin from '../pages/vendor/VendorLogin';
import VendorRegister from '../pages/vendor/VendorRegister';
import VendorHome from '../pages/vendor/VendorHome';
import { RootState } from '../redux/store';
import VendorRegOtp from '../pages/vendor/VendorRegOtp';
import VendorResetpass from '../pages/vendor/VendorResetpass';
import ResetpassOtp from '../pages/vendor/ResetpassOtp'


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
        <Route path="/otp" element={<VendorRegOtp/>} />
        <Route path="resetpassword" element={<VendorResetpass />} />
        <Route path="resetpassOtp" element={<ResetpassOtp />} />
      </Route>

    
      <Route element={<ProtectedVendorRoute />}>
        <Route path="home" element={<VendorHome />} />
       
      </Route>
    </Routes>
  );
};

export default VendorRoutes;