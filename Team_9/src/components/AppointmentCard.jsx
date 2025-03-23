// src/components/AppointmentCard.jsx
import React from 'react';
import { format } from 'date-fns';
import { Trash2Icon, XCircleIcon } from 'lucide-react';

function AppointmentCard({ appointment, handleCancelAppointment }) {
  const startTime = new Date(appointment.startTime);

  // Function to determine badge color based on status
  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow h-full">
      {/* Status Badge */}
      <span
        className={`absolute top-2 right-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
          appointment.status
        )}`}
      >
        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      </span>

      <div className="flex flex-col justify-between h-full">
        {/* Main Content */}
        <div className="flex items-center gap-4">
          {/* Date Column */}
          <div className="w-20 text-center">
            <div className="text-gray-600">{format(startTime, 'EEE')}</div>
            <div className="text-3xl font-bold">{format(startTime, 'dd')}</div>
            <div className="text-sm text-gray-600">{format(startTime, 'MMM')}</div>
          </div>

          {/* Details Column */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Dr. {appointment.doctorName}</h3>
            <div className="text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <span>Time: {appointment.timeSlot}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Location: {appointment.location || 'Online Consultation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Token No.: {appointment.tokenNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Estimated Time: {appointment.estimatedTime || 'To be updated'}</span>
              </div>
            </div>
          </div>  
        </div> {/* <-- Closing div for flex items */}

        {/* Action Button */}
        {appointment.status !== 'cancelled' && new Date(appointment.startTime) > new Date() && (
          <div className="absolute bottom-2 right-2">
            {appointment.status !== 'completed' && (
              <button
                className="text-sm bg-red-600 text-white hover:bg-red-800 px-3 py-1 rounded flex items-center gap-1"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                <Trash2Icon className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;
