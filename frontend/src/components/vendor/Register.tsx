import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Building, FileText, Image as ImageIcon, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { vendorRegister } from '../../features/vendor/vendorAction';
import vendorValidation from '../../validation/vendorValidation'
interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  description: string;
  documents: File[];
}


interface FilePreview {
  name: string;
  url: string;
}

const MAX_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    description: '',
    documents: [],
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForgotModal, setShowForgotModal] = useState(false);
 
  const [filePreview, setFilePreview] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const navigate = useNavigate();
  
  const images = [
    'img4.jpeg',
    'img4.jpeg',
    'img7.jpg',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
      return false;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File ${file.name} is not supported. Please upload images or PDFs only`);
      return false;
    }
    
    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    try {
      const newFiles = Array.from(files);
      
     
      if (formData.documents.length + newFiles.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`);
        setIsUploading(false);
        return;
      }

      const validFiles = newFiles.filter(validateFile);
      
      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

   
      const previewPromises = validFiles.map(file => {
        return new Promise<FilePreview>((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = () => {
            resolve({
              name: file.name,
              url: reader.result as string
            });
          };
          
          reader.onerror = () => {
            reject(new Error(`Failed to read file ${file.name}`));
          };
          
          reader.readAsDataURL(file);
        });
      });

     
      const newPreviews = await Promise.all(previewPromises);
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles]
      }));
      
      setFilePreview(prev => [...prev, ...newPreviews]);
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files. Please try again.');
    } finally {
      setIsUploading(false);
      
   
      if (event.target.value) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
    setFilePreview(prev => prev.filter((_, i) => i !== index));
  };





 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.documents.length < 1) {
      toast.error('Please upload at least 4 documents');
      return;
    }
    
    const { name, email, mobile, password, confirmPassword,address,city,description,documents } = formData;
    const vendorRegValidation = vendorValidation ({name, email, mobile, password,confirmPassword,address,city,description});
    if(vendorRegValidation === true){
      const response = await vendorRegister({name, email, mobile, password,address,city,description,documents});
      if (response === true) {
       
        setTimeout(() => {
          navigate('/vendor/otp');
        }, 2000);
      } else {
        toast.error('Registration failed');
      }
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign-up initiated');
    alert('dkjfbdkj');
  };




  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Password reset email sent!');
    setShowForgotModal(false);
  };




  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left side with background image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
        
             <div 
             className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
             style={{ backgroundImage: `url(/img4.jpeg)` }}
           />
    
          <div className="absolute inset-0 bg-amber-900/30" />
        </div>
        <div className="relative h-full flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Join Our Platform</h1>
          <div className="space-y-4">
            <p className="text-lg">✓ Expand your business reach</p>
            <p className="text-lg">✓ Connect with customers</p>
            <p className="text-lg">✓ Manage everything in one place</p>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Create your account</h1>
          <p className="text-gray-600 mb-6 text-center">Start your journey with us today</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Company Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Contact Information */}
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
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Phone number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Location Information */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="address"
                  placeholder="Company Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  name="description"
                  placeholder="About your company"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="file"
                  name="documents"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

                {/* File Preview Section */}
    {filePreview.length > 0 && (
      <div className="mt-4 grid grid-cols-2 gap-4">
        {filePreview.map((file, index) => (
          <div key={index} className="relative border rounded-lg p-2">
            <div className="flex items-center">
              <span className="truncate text-sm">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="ml-auto text-red-500 hover:text-red-700"
                disabled={isUploading}
              >
                <X size={16} />
              </button>
            </div>
            {file.url.startsWith('data:image') && (
              <img
                src={file.url}
                alt={file.name}
                className="mt-2 w-full h-20 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
   )}
              {/* Password Section */}
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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Create Account
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">or sign up with</p>
            <div className="mt-3">
              <button
                onClick={handleGoogleSignUp}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/vendor" className="text-amber-700 hover:text-amber-800 font-medium">
                Sign in
              </Link>
            </p>
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

      <ToastContainer />
    </div>
  );
};

export default Register;