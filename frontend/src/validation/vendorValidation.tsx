import { showToastMessage } from './Toast';

interface VendorValidationParams {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  description: string;
}

const vendorValidation = ({
  name,
  email,
  mobile,
  password,
  confirmPassword,
  address,
  city,
  description,
}: VendorValidationParams): boolean => {
  // Trim all input fields
  const trimName = name.trim();
  const trimEmail = email.trim();
  const trimMobile = mobile.trim();
  const trimPassword = password.trim();
  const trimConfirmPass = confirmPassword.trim();
  const trimAddress = address.trim();
  const trimCity = city.trim();
  const trimDescription = description.trim();

  // Regular expressions for validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mobileRegex = /^(91)?0?[6-9]\d{9}$/;
  
  // Check if any required field is empty
  if (
    trimName === '' || 
    trimEmail === '' || 
    trimMobile === '' || 
    trimPassword === '' || 
    trimConfirmPass === '' ||
    trimAddress === '' ||
    trimCity === ''
  ) {
    showToastMessage("All Fields Are Required", 'error');
    return false;
  }

  // Validate name length
  if (trimName.length < 3) {
    showToastMessage("Name should be at least 3 characters long", 'error');
    return false;
  }

  // Validate email format
  if (!emailRegex.test(trimEmail)) {
    showToastMessage("Invalid Email Address", 'error');
    return false;
  }

  // Validate mobile number
  if (!mobileRegex.test(trimMobile) && trimMobile.length === 10) {
    showToastMessage("Enter valid Mobile Number", 'error');
    return false;
  }

  if (!mobileRegex.test(trimMobile)) {
    showToastMessage("Invalid Mobile Number", 'error');
    return false;
  }

  // Validate password strength
  if (!passwordRegex.test(trimPassword)) {
    showToastMessage("Password must contain at least 8 characters, including uppercase, lowercase, number and special character", 'error');
    return false;
  }

  // Validate password matching
  if (trimConfirmPass !== trimPassword) {
    showToastMessage("Passwords not matching", 'error');
    return false;
  }

  // Validate address length
  if (trimAddress.length < 10) {
    showToastMessage("Please provide a complete address (minimum 10 characters)", 'error');
    return false;
  }

  // Validate city
  if (trimCity.length < 3) {
    showToastMessage("Please enter a valid city name", 'error');
    return false;
  }

  // Validate description length (if required)
  if (trimDescription && trimDescription.length < 20) {
    showToastMessage("Description should be at least 20 characters long", 'error');
    return false;
  }

  return true;
};

export default vendorValidation;