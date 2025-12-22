import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData, createBlob } from './utils/audio';
import { SYSTEM_INSTRUCTION, MODEL_NAME, VOICE_NAME } from './constants';
import { Visualizer } from './components/Visualizer';

// Blog post data structure
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: React.ReactNode;
  category: string;
  readTime: string;
  publishedDate: string;
  keywords: string[];
}

const blogPosts: BlogPost[] = [
  {
    slug: 'ultimate-insult-chatbot',
    title: 'Tired of Boring AI? Meet the Ultimate Insult Chatbot That Actually Has a Personality',
    description: 'Looking for a laugh? Discover the funniest insult bot AI on the web. From witty comebacks to savage roasts, see why this insult chatbot is going viral.',
    category: 'Entertainment',
    readTime: '6 min read',
    publishedDate: '2024-01-20',
    keywords: ['insult bot AI', 'insult chatbot', 'funny insult bot', 'roast bot', 'entertainment AI'],
    content: (
      <>
        <div className="my-8 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&q=80"
            alt="AI chatbot with personality - Insult Bot AI entertainment"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-6 mb-4">Why Nice is Overrated</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Let's be honest: asking an AI for the weather or a cookie recipe is useful, but it's incredibly boring.
          We live in an era of polite, sterilized digital assistants that are afraid to step on toes. But sometimes,
          you don't want polite. You want personality.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Enter the new wave of entertainment AI: the <Link to="/" className="text-red-400 hover:underline">funny insult bot</Link>.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          If you've ever wanted to roast your friends, find the perfect witty comeback, or just see if a machine
          can hurt your feelings (in a funny way), you're in the right place. Our new insult bot AI isn't here to
          be your assistant—it's here to be your sarcastic best friend.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">What is an Insult Bot AI?</h2>
        <div className="my-6 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=600&fit=crop&q=80"
            alt="AI language model generating humorous responses - Insult chatbot technology"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          An insult bot AI is a specialized language model designed to generate humorous, sarcastic, and witty responses.
          Unlike standard chatbots that are programmed to be servile, an insult bot is tuned for banter.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Think of it as a digital comedian. It uses advanced natural language processing (NLP) to understand context
          and deliver a "roast" that is sharp, funny, and surprisingly human.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Why Use an Insult Chatbot?</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          You might be wondering, "Why would I want a robot to be mean to me?" It's not about being mean; it's about
          entertainment. Here is why thousands of users are flocking to InsultBot:
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">1. The Ultimate Icebreaker</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Silence in the group chat? Drop a link to the <Link to="/" className="text-red-400 hover:underline">funny insult bot</Link>.
          Nothing bonds people faster than collectively laughing at an AI roasting everyone in the room.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">2. Sharpen Your Wits</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Want to get better at banter? Sparring with an insult bot AI is the perfect training ground. It creates unique,
          never-before-seen comebacks that you can use in your next friendly debate.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">3. Pure Entertainment</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Sometimes you just need a laugh. The unpredictability of the bot makes it addictive. Will it make a pun?
          Will it call out your typing speed? You never know what it's going to say next.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">How We Built the Fastest Roast Bot on Vercel</h2>
        <div className="my-6 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80"
            alt="Fast AI response speed - Vercel edge network performance for insult bot"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Speed matters. A joke isn't funny if you have to wait 10 seconds for the punchline. That's why InsultBot
          is hosted on Vercel.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          By leveraging Vercel's edge network, our insult chatbot delivers responses in milliseconds. This ensures that
          the banter flows naturally, just like a real conversation. Whether you are on mobile or desktop, the roast
          is served hot and fast.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Safe, Consensual Fun</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          It is important to note that while our insult bot AI has an attitude, it's designed for comedy. We believe
          in roasting, not bullying. The goal is to make you laugh at the absurdity of a machine having an attitude,
          not to spread genuine hate.
        </p>

        <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4">Ready to Get Roasted?</h2>
          <p className="text-sm leading-relaxed text-zinc-200 mb-4">
            Are you brave enough to press start?
          </p>
          <p className="text-sm leading-relaxed text-zinc-200 mb-4">
            Stop talking to boring robots. Experience the sharpest, funniest insult chatbot on the web today.
            But don't say we didn't warn you—it doesn't hold back.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
          >
            Click here to chat with InsultBot now →
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'web-based-insult-bot',
    title: 'Insult Bot AI: Why the Funniest Roast Generator is Now on the Web (No App Download Needed)',
    description: 'Skip the App Store. Try the new insult bot AI that runs directly in your browser. Fast, free, and savage. Click to get roasted by the ultimate insult chatbot instantly.',
    category: 'Features',
    readTime: '5 min read',
    publishedDate: '2024-01-18',
    keywords: ['insult bot AI', 'web-based chatbot', 'roast generator', 'no app download', 'browser AI'],
    content: (
      <>
        <h2 className="text-2xl font-bold text-zinc-50 mt-6 mb-4">Stop Downloading Apps Just to Get Roasted</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          We've all been there. You want a quick laugh, or you need a savage comeback for a group chat.
          You search for an "AI roast bot," and what do you find? A dozen apps demanding 200MB of storage,
          a signup with your email, and a "Pro Subscription" just to unlock the funny jokes.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          That is the old way.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          The new way is InsultBot—the lightweight, instant insult chatbot that lives on the web, not in your phone storage.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">The Rise of the Web-Based Insult Bot</h2>
        <div className="my-6 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80"
            alt="Fast browser-based AI chatbot - Instant loading insult bot on web"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Why is everyone switching to browser-based AI? Because speed is the ultimate punchline. When you are
          in the middle of a text battle or a discord argument, you don't have time to install an app.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          You need an <Link to="/" className="text-red-400 hover:underline">insult bot AI</Link> that loads instantly.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Our tool is hosted on Vercel, which means it uses "Edge Network" technology. In non-tech speak: it's fast.
          Ridiculously fast. You type a prompt, and the AI fires back a roast before you can even blink.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Test Driving the "Savage" Engine</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Unlike other bots that rely on recycled "yo mama" jokes from 2005, this insult chatbot is powered by modern
          LLMs (Large Language Models). This means it understands context.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Here is what happens when you use a modern insult bot AI:
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">It adapts:</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          It doesn't just call you "stupid"; it critiques your typing style.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">It's specific:</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          It targets the insecurity you didn't even know you had.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">It's creative:</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          It invents new insults that have never been said before.
        </p>

        <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-300">
            <strong className="text-red-400">Note:</strong> This is all in good fun. The AI is tuned for comedy,
            making it the perfect tool for friends, parties, and breaking the ice.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">3 Ways to Use This Insult Chatbot Today</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Since you don't need to sign up, you can start using it immediately for:
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">1. The "Fantasy Football" Loser Punishment</h3>
        <div className="my-4 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop&q=80"
            alt="Fantasy football group chat with insult bot AI - Fun roast generator use case"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Did someone in your league score zero points? Feed their stats into the insult bot AI and paste the result
          in the group chat. It's brutal, effective, and hilarious.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">2. The Tinder Bio Review</h3>
        <div className="my-4 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop&q=80"
            alt="Dating app profile review with AI insult bot - Creative chatbot use case"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Not getting matches? Maybe your bio is too earnest. Paste it into the bot and ask for a roast. The feedback
          will be harsh, but it might just be the reality check you need.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">3. The "Code Review"</h3>
        <div className="my-4 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop&q=80"
            alt="Developer code review with insult bot AI - Programming humor chatbot"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          For the developers out there: paste a snippet of your spaghetti code into the bot. If you think your senior
          dev is mean, wait until you hear what an AI thinks of your variable naming conventions.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Conclusion: Simplicity Wins</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          The internet is cluttered with bloatware. InsultBot is the antidote. It does one thing, and it does it perfectly:
          it makes you laugh.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          No downloads. No signups. Just pure, unadulterated roasting power.
        </p>

        <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
          >
            Try the Instant Insult Bot Now →
          </Link>
        </div>
      </>
    ),
  },
];

// Enhanced SEO hook with Article schema support
const usePageSEO = (title: string, description: string, articleSchema?: any) => {
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

    // Add Article schema if provided
    if (articleSchema) {
      let existingSchema = document.querySelector('script[type="application/ld+json"][data-article]');
      if (existingSchema) {
        existingSchema.remove();
      }
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-article', 'true');
      schemaScript.textContent = JSON.stringify(articleSchema);
      document.head.appendChild(schemaScript);
    }
  }, [title, description, articleSchema]);
};

const HomePage: React.FC = () => {
  usePageSEO(
    'Insult Chatbot: Free Brutal Insult Generator AI & Roast Maker',
    'Destroy your friends with the #1 brutal insult generator(chatbot) AI. Insult Bot by Batmeez Bot unleashes savage roasts, witty comebacks, and brutal burns.'
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
      try { source.stop(); } catch (e) { }
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

      if (!outputCtx) {
        throw new Error("Failed to initialize output audio context.");
      }

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
            if (!inputCtx) {
              throw new Error("Input audio context is not initialized.");
            }

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
            const parts = message.serverContent?.modelTurn?.parts;
            const base64Audio = parts && parts.length > 0 ? parts[0]?.inlineData?.data : undefined;

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
                try { src.stop(); } catch (e) { }
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
          {isConnected ? 'DISCONNECT (NIKLO)' : 'START CONVERSATION'}

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-y-auto">
      <header className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
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

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-6 pb-20">
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

const BlogPage: React.FC = () => {
  usePageSEO(
    'Insult Bot AI Blog | SEO Tips, Roast Ideas & Chatbot Strategies',
    'Discover SEO strategies, funny roast ideas, and content tips for insult bot AI applications. Learn how to rank your chatbot and drive traffic with expert blog posts.',
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'Insult Bot AI Blog',
      'description': 'SEO tips, roast ideas, and strategies for insult bot AI applications',
      'url': 'https://insultbot.vercel.app/blog',
      'publisher': {
        '@type': 'Organization',
        'name': 'InsultBot',
        'url': 'https://insultbot.vercel.app/',
      },
      'blogPost': blogPosts.map(post => ({
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.description,
        'url': `https://insultbot.vercel.app/blog/${post.slug}`,
        'datePublished': post.publishedDate,
        'author': {
          '@type': 'Organization',
          'name': 'InsultBot',
        },
        'keywords': post.keywords.join(', '),
      })),
    }
  );

  return (
    <PageShell
      title="Insult Bot AI Blog | SEO Tips, Roast Ideas & Chatbot Strategies"
      description="Discover SEO strategies, funny roast ideas, and content tips for insult bot AI applications. Learn how to rank your chatbot and drive traffic with expert blog posts."
      heading="Insult Bot AI Blog"
    >
      <p className="text-sm text-zinc-400 mb-6">
        Expert insights on SEO, content strategy, and growing your insult bot AI chatbot application.
      </p>
      <section className="grid gap-5 md:grid-cols-2">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-red-500 hover:shadow-[0_12px_40px_rgba(239,68,68,0.25)] transition"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-red-400">{post.category} • Rude Bot AI</p>
            <h2 className="mt-2 text-lg font-semibold text-zinc-50">
              <Link to={`/blog/${post.slug}`} className="hover:text-red-400 transition">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-zinc-300">{post.description}</p>
            <div className="mt-4 flex justify-between items-center text-sm text-red-300">
              <span>{post.readTime} • {post.category}</span>
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-red-400 hover:underline"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </section>
      <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-50 mb-2">Want to Try the Insult Bot?</h3>
        <p className="text-sm text-zinc-300 mb-3">
          Experience the AI-powered insult generator that's driving traffic to this blog.
          <Link to="/" className="text-red-400 hover:underline ml-1">Try Batmeez Bot now →</Link>
        </p>
      </div>
    </PageShell>
  );
};

// Individual Blog Post Page Component
const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <PageShell
        title="Blog Post Not Found | Insult Bot AI"
        description="The blog post you're looking for doesn't exist."
        heading="Post Not Found"
      >
        <p className="text-sm text-zinc-300">
          The blog post you're looking for doesn't exist.{' '}
          <Link to="/blog" className="text-red-400 hover:underline">
            View all blog posts →
          </Link>
        </p>
      </PageShell>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'url': `https://insultbot.vercel.app/blog/${post.slug}`,
    'datePublished': post.publishedDate,
    'dateModified': post.publishedDate,
    'author': {
      '@type': 'Organization',
      'name': 'InsultBot',
      'url': 'https://insultbot.vercel.app/',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'InsultBot',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://insultbot.vercel.app/og-image.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://insultbot.vercel.app/blog/${post.slug}`,
    },
    'keywords': post.keywords.join(', '),
    'articleSection': post.category,
    'inLanguage': 'en-US',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://insultbot.vercel.app/',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://insultbot.vercel.app/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `https://insultbot.vercel.app/blog/${post.slug}`,
      },
    ],
  };

  usePageSEO(post.title, post.description, articleSchema);

  useEffect(() => {
    // Add breadcrumb schema
    let existingBreadcrumb = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
    if (existingBreadcrumb) {
      existingBreadcrumb.remove();
    }
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-breadcrumb', 'true');
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);
  }, [slug]);

  return (
    <PageShell title={post.title} description={post.description} heading={post.title}>
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-zinc-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="hover:text-red-400">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/blog" className="hover:text-red-400">
              Blog
            </Link>
          </li>
          <li>/</li>
          <li className="text-zinc-400">{post.title}</li>
        </ol>
      </nav>

      {/* Article Meta */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-6">
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">{post.category}</span>
        <span>{post.readTime}</span>
        <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Article Content */}
      <article className="prose prose-invert max-w-none">
        {post.content}
      </article>

      {/* CTA Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
        <h3 className="text-xl font-semibold text-zinc-50 mb-2">Ready to Try the Insult Bot?</h3>
        <p className="text-sm text-zinc-300 mb-4">
          Experience the AI-powered chatbot that's driving traffic. Get roasted with witty comebacks and savage burns.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-semibold"
        >
          Try Batmeez Bot Now →
        </Link>
      </div>

      {/* Related Posts */}
      <div className="mt-8 pt-8 border-t border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-50 mb-4">More Blog Posts</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {blogPosts
            .filter((p) => p.slug !== slug)
            .map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                to={`/blog/${relatedPost.slug}`}
                className="block p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-red-500 transition"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-red-400 mb-1">
                  {relatedPost.category}
                </p>
                <h4 className="text-sm font-semibold text-zinc-50 hover:text-red-400">
                  {relatedPost.title}
                </h4>
              </Link>
            ))}
        </div>
      </div>
    </PageShell>
  );
};

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
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;