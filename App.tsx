
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { Audiobook, View, Profile } from './types';
import { SUBSCRIPTION_PRICE_RUPEES } from './constants';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import UserView from './components/UserView';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user');
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Audiobook | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  const isAdmin = profile?.is_admin || false;
  const isSubscribed = profile?.is_subscribed || false;

  const fetchProfile = useCallback(async (user: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, is_subscribed, is_admin, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchProfile(session.user);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const fetchAudiobooks = useCallback(async () => {
    const { data, error } = await supabase
      .from('audiobooks')
      .select('id, title, author, cover_art_url, audio_url, duration_minutes')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching audiobooks', error.message);
    } else if (data) {
      setAudiobooks(data);
    }
  }, []);

  useEffect(() => {
    fetchAudiobooks();
  }, [fetchAudiobooks]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setView('login');
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const handleNavigate = useCallback((targetView: View) => {
    if (targetView === 'admin' && !isAdmin) {
      setView('user'); // Non-admins can't go to the admin page.
    } else if ((targetView === 'login' || targetView === 'signup') && session) {
      // If user is already logged in, navigating to login/signup should just show the user view.
      setView('user');
    } else {
      setView(targetView);
    }
  }, [isAdmin, session]);

  const handleSubscribe = useCallback(async () => {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ is_subscribed: true })
      .eq('id', profile.id);
    
    if (error) {
      alert('Subscription failed. Please try again.');
      console.error('Subscription error:', error.message);
    } else {
      alert('Payment successful! Welcome to Aura Audiobooks. Your library is now unlocked.');
      setProfile({ ...profile, is_subscribed: true });
    }
  }, [profile]);

  const handleAddBook = async (book: Omit<Audiobook, 'id' | 'audio_url'>, audioFile: File) => {
    // 1. Upload audio file to storage
    const fileExt = audioFile.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('audio_files')
      .upload(filePath, audioFile);

    if (uploadError) {
      throw new Error(`Audio upload failed: ${uploadError.message}`);
    }

    // 2. Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('audio_files')
      .getPublicUrl(filePath);

    // 3. Insert audiobook metadata into the database
    const { error: insertError } = await supabase.from('audiobooks').insert({
      ...book,
      audio_url: publicUrl,
    });

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }
    
    // 4. Refresh the list
    await fetchAudiobooks();
    alert('Audiobook added successfully!');
  };

  const handleSelectTrack = useCallback((book: Audiobook) => {
    if (!isSubscribed && !isAdmin) {
      alert(`Please subscribe for ₹${SUBSCRIPTION_PRICE_RUPEES} to listen.`);
      return;
    }
    setCurrentTrack(book);
    setIsPlaying(true);
  }, [isSubscribed, isAdmin]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onEnded = useCallback(() => {
      setIsPlaying(false);
      setProgress(0);
      const currentIndex = audiobooks.findIndex(b => b.id === currentTrack?.id);
      if(currentIndex !== -1 && currentIndex < audiobooks.length - 1) {
          handleSelectTrack(audiobooks[currentIndex + 1]);
      } else {
          setCurrentTrack(null);
      }
  }, [audiobooks, currentTrack, handleSelectTrack]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const scrubTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = scrubTime;
    }
  };
  
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.src = currentTrack?.audio_url || '';
        if (currentTrack) {
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Playback failed", e));
        }
    }
  }, [currentTrack]);


  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20">Loading...</div>;
    }

    // If user is not logged in, only show login or signup pages
    if (!session) {
      if (view === 'signup') {
        return <SignUpPage setView={setView} />;
      }
      // Default to login page for all other views when logged out
      return <LoginPage setView={setView} />;
    }

    // If user is logged in
    switch (view) {
      case 'admin':
        return isAdmin 
            ? <AdminDashboard audiobooks={audiobooks} onAddBook={handleAddBook} /> 
            : <UserView // If not admin, show user view instead of admin dashboard
                isSubscribed={isSubscribed}
                onSubscribe={handleSubscribe}
                audiobooks={audiobooks}
                onSelectTrack={handleSelectTrack}
                currentTrackId={currentTrack?.id}
                profile={profile}
                session={session}
              />;
      case 'user':
      case 'login': // If user is logged in, redirect from login/signup to user view
      case 'signup':
      default:
        return (
          <UserView
            isSubscribed={isSubscribed}
            onSubscribe={handleSubscribe}
            audiobooks={audiobooks}
            onSelectTrack={handleSelectTrack}
            currentTrackId={currentTrack?.id}
            profile={profile}
            session={session}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header profile={profile} currentView={view} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
        {renderContent()}
      </main>
      {currentTrack && (
        <AudioPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={togglePlayPause}
          onScrub={handleScrub}
        />
      )}
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />
    </div>
  );
};

export default App;
