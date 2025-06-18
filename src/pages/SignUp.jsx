import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { SiGoogle } from 'react-icons/si';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../config/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Validate the form before submission
  const validateForm = () => {
    const newErrors = {};

    // Full name
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation (standard)
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Indian phone validation (starts with 6-9, 10 digits)
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  // Save the user details to Firestore
  const saveUserToFirestore = async (user) => {
    // Create (or update) a document in the "users" collection using the uid
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      name: user.displayName || formData.fullName,
      email: user.email,
      phone: formData.phone,
      photoURL: user.photoURL || null,
      role: 'user',
      status: 'active',
      createdAt: new Date(),
      orders: [],
      bookings: [],
      addresses: []
    });
  };

  // Handle email-based registration using Firebase Auth
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        // Create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Optionally update the profile with full name
        await updateProfile(user, { displayName: formData.fullName });

        // Save the user data to Firestore
        await saveUserToFirestore(user);

        // Log in with the same credentials used for signup
        await login(formData.email, formData.password);
        navigate('/profile');
      } catch (error) {
        console.error('Error during email sign-up:', error);
        // Optionally set error messages here to display to the user
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  // Handle Google sign in using Firebase Auth
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save the user data to Firestore
      await saveUserToFirestore(user);
      
      // No need to manually login as signInWithPopup already authenticates the user
      navigate('/profile');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for Facebook sign in handler
  const handleFacebookSignIn = () => {
    // Implement Facebook authentication using Firebase or your preferred method
    console.log('Facebook sign in not implemented yet.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signin" className="font-medium text-custom hover:text-custom/80">
              sign in to existing account
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: '20px', height: '20px', marginRight: '8px' }}
            />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleFacebookSignIn}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook"
              style={{ width: '20px', height: '20px', marginRight: '8px' }}
            />
            Continue with Facebook
          </button>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-custom focus:border-custom focus:z-10`}
                  placeholder="Full Name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-custom focus:border-custom focus:z-10`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">
                  +91
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none rounded-r-md relative block w-full pl-3 pr-3 py-3 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-custom focus:border-custom focus:z-10`}
                  placeholder="Phone Number"
                  style={{ borderLeft: 'none' }}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-custom focus:border-custom focus:z-10`}
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-custom focus:border-custom focus:z-10`}
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="accept-terms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className={`h-4 w-4 text-custom focus:ring-custom border-gray-300 rounded ${
                errors.acceptTerms ? 'border-red-300' : ''
              }`}
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
              I accept the{' '}
              <a href="#" className="text-custom hover:text-custom/80">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
