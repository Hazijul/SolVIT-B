import React from 'react';
import { ShoppingCart, Search, ChevronDown } from 'lucide-react';

const categories = ['Food', 'Toiletries', 'Household Items'];

interface NavbarProps {
  onCartClick: () => void;
  cartItemCount: number;
  onCategorySelect: (category: string | null) => void;
  onSearchChange?: (search: string) => void;
}

export function Navbar({ 
  onCartClick, 
  cartItemCount,
  onCategorySelect,
  onSearchChange = () => {} 
}: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">NoQ</span>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <button
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => onCategorySelect(null)}
                >
                  Home
                </button>
                
                <div className="relative">
                  <button
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            onCategorySelect(null);
                            setIsDropdownOpen(false);
                          }}
                        >
                          All Items
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              onCategorySelect(category);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search items..."
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <button
              className="flex items-center text-gray-600 hover:text-gray-900"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="ml-2">{cartItemCount}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}