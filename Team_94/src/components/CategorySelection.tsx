import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Guitar as Hospital, Building2, Bus, X } from 'lucide-react';
import React from 'react';

const categories = [
  {
    id: 'retail',
    name: 'Retail',
    icon: ShoppingBag,
    description: 'Shop for groceries, household items, and more',
    color: 'bg-blue-500',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Hospital,
    description: 'Book appointments and consultations',
    color: 'bg-green-500',
  },
  {
    id: 'banks',
    name: 'Banks',
    icon: Building2,
    description: 'Banking services and transactions',
    color: 'bg-yellow-500',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: Bus,
    description: 'Book tickets and track services',
    color: 'bg-purple-500',
  },
];

export function CategorySelection() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'retail') {
      navigate(`/${categoryId}`);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to NoQ
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Select a category to get started
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="relative group bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="h-48 flex items-center justify-center">
                  <div className={`p-4 rounded-full ${category.color} bg-opacity-10`}>
                    <Icon className={`h-12 w-12 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add popup dialog */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Coming Soon</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600">
              This feature is currently under development, or the API is presently offline. The Retail model will be applied to all remaining public services. Please check back later!
            </p>
            <button
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}