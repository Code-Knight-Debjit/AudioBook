import React from 'react';
import { Audiobook } from '../types';
import { LockIcon } from './icons/LockIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface AudiobookCardProps {
  book: Audiobook;
  onSelectTrack: (book: Audiobook) => void;
  isLocked: boolean;
  isPlaying: boolean;
}

const AudiobookCard: React.FC<AudiobookCardProps> = ({ book, onSelectTrack, isLocked, isPlaying }) => {
  return (
    <div className="group relative" onClick={() => onSelectTrack(book)}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-800 cursor-pointer shadow-lg transition-all duration-300 group-hover:shadow-purple-500/40 transform group-hover:-translate-y-1">
        <img
          src={book.cover_art_url}
          alt={book.title}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 ${isLocked && !isPlaying ? 'grayscale filter blur-sm' : ''}`}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isLocked ? (
            <LockIcon className="h-12 w-12 text-white/80" />
          ) : isPlaying ? (
            <PauseIcon className="h-12 w-12 text-white/90" />
          ) : (
            <PlayIcon className="h-12 w-12 text-white/90" />
          )}
        </div>
         {isPlaying && (
           <div className="absolute inset-0 border-4 border-purple-500 rounded-lg pointer-events-none"></div>
         )}
      </div>
      <div className="mt-3 text-left">
        <h3 className="text-sm font-semibold text-white truncate">{book.title}</h3>
        <p className="mt-1 text-xs text-gray-400 truncate">{book.author}</p>
      </div>
    </div>
  );
};

export default AudiobookCard;