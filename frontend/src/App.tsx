
// import { Route, Routes } from 'react-router-dom'
// import UserLogin from './pages/user/UserLogin';
// import Register from './pages/user/Register';
// import Home from './pages/user/Homepage'
// import AdminLogin from './pages/admin/AdminLogin'
// import AdminDashboard from './pages/admin/AdminDashboard';
// import VendorLogin from './pages/vendor/VendorLogin';
// import VendorRegister from './pages/vendor/VendorRegister';
// import VendorHome from './pages/vendor/VendorHome';
// import AdminUser from './pages/admin/AdminUser';
// import AdminVendor from './pages/admin/AdminVendor'
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   UserPublicRoute,
//   UserPrivateRoute,
//   VendorPublicRoute,
//   VendorPrivateRoute,
//   AdminPublicRoute,
//   AdminPrivateRoute
// } from './ProtectedRoutes/protectedRoutes';

// const App = () => {
//   return (
//     <Routes>
//       {/* User Routes */}
//       <Route element={<UserPublicRoute />}>
//         <Route path='/user' element={<UserLogin />} />
//         <Route path='/user/register' element={<Register />} />
//       </Route>
      
//       <Route element={<UserPrivateRoute />}>
//         <Route path='/home' element={<Home />} />
//       </Route>

//       {/* Vendor Routes */}
//       <Route element={<VendorPublicRoute />}>
//         <Route path='/vendor' element={<VendorLogin />} />
//         <Route path='/vendorreg' element={<VendorRegister />} />
//       </Route>

//       <Route element={<VendorPrivateRoute />}>
//         <Route path='/vendor/home' element={<VendorHome />} />
//       </Route>

//       {/* Admin Routes */}
//       <Route element={<AdminPublicRoute />}>
//         <Route path='/admin' element={<AdminLogin />} />
//       </Route>

//       <Route element={<AdminPrivateRoute />}>
//         <Route path='/admin/home' element={<AdminDashboard />} />
//         <Route path='/admin/users' element={<AdminUser />} />
//         <Route path='/admin/vendors' element={<AdminVendor />} />
//       </Route>
//     </Routes>
//   );
// };

// export default App;







// App.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import UserRoutes from './Routes/userRoute';
import VendorRoutes from './Routes/vendorRoute';
import AdminRoutes from './Routes/adminRoute';
const App = () => {
  return (
    <Routes>
      {/* Each route type has its own namespace */}
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/vendor/*" element={<VendorRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/user" replace />} />
      
      {/* Catch invalid routes */}
      <Route path="*" element={<Navigate to="/user" replace />} />
    </Routes>
  );
};

export default App;