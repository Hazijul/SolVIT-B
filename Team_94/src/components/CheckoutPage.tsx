import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useCartStore } from '../lib/store';
import { CartItem } from '../types/cart';

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [tokenNumber] = React.useState(Math.floor(Math.random() * 1000) + 1);

  const items = location.state?.items || [];
  const total = items.reduce((sum: number, item: CartItem) => sum + item.cost * item.quantity, 0);
  const currentTime = new Date();

  const handleConfirmOrder = () => {
    setShowReceipt(true);
    clearCart();
  };

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No items in cart</p>
      </div>
    );
  }

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">NoQ Receipt</h1>
            <p className="text-gray-500">Token #{tokenNumber}</p>
            <p className="text-gray-500">{format(currentTime, 'PPpp')}</p>
          </div>

          <div className="space-y-4 mb-8">
            {items.map((item: CartItem) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span>₹{(item.cost * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="font-medium">Expected Pickup Time:</p>
            <p className="text-xl font-bold">
              {format(new Date(currentTime.getTime() + 30 * 60000), 'HH:mm')}
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Order Summary</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="space-y-4">
            {items.map((item: CartItem) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.cost * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmOrder}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}