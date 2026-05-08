import React from 'react';
import { Track } from '../types';

interface TrackCardProps {
  track: Track;
  onClick: (track: Track) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onClick }) => {
  return (
    <div 
      onClick={() => onClick(track)}
      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-slate-800"
    >
      <img 
        src={track.imageUrl} 
        alt={track.title} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg leading-tight">{track.title}</h3>
        <p className="text-slate-300 text-xs mt-1">{track.description}</p>
        
        {/* Category Badge */}
        <div className="absolute top-2 right-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full text-white
                ${track.category === 'nature' ? 'bg-green-600' : ''}
                ${track.category === 'vitamin' ? 'bg-orange-500' : ''}
                ${track.category === 'laughter' ? 'bg-pink-500' : ''}
                ${track.category === 'relaxation' ? 'bg-blue-600' : ''}
            `}>
                {track.category}
            </span>
        </div>
      </div>
      
      {/* Play Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[1px]">
        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
    </div>
  );
};