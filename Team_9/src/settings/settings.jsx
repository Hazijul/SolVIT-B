// src/pages/settings.jsx
import React, { useEffect, useState, useContext } from 'react';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { auth, db } from '../firebase/config';
import { AuthContext } from '../AuthContext';
import { UserIcon,PhoneIcon,HeartIcon,Loader2Icon,CheckCircleIcon } from 'lucide-react';

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
    allergies: '',
    chronicConditions: '',
    vaccinations: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser) return;

        const userDoc = await getDoc(doc(db, 'patients', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            age: data.age || '',
            gender: data.gender || '',
            bloodGroup: data.bloodGroup || '',
            phone: data.phone || '',
            address: data.address || '',
            allergies: data.allergies?.join(', ') || '',
            chronicConditions: data.chronicConditions?.join(', ') || '',
            vaccinations: data.vaccinations || []
          });
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedData = {
        ...formData,
        allergies: formData.allergies.split(',').map(item => item.trim()).filter(Boolean),
        chronicConditions: formData.chronicConditions.split(',').map(item => item.trim()).filter(Boolean),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'patients', currentUser.uid), updatedData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-blue-100 mt-1">Update your personal information</p>
          </div>

          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-8">
                {/* Personal Information */}
                <Section 
                  title="Personal Information"
                  description="Your basic profile information"
                  icon={<UserIcon className="w-5 h-5 text-blue-500" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 ease-in-out"
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <FormField
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                    />
                    <FormField
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      as="select"
                      className="capitalize"
                    >
                      <option value="">Select Gender</option>
                      {['male', 'female', 'other'].map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </FormField>
                    <FormField
                      label="Blood Group"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      as="select"
                    >
                      <option value="">Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </FormField>
                  </div>
                </Section>

                {/* Contact Details */}
                <Section 
                  title="Contact Details"
                  description="How we can reach you"
                  icon={<PhoneIcon className="w-5 h-5 text-blue-500" />}
                >
                  <div className="space-y-6">
                    <FormField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                    <FormField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      as="textarea"
                      rows={3}
                      placeholder="Enter your full address"
                    />
                  </div>
                </Section>

                {/* Medical Information */}
                <Section 
                  title="Medical Information"
                  description="Important health details"
                  icon={<HeartIcon className="w-5 h-5 text-blue-500" />}
                >
                  <div className="space-y-6">
                    <FormField
                      label="Allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="e.g. Peanuts, Penicillin (comma separated)"
                    />
                    <FormField
                      label="Chronic Conditions"
                      name="chronicConditions"
                      value={formData.chronicConditions}
                      onChange={handleChange}
                      placeholder="e.g. Asthma, Diabetes (comma separated)"
                    />
                  </div>
                </Section>

                {/* Status Messages */}
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md flex items-center">
                      <XCircleIcon className="w-5 h-5 mr-2" />
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-50 text-green-600 px-4 py-3 rounded-md flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Profile updated successfully!
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-6 py-3 border border-transparent 
                             text-base font-medium rounded-md shadow-sm text-white 
                             bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
                             disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {saving ? (
                      <>
                        <Loader2Icon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated Section component
const Section = ({ title, description, icon, children }) => (
  <div className="border rounded-lg p-6 bg-gray-50">
    <div className="flex items-center mb-4">
      {icon}
      <div className="ml-3">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {children}
  </div>
);


const FormField = ({
  label,
  error,
  as: Component = 'input',
  required = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    block w-full rounded-lg border 
    ${error ? 'border-red-300' : 'border-gray-300'}
    shadow-sm focus:border-blue-500 
    focus:ring-blue-500 sm:text-sm 
    ${Component === 'textarea' ? 'resize-y' : ''}
    px-4 py-2
    ${className}
  `;

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Component
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.name}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${props.name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};



export default Settings;