import { GoogleGenAI, Modality } from "@google/genai";

// Cache generated audio to save tokens/latency during a session
const audioCache: Map<string, AudioBuffer> = new Map();

export const generateLaughterAudio = async (
  prompt: string, 
  voiceName: string, 
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const cacheKey = `${prompt}-${voiceName}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  if (!process.env.API_KEY) {
    throw new Error("Clé API manquante");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We emphasize "Just laugh" in the system instruction
  const fullPrompt = `Rire uniquement. Ne parle pas. ${prompt}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("Aucun audio généré");
    }

    // Decode base64 manually
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode audio data using Web Audio API
    // Note: decodeAudioData detaches the buffer, so we must clone if we want to cache, 
    // but audioContext.decodeAudioData returns a fresh buffer.
    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
    
    audioCache.set(cacheKey, audioBuffer);
    return audioBuffer;

  } catch (error) {
    console.error("Erreur Gemini TTS:", error);
    throw error;
  }
};