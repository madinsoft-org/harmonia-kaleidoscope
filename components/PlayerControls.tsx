import React, { useEffect } from 'react';
import { Track } from '../types';

interface PlayerControlsProps {
  track: Track;
  isPlaying: boolean;
  timeLeft: number;
  onTogglePlay: () => void;
  onStop: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ 
  track, 
  isPlaying, 
  timeLeft, 
  onTogglePlay, 
  onStop 
}) => {
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-8 pointer-events-none">
      
      {/* Header Info */}
      <div className="flex justify-between items-start animate-fade-in pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl text-white border border-white/10 shadow-xl max-w-md">
            <h2 className="text-3xl font-bold mb-1">{track.title}</h2>
            <p className="text-slate-200 text-lg opacity-90">{track.description}</p>
            {track.category === 'laughter' && (
                <p className="text-xs text-pink-300 mt-2 italic flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                    Généré par Gemini IA
                </p>
            )}
        </div>
        
        {/* Timer */}
        <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/10 font-mono text-xl shadow-xl">
            {formatTime(timeLeft)}
        </div>
      </div>

      {/* Center - just space for visualizer */}
      <div className="flex-grow"></div>

      {/* Bottom Controls */}
      <div className="flex justify-center items-center gap-8 mb-8 pointer-events-auto">
        
        {/* Play/Pause */}
        <button 
            onClick={onTogglePlay}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-lg border border-white/40 hover:bg-white/30 hover:scale-105 transition-all shadow-2xl group"
        >
            {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
            )}
        </button>

        {/* Stop / Exit */}
        <button 
            onClick={onStop}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/80 backdrop-blur-lg border border-red-400 hover:bg-red-600 hover:scale-105 transition-all shadow-2xl"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
        </button>

      </div>
    </div>
  );
};