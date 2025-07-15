import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Audiobook, Profile } from '../types';
import { SUBSCRIPTION_PRICE_RUPEES, RAZORPAY_KEY_ID, COMPANY_NAME } from '../constants';
import AudiobookList from './AudiobookList';

interface UserViewProps {
  isSubscribed: boolean;
  onSubscribe: () => void;
  audiobooks: Audiobook[];
  onSelectTrack: (book: Audiobook) => void;
  currentTrackId?: number | null;
  profile: Profile | null;
  session: Session | null;
}

const UserView: React.FC<UserViewProps> = ({ isSubscribed, onSubscribe, audiobooks, onSelectTrack, currentTrackId, profile, session }) => {
  
  const displayRazorpay = async () => {
    if (!profile || !session) {
      alert("Please log in to subscribe.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: SUBSCRIPTION_PRICE_RUPEES * 100, // Amount in the smallest currency unit (paise)
      currency: "INR",
      name: COMPANY_NAME,
      description: "Lifetime Subscription",
      image: "https://cdn.pixabay.com/photo/2016/11/29/03/40/headphone-1867123_960_720.jpg",
      handler: function (response: { razorpay_payment_id: string }) {
        console.log("Payment ID: ", response.razorpay_payment_id);
        onSubscribe();
      },
      prefill: {
        name: profile.username,
        email: session.user.email,
      },
      theme: {
        color: "#8B5CF6" // Purple color
      }
    };
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl mb-12 text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-extrabold mb-2">Unlock Unlimited Listening</h2>
          <p className="text-lg mb-6 opacity-90">Get access to our entire library of audiobooks for a one-time payment.</p>
          <button
            onClick={displayRazorpay}
            className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 shadow-xl"
          >
            Subscribe Now for ₹{SUBSCRIPTION_PRICE_RUPEES}
          </button>
        </div>
      )}

      <AudiobookList
        audiobooks={audiobooks}
        onSelectTrack={onSelectTrack}
        isLocked={!isSubscribed && !profile?.is_admin}
        currentTrackId={currentTrackId}
      />
    </>
  );
};

export default UserView;