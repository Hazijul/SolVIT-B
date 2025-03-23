import type { Database } from '../lib/database.types';
import { X } from 'lucide-react';

type Item = Database['public']['Tables']['items']['Row'] & {
  shops: Database['public']['Tables']['shops']['Row'];
};

interface CartItem extends Item {
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
}

export function Cart({ items, onClose, onRemoveItem, onUpdateQuantity, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={`https://source.unsplash.com/100x100/?${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.shops.name}</p>
                      <p className="text-sm">₹{item.cost}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                        className="w-16 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}