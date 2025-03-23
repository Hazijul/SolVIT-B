import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../AuthContext';
import { signOut } from '@firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from '@firebase/firestore';

export function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const [userType, setUserType] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitial = () => {
    if (currentUser && currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return '';
  };

  useEffect(() => {
    const fetchUserType = async () => {
      if (currentUser) {
        try {
          // Check in patients collection
          const patientDoc = await getDoc(doc(db, 'patients', currentUser.uid));
          if (patientDoc.exists()) {
            setUserType('patient');
            return;
          }

          // Check in doctors collection
          const doctorDoc = await getDoc(doc(db, 'doctors', currentUser.uid));
          if (doctorDoc.exists()) {
            setUserType('doctor');
            return;
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
        }
      }
    };

    fetchUserType();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      setUserType(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const UserAvatar = () => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none overflow-hidden"
        >
          {currentUser?.photoURL && !imageError ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">
              {getInitial()}
            </div>
          )}
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
            <div className="p-2 border-b">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.displayName || currentUser?.email}
              </p>
              <p className="text-xs text-gray-500">
                {userType?.charAt(0).toUpperCase() + userType?.slice(1)}
              </p>
            </div>
            {userType === 'patient' && (
              <Link
                to="/appointments"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                My Appointments
              </Link>
            )}
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    )
  };

  return (
    <nav className="bg-white border-b border-gray-200 z-50 fixed w-full top-0 left-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">MediTrack</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Find Doctors
              </Link>
            </div>

            {/* Right Side - User Avatar or Auth Links */}
            <div className="flex items-center space-x-4 relative">
              {currentUser ? (
                <UserAvatar />
              ) : (
                <>
                  <Link to="/hospital/registration" className="text-blue-600 font-bold hover:text-gray-900">
                    Hospital Registration
                  </Link>
                  <Link to="/hospital/login" className="text-blue-400 font-bold hover:text-gray-900">
                    Hospital Login
                  </Link>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Doctors
              </Link>
              {currentUser && userType === 'patient' ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
