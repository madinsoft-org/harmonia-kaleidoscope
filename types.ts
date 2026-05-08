export type TrackCategory = 'nature' | 'vitamin' | 'laughter' | 'relaxation';

export interface Track {
  id: string;
  title: string;
  category: TrackCategory;
  imageUrl: string;
  description: string;
  // Specific params for synthesis
  frequency?: number; // For nature/vitamin tones
  prompt?: string; // For Gemini TTS laughter
  voice?: string; // For Gemini TTS voice selection
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number; // in seconds (300s = 5m)
}