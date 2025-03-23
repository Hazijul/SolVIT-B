// src/components/Search.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ queryParam, locationParam, doctors, loading }) => {
  const navigate = useNavigate();

  // Function to handle navigation to the doctor's profile page
  const handleViewProfile = (docid) => {
    navigate(`/view?docid=${docid}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">
        Search Results for "{queryParam}" {locationParam && `in ${locationParam}`}
      </h2>

      {loading ? (
        <p className="mt-6 text-gray-600">Loading...</p>
      ) : doctors.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-gray-50 p-6 rounded-lg shadow-md">
              <img
                src={doctor.image || 'https://via.placeholder.com/300'}
                alt={`${doctor.firstName} ${doctor.lastName}`}
                className="w-full h-64 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-gray-700">
                {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-lg text-gray-600 mb-2">{doctor.specialty}</p>
              <p className="text-gray-500 capitalize">{doctor.location}</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                onClick={() => handleViewProfile(doctor.id)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-600">No results found. Please try a different search.</p>
      )}
    </div>
  );
};

export default Search;