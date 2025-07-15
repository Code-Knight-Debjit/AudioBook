import React, { useState } from 'react';
import { SUBSCRIPTION_PRICE_RUPEES } from '../constants';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing for both card and UPI
    onSuccess();
  };

  const upiPayLink = `upi://pay?pa=debjitpl21@okicici&pn=Aura%20Audiobooks&am=${SUBSCRIPTION_PRICE_RUPEES}&cu=INR&tn=Aura%20Audiobooks%20Subscription`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayLink)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 p-8 max-w-md w-full m-4 transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Your Subscription</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            Card
          </button>
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${paymentMethod === 'upi' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            UPI / QR Code
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {paymentMethod === 'card' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                <input type="text" placeholder="**** **** **** 1234" required={paymentMethod === 'card'} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required={paymentMethod === 'card'} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                  <input type="text" placeholder="123" required={paymentMethod === 'card'} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <p className="text-gray-300 mb-4">Scan the QR code with any UPI app</p>
                    <div className="bg-white p-2 rounded-lg inline-block shadow-lg">
                         <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
                    </div>
                </div>
                 <div className="flex items-center my-2">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase">Or</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Pay using UPI ID</label>
                    <input type="text" placeholder="yourname@upi" className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
            </div>
          )}

          <div className="pt-4">
            <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors duration-200">
              Pay ₹{SUBSCRIPTION_PRICE_RUPEES}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;