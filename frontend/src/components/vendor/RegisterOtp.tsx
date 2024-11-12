import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { showToastMessage } from "../../validation/Toast";
import { useNavigate } from 'react-router-dom';
//import { userResetPassOtpverify, userResendOtpresetpass } from '../../features/user/userAction';
import {VendorverifyOTP,vendorResendOtp} from '../../features/vendor/vendorAction'
interface OTPVerificationProps {}

const OTPVerification: React.FC<OTPVerificationProps> = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
const navigate = useNavigate()
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      showToastMessage('OTP has expired. Click resend to get a new one.', 'error');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleContainerClick = () => {
    const firstEmptyIndex = otp.findIndex(digit => digit === '');
    const focusIndex = firstEmptyIndex === -1 ? otp.length - 1 : firstEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newOtp = [...otp];
      for (let i = otp.length - 1; i >= 0; i--) {
        if (newOtp[i] !== '') {
          newOtp[i] = '';
          setOtp(newOtp);
          inputRefs.current[i]?.focus();
          break;
        }
      }
    } else if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits');
      showToastMessage('Please enter complete OTP', 'error');
      return;
    }

    if (timeLeft === 0) {
      showToastMessage('OTP has expired. Please request a new one.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await VendorverifyOTP({otp: enteredOtp});
      if(response.success) {
        showToastMessage('OTP verified successfully', 'success');
        navigate('/vendor')
      }
    } catch (err) {
      setError('Invalid OTP');
      showToastMessage('Invalid OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setTimeLeft(30);
      const response = await vendorResendOtp();

      if(response.success) {
        showToastMessage('New OTP has been sent to your email', 'success');
        inputRefs.current[0]?.focus();
      } else {
        showToastMessage('Failed to resend OTP. Please try again.', 'error');
      }
    } catch (err) {
      setError('Failed to resend OTP');
      showToastMessage('Failed to resend OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-300 relative">
      <div
        className="absolute inset-0 backdrop-blur-sm shadow-2xl"
        style={{
          backgroundImage: 'url("/")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
        }}
      />

      <div className="bg-white rounded-xl p-8 w-full max-w-sm relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center mb-6">
          <ChevronLeft className="w-6 h-6 text-amber-800 cursor-pointer hover:text-amber-800 transition-colors" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-25 h-25 mb-4 bg-gradient-to-br from-amber-800 to-amber-700 rounded-full flex items-center justify-center">
            <img
              src="/img1.png"
              alt="Your Image Description"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-amber-700">OTP Verification</h2>
          <p className="text-gray-600 text-sm text-center">
            Enter the OTP sent to your email
          </p>
          <p
            className={`text-sm mt-2 font-medium ${timeLeft > 10 ? 'text-gray-500' : 'text-amber-800'}`}
          >
            Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
        </div>

        <div 
          ref={containerRef}
          onClick={handleContainerClick}
          onPaste={handlePaste}
          className="flex justify-center gap-2 mb-6"
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              maxLength={1}
              className="w-12 h-14 border-2 rounded-lg text-center text-xl font-bold focus:border-amber-700 focus:ring-2 focus:ring-amber-700 focus:ring-opacity-50 outline-none transition-all"
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <p className="text-amber-800 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={isLoading || timeLeft === 0}
          className="w-full bg-gradient-to-r from-amber-800 to-amber-400 text-white py-4 rounded-lg mb-4 hover:from-amber-800 hover:to-amber-400 transition-all transform hover:scale-[1.02] disabled:from-amber-800 disabled:to-amber-400 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-lg shadow-lg"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="text-center">
          <span className="text-gray-600 text-sm">Didn't receive OTP?</span>
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-amber-600 text-sm font-semibold ml-1 hover:text-amber-700 disabled:text-amber-800 disabled:cursor-not-allowed transition-colors"
          >
            RESEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;