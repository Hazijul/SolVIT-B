import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaXTwitter } from 'react-icons/fa6';
import { SocialButton } from '../signup/SocialButton';
import { InputField } from '../signup/InputField';
import { auth, googleProvider, db } from '../firebase/config';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to determine user role and redirect
  const redirectUser = async (user) => {
    try {
      // Check if user exists in 'patients' collection
      const patientDocRef = doc(db, 'patients', user.uid);
      const patientDoc = await getDoc(patientDocRef);
      if (patientDoc.exists()) {
        navigate('/'); // Redirect to home page for patients
        return;
      }

      // Check if user exists in 'doctors' collection
      const doctorDocRef = doc(db, 'doctors', user.uid);
      const doctorDoc = await getDoc(doctorDocRef);
      if (doctorDoc.exists()) {
        navigate('/dashboard'); // Redirect to dashboard for doctors
        return;
      }

      // If user is not found in either collection
      setError('User role not recognized. Please contact support.');
    } catch (err) {
      console.error('Error determining user role:', err);
      setError('An error occurred while logging in. Please try again.');
    }
  };

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Reset error state
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      await redirectUser(userCredential.user); // Determine role and redirect
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in success:', result.user);
      await redirectUser(result.user); // Determine role and redirect
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
    }
  };

  // Handle show reset password modal
  const handleShowResetModal = () => {
    setResetEmail('');
    setResetError('');
    setResetSuccess('');
    setShowResetModal(true);
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError('');
    setResetSuccess('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      setResetError('Failed to send password reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex text-left">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8">Log in to your account</h1>
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              placeholder="abc@google.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="********"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Log In
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleShowResetModal}
                className="text-blue-600 hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 p-8 flex-col items-center justify-center">
        <div className="w-32 h-32 bg-gray-300 rounded-full mb-8"></div>
        <h2 className="text-3xl font-bold mb-4">Welcome to Medi-Chain</h2>
        <p className="text-gray-600 text-center max-w-md">
          "Your health, your control – MediTrack simplifies care, secures your records, and connects you to
          better healthcare anytime, anywhere."
        </p>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            {resetError && <p className="text-red-500 text-sm mb-4">{resetError}</p>}
            {resetSuccess && <p className="text-green-500 text-sm mb-4">{resetSuccess}</p>}
            {!resetSuccess ? (
              <form onSubmit={handleResetPassword}>
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="abc@google.com"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <div className="flex items-center justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="mr-4 text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isResetting ? 'Sending...' : 'Send Reset Email'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}