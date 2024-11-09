

import React, { useState, useEffect } from 'react';
//import { useDispatch } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { userverifyOTP,userresendOtp} from '../../features/user/userAction';
//import { AppDispatch } from '../../redux/store'; 
import { showToastMessage } from "../../validation/Toast";
const OTPPage: React.FC = () => {
  const [otp, setOTP] = useState('');
  const [timer, setTimer] = useState(30);
  //const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const startTimer = () => {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    };

    startTimer();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      toast.error('OTP has expired. Please request a new one.');
    }
  }, [timer]);

  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    try {
      const response = await userverifyOTP(otp);

      if (response.success) {
        showOTPVerifiedMessage();
       
        setTimeout(() => {
          navigate('/user');
        }, 1000);
      } else {
        showToastMessage(response.message, 'error');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      showToastMessage('OTP verification failed. Please try again later.', 'error');
    } 
  };

  const handleResendOTP = async () => {
    try {
      setTimer(30);
      
      const response = await userresendOtp()
      if(response.success){
        showToastMessage('New OTP sent!', 'success');
      }else{
        
      }
    } catch (error) {
      console.error('Resend OTP failed:', error);
      showToastMessage('Failed to resend OTP. Please try again later.', 'error');
    }
  };

  const showOTPVerifiedMessage = () => {
    toast.success('OTP verified successfully');
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex md:w-1/2 bg-yellow-400 relative">
      <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ backgroundImage: `url(/bg.jpeg)` }}
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
          <h1 className="text-xl font-bold mb-2">Verify Your OTP</h1>
          <p className="text-gray-600 mb-4 text-sm">
            Please enter the OTP sent to your registered email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOTPChange}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                {timer > 0 ? `OTP expires in ${timer} seconds` : 'OTP has expired'}
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-500 hover:underline text-sm"
              >
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
            >
              Verify OTP
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Don't have an account?&nbsp;
            <Link to="/user/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;