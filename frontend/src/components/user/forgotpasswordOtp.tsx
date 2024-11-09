import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { showToastMessage } from "../../validation/Toast";
import {userResetPassOtpverify} from '../../features/user/userAction'
import {userResendOtpresetpass} from'../../features/user/userAction'
interface OTPVerificationProps {}


const OTPVerification: React.FC<OTPVerificationProps> = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);

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

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError('');
    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
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
     const response = await userResetPassOtpverify({otp:enteredOtp})
     if(response.success){
      showToastMessage('OTP verified successfully', 'success');
      alert('successss hridhya kkkkk')
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
      const response = await userResendOtpresetpass()

     if(response.success){
      showToastMessage('New OTP has been sent to your email', 'success');

     }else{
      alert('heyyy')
      showToastMessage('Failed to resend OTP. Please try again.', 'error');
     }

     
    } catch (err) {
      setError('Failed to resend OTP');
      showToastMessage('Failed to resend OTP. Please try again.', 'error');
      // Reset timer even if API call fails to maintain consistent UX
      setTimeLeft(30);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative">
      {/* Dark overlay with blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundImage: 'url("/background.jpg")',
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
          <div className="w-25 h-25 mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <img
              src="/img1.png"
              alt="Your Image Description"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
          <p className="text-gray-600 text-sm text-center">
            Enter the OTP sent to your email
          </p>
          <p
            className={`text-sm mt-2 font-medium ${timeLeft > 10 ? 'text-gray-500' : 'text-red-500'}`}
          >
            Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              className="w-12 h-14 border-2 rounded-lg text-center text-xl font-bold focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 outline-none transition-all"
              value={digit}
              onChange={(e) => handleChange(e.target, idx)}
              onKeyUp={(e) => {
                if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
                  (e.target.previousSibling as HTMLInputElement).focus();
                }
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={isLoading || timeLeft === 0}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg mb-4 hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] disabled:from-red-400 disabled:to-red-400 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-lg shadow-lg"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="text-center">
          <span className="text-gray-600 text-sm">Didn't receive OTP?</span>
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-red-600 text-sm font-semibold ml-1 hover:text-red-700 disabled:text-red-400 disabled:cursor-not-allowed transition-colors"
          >
            RESEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;