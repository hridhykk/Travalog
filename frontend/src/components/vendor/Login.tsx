import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { vendorLogin } from '../../features/vendor/vendorAction';
import { RootState } from '../../redux/store';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../common/loadingSpinner';
import { showToastMessage } from "../../validation/Toast";
import { vendorAxios } from "../../Axiosconfig/Axiosconfig";
const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
   
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const images = [
    'img4.jpeg',
    'bg.jpeg',
    'img7.jpg',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const isAuthenticated = useSelector((state: RootState) => state.vendor.isAuthenticated);
  useEffect(() => {
    
    setShowLoadingSpinner(false);
    if (isAuthenticated) {

      navigate('/vendor/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowLoadingSpinner(true);
    try{
      const { email, password } = formData;
      await dispatch(vendorLogin({ email, password })).unwrap();
    }catch(error){
      console.error('Login failed:', error);
      showToastMessage('Login failed. Please try again.', 'error');
    }
    
    
    
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send email as an object
      const response = await vendorAxios.post<{status: string, message: string}>(
        '/vendor/verifyemail',
        { email: forgotEmail }  // Changed this line to send as an object
      );
      
      const { message, status } = response.data;
      if (status === 'success') {  // Fixed comparison operator
        toast.success(message)
        showToastMessage(message, 'success');
        setTimeout(()=>{
          navigate('/vendor/resetpassOtp');
        },2000)
       
      }else if(status==='failed'){
        showToastMessage(message, 'error');
       
      }
      // toast.info('Password reset link has been sent to your email.');
      // setShowForgotModal(false);
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left side with background image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000" style={{ backgroundImage: `url(${images[currentImageIndex]})` }} />
          <div className="absolute inset-0 bg-amber-900/30" />
        </div>
        <div className="relative h-full flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Welcome back!</h1>
          <div className="space-y-4">
            <p className="text-lg">✓ Access your account</p>
            <p className="text-lg">✓ Manage your business</p>
            <p className="text-lg">✓ Stay connected</p>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.svg" alt="Logo" className="w-40" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center">Sign in to your account</h1>
          <p className="text-gray-600 mb-6 text-center">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input

                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
             
             />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-amber-700 hover:text-amber-800"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Don't have an account?</p>
            <Link to="/vendor/register" className="text-amber-700 hover:text-amber-800 font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showLoadingSpinner && <LoadingSpinner />}
    </div>
  );
};

export default Login;