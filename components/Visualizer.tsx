import React from 'react';

interface VisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive, isSpeaking }) => {
  return (
    <div className="relative flex items-center justify-center h-64 w-64 mt-8 mb-12">
      {/* Outer Glow */}
      <div 
        className={`absolute inset-0 rounded-full bg-red-600 blur-2xl transition-opacity duration-500 ${
          isActive ? (isSpeaking ? 'opacity-60 animate-pulse' : 'opacity-20') : 'opacity-0'
        }`}
      ></div>
      
      {/* Core Circle */}
      <div 
        className={`relative z-10 h-48 w-48 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
          isActive 
            ? 'border-red-500 bg-zinc-900 shadow-[0_0_30px_rgba(220,38,38,0.5)]' 
            : 'border-zinc-700 bg-zinc-800'
        }`}
      >
        {isActive ? (
            <div className="flex gap-1 h-16 items-center justify-center">
               {/* Fake waveform animation */}
               <div className={`w-2 bg-red-500 rounded-full ${isSpeaking ? 'animate-[bounce_1s_infinite]' : 'h-2'}`}></div>
               <div className={`w-2 bg-red-500 rounded-full ${isSpeaking ? 'animate-[bounce_1.2s_infinite]' : 'h-2'}`}></div>
               <div className={`w-2 bg-red-500 rounded-full ${isSpeaking ? 'animate-[bounce_0.8s_infinite]' : 'h-2'}`}></div>
               <div className={`w-2 bg-red-500 rounded-full ${isSpeaking ? 'animate-[bounce_1.1s_infinite]' : 'h-2'}`}></div>
               <div className={`w-2 bg-red-500 rounded-full ${isSpeaking ? 'animate-[bounce_0.9s_infinite]' : 'h-2'}`}></div>
            </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </div>
      
      {/* Status Text */}
      <div className="absolute -bottom-16 text-center w-full font-mono text-sm tracking-widest text-red-400 uppercase">
        {isActive ? (isSpeaking ? "Batmeez Speaking..." : "Listening...") : "Disconnected"}
      </div>
    </div>
  );
};