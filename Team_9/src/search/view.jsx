import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc, collection } from '@firebase/firestore';
import { auth, db } from '../firebase/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  Badge,
  Separator} from '../components/ui';
import { MapPin, Star, ThumbsUp, Award } from 'lucide-react';
import AppointmentBooking from '../components/AppointmentBooking';

const View = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const docid = queryParams.get('docid');

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Placeholder time slots (should be fetched based on doctor's availability)
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  // Placeholder reviews (fetch from database if available)
  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent doctor, very thorough and caring.',
      date: '2 days ago',
    },
    {
      name: 'Mike Peters',
      rating: 4,
      comment: 'Great experience, minimal waiting time.',
      date: '1 week ago',
    },
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!docid) {
        setError('No doctor ID provided.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'doctors', docid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data());
        } else {
          setError('Doctor not found.');
        }
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Error fetching doctor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [docid]);

  const handleBooking = async () => {
    setIsBooking(true);
    setBookingError('');

    const user = auth.currentUser;
    if (!user) {
      setBookingError('Please login to book an appointment');
      setIsBooking(false);
      return;
    }

    try {
      const appointmentRef = doc(collection(db, 'appointments'));
      await setDoc(appointmentRef, {
        doctorId: docid,
        patientId: user.uid,
        date: selectedDate,
        timeSlot: selectedSlot,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        patientName: user.displayName || user.email,
        status: 'pending',
        createdAt: new Date(),
      });

      setIsDialogOpen(false);
      // Navigate to appointments page or show success message
      navigate('/appointments');
    } catch (err) {
      console.error('Error booking appointment:', err);
      setBookingError('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <p className="mt-6 text-gray-600 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="mt-6 text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
        {/* Doctor Info Section */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardContent >
              <div className="flex flex-col md:flex-row gap-6 p-5">
                <Avatar className="w-32 h-32">
                  <img
                    src={doctor.image || 'https://via.placeholder.com/400x400'}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="object-cover"
                  />
                </Avatar>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h2>
                    <p className="text-muted-foreground">
                      {doctor.specialty} {doctor.qualifications && `| ${doctor.qualifications}`}
                    </p>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {doctor.experience || 'N/A'} Years Experience
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {doctor.successRate || 'N/A'}% Success Rate
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {doctor.clinicName || 'Clinic Name'}, {doctor.clinicAddress || 'Clinic Address'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specializations */}
          {doctor.specializations && doctor.specializations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                {doctor.specializations.map((spec) => (
                  <Badge key={spec} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Reviews</CardTitle>
              <CardDescription>Recent reviews from patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <img
                          src={`https://placehold.co/100x100`}
                          alt={review.name}
                        />
                      </Avatar>
                      <span className="font-medium">{review.name}</span>
                    </div>
                    <div className="flex items-center">
                      {Array(review.rating)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                  {index !== reviews.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Appointment Booking Section */}
        <Card className="h-fit sticky top-6">
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>Select your preferred date and time</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentBooking doctor={doctor} docid={docid} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default View;