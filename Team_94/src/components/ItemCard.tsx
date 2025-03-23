import React from 'react';
import type { Database } from '../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'] & {
  shops: Database['public']['Tables']['shops']['Row'];
};

interface ItemCardProps {
  item: Item;
  onAddToCart: (item: Item) => void;
}

export function ItemCard({ item, onAddToCart }: ItemCardProps) {
  const [showModal, setShowModal] = React.useState(false);

  const imageUrl = item.image_url;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking add to cart
    onAddToCart(item);
    setShowModal(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        <img
          src={imageUrl || undefined}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-gray-600">₹{item.cost}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-sm ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </span>
            <span className="text-sm text-gray-500">
              {item.shops.name}
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
            <img
              src={imageUrl || undefined}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <p className="text-gray-600">Price: ₹{item.cost}</p>
              <p className="text-gray-600">Store: {item.shops.name}</p>
              <p className="text-gray-600">Location: {item.shops.location}</p>
              <p className={`${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={item.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}