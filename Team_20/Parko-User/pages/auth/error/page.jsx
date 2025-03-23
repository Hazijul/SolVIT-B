"use client";

import { useSearchParams } from "next/navigation";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Something went wrong.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-red-600">Access Denied</h2>
        <p className="mt-2 text-gray-700">{error}</p>
        <a href="/" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Go Back to Login
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
