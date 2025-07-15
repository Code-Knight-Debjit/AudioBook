
import { useState, useEffect, useCallback } from 'react';
import { Audiobook, AdminProfileView } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { supabase } from '../lib/supabaseClient';

interface AdminDashboardProps {
  audiobooks: Audiobook[];
  onAddBook: (book: Omit<Audiobook, 'id' | 'audio_url'>, audioFile: File) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ audiobooks, onAddBook }) => {
  // State for adding a new book
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverArtUrl, setCoverArtUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [addBookError, setAddBookError] = useState('');
  const [addBookLoading, setAddBookLoading] = useState(false);

  // State for admin management
  const [profiles, setProfiles] = useState<AdminProfileView[]>([]);
  const [manageAdminError, setManageAdminError] = useState('');
  const [manageAdminLoading, setManageAdminLoading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const fetchProfiles = useCallback(async () => {
    setManageAdminLoading(true);
    const { data, error } = await supabase.rpc('get_all_profiles', {});
    if (error) {
 console.error('Error fetching profiles:', error); // Log the actual error object
        setManageAdminError(`Failed to fetch users: ${error.message}`);
    } else {
      console.log("Data received from get_all_profiles:", data); // <--- ADD THIS LINE  
      setProfiles(data || []);
    }
    setManageAdminLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);


  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBookError('');
    if (!title || !author || !coverArtUrl || !duration || !audioFile) {
      setAddBookError('All fields and the audio file are required.');
      return;
    }
    if (isNaN(Number(duration)) || Number(duration) <= 0) {
        setAddBookError('Duration must be a positive number.');
        return;
    }
    setAddBookLoading(true);
    try {
      await onAddBook({
        title,
        author,
        cover_art_url: coverArtUrl,
        duration_minutes: Number(duration),
      }, audioFile);
      setTitle('');
      setAuthor('');
      setCoverArtUrl('');
      setDuration('');
      setAudioFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setAddBookError(err.message || 'An unknown error occurred.');
    } finally {
      setAddBookLoading(false);
    }
  };

  const handleGrantAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManageAdminError('');
    if (!newAdminEmail) {
        setManageAdminError('Email is required.');
        return;
    }
    setManageAdminLoading(true);
    const { error } = await supabase.rpc('grant_admin_role', { user_email: newAdminEmail });

    if (error) {
        setManageAdminError(error.message);
    } else {
        alert(`Successfully granted admin privileges to ${newAdminEmail}.`);
        setNewAdminEmail('');
        await fetchProfiles(); // Refresh the list
    }
    setManageAdminLoading(false);
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Admin Management Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-white">Admin Management</h2>
            <form onSubmit={handleGrantAdminSubmit} className="space-y-4">
                <p className="text-gray-300">Grant admin rights to a user by email.</p>
                <input type="email" placeholder="user@example.com" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                {manageAdminError && <p className="text-red-400 text-sm">{manageAdminError}</p>}
                <button type="submit" disabled={manageAdminLoading} className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                   {manageAdminLoading ? 'Processing...' : 'Make Admin'}
                </button>
            </form>
            <div>
                <h3 className="text-xl font-bold text-white mb-4">User List</h3>
                <div className="overflow-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50 sticky top-0">
                             <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {profiles.map(profile => (
                                <tr key={profile.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{profile.email}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                        {profile.is_admin && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-red-100">Admin</span>}
                                        {profile.is_subscribed && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500 text-purple-100">Subscribed</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        {/* Add Audiobook Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><PlusIcon className="w-8 h-8"/> Add New Audiobook</h2>
            <form onSubmit={handleAddBookSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                <input type="url" placeholder="Cover Art Image URL" value={coverArtUrl} onChange={e => setCoverArtUrl(e.target.value)} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                <input type="number" placeholder="Duration (minutes)" value={duration} onChange={e => setDuration(e.target.value)} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
                <input type="file" accept="audio/*" required onChange={e => setAudioFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" />
            </div>
            {addBookError && <p className="text-red-400 text-sm">{addBookError}</p>}
            <button type="submit" disabled={addBookLoading} className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {addBookLoading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                    </>
                ) : ( <> <PlusIcon className="w-5 h-5" /> Add Audiobook </> )}
            </button>
            </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Existing Audiobooks ({audiobooks.length})</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cover</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {audiobooks.map(book => (
                        <tr key={book.id}>
                            <td className="px-6 py-4 whitespace-nowrap"><img src={book.cover_art_url} alt={book.title} className="w-12 h-12 rounded-md object-cover"/></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{book.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{book.author}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{book.duration_minutes} min</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
