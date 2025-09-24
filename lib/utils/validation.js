/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if the email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing validation result and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }
  
  // Add more password validation rules as needed
  // Example: Check for uppercase, lowercase, numbers, special characters
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Validates form fields
 * @param {Object} fields - Object containing form fields
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Object containing validation result and message
 */
export const validateForm = (fields, requiredFields) => {
  // Check for empty required fields
  for (const field of requiredFields) {
    if (!fields[field]) {
      return {
        isValid: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      };
    }
  }
  
  // If email is in the fields, validate it
  if (fields.email && !isValidEmail(fields.email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }
  
  // If password is in the fields, validate it
  if (fields.password) {
    const passwordValidation = validatePassword(fields.password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }
  }
  
  // If confirmPassword is in the fields, check if it matches password
  if (fields.password && fields.confirmPassword && fields.password !== fields.confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match'
    };
  }
  
  return {
    isValid: true,
    message: 'All fields are valid'
  };
};
