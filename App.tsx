import React, { useState, useEffect, useCallback } from 'react';
import { TRACKS, TRACK_DURATION } from './constants';
import { Track } from './types';
import { TrackCard } from './components/TrackCard';
import { Kaleidoscope } from './components/Kaleidoscope';
import { PlayerControls } from './components/PlayerControls';
import { audioSynthesizer } from './services/audioSynthesizer';

// Import GoogleGenAI only to verify key presence or for types if needed, 
// but service handles logic.
// We'll rely on service error handling.

const App: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TRACK_DURATION);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check for API key for the laughter feature
    if (!process.env.API_KEY) {
        console.warn("API_KEY manquante. Les rires générés ne fonctionneront pas.");
        setIsApiKeyMissing(true);
    }
  }, []);

  const handleTrackSelect = async (track: Track) => {
    if (track.category === 'laughter' && isApiKeyMissing) {
        alert("Attention: Clé API manquante. Impossible de générer le rire.");
        return;
    }

    setActiveTrack(track);
    setIsPlaying(true);
    setTimeLeft(TRACK_DURATION);
    
    try {
        await audioSynthesizer.play(track);
    } catch (e) {
        console.error("Audio error", e);
        alert("Erreur lors de la lecture audio.");
        handleStop();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioSynthesizer.pause();
      setIsPlaying(false);
    } else {
      audioSynthesizer.resume();
      setIsPlaying(true);
    }
  };

  const handleStop = useCallback(() => {
    audioSynthesizer.stop();
    setIsPlaying(false);
    setActiveTrack(null);
    setTimeLeft(TRACK_DURATION);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (isPlaying && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                handleStop();
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, handleStop]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      
      {/* View: Player (Fullscreen) */}
      {activeTrack ? (
        <div className="relative w-full h-screen overflow-hidden">
          <Kaleidoscope 
            imageSrc={activeTrack.imageUrl} 
            isPlaying={isPlaying} 
          />
          <PlayerControls 
            track={activeTrack}
            isPlaying={isPlaying}
            timeLeft={timeLeft}
            onTogglePlay={handleTogglePlay}
            onStop={handleStop}
          />
        </div>
      ) : (
        /* View: Grid */
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400">
              Harmonia Kaleidoscope
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Sélectionnez une vignette pour immerger vos sens. 
              Sons de la nature, fréquences de guérison, rires thérapeutiques et relaxation.
            </p>
            {isApiKeyMissing && (
                <div className="mt-4 p-3 bg-yellow-500/20 text-yellow-200 rounded-lg text-sm inline-block">
                    Note: Configurez <code>process.env.API_KEY</code> pour activer les rires générés par IA.
                </div>
            )}
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
            {TRACKS.map((track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onClick={handleTrackSelect} 
              />
            ))}
          </div>

          <footer className="text-center text-slate-600 text-sm pb-8">
            <p>Audio généré en temps réel et via Gemini API (pour les voix). Images via Picsum.</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;