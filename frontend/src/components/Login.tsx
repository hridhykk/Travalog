
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
//import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin, usergoogleLogin,userforgotPassword } from '../features/user/userAction';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';
import { auth, provider } from "../config/firebaseconfig";
import { signInWithPopup } from "firebase/auth";
import { showToastMessage } from "../validation/Toast";
import LoadingSpinner from './common/loadingSpinner';


interface LoginFormData {
  email: string;
  password: string;
}

interface ForgotPasswordFormData {
  email: string;
}

interface GoogleUser {
  email: string;
}

const Login: React.FC = () => {
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState<string | null>(null);
  const [currentImageIndex] = useState(0);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
 
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const images = [
    'bg.jpeg',
    'img4.jpeg',
    'img7.jpg',
  ];

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  useEffect(() => {
    setShowLoadingSpinner(false);
    if (isAuthenticated) {
      navigate('/user/home');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForgotPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForgotPasswordFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowLoadingSpinner(true);
  if (validateLogin(loginFormData.email, loginFormData.password)) {
      try {
        await dispatch(userLogin(loginFormData)).unwrap();
        console.log('Login successful');
      } catch (error) {
        console.error('Login failed:', error);
        showToastMessage('Login failed. Please try again.', 'error');
      }finally{
        setShowLoadingSpinner(false)
      }
    } 
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email) {
        const userData: GoogleUser = {
          email: user.email,
        };
        await dispatch(usergoogleLogin(userData)).unwrap();
      }
    } catch (error: any) {
      console.error('Google Sign Up Error:', error);
      showToastMessage(error.message || 'Something went wrong during Google sign up', 'error');
    }
  };

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowLoadingSpinner(true);
  
    try {
      const response = await userforgotPassword({ email: forgotPasswordFormData.email });
      if (response.success) {
            navigate('/user/resetpassOtp');
            showToastMessage('Password reset instructions sent to your email', 'success');
      } else {
        showToastMessage('Password reset instructions sent to your email', 'error');
        setShowForgotPasswordModal(false);
      }
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      showToastMessage(error.message || 'Something went wrong during forgot password', 'error');
      setShowForgotPasswordModal(false);
    } finally {
      setShowLoadingSpinner(false);
    }
  };
  

  const validateLogin = (email: string, password: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
      showToastMessage("Invalid email address", 'error');
      return false;
    }

    if (!passwordRegex.test(password)) {
      showToastMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character", 'error');
      return false;
    }

    return true;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex md:w-1/2 bg-yellow-400 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
        <div className="absolute bottom-0 left-0 p-4 bg-white bg-opacity-75 w-full">
          <h2 className="text-lg font-bold mb-2">Get ready to:</h2>
          <ul className="space-y-1">
            <li className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✓</span>
              Save even more with reward rates from our partner sites
            </li>
            <li className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✓</span>
              Easily pick up your search again from any device
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-start px-4 py-6 overflow-y-auto">
        <img src="/logo.svg" alt="" className="w-40 mb-6" />
        <div className="w-full max-w-md">
          <h1 className="text-xl font-bold mb-2">Unlock more savings as a member</h1>
          <p className="text-gray-600 mb-4 text-sm">Log in or create account with your email</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={loginFormData.email}
                onChange={handleLoginChange}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={loginFormData.password}
                onChange={handleLoginChange}
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative text-sm" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
            >
              Continue
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-500 mt-4">or continue with</p>
          
          <div className="flex justify-center mt-3">
            <button
              onClick={handleGoogleLogin} 
              className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 text-sm"
            >
              <img src="/google.png" alt="Google" className="w-4 h-4" />
              <span>Google</span>
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-6">
  <Link
    to="#"
    onClick={() => setShowForgotPasswordModal(true)}
    className="text-blue-500 hover:underline"
  >
    Forgot password?
  </Link>

  <p className="mt-2">
    Don't have an account?{' '}
    <Link to="/user/register" className="text-blue-500 hover:underline">
      Register
    </Link>
  </p>
</div>


{showForgotPasswordModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeInUp">
      {/* Close Button */}
      <button
        onClick={() => setShowForgotPasswordModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Close modal"
      >
        &times;
      </button>

      <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">
        OTP Verification
      </h3>

      <form onSubmit={handleForgotPassword} className="space-y-5">
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={forgotPasswordFormData.email}
            onChange={handleForgotPasswordChange}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            required
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-150 transform hover:scale-105"
        >
          Get OTP
        </button>
      </form>
    </div>
  </div>
)}
         
       

        </div>
      </div>
      {showLoadingSpinner && <LoadingSpinner />}
    </div>
  );
};

export default Login;



























