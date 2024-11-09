import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminLogin } from '../../features/admin/adminAction';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

interface formData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<formData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateLogin(formData.email, formData.password)) {
      try {
        await dispatch(adminLogin(formData)).unwrap();
        console.log('Login successful');
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('Login failed. Please try again.');
      }
    } else {
      toast.error('Invalid email or password format');
    }
  };

  const validateLogin = (email: string, password: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }
  
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
      return false;
    }
  
    return true;
  };

  return (
    <div className="h-screen w-full relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/bg.jpeg)',
          filter: 'brightness(0.8)'
        }}
      />
      
      {/* Login Container */}
      <div className="relative h-full flex items-center justify-center">
        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md mx-4">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">ADMIN LOGIN</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-white placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition duration-300"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;