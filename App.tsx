import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData, createBlob } from './utils/audio';
import { SYSTEM_INSTRUCTION, MODEL_NAME, VOICE_NAME } from './constants';
import { Visualizer } from './components/Visualizer';

// Simple helper to set per-page SEO without touching main index.html structure
const usePageSEO = (title: string, description: string) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);
};

const HomePage: React.FC = () => {
  usePageSEO(
    'Insult Bot AI | Rude AI Chatbot | BatMeez Bot - Instant Roasts',
    'Talk to our insult bot AI! Experience the funniest rude bot AI with savage roasts, witty comebacks, and hilarious AI-generated insults. Free instant chat.'
  );
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

        {/* Simple nav to SEO pages */}
        <nav className="mt-4 flex justify-center gap-4 text-xs text-zinc-500 uppercase tracking-wide">
          <Link to="/blog" className="hover:text-red-400">Blog</Link>
          <Link to="/about" className="hover:text-red-400">About</Link>
          <Link to="/privacy" className="hover:text-red-400">Privacy</Link>
          <Link to="/terms" className="hover:text-red-400">Terms</Link>
          <Link to="/api-docs" className="hover:text-red-400">API</Link>
        </nav>
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

// ----- Static SEO Pages -----

const PageShell: React.FC<{ title: string; description: string; heading: string; children: React.ReactNode }> = ({
  title,
  description,
  heading,
  children,
}) => {
  usePageSEO(title, description);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <Link to="/" className="text-sm font-bold tracking-widest uppercase text-red-500">
          Batmeez Bot
        </Link>
        <nav className="flex gap-4 text-xs text-zinc-400 uppercase">
          <Link to="/blog" className="hover:text-red-400">Blog</Link>
          <Link to="/about" className="hover:text-red-400">About</Link>
          <Link to="/privacy" className="hover:text-red-400">Privacy</Link>
          <Link to="/terms" className="hover:text-red-400">Terms</Link>
          <Link to="/api-docs" className="hover:text-red-400">API</Link>
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {heading}
        </h1>
        {children}
        <p className="pt-6 text-xs text-zinc-500">
          Ready for more savage roasts?{' '}
          <Link to="/" className="text-red-400 hover:underline">
            Go back to the main insult bot AI and get roasted.
          </Link>
        </p>
      </main>
    </div>
  );
};

const BlogPage: React.FC = () => (
  <PageShell
    title="Insult Bot Blog | Funny Rude Bot AI Articles"
    description="Read about why people love insult bots, the funniest rude bot AI roasts, and the psychology behind insult humor AI."
    heading="Insult Bot AI Blog"
  >
    <section className="space-y-4 text-sm leading-relaxed text-zinc-200">
      <article className="space-y-2">
        <h2 className="text-xl font-semibold">Top 10 Funniest Insults from AI Bots</h2>
        <p>
          Our insult bot AI constantly generates savage one-liners and witty comebacks. This list
          highlights some of the funniest roasts ever produced by a rude bot AI, crafted purely for
          entertainment.
        </p>
      </article>

      <article className="space-y-2">
        <h2 className="text-xl font-semibold">Why People Love Talking to Rude Bot AI</h2>
        <p>
          A rude AI chatbot lets users safely explore dark humor and playful mockery. The insult bot
          becomes a guilt‑free way to hear jokes that a normal friend might never say out loud.
        </p>
      </article>

      <article className="space-y-2">
        <h2 className="text-xl font-semibold">The Psychology Behind Insult Humor AI</h2>
        <p>
          Insult humor works because it mixes surprise, exaggeration, and emotional distance. Our
          insult generator AI leans into this by keeping everything clearly fictional and optional,
          so users stay in control.
        </p>
      </article>
    </section>
  </PageShell>
);

const AboutPage: React.FC = () => (
  <PageShell
    title="About Batmeez Bot | Rude Insult Bot AI"
    description="Learn how Batmeez Bot works as a rude bot AI insult generator built for comedy and entertainment."
    heading="About This Rude Insult Bot AI"
  >
    <p className="text-sm leading-relaxed text-zinc-200">
      Batmeez Bot is a deliberately rude AI chatbot designed for people who enjoy dark humor and
      over‑the‑top roasts. Instead of giving polite answers, this insult bot focuses on sarcasm,
      spicy comebacks, and theatrical trash talk.
    </p>
    <p className="text-sm leading-relaxed text-zinc-200">
      Under the hood, a modern large language model powers the insult generator, turning your
      prompts into context‑aware jokes. Every response is generated on the fly, meaning the rude bot
      AI never fully repeats itself and can adapt to your style of banter.
    </p>
  </PageShell>
);

const PrivacyPage: React.FC = () => (
  <PageShell
    title="Privacy Policy | Batmeez Insult Bot AI"
    description="Privacy details for using the Batmeez insult bot AI and rude chatbot experience."
    heading="Privacy Policy"
  >
    <p className="text-sm leading-relaxed text-zinc-200">
      This project is for entertainment and demo purposes. Do not share sensitive personal
      information with the insult bot AI. Usage data may be logged by the hosting platform or API
      provider to keep the rude bot AI running reliably and securely.
    </p>
  </PageShell>
);

const TermsPage: React.FC = () => (
  <PageShell
    title="Terms of Use | Rude Bot AI"
    description="Terms for using this rude insult bot AI experience."
    heading="Terms of Use"
  >
    <p className="text-sm leading-relaxed text-zinc-200">
      By using this insult bot AI, you agree that the experience is purely comedic, fictional, and
      provided as‑is with no guarantees. If you are easily offended, you should not use a rude bot
      AI designed specifically to roast you.
    </p>
  </PageShell>
);

const ApiDocsPage: React.FC = () => (
  <PageShell
    title="API Documentation | Insult Bot AI"
    description="High-level overview of how an insult generator AI API could be integrated into apps and bots."
    heading="API Documentation (Concept)"
  >
    <p className="text-sm leading-relaxed text-zinc-200">
      This demo shows how a live insult bot AI experience can work in the browser using a streaming
      AI API. A production insult generator API would expose endpoints for sending text or audio
      prompts and receiving rude bot AI responses in real time.
    </p>
  </PageShell>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;