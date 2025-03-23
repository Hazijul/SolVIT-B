import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../firebase/config';
import { BookingTabs } from './Tabs';
import { BookingList } from './EventList';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { signOut } from '@firebase/auth';
import { PatientSidebar } from './PatientSidebar';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // Add this line
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('doctorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to Date
          startTime: doc.data().date.toDate(),
          endTime: new Date(doc.data().date.toDate().getTime() + 60 * 60 * 1000), // Add 1 hour
          title: `Appointment with ${doc.data().patientName}`,
          location: 'Online Consultation'
        }));

        setAppointments(fetchedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredBookings = appointments.filter(appointment => {
    const now = new Date();
    const appointmentDate = new Date(appointment.startTime);

    switch (activeTab) {
      case 'Upcoming':
        // Return true only if appointment is in future AND not cancelled
        return appointmentDate > now && appointment.status !== 'cancelled';
      case 'Past':
        return appointmentDate < now;
      case 'Cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const handleEdit = async (booking, action) => {
    if (action === 'view') {
      setSelectedPatientId(booking.patientId);
      setSelectedAppointmentId(booking.id); // Set the appointment ID
      setIsSidebarOpen(true);
    }
    if (action === 'delete') {
      try {
        const appointmentRef = doc(db, 'appointments', booking.id);
        await setDoc(appointmentRef, {
          ...booking,
          status: 'cancelled',
          updatedAt: new Date()
        }, { merge: true });

        // Update local state to reflect the change
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt.id === booking.id 
              ? { ...apt, status: 'cancelled' }
              : apt
          )
        );
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment');
      }
    }
    // Handle other actions...
    console.log('Edit action:', action, booking);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Helper function to get user initials
  const getUserInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return <div className="p-6">Loading appointments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        
        {currentUser ? (
          <div className="relative">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center cursor-pointer"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg">
                  {getUserInitials(currentUser.email)}
                </div>
              )}
            </div>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-600">Loading...</div>
        )}
      </div>
      
      <BookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No {activeTab.toLowerCase()} appointments found
        </p>
      ) : (
        <BookingList
          bookings={filteredBookings}
          onEdit={handleEdit}
        />
      )}

      <PatientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        patientId={selectedPatientId}
        appointmentId={selectedAppointmentId} // Pass the appointment ID
      />
    </div>
  );
}

export default Dashboard;