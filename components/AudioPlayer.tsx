import React from 'react';
import { Audiobook } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface AudioPlayerProps {
  track: Audiobook;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onScrub: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, isPlaying, progress, onPlayPause, onScrub }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-md text-white p-4 shadow-2xl-top z-50 animate-slide-up">
      <div className="container mx-auto flex items-center gap-4">
        <img src={track.cover_art_url} alt={track.title} className="w-16 h-16 rounded-md shadow-lg" />
        <div className="flex-1">
          <div className="font-bold text-lg">{track.title}</div>
          <div className="text-sm text-gray-400">{track.author}</div>
          <div className="w-full mt-2">
             <input
              type="range"
              value={progress}
              step="0.1"
              onChange={onScrub}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-purple-500"
            />
          </div>
        </div>
        <button
          onClick={onPlayPause}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full transition-colors duration-200"
        >
          {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;