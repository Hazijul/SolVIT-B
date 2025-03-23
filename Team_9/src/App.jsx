import { SearchBar } from './components/SearchBar';
import { TopSpecialties } from './components/TopSpecialties';
import { HeroIllustration } from './components/HeroIllustration';

export default function DoctorSearchPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Add top padding equal to Navbar height (e.g., 16 for h-16) */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-yellow-50 to-yellow-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 relative z-10">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Find and book the best doctors near you
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                  Connect with qualified healthcare professionals in your area. 
                  Book appointments instantly and manage your health journey.
                </p>
                <div className="max-w-2xl">
                  <SearchBar />
                </div>
              </div>
              <div className="hidden lg:block w-1/2">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <TopSpecialties />
        </div>
      </div>
    </div>
  );
}