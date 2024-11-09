import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useState } from 'react';

// Enhanced selectors with token verification
const selectIsUserAuthenticated = (state: RootState) => {
  const isAuthenticated = state.auth.isAuthenticated;
  const hasToken = Boolean(localStorage.getItem('usertoken'));
  return isAuthenticated && hasToken;
};

const selectIsVendorAuthenticated = (state: RootState) => {
  const isAuthenticated = state.vendor.isAuthenticated;
  const hasToken = Boolean(localStorage.getItem('vendortoken'));
  return isAuthenticated && hasToken;
};

const selectIsAdminAuthenticated = (state: RootState) => {
  const isAuthenticated = state.admin.isAuthenticated;
  const hasToken = Boolean(localStorage.getItem('admintoken'));
  return isAuthenticated && hasToken;
};

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

// Public Routes with loading state
export const UserPublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export const VendorPublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsVendorAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Navigate to="/vendor/home" replace /> : <Outlet />;
};

export const AdminPublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Navigate to="/admin/home" replace /> : <Outlet />;
};

// Private Routes with loading state and token verification
export const UserPrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/user" replace />;
};

export const VendorPrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsVendorAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/vendor" replace />;
};

export const AdminPrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};