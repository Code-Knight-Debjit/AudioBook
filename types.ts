export interface Audiobook {
  id: number;
  title: string;
  author: string;
  cover_art_url: string;
  audio_url: string;
  duration_minutes: number;
}

export interface Profile {
  id: string; // Corresponds to Supabase auth user ID
  username: string;
  is_subscribed: boolean;
  is_admin: boolean;
  avatar_url?: string | null;
}

export interface AdminProfileView {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  is_subscribed: boolean;
  avatar_url: string | null;
}
export type View = 'user' | 'login' | 'signup' | 'admin';

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}