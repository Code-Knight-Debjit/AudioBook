
import React from 'react';
import { Audiobook } from '../types';
import AudiobookCard from './AudiobookCard';

interface AudiobookListProps {
  audiobooks: Audiobook[];
  onSelectTrack: (book: Audiobook) => void;
  isLocked: boolean;
  currentTrackId?: number | null;
}

const AudiobookList: React.FC<AudiobookListProps> = ({ audiobooks, onSelectTrack, isLocked, currentTrackId }) => {
  return (
    <div>
        <h2 className="text-3xl font-bold text-white mb-6">
            {isLocked ? 'Explore Our Collection' : 'Your Library'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {audiobooks.map(book => (
                <AudiobookCard
                    key={book.id}
                    book={book}
                    onSelectTrack={onSelectTrack}
                    isLocked={isLocked}
                    isPlaying={currentTrackId === book.id}
                />
            ))}
        </div>
    </div>
  );
};

export default AudiobookList;
