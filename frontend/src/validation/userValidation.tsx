import { showToastMessage } from './Toast';

interface UserValidationParams {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const userValidation = ({
  name,
  email,
  mobile,
  password,
  confirmPassword,
}: UserValidationParams): boolean => {
  const trimName = name.trim();
  const trimEmail = email.trim();
  const trimMobile = mobile.trim();
  const trimPassword = password.trim();
  const trimConfirmPass = confirmPassword.trim();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mobileRegex = /^(91)?0?[6-9]\d{9}$/;

  if (trimName === '' || trimEmail === '' || trimMobile === '' || trimPassword === '' || trimConfirmPass === '') {
    showToastMessage("All Fields Are Required", 'error');
    return false;
  } else if (trimConfirmPass !== trimPassword) {
    showToastMessage("Passwords not matching", 'error');
    return false;
  } else if (!emailRegex.test(trimEmail)) {
    showToastMessage("Invalid Email Address", 'error');
    return false;
  } else if (!mobileRegex.test(trimMobile) && trimMobile.length === 10) {
    showToastMessage("Enter valid Mobile Number", 'error');
    return false;
  } else if (!mobileRegex.test(trimMobile)) {
    showToastMessage("Invalid Mobile Number", 'error');
    return false;
  } else if (!passwordRegex.test(trimPassword)) {
    showToastMessage("Enter a strong Password", 'error');
    return false;
  } else {
    return true; 
  }
};

export default userValidation;