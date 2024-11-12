import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { showToastMessage } from "../../validation/Toast";
//import { userResetpassword } from '../../features/user/userAction';
import { vendorAxios } from "../../Axiosconfig/Axiosconfig";


const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
 
const ResetPasswordModal = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      showToastMessage('Invalid password format', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      showToastMessage('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await vendorAxios.post<{ status: string, message: string }>(
        '/vendor/resetpassword',
        { password: password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const { status, message } = response.data;
      if (status === 'success') {
        showToastMessage(message, 'success');
        navigate('/vendor');
      } else {
        showToastMessage(message, 'error');
      }
    } catch (error: any) {
      showToastMessage(error.response?.data?.message || 'Verification failed', 'error');
    } 
    // try {
    //   const response = await userResetpassword({password:password});
    //   if(response.success){
    //     showToastMessage('Password reset successfully', 'success');
    //     navigate('/user'); 
    //   }

      
      
    // } catch (err) {
    //   setError('Failed to reset password. Please try again.');
    //   showToastMessage('Failed to reset password', 'error');
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative">
      {/* Dark overlay with blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundImage: 'url("/background.jpg")', // Update with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Modal container */}
      <div className="bg-white rounded-xl p-8 w-full max-w-sm relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
        <div className="flex items-center mb-6">
          <ChevronLeft className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm text-center">
            Enter your new password
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border-2 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 outline-none transition-all"
              placeholder="Enter your new password"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full border-2 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 outline-none transition-all"
              placeholder="Confirm your new password"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg mt-6 hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] disabled:from-red-400 disabled:to-red-400 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-lg shadow-lg"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;