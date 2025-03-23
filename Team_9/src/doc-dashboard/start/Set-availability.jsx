import { useState } from 'react';
import { DayTimeRange } from '../../components/DateTimeRange';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, setDoc } from '@firebase/firestore';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function SetAvailabilityPage() {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState({});

  // Function to handle changes from DayTimeRange components
const handleAvailabilityChange = (day, times) => {
  setAvailability((prev) => ({
    ...prev,
    [day]: times,
  }));
};

  // Function to handle Save button click
  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error('No user is logged in');
      return;
    }

    const uid = user.uid;

    try {
      // Update the doctor's availability in Firestore
      await setDoc(
        doc(db, 'doctors', uid),
        { availability },
        { merge: true }
      );

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Set your availability
        </h1>
        <p className="text-gray-600 mb-4">
          Define ranges of time when you are available. You can customize all of this later in the availability page.
        </p>

        <div className="space-y-2">
        {DAYS.map((day) => (
          <DayTimeRange
            key={day}
            day={day}
            onChange={(day, times) => handleAvailabilityChange(day, times)}
          />
        ))}
        </div>

        <div className="mt-8">
          <button
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}