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
    slug: 'seo-playbook',
    title: 'Insult Bot SEO Playbook: How to Rank for "Rude Bot AI" Keywords',
    description: 'Learn how BatMeez Bot ranks for "insult bot AI", "rude bot chatbot", and "funny insult generator" using schema markup, fast hosting, and strategic internal linking.',
    category: 'SEO',
    readTime: '5 min read',
    publishedDate: '2024-01-15',
    keywords: ['insult bot AI', 'rude bot chatbot', 'SEO strategy', 'schema markup'],
    content: (
      <>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          How BatMeez Bot ranks for "insult bot AI", "rude bot chatbot", and "funny insult generator"
          using schema, fast Vercel hosting, and internal links to the homepage, About, and API pages.
        </p>
        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">Key SEO Strategies</h3>
        <ul className="space-y-2 text-sm text-zinc-200 list-disc pl-6 mb-4">
          <li>WebPage + SoftwareApplication JSON-LD for clear entity signals</li>
          <li>FAQPage schema to earn rich results on Q&A queries</li>
          <li>Sitemap + robots.txt pointing Google to key URLs</li>
          <li>Internal links back to Home, About, and API pages</li>
          <li>Mobile-first responsive design for better rankings</li>
          <li>Fast page load times with optimized assets</li>
        </ul>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Keep content fast, mobile-friendly, and keyword-natural—Google rewards speed and clarity.
          The insult bot AI market is competitive, but with proper schema markup and strategic content,
          you can capture high-intent traffic looking for entertainment chatbots.
        </p>
        <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-300 mb-2">
            <strong className="text-red-400">Pro Tip:</strong> Use long-tail keywords like "free insult bot AI" 
            and "rude chatbot generator" to capture specific search intent and drive qualified traffic 
            to your chatbot application.
          </p>
        </div>
      </>
    ),
  },
  {
    slug: 'funny-roasts',
    title: '25 Funny, Safe Roast Lines for Your Insult Bot AI',
    description: 'Click-worthy, share-friendly roast ideas in Hinglish and English that show off the insult bot personality while keeping things playful and safe.',
    category: 'Content',
    readTime: '4 min read',
    publishedDate: '2024-01-10',
    keywords: ['funny roasts', 'insult generator', 'roast lines', 'Hinglish insults'],
    content: (
      <>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Click-worthy, share-friendly roast ideas in Hinglish and English that show off the insult bot
          personality while keeping things playful and safe.
        </p>
        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">Top Roast Lines</h3>
        <ul className="space-y-2 text-sm text-zinc-200 list-disc pl-6 mb-4">
          <li>"Internet slow? Ya dimaag 2G pe atka hua hai?"</li>
          <li>"Confidence download karle, warna main hi update bhej doon?"</li>
          <li>"Brain ka RAM free kar—background mein drama chal raha hai."</li>
          <li>"Itni der kyun? Google pe khoye the ya life pe?"</li>
          <li>"Teri battery low hai, aur tu power-saver mode mein bhi boring hai."</li>
          <li>"Tujhe lagta hai tu smart hai? Calculator bhi smart hota hai."</li>
          <li>"Confidence level: -100. Self-esteem: Missing in action."</li>
          <li>"Teri personality offline hai, aur tu online bhi boring hai."</li>
        </ul>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Open the mic on the <Link className="text-red-400 hover:underline" to="/">Insult Bot AI homepage</Link> or
          read the <Link className="text-red-400 hover:underline" to="/about">About page</Link> to learn how BatMeez crafts safe roasts.
        </p>
        <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-300">
            <strong className="text-red-400">Remember:</strong> These roasts are designed for entertainment. 
            Always keep content playful and avoid anything that could be genuinely hurtful. The goal is 
            humor, not harm.
          </p>
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