import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData, createBlob } from './utils/audio';
import { SYSTEM_INSTRUCTION, MODEL_NAME, VOICE_NAME } from './constants';
import { Visualizer } from './components/Visualizer';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  // Refs for audio handling
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session ref
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  // Cleanup function to stop audio and disconnect
  const disconnect = async () => {
    try {
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
        }
    } catch (e) {
        console.error("Error closing session:", e);
    }
    
    sessionPromiseRef.current = null;

    // Stop microphone stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Disconnect Web Audio nodes
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    // Close contexts
    if (inputAudioContextRef.current) {
      await inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      await outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    // Stop any playing audio
    activeSourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();

    setIsConnected(false);
    setIsBotSpeaking(false);
  };

  const handleConnect = async () => {
    setError(null);
    
    if (isConnected) {
      await disconnect();
      return;
    }

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key not found in environment variables.");
      }

      const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      
      // Input: 16kHz required by Gemini
      inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      // Output: 24kHz typical for Gemini response
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      const inputCtx = inputAudioContextRef.current;
      const outputCtx = outputAudioContextRef.current;
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      // Get Microphone Access (with secure-context and legacy fallbacks)
      const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
      if (!window.isSecureContext && !isLocalhost) {
        throw new Error(
          "Microphone access requires a secure origin. Please run on https:// or http://localhost."
        );
      }

      const legacyGetUserMedia = (navigator as any).getUserMedia
        ? (constraints: MediaStreamConstraints) =>
            new Promise<MediaStream>((resolve, reject) =>
              (navigator as any).getUserMedia(constraints, resolve, reject)
            )
        : null;

      const getUserMedia =
        navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices) || legacyGetUserMedia;

      if (!getUserMedia) {
        throw new Error(
          "Microphone access is not available in this browser/context. Try a modern browser like Chrome/Edge/Firefox."
        );
      }

      const stream = await getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      nextStartTimeRef.current = 0;

      // Start Gemini Session
      sessionPromiseRef.current = genAI.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: async () => {
            setIsConnected(true);
            console.log("Gemini Live Session Connected");

            // Setup Input Pipeline (Mic -> Processor -> Gemini)
            const source = inputCtx.createMediaStreamSource(stream);
            sourceNodeRef.current = source;
            
            // Buffer size 4096, 1 input channel, 1 output channel
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Response
             const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             
             if (base64Audio) {
               setIsBotSpeaking(true);
               // Sync timing
               nextStartTimeRef.current = Math.max(
                 nextStartTimeRef.current,
                 outputCtx.currentTime
               );

               const audioBuffer = await decodeAudioData(
                 decode(base64Audio),
                 outputCtx,
                 24000,
                 1
               );

               const source = outputCtx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputNode);
               
               source.addEventListener('ended', () => {
                 activeSourcesRef.current.delete(source);
                 if (activeSourcesRef.current.size === 0) {
                    setIsBotSpeaking(false);
                 }
               });

               source.start(nextStartTimeRef.current);
               activeSourcesRef.current.add(source);
               nextStartTimeRef.current += audioBuffer.duration;
             }

             // Handle Interruption
             if (message.serverContent?.interrupted) {
               console.log("Model interrupted by user");
               activeSourcesRef.current.forEach(src => {
                   try { src.stop(); } catch (e) {}
               });
               activeSourcesRef.current.clear();
               nextStartTimeRef.current = 0;
               setIsBotSpeaking(false);
             }
          },
          onclose: () => {
            console.log("Session closed");
            setIsConnected(false);
            setIsBotSpeaking(false);
          },
          onerror: (e) => {
            console.error("Session error", e);
            setError("Connection error occurred.");
            disconnect();
          }
        }
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect.");
      disconnect();
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      
      {/* Header */}
      <header className="w-full max-w-2xl text-center space-y-2 mt-12">
        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 uppercase drop-shadow-lg">
          Batmeez Bot
        </h1>
        <p className="text-zinc-500 text-sm tracking-widest uppercase">
          Extremely Rude • Unhelpful • Aggressive
        </p>
      </header>

      {/* Main Interface */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg relative">
        
        <div className="absolute top-0 left-0 w-full h-full bg-red-900/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <Visualizer isActive={isConnected} isSpeaking={isBotSpeaking} />

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-200 rounded-lg text-center text-sm max-w-xs">
            Error: {error}
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={!process.env.API_KEY}
          className={`
            group relative px-8 py-4 rounded-full font-bold text-lg tracking-wider transition-all duration-300
            ${isConnected 
              ? 'bg-zinc-900 text-red-500 border-2 border-red-900 hover:bg-red-950 hover:border-red-700 shadow-[0_0_20px_rgba(127,29,29,0.4)]' 
              : 'bg-gradient-to-br from-red-600 to-red-900 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
          `}
        >
          {isConnected ? 'DISCONNECT (BHAGO)' : 'START CONVERSATION'}
          
          {/* Hover glow effect */}
          {!isConnected && (
            <div className="absolute inset-0 rounded-full bg-red-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
          )}
        </button>
        
        {!process.env.API_KEY && (
             <p className="mt-4 text-red-400 text-xs text-center max-w-xs">
                System configuration error: API Key is missing from environment variables.
             </p>
        )}

      </main>

      {/* Footer Instructions */}
      <footer className="w-full max-w-2xl text-center pb-8 opacity-40">
        <p className="text-xs text-zinc-500 font-mono">
          WARNING: THIS AI IS PROGRAMMED TO BE INSULTING. DO NOT USE IF SENSITIVE.
        </p>
      </footer>
    </div>
  );
};

export default App;