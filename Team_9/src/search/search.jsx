import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query as firestoreQuery, where, getDocs } from '@firebase/firestore'; // Updated import path
import { db } from '../firebase/config';
import { SearchBar } from '../components/SearchBar';
import Search  from '../components/Search';

const SearchPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get('query') || '';
  const locationParam = params.get('location') || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example function to create search keywords

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const doctorsRef = collection(db, 'doctors');
        let q = firestoreQuery(doctorsRef);

        if (queryParam) {
          q = firestoreQuery(
            doctorsRef,
            where('searchKeywords', 'array-contains', queryParam.toLowerCase())
          );
        }

        if (locationParam) {
          q = firestoreQuery(q, where('location', '==', locationParam.toLowerCase()));
        }

        const querySnapshot = await getDocs(q);
        const doctorsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDoctors(doctorsList);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [queryParam, locationParam]);

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <SearchBar initialQuery={queryParam} initialLocation={locationParam} />

        <Search queryParam={queryParam} locationParam={locationParam} doctors={doctors} loading={loading} />
      </div>
    </div>
  );
};

export default SearchPage;


