import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (username === 'admin' && password === 'admin123') {
      router.push('/dashboard');
    } else {
      alert('Invalid login credentials!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-800 to-purple-900">
      <div className="bg-black bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105 hover:shadow-3xl">
        <h1 className="text-4xl font-semibold text-center text-white mb-8 animate__animated animate__fadeIn animate__delay-1s">Parking Handler Login</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 mb-6 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-6 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gradient-to-l hover:from-blue-600 hover:to-purple-500 transform transition duration-300 ease-in-out hover:scale-105"
        >
          Login
        </button>
      </div>
    </div>
  );
}
