import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  useEffect(() => {
    const img = new Image();
    img.src = "/parko1.png";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: imageLoaded ? "url('/parko1.png')" : "none" }}
    >
      <Head>
        <title>Parko : Smart Parking, Smarter Travel</title>
        <meta name="description" content="Official ticketing system for Advitya 2025 events." />
      </Head>

      {/* Darker Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Loading Spinner */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        </div>
      )}

      {/* Main Login Card */}
      {imageLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-900 border border-gray-700 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center"
        >
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="/profile.webp" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-white text-2xl sm:text-3xl font-semibold mt-4">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>

          {/* Google Sign-In Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn("google")}
            className="mt-6 flex items-center justify-center w-full bg-white text-gray-900 rounded-full py-3 px-5 font-semibold text-lg hover:bg-gray-300 transition duration-300 shadow-lg"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default LoginPage;
