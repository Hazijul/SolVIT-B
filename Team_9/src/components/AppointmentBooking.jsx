// src/components/AppointmentBooking.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { doc, setDoc, collection } from '@firebase/firestore';
import { auth, db } from '../firebase/config';
import PropTypes from 'prop-types';

const AppointmentBooking = ({ doctor, docid }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Available time slots (could be fetched from doctor's availability)
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowTimeSlots(true);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    const user = auth.currentUser;
    if (!user) {
      setBookingError('Please login to book an appointment');
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      const appointmentRef = doc(collection(db, 'appointments'));
      await setDoc(appointmentRef, {
        doctorId: docid, // Use docid instead of doctor.id
        patientId: user.uid,
        date: selectedDate,
        timeSlot: selectedSlot,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        patientName: user.displayName || user.email,
        status: 'confirmed',
        createdAt: new Date()
      });

      // Reset states after successful booking
      setSelectedDate(null);
      setShowTimeSlots(false);
      setSelectedSlot(null);
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingError('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl p-4">
        <Calendar
          onChange={handleDateSelect}
          value={selectedDate}
          minDate={new Date()}
          className="w-full shadow-sm"
          tileClassName="hover:bg-blue-50 transition-colors"
        />
      </div>

      {/* Time Slots Modal */}
      {showTimeSlots && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Available Slots for {selectedDate.toLocaleDateString()}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedSlot === slot 
                      ? 'bg-blue-500 text-white border-blue-600 shadow-md' 
                      : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setShowTimeSlots(false)}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={!selectedSlot || isBooking}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  !selectedSlot || isBooking
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                }`}
              >
                {isBooking ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
            {bookingError && (
              <p className="mt-4 text-red-500 text-sm font-medium">{bookingError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

AppointmentBooking.propTypes = {
  doctor: PropTypes.object.isRequired,
  docid: PropTypes.string.isRequired
};

export default AppointmentBooking;