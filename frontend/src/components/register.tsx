import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast} from 'react-toastify';
import {useDispatch} from 'react-redux';
import userValidation from '../validation/userValidation'
import { userRegister,usergoogleRegister } from '../features/user/userAction';
import { auth, provider } from "../config/firebaseconfig";
import { signInWithPopup } from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
//import { RootState } from '../redux/store'; 
import { AppDispatch } from '../redux/store'; 
//import { showToastMessage } from "../validation/Toast";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

interface GoogleUser {
  
  name: string | null;
  email: string | null;
  uid: string;
  photoUrl: string | null;
}


const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();


  const images = [
    'bg.jpeg',
    'background.jpg',
    'img3.jpeg',
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


  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { name, email, mobile, password, confirmPassword } = formData;
      const userRegValidation = userValidation({name, email, mobile, password, confirmPassword});
      
      if (userRegValidation) {
        const response = await userRegister({name, email, mobile, password});
        
        if (response.success) {
          
          setTimeout(()=>{
            navigate('/user/otp');
          },3000)
         
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('registation failed')
    }
  };
 



  const handleGoogleSignUp = async () => { 
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData: GoogleUser = {
        
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoUrl: user.photoURL,
      };
      
      const response = await dispatch(usergoogleRegister(userData)).unwrap();
  
      if (response.status === 'success') { 
        toast.success('Google registration successful!');
        navigate("/home");
      }else if(response.message==='user already excisting'){
        toast.error(response.message || 'user already excisted');
        navigate("/");
      }else{
        toast.error(response.message || 'Registration failed');
      }

      
    } catch (error: any) {
      console.error('Google Sign Up Error:', error);
      toast.error(error.message || 'Something went wrong during Google sign up');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex md:w-1/2 bg-yellow-400 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ backgroundImage: `url(/img7.jpg)`  }}
        />
        <div className="absolute bottom-0 left-0 p-4 bg-white bg-opacity-75 w-full">
          <h2 className="text-lg font-bold mb-2">Get ready to:</h2>
          <ul className="space-y-1">
            <li className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✓</span>
              Create your account and start saving
            </li>
            <li className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✓</span>
              Access exclusive deals and offers
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-start px-4 py-6 overflow-y-auto">
        <img src="/logo.svg" alt="" className="w-40 mb-6" />
        <div className="w-full max-w-md">
          <h1 className="text-xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-600 mb-4 text-sm">Sign up to start saving today</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
            >
              Sign Up
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-500 mt-4">or sign up with</p>
          
          <div className="flex justify-center mt-3">
            <button
             type="button" 
              onClick={handleGoogleSignUp} 
              className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 text-sm"
            >
              <img src="/google.png" alt="Google" className="w-4 h-4" />
              <span>Google</span>
            </button>
          </div>
          <p>
          <p className="text-center text-xs text-gray-500 mt-6">
          Already have an accound?&nbsp;
         <Link to="/user" className="text-blue-500 hover:underline">
          Login here
         </Link>
  </p>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;



// import * as React from 'react';
// import { useDispatch } from 'react-redux';
// import {
//   Button,
//   FormControl,
//   InputLabel,
//   OutlinedInput,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Box,
//   Link,
//   Container,
//   Typography,
// } from '@mui/material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import PhoneIcon from '@mui/icons-material/Phone';
// import { AppProvider } from '@toolpad/core';
// import { useTheme } from '@mui/material/styles';
//  //import { userRegister } from '../redux/userRedux/userThunk';

// import userValidation from '../validation/userValidation';
// import GoogleIcon from '@mui/icons-material/Google';

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';






// function CustomTextField({ label, name, icon, type = 'text', value, onChange }: {
//   label: string;
//   name: string;
//   icon: React.ReactNode;
//   type?: string;
//   value: string;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }) {
//   return (
//     <TextField
//       label={label}
//       name={name}
//       type={type}
//       size="small"
//       required
//       fullWidth
//       sx={{ mb: 2 }}
//       value={value}
//       onChange={onChange}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             {icon}
//           </InputAdornment>
//         ),
//       }}
//       variant="outlined"
//     />
//   );
// }

// function CustomPasswordField({ name, label, value, onChange }: {
//   name: string;
//   label: string;
//   value: string;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }) {
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (event: React.MouseEvent) => {
//     event.preventDefault();
//   };

//   return (
//     <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
//       <InputLabel size="small" htmlFor={`outlined-adornment-${name}`}>
//         {label}
//       </InputLabel>
//       <OutlinedInput
//         id={`outlined-adornment-${name}`}
//         type={showPassword ? 'text' : 'password'}
//         name={name}
//         size="small"
//         value={value}
//         onChange={onChange}
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="toggle password visibility"
//               onClick={handleClickShowPassword}
//               onMouseDown={handleMouseDownPassword}
//               edge="end"
//               size="small"
//             >
//               {showPassword ? (
//                 <VisibilityOff fontSize="inherit" />
//               ) : (
//                 <Visibility fontSize="inherit" />
//               )}
//             </IconButton>
//           </InputAdornment>
//         }
//         label={label}
//       />
//     </FormControl>
//   );
// }

// function CustomButton() {
//   return (
//     <Button
//       type="submit"
//       variant="outlined"
//       color="info"
//       size="small"
//       disableElevation
//       fullWidth
//       sx={{ my: 2  ,
        
//         backgroundColor: "#4285F4",
//         color: "white",  
//         '&:hover': {
//           backgroundColor: "#357AE8",  
//         },
//       }}
//     >
//       Sign Up
//     </Button>
//   );
// }

// function GoogleButton({ onClick }: { onClick: () => void }) {
//   return (
//     <Button
//       variant="outlined"
//       size="small"
//       disableElevation
//       fullWidth
//       sx={{
//         my: 2,
//         backgroundColor:  "#771306", 
//         color: "white",  
//         '&:hover': {
//           backgroundColor:  "#5e0f05",  
//         },
//       }}
//       startIcon={<GoogleIcon sx={{ color: "white" }} />}  
//       onClick={onClick}
//     >
//       Sign Up with Google
//     </Button>
//   );
// }


// function SignUpLink() {
//   return (
   
//     <Link href="/" variant="body2">
//       already have an account ?Sign In
//     </Link>
//   );
// }
// export default function SignUpPage() {
//   const theme = useTheme();
//   //const dispatch = useDispatch();

//   const [formData, setFormData] = React.useState({
//     name: '',
//     email: '',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
   
//     try {
      
     
//     } catch (err) {
     
//    alert('errorrr')
//     }
//   };

//   const handleGoogleSignUp = () => {
// alert('vanneyyyy')
//     console.log('Google sign-up initiated');

//   };

//   return (
//     <AppProvider theme={theme}>
//       <Box
//         sx={{
//           minHeight: '100vh',
//           backgroundImage: `url("/bg.jpeg")`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       >
//         <Container
//           maxWidth="xs"
//           sx={{
//             backgroundColor: 'rgba(255, 255, 255, 0.5)',
//             borderRadius: 5,
//             p: 3,
//             boxShadow: 1,
//             backdropFilter: 'blur(6px)',
//           }}
//         >
//           <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
//             Sign Up
//           </Typography>
//           <GoogleButton onClick={handleGoogleSignUp} />
        

//          <div className="flex items-center justify-center my-6 relative">
//   <hr className="w-full border-gray-300" />

// </div>
//           <form onSubmit={handleSubmit}>
//             <CustomTextField
//               label="Email"
//               name="email"
//               icon={<AccountCircle fontSize="small" />}
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <CustomTextField
//               label="Name"
//               name="name"
//               icon={<AccountCircle fontSize="small" />}
//               value={formData.name}
//               onChange={handleChange}
//             />
//             <CustomTextField
//               label="Phone Number"
//               name="mobile"
//               icon={<PhoneIcon fontSize="small" />}
//               type="tel"
//               value={formData.mobile}
//               onChange={handleChange}
//             />
//             <CustomPasswordField 
//               name="password" 
//               label="Password" 
//               value={formData.password}
//               onChange={handleChange}
//             />
//             <CustomPasswordField 
//               name="confirmPassword" 
//               label="Confirm Password" 
//               value={formData.confirmPassword}
//               onChange={handleChange}
//             />
//             <CustomButton />
           
//             <SignUpLink />
//           </form>
//         </Container>
//       </Box>
//       <ToastContainer />
//     </AppProvider>
//   );
// }