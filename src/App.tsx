import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData, createBlob } from '../utils/audio';
import { SYSTEM_INSTRUCTION, MODEL_NAME, VOICE_NAME } from '../constants';
import { Visualizer } from '../components/Visualizer';

// Cookie Consent Banner Component
const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent');
    if (hasConsent) {
      setConsentGiven(true);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem('cookie-consent', 'all');
    setConsentGiven(true);
    setShowBanner(false);
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setConsentGiven(true);
    setShowBanner(false);
  };

  if (!showBanner || consentGiven) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 p-4 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-zinc-300 mb-2">
              <strong className="text-zinc-100">Cookie Notice:</strong> We use cookies to enhance your experience and serve personalized ads. By continuing to use this site, you agree to our use of cookies.
            </p>
            <p className="text-xs text-zinc-400">
              <Link to="/cookies" className="text-red-400 hover:underline">Learn more about our Cookie Policy</Link>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={acceptEssentialOnly}
              className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAllCookies}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
            src="https://media.istockphoto.com/id/1202287108/photo/gold-wooden-hand-model-showing-middle-finger-isolated-on-a-white-background.jpg?s=612x612&w=0&k=20&c=4V6QWvX6jQRl-o8JnG5Va7FE9oqKDryQxC2vhQ3NZcA="
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
            src="https://media.istockphoto.com/id/644613898/photo/terrorism-in-the-future.jpg?s=612x612&w=0&k=20&c=-q7UhB4218o1Zj_Y479ssLvv9Gxm8Crh4uM2auMlJkI="
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
            src="https://media.istockphoto.com/id/585509432/photo/angry-man.jpg?s=612x612&w=0&k=20&c=eSyqwuvQXhiQN7ATzfmgMuNa8_Y7SIsuyPusMUqaiYk="
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
            src="https://media.istockphoto.com/id/513728445/photo/robot-as-devil.jpg?s=612x612&w=0&k=20&c=4XG_vE4raJtY5KMPoOcz-7ZFRk0NZTVETlJ6wIhv8oM="
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
            src="https://media.istockphoto.com/id/1501905892/photo/real-robotic-hand-giving-the-middle-finger-against-grey-background-concepts-of-ai-takover-and.jpg?s=612x612&w=0&k=20&c=P0y0pLwc0zRI3NhDd6smg8j3Z-ATvwdJEdoLA2q6b4c="
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
            src="https://media.istockphoto.com/id/946295840/photo/queen-cyborg-portrait.jpg?s=612x612&w=0&k=20&c=eDioa7JH27QcfVdPSUijlXUOI0XxR7O3vjEG2TqGjcw="
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
            src="https://media.istockphoto.com/id/1179599224/photo/robot-hand-show-middle-finger-on-blue-background.jpg?s=612x612&w=0&k=20&c=_jYAYLXnYCSqlhzoAo2t7Vd3G6zs4yD6eO2-jHyOocw="
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
  {
    slug: 'unleash-inner-comedian-insult-maker',
    title: 'Unleash Your Inner Comedian with Our Insult Maker',
    description: 'Create hilarious insults on the fly with our insult maker chatbot! Let the roasting begin with just a few clicks. Try it now!',
    category: 'Entertainment',
    readTime: '7 min read',
    publishedDate: '2024-01-22',
    keywords: ['insult maker', 'comedy generator', 'roast creator', 'funny insults', 'AI humor'],
    content: (
      <>
        <div className="my-8 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="/assets/istockphoto-1180659653-1024x1024.jpg"
            alt="Comedy stage spotlight - Professional insult maker for entertainment"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-6 mb-4">The Art of Modern Insult Making</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Remember the days of generic "yo mama" jokes and recycled playground insults? Those days are over.
          Welcome to the golden age of digital comedy, where our advanced <Link to="/" className="text-red-400 hover:underline">insult maker</Link>
          is revolutionizing how we think about humor and entertainment.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          In today's fast-paced digital world, comedy has evolved. What once required quick wit and years of
          stand-up experience can now be accessed instantly through cutting-edge AI technology. Our insult maker
          isn't just a random insult generator—it's your personal comedy writer, roast master, and humor coach
          all rolled into one sleek interface.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">What Makes Our Insult Maker Different?</h2>
        <div className="my-6 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="/assets/istockphoto-1479620056-1024x1024.jpg"
            alt="Advanced AI technology powering modern insult maker - Neural network visualization"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Unlike basic insult generators that simply pull from a static database of pre-written lines, our
          insult maker uses state-of-the-art language models to understand context, nuance, and comedic timing.
          Here's what sets it apart:
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">🧠 Contextual Intelligence</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Our AI doesn't just throw random insults—it analyzes your input, understands the situation, and crafts
          responses that are actually relevant. Whether you're roasting someone's terrible taste in movies or
          playfully mocking a friend's gaming skills, the insults hit differently because they make sense.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">🎭 Comedic Timing</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Great comedy isn't just about what you say—it's about when and how you say it. Our insult maker has been
          trained on thousands of hours of stand-up comedy, roast battles, and witty banter to understand the
          rhythm and timing that makes humor work.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">🔄 Endless Creativity</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Never run out of material again. Each interaction generates unique, original content that you won't
          find anywhere else. The AI combines different comedic styles, references, and structures to create
          insults that are genuinely funny and surprisingly clever.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">The Technology Behind the Laughter</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          At the heart of our insult maker lies sophisticated machine learning architecture that processes natural
          language with remarkable precision. But what does that mean for you as a user?
        </p>

        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <h4 className="text-lg font-semibold text-red-400 mb-3">Lightning-Fast Responses</h4>
            <p className="text-sm text-zinc-300">
              Powered by Vercel's edge network, our insult maker delivers witty comebacks in milliseconds.
              No awkward waiting—just instant comedic gratification.
            </p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <h4 className="text-lg font-semibold text-red-400 mb-3">Adaptive Learning</h4>
            <p className="text-sm text-zinc-300">
              The system continuously improves based on user interactions, getting better at understanding
              what makes people laugh and refining its comedic style.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Real-World Applications of Your Insult Maker</h2>
        <div className="my-6 rounded-lg overflow-hidden border border-zinc-800">
          <img
            src="/assets/istockphoto-1479619444-1024x1024.jpg"
            alt="Friends having fun with insult maker - Social entertainment and bonding"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">🎮 Gaming Communities</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Level up your trash talk game. Whether you're dominating in FPS games or strategizing in multiplayer
          battles, our insult maker helps you craft the perfect roast for your opponents (and allies) that's
          funny without being toxic.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">💼 Team Building & Ice Breakers</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Who says corporate events have to be boring? Use the insult maker for team-building exercises that
          actually work. Nothing brings people together like shared laughter and playful roasting sessions.
        </p>

        <h3 className="text-xl font-semibold text-zinc-50 mt-6 mb-3">📱 Content Creation</h3>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Social media creators, podcasters, and YouTubers can use our insult maker to generate content ideas,
          create engaging segments, or add humor to their productions. It's like having a team of comedy writers
          on demand.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">The Psychology of Why We Love Roasting</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          There's a reason roast battles have been a comedy staple for decades. When done right, playful
          insulting strengthens bonds, builds confidence, and creates memorable shared experiences. Our insult
          maker taps into this fundamental aspect of human interaction.
        </p>

        <div className="my-6 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
          <h4 className="text-lg font-semibold text-zinc-50 mb-3">The Science Behind the Laughter</h4>
          <p className="text-sm text-zinc-300 mb-3">
            Research shows that humor and playful teasing trigger the release of endorphins, strengthening
            social bonds and reducing stress. Our insult maker creates these positive social experiences in a
            safe, controlled environment.
          </p>
          <p className="text-sm text-zinc-300">
            The key is consent and context—everyone knows it's all in good fun, which makes the roasts more
            enjoyable and less likely to cause actual offense.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Getting Started with Your Insult Maker</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Ready to dive into the world of AI-powered comedy? Getting started is easier than you think:
        </p>

        <div className="my-6 space-y-4">
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Start a Conversation</h4>
              <p className="text-sm text-zinc-300">Simply click the start button and begin chatting with your personal insult maker.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Set the Context</h4>
              <p className="text-sm text-zinc-300">Tell the AI what you want to roast—your friend's terrible cooking, your own bad decisions, anything goes.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Enjoy the Laughs</h4>
              <p className="text-sm text-zinc-300">Share the results with friends, use them in your content, or just enjoy the private comedy show.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Safety and Responsible Use</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          While our insult maker is designed for entertainment, we believe in responsible comedy. The AI is
          programmed to avoid genuinely harmful content, hate speech, and bullying. Think of it as the
          difference between a friendly roast at a comedy club and actual harassment—it's all about intent,
          context, and consent.
        </p>

        <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-300">
            <strong className="text-red-400">Golden Rule:</strong> Use your insult maker to spread laughter, not tears.
            The best comedy brings people together, even when it's at someone's expense.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">The Future of Digital Comedy</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          As AI technology continues to evolve, so will our insult maker. We're constantly working on new features,
          improved comedic timing, and better understanding of cultural nuances. The future might include:
        </p>

        <ul className="my-4 space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>Voice integration for real-time roast battles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>Personalized comedy styles based on your preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>Multi-language support for global humor</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>Integration with social media platforms</span>
          </li>
        </ul>

        <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4">Ready to Unleash Your Inner Comedian?</h2>
          <p className="text-sm leading-relaxed text-zinc-200 mb-4">
            Stop settling for boring conversations and generic humor. Our insult maker is your ticket to becoming
            the funniest person in any room—virtual or real.
          </p>
          <p className="text-sm leading-relaxed text-zinc-200 mb-4">
            Whether you're looking to entertain friends, create engaging content, or just need a good laugh,
            our AI-powered insult maker is here to help you find your funny bone.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
          >
            Start Roasting with the Ultimate Insult Maker →
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'roast-my-code',
    title: 'Roast My Code: Get Your Programming Brutally Judged by AI',
    description: 'Let AI roast your code with brutal, funny feedback on bad variable names, spaghetti logic, and copy-pasted Stack Overflow snippets. Free, no signup.',
    category: 'Development',
    readTime: '7 min read',
    publishedDate: '2024-01-25',
    keywords: ['roast my code', 'ai roast my code', 'code roast generator', 'roast my code online', 'programmer roast bot', 'funny code review ai'],
    content: (
      <>
        <h2 className="text-2xl font-bold text-zinc-50 mt-6 mb-4">You Already Know Your Code Isn't Clean</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          You wrote it at 2 AM, you named a variable <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">temp2FinalACTUAL</code>, and there's a comment that just says <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">// don't touch this, idk why it works</code>. You don't need a code review. You need someone to say it out loud.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          That's what a <strong className="text-zinc-50">code roast</strong> is: instead of a polite senior dev softening feedback with "have you considered refactoring this," an AI roast generator just tells you your function is a war crime and moves on. It's <em>Roast My Code</em> — feed it a snippet, a language, or just a vibe, and let the AI go feral on your programming choices.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">What "Roast My Code" Actually Means</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          "Roast my code" is exactly what it sounds like: you hand over some code (or describe what it does) and an AI generates savage, funny, brutally honest commentary on it — your naming conventions, your nesting depth, your total disregard for error handling, all of it. No actual code analysis tools flag your <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">try/catch</code> block as "emotional avoidance," but an insult-trained AI absolutely will.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          It's part of a growing trend of programmers using AI for comedy instead of just autocomplete — roasting your own git history, your commit messages, your 47-line function that could've been a one-liner. It's the developer version of "roast me," and it's popular for one simple reason: <strong className="text-zinc-50">everyone's code is bad at 2 AM, and it's funnier to laugh about it than pretend otherwise.</strong>
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Why Getting Roasted Is Weirdly Useful</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Beyond the laughs, a code roast does something real code reviews rarely do — it makes bad patterns <em>memorable</em>. Nobody forgets the time an AI called their 12-nested-if-statement "a decision tree grown by someone afraid of committing to anything." You will remember that. You will refactor because of that. Shame is a surprisingly effective teacher.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          It's also just a good icebreaker for dev teams. Paste a teammate's gnarliest legacy function into a roast generator during a retro and watch morale either skyrocket or the room go silent. Either way, it's memorable.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Sample AI Code Roasts</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">Here's what you can expect the AI to say once you paste in a snippet:</p>
        <div className="my-6 space-y-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"You named three different variables <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">data</code>, <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">data2</code>, and <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">dataFinal</code>. Nothing about any of them is final. Nothing about any of this is fine."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"This function has more nested <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">if</code> statements than a Russian nesting doll factory, and about as much documentation as one too."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"You wrote 40 lines to do what one list comprehension does, and there's <em>still</em> an off-by-one bug in there. Impressive, in the way a car crash is impressive."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"I've seen ransom notes with more consistent formatting than this indentation."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"Congratulations, you've reinvented a for-loop and called it <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">recursiveHelperUtilFn_v2</code>. Your ancestors invented the wheel. You reinvented a worse wheel, slower, and gave it a longer name."</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">How to Roast Your Code in 3 Steps</h2>
        <div className="my-6 space-y-4">
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Copy your snippet (or just describe it)</h4>
              <p className="text-sm text-zinc-300">You don't need clean formatting; the messier it looks, the better material the AI has to work with.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Paste it into the Insult Chatbot</h4>
              <p className="text-sm text-zinc-300">Ask it to roast your code specifically — mention the language if you want language-specific burns (Python devs get roasted differently than people still writing raw PHP in 2026).</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Read it, laugh, then maybe actually fix the thing</h4>
              <p className="text-sm text-zinc-300">That part's optional but recommended.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">What Makes a Good Code Roast</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">The best code roasts aren't just "your code bad" — they're specific. A good AI roast picks on:</p>
        <ul className="my-4 space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong className="text-zinc-50">Naming</strong> (single-letter variables outside of loop counters, anything named <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">temp</code> that's clearly permanent)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong className="text-zinc-50">Structure</strong> (deep nesting, functions doing five unrelated things, 500-line files called <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">utils.js</code>)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong className="text-zinc-50">Habits</strong> (copy-pasted Stack Overflow answers with the original commented-out attempt still sitting above it, commit messages that just say "fix")</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong className="text-zinc-50">Overengineering or underengineering</strong> (a factory pattern for a function that adds two numbers, or a single 300-line function with zero abstractions)</span>
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          If you're building the muscle to roast your own code before an AI does it for you — that's basically just... code review. Don't tell anyone we said that.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">FAQ</h2>
        <div className="my-6 space-y-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Is there a free AI tool that roasts my code?</h4>
            <p className="text-sm text-zinc-300">Yes — the Insult Chatbot generates code-specific roasts for free, with no signup required. Just paste your snippet and ask it to roast your programming.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Does the AI actually analyze my code for bugs?</h4>
            <p className="text-sm text-zinc-300">No — this is a comedy tool, not a linter or static analysis tool. It reacts to what you paste like a savage AI comedian, not like ESLint. Use it for laughs, not for production code review.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Can I use this for a specific language like Python, JavaScript, or Java?</h4>
            <p className="text-sm text-zinc-300">Yes. Mention your language when you ask for the roast and the AI will tailor jokes to language-specific stereotypes (yes, it knows about JavaScript's <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">==</code> vs <code className="bg-zinc-800 px-1 py-0.5 rounded text-red-400">===</code> problem).</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Is roasting code with AI actually good practice for teams?</h4>
            <p className="text-sm text-zinc-300">As a serious code-quality tool, no. As a low-stakes way to make a retro or standup funnier and get people talking about messy legacy code without it feeling like a personal attack, it works surprisingly well.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Will it roast someone else's code, or just mine?</h4>
            <p className="text-sm text-zinc-300">Either — paste any code you have permission to share and ask for a roast. Just keep it to code, not people.</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4">Ready to See What the AI Thinks of Your Function Names?</h2>
          <p className="text-sm leading-relaxed text-zinc-200 mb-4">
            Feed your code to the insult generator and prepare for brutal honesty.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
          >
            Try the Insult Chatbot →
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'funny-ai-insults-for-friends',
    title: 'Funny AI Insults for Friends: Roast Your Squad Without the Awkwardness',
    description: 'Get funny AI-generated insults built for roasting your friends — group chat ready, no signup, and way less awkward than writing your own.',
    category: 'Entertainment',
    readTime: '6 min read',
    publishedDate: '2024-01-26',
    keywords: ['funny ai insults for friends', 'ai insults for friends', 'funny insults generator for friends', 'roast my friend ai', 'ai roast generator for friends', 'insult my friends generator'],
    content: (
      <>
        <h2 className="text-2xl font-bold text-zinc-50 mt-6 mb-4">Roasting Your Friends Is a Love Language</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Coming up with something actually funny on the spot, before the group chat moves on to the next topic, is a skill most people don't have. That's the gap an AI insult generator fills — it does the improv for you, and it's <em>good</em> at it, because it's not worried about the friendship surviving the joke.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          If you've ever typed "you're so—" into a group chat and then just stared at the screen for ten seconds with nothing, this is the tool for that exact moment.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">What Counts as a "Friend Roast"?</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          A friend roast is different from a generic insult in one important way: it's meant to land soft enough to be funny, not hard enough to end a friendship. Good friend-roast material usually pokes at things everyone already knows and jokes about — someone's terrible taste in movies, their inability to be on time, their weird obsession with one specific snack, their 0-and-12 record in fantasy football.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          An AI insult generator built for this use case leans into "affectionate savage" rather than "actually cruel." It's the difference between a joke that gets sent back with a laughing emoji and one that gets you muted.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Why AI Insults Land Better With Friends Than the Ones You'd Write Yourself</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">Three reasons people reach for a generator instead of freestyling:</p>
        <div className="my-6 space-y-4">
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Speed</h4>
              <p className="text-sm text-zinc-300">The best roast in a group chat is the fastest one. By the time you've thought of something clever, the conversation has moved on. An AI generates one in seconds.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Deniability</h4>
              <p className="text-sm text-zinc-300">"The AI said it, not me" is a real social shield. You get to send something savage while technically outsourcing the blame.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Range</h4>
              <p className="text-sm text-zinc-300">Everyone has three go-to insults they reuse constantly. An AI has effectively unlimited material, so your friend group doesn't get the same "you're built like a Wi-Fi router in the corner of a basement" joke for the fortieth time.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Sample AI Insults for Friends</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">Here's the kind of thing you'll get when you ask for a friend-safe roast:</p>
        <div className="my-6 space-y-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"You're the human version of a phone at 1% battery — always about to shut down mid-conversation, and somehow still surprised every time."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"You've been 'about to leave' for 45 minutes. At this point you're not late, you're a resident."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"Your fantasy football team has the energy of someone who drafted based on vibes and lost every week since."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"You text 'lol' at everything and it's honestly starting to feel like a cry for help."</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">"You've rewatched the same three shows for two years. Not because they're good — because trying something new requires effort you don't have."</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          Notice none of these are actually mean — they're specific, exaggerated, and clearly a bit. That's the formula.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">How to Generate Insults for Your Friends in Seconds</h2>
        <div className="my-6 space-y-4">
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Open the Insult Chatbot</h4>
              <p className="text-sm text-zinc-300">No signup, no app download.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Tell it who you're roasting</h4>
              <p className="text-sm text-zinc-300">Mention one or two things about them (chronically late, obsessed with a show, terrible at video games — whatever's true and funny).</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-zinc-50 mb-2">Copy the roast straight into the group chat</h4>
              <p className="text-sm text-zinc-300">Adjust the intensity if you want it milder or savager — the AI will match the tone you ask for.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">Roast Etiquette: Keeping It Funny, Not Mean</h2>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          A friend roast works when it's about something silly and low-stakes, not something someone's actually insecure about. Good targets: lateness, fantasy sports records, questionable fashion choices, being bad at a specific game. Bad targets: appearance insecurities, actual personal struggles, anything someone's asked you not to joke about. The AI will follow your lead — feed it silly, low-stakes material and it'll roast in that register. Feed it something genuinely sensitive and you're the one who made that call, not the bot.
        </p>
        <p className="text-sm leading-relaxed text-zinc-200 mb-4">
          The best test: if you wouldn't say it to their face and laugh together after, don't send it either.
        </p>

        <h2 className="text-2xl font-bold text-zinc-50 mt-8 mb-4">FAQ</h2>
        <div className="my-6 space-y-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Is there a free tool that generates insults for friends?</h4>
            <p className="text-sm text-zinc-300">Yes — the Insult Chatbot generates friend-safe roasts for free, instantly, with no account needed.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Can I make the insults milder or more savage?</h4>
            <p className="text-sm text-zinc-300">Yes. Just tell it the tone you want — "keep it light" or "go brutal" both work, and it'll adjust.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Will the AI insult based on personal details I give it?</h4>
            <p className="text-sm text-zinc-300">You can mention traits or habits (chronically late, bad at a game, obsessed with a show) and it'll build the roast around those specifics rather than generic insults.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">Is this good for roasting someone on their birthday?</h4>
            <p className="text-sm text-zinc-300">It's a common use case — a personalized, funny roast is a popular alternative to a sincere birthday message, especially in close friend groups that roast each other regularly.</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="font-semibold text-zinc-50 mb-2">What if my friend group doesn't roast each other like that?</h4>
            <p className="text-sm text-zinc-300">Read the room first. This works great for groups that already joke around; it's not a great icebreaker for a friend group that doesn't already roast each other.</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-zinc-900/50 rounded-lg border border-red-500/30">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4">Need Ammunition for the Group Chat?</h2>
          <p className="text-sm leading-relaxed text-zinc-200 mb-4">
            Get funny, friend-safe roasts instantly.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
          >
            Try the Insult Chatbot →
          </Link>
          <div className="mt-4">
            <p className="text-sm text-zinc-300 mb-2">Or if it's your own code that needs judging, not your friends:</p>
            <Link
              to="/blog/roast-my-code"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition text-sm font-semibold border border-zinc-700"
            >
              Roast My Code →
            </Link>
          </div>
        </div>
      </>
    ),
  },
];

// Enhanced SEO hook with Article schema support and canonical URL
const usePageSEO = (title: string, description: string, canonicalUrl?: string, articleSchema?: any) => {
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

    // Update canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
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
  }, [title, description, canonicalUrl, articleSchema]);
};

const HomePage: React.FC = () => {
  usePageSEO(
    'Insult Chatbot: Free Brutal Insult Generator AI & Roast Maker',
    'Insult Chatbot AI that generates savage roasts, witty comebacks, and brutal burns instantly. Try the free insult chatbot now for hilarious AI‑powered banter.',
    'https://insult-chatbot.vercel.app/'
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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
    <>
      {/* Hero Section - Exactly 100vh */}
      <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">

        {/* Header */}
        <header className="w-full max-w-2xl text-center space-y-2 mt-6 sm:mt-12">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 uppercase drop-shadow-lg">
            Insult Chatbot
          </h1>

          {/* Simple nav to SEO pages */}
          <nav className="mt-3 sm:mt-4 flex justify-center gap-3 sm:gap-4 text-xs text-zinc-500 uppercase tracking-wide flex-wrap">
            <Link to="/blog" className="hover:text-red-400">Blog</Link>
            <Link to="/about" className="hover:text-red-400">About</Link>
            <Link to="/privacy" className="hover:text-red-400">Privacy</Link>
            <Link to="/terms" className="hover:text-red-400">Terms</Link>
            <Link to="/cookies" className="hover:text-red-400">Cookies</Link>
            <Link to="/contact" className="hover:text-red-400">Contact</Link>
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
              group relative px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg tracking-wider transition-all duration-300
              ${isConnected
                ? 'bg-zinc-900 text-red-500 border-2 border-red-900 hover:bg-red-950 hover:border-red-700 shadow-[0_0_20px_rgba(127,29,29,0.4)]'
                : 'bg-gradient-to-br from-red-600 to-red-900 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
            `}
          >
            {isConnected ? 'DISCONNECT (Shut Up)' : 'START CONVERSATION'}

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

        {/* Small hero warning */}
        <div className="w-full max-w-2xl text-center pb-3 sm:pb-6 opacity-40">
          <p className="text-[10px] sm:text-xs text-zinc-500 font-mono px-2">
            WARNING: THIS AI IS PROGRAMMED TO BE INSULTING. DO NOT USE IF SENSITIVE.
          </p>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 py-10 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-4">
              About Insult Chatbot AI
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
          </div>

          {/* Content Cards */}
          <div className="space-y-8 mb-16">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-zinc-700/50 shadow-xl hover:border-red-500/50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-50 mb-2 sm:mb-4">What is an Insult Chatbot?</h3>
                  <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
                    It’s a different kind of bot, one that dishes out sharp jokes instead of helpful answers.
                    It’s not made to assist but to serve quick, punchy remarks with a bit of attitude.
                    Humor is the main focus here—dry, bold, and sometimes unexpectedly clever.
                    It responds with style, trading kindness for fast wit.
                    The result is a chat that's funny just enough to make you smile.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-zinc-700/50 shadow-xl hover:border-red-500/50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-50 mb-2 sm:mb-4">
                    Insult Chatbot Technology Explained?</h3>
                  <p className="text-zinc-300 leading-relaxed text-base sm:text-lg mb-4">
                    A twist of code learns laughs, picking up sass through endless jokes fed during training.
                    As you speak, one sharp reply forms - shaped by what you said, quick but never slow.
                    Each answer snaps into place because timing matters just as much as the tease.
                    Cleverness sneaks in, not forced, riding rhythm more than rules.
                  </p>
                  <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
                    A twist in how machines learn means they now catch the mood of what you say,
                    shifting their teasing tone depending on how you respond.
                    What comes next changes every time, shaped by the way you talk back.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-zinc-700/50 shadow-xl hover:border-red-500/50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-50 mb-2 sm:mb-4">Insult Ai Chatbot Reasons?</h3>
                  <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
                    Though built to mock, this AI Chatbot finds real work online.
                    Content makers drop it into videos across platforms.
                    Programmers weave it into games that react.
                    Teachers hand it to students learning machine thinking.
                    Laughter opens doors to deeper understanding of word patterns.
                    Fun hides lessons in every sarcastic reply.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-10 sm:mt-16">
            <div className="text-center mb-6 sm:mb-12">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-zinc-50 mb-4">Frequently Asked Questions</h3>
              <p className="text-zinc-400 text-lg">Got questions? Click to expand and find answers.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What makes an insult chatbot different from regular chatbots?",
                  a: "It jokes around, then suddenly you’re rethinking everything. Not built for help, just humor - They are being rude rather than solving the problem. While others try to fix things, this one leans into punchlines. Help isn’t the goal here; laughs are. Seriousness gets tossed aside every time. What counts most isn’t honesty but how it sounds. Who you seem to be drowns out why you’re there. Laughter leads, leaving value trailing behind. Mocking shapes every message on purpose. Sharp remarks pour out like they grew up on forums. Not about helping - it’s joy found in quick, biting words."
                },
                {
                  q: "Is it safe to use an insult chatbot?",
                  a: "A joke-driven Chatbot can stay harmless if people handle it right. Built-in guards usually block anything truly toxic. Still, laughter isn’t a free pass to cross lines. The machine tosses taunts just for fun, nothing more. Anyone using it ought to keep things light. Sharp words might seem clever until someone feels crushed through this chatbot. Playfulness fades fast when pain shows up."
                },
                {
                  q: "Can I customize an insult AI Chatbot's personality?",
                  a: "Harshness levels? Those can sometimes slide into funnier territory, depending on the chatbot. One version learns patterns - changes its rhythm when facing different users. Not every setup offers freedom though; some lock down options tight, others throw the doors wide. contact me for customization or making entire chatbot on your own name and your own customization."

                },
                {
                  q: "How do developers creates an insult chatbot?",
                  a: "Building a chatbot that throws insults means knowing how to work with language software, learning systems, and talk-style programming. Usually, coders adjust big text predictors using funny examples, add guardrails to block harmful output, then shape the back-and-forth to stay amusing without crossing lines. I can create many chatbots like this one, If you are interested then contact me now."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden transition-all duration-300 hover:border-red-500/50"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm sm:text-lg font-semibold text-zinc-50 pr-4 group-hover:text-red-400 transition-colors">
                      {faq.q}
                    </span>
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30 group-hover:bg-red-500/30 transition-all">
                      <svg
                        className={`w-5 h-5 text-red-400 transition-transform duration-300 ${openFAQ === index ? 'rotate-45' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-5 pt-0">
                      <div className="pt-4 border-t border-zinc-700/50">
                        <p className="text-zinc-300 leading-relaxed text-base">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Site Footer ── */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

            {/* Brand */}
            <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 uppercase">
                  Insult Generating AI
                </span>
              </Link>
              <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                The internet's most unapologetically funny AI chatbot. Powered by Google Gemini.
                Free, fast, and savage — all in good fun.
              </p>
              <a
                href="mailto:codesmithnazim@gmail.com"
                className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition"
              >
                ✉️ codesmithnazim@gmail.com
              </a>
            </div>

            {/* Navigation */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-zinc-100 font-semibold uppercase tracking-wider text-xs mb-4">Navigation</h4>
              <ul className="space-y-2.5">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/blog', label: 'Blog' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-red-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-zinc-100 font-semibold uppercase tracking-wider text-xs mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms of Use' },
                  { to: '/cookies', label: 'Cookie Policy' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-red-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About the bot */}
            <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="text-zinc-100 font-semibold uppercase tracking-wider text-xs mb-4">About the Bot</h4>
              <ul className="space-y-2.5 text-zinc-500 text-xs leading-relaxed">
                <li className="flex items-center justify-center lg:justify-start gap-2"><span className="text-red-400">🤖</span><span>Powered by Google Gemini Live</span></li>
                <li className="flex items-center justify-center lg:justify-start gap-2"><span className="text-red-400">⚡</span><span>Hosted on Vercel Edge Network</span></li>
                <li className="flex items-center justify-center lg:justify-start gap-2"><span className="text-red-400">🎤</span><span>Real-time voice conversations</span></li>
                <li className="flex items-center justify-center lg:justify-start gap-2"><span className="text-red-400">🔒</span><span>No login or signup required</span></li>
                <li className="flex items-center justify-center lg:justify-start gap-2"><span className="text-red-400">🛡️</span><span>Safe, consensual comedy only</span></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/60 px-4 py-4 sm:px-6 sm:py-5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Insult Chatbot . All rights reserved. For entertainment purposes only.
            </p>
            <p className="text-xs text-zinc-700 font-mono">
              ⚠️ AI-generated content. Not responsible for bruised egos.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

// ----- Static SEO Pages -----

const PageShell: React.FC<{ title: string; description: string; heading: string; canonicalUrl?: string; children: React.ReactNode }> = ({
  title,
  description,
  heading,
  canonicalUrl,
  children,
}) => {
  usePageSEO(title, description, canonicalUrl);
  const pathname = window.location.pathname;

  const navLinks = [
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' },
    { to: '/cookies', label: 'Cookies' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/80 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 min-h-14 py-2 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          <Link
            to="/"
            className="flex-shrink-0 text-base font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 uppercase hover:opacity-80 transition-opacity"
          >
            Insult Chatbot
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-end">
            {navLinks.map(({ to, label }) => {
              const isActive = pathname === to || pathname.startsWith(to + '/');
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium uppercase tracking-wide transition-all ${isActive
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 space-y-6 pb-20">
        <h1 className="text-3xl font-extrabold tracking-tight">{heading}</h1>
        {children}
        <p className="pt-6 text-xs text-zinc-500">
          Ready for more savage roasts?{' '}
          <Link to="/" className="text-red-400 hover:underline">
            Go back to the Insult Chatbot AI →
          </Link>
        </p>
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Insult Chatbot AI. All rights reserved. For entertainment purposes only.
          </p>
          <div className="flex gap-4 text-xs text-zinc-700">
            <Link to="/privacy" className="hover:text-red-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-red-400 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-red-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const BlogPage: React.FC = () => {
  usePageSEO(
    'Insult Chatbot Blog — Roast Tips, AI Humor & Savage Comeback Ideas',
    'Discover SEO strategies, funny roast ideas, and content tips for insult bot AI applications. Learn how to rank your chatbot and drive traffic with expert blog posts.',
    'https://insult-chatbot.vercel.app/blog',
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'Insult Bot AI Blog',
      'description': 'Insult Chatbot AI that generates savage roasts, witty comebacks, and brutal burns instantly. Try the free insult chatbot now for hilarious AI‑powered banter.',
      'url': 'https://insult-chatbot.vercel.app/blog',
      'publisher': {
        '@type': 'Organization',
        'name': 'InsultBot',
        'url': 'https://insult-chatbot.vercel.app/',
      },
      'blogPost': blogPosts.map(post => ({
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.description,
        'url': `https://insult-chatbot.vercel.app/blog/${post.slug}`,
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
      title="Insult Chatbot Blog — Roast Tips, AI Humor & Savage Comeback Ideas"
      description="Insult Chatbot AI that generates savage roasts, witty comebacks, and brutal burns instantly. Try the free insult chatbot now for hilarious AI‑powered banter."
      heading="Insult Bot AI Blog"
    >
      <p className="text-sm text-zinc-400 mb-6">
        Explore roast guides, savage comeback ideas, and AI humor tips
        from the team behind Insult Chatbot. Learn how to roast better
        with AI. Updated regularly. 🔥      </p>
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

// Sticky Bottom Bar Component for Blog Posts
const StickyBottomBar: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 p-4 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-300">
          Curious what it'd say about you? Try it live →
        </p>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Try Now
          </Link>
          <button
            onClick={onDismiss}
            className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Prominent Notification Component for Blog Posts
const BlogNotification: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 7000); // 7 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-2xl p-6 max-w-sm border border-red-500/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-bold text-white">Try the AI Chatbot!</h3>
            </div>
            <p className="text-sm text-red-100 mb-4 leading-relaxed">
              Don't just read about it—experience the AI that roasts you in real-time!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-lg"
            >
              <span>Try Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Individual Blog Post Page Component
const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const scrollMarkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem('sticky-bar-dismissed');
    if (dismissed) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When the 50% marker comes into view, show the bar
          if (entry.isIntersecting) {
            setShowStickyBar(true);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (scrollMarkerRef.current) {
      observer.observe(scrollMarkerRef.current);
    }

    return () => {
      if (scrollMarkerRef.current) {
        observer.unobserve(scrollMarkerRef.current);
      }
    };
  }, []);

  const handleDismissStickyBar = () => {
    setShowStickyBar(false);
    sessionStorage.setItem('sticky-bar-dismissed', 'true');
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  if (!post) {
    return (
      <PageShell
        title="Blog Post Not Found | Insult Cahtbot AI"
        description="Insult Chatbot AI that generates savage roasts, witty comebacks, and brutal burns instantly. Try the free insult chatbot now for hilarious AI‑powered banter."
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
    'url': `https://insult-chatbot.vercel.app/blog/${post.slug}`,
    'datePublished': post.publishedDate,
    'dateModified': post.publishedDate,
    'author': {
      '@type': 'Organization',
      'name': 'InsultBot',
      'url': 'https://insult-chatbot.vercel.app/',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'InsultBot',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://insult-chatbot.vercel.app/og-image.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://insult-chatbot.vercel.app/blog/${post.slug}`,
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
        'item': 'https://insult-chatbot.vercel.app/',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://insult-chatbot.vercel.app/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `https://insult-chatbot.vercel.app/blog/${post.slug}`,
      },
    ],
  };

  // FAQ schema for roast-my-code post
  const faqSchema = post.slug === 'roast-my-code' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Is there a free AI tool that roasts my code?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes — the Insult Chatbot generates code-specific roasts for free, with no signup required. Just paste your snippet and ask it to roast your programming.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Does the AI actually analyze my code for bugs?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No — this is a comedy tool, not a linter or static analysis tool. It reacts to what you paste like a savage AI comedian, not like ESLint. Use it for laughs, not for production code review.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I use this for a specific language like Python, JavaScript, or Java?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. Mention your language when you ask for the roast and the AI will tailor jokes to language-specific stereotypes (yes, it knows about JavaScript\'s == vs === problem).'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is roasting code with AI actually good practice for teams?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'As a serious code-quality tool, no. As a low-stakes way to make a retro or standup funnier and get people talking about messy legacy code without it feeling like a personal attack, it works surprisingly well.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Will it roast someone else\'s code, or just mine?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Either — paste any code you have permission to share and ask for a roast. Just keep it to code, not people.'
        }
      }
    ]
  } : post.slug === 'funny-ai-insults-for-friends' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Is there a free tool that generates insults for friends?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes — the Insult Chatbot generates friend-safe roasts for free, instantly, with no account needed.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I make the insults milder or more savage?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. Just tell it the tone you want — "keep it light" or "go brutal" both work, and it\'ll adjust.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Will the AI insult based on personal details I give it?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can mention traits or habits (chronically late, bad at a game, obsessed with a show) and it\'ll build the roast around those specifics rather than generic insults.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is this good for roasting someone on their birthday?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'It\'s a common use case — a personalized, funny roast is a popular alternative to a sincere birthday message, especially in close friend groups that roast each other regularly.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What if my friend group doesn\'t roast each other like that?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Read the room first. This works great for groups that already joke around; it\'s not a great icebreaker for a friend group that doesn\'t already roast each other.'
        }
      }
    ]
  } : null;

  usePageSEO(post.title, post.description, `https://insult-chatbot.vercel.app/blog/${post.slug}`, articleSchema);

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

    // Add FAQ schema for roast-my-code post
    if (faqSchema) {
      let existingFaq = document.querySelector('script[type="application/ld+json"][data-faq]');
      if (existingFaq) {
        existingFaq.remove();
      }
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.setAttribute('data-faq', 'true');
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }
  }, [slug]);

  return (
    <>
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
          {/* 50% scroll marker for sticky bar trigger */}
          <div ref={scrollMarkerRef} className="h-1"></div>
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
            Try Insult Chatbot Now →
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

        {/* Sticky Bottom Bar */}
        {showStickyBar && <StickyBottomBar onDismiss={handleDismissStickyBar} />}
      </PageShell>

      {/* Prominent Notification */}
      {showNotification && <BlogNotification onDismiss={handleDismissNotification} />}
    </>
  );
};

const AboutPage: React.FC = () => {
  usePageSEO(
    'About Insult Chatbot AI | Who We Are, Our Mission & How It Works',
    'Learn about Insult Chatbot AI — who built it, how the AI technology works, our mission to bring safe humor to the web, and how to contact us. Transparency you can trust.',
    'https://insult-chatbot.vercel.app/about',
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Insult Chatbot AI',
      'description': 'Insult Chatbot AI is a free, browser-based humor chatbot powered by a large language model. Designed for entertainment, roasting, and laughs — with safety guardrails built in.',
      'url': 'https://insult-chatbot.vercel.app/about',
      'publisher': {
        '@type': 'Organization',
        'name': 'Insult Chatbot AI',
        'url': 'https://insult-chatbot.vercel.app/',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://insult-chatbot.vercel.app/og-image.png',
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer support',
          'email': 'codesmithnazim@gmail.com',
        },
      },
    }
  );

  return (
    <PageShell
      title="About Insult Chatbot AI | Who We Are, Our Mission & How It Works"
      description="Learn about Insult Chatbot AI — who built it, how the AI technology works, our mission to bring safe humor to the web, and how to contact us. Transparency you can trust."
      heading="About Insult Chatbot AI"
    >
      <div className="space-y-10 text-sm text-zinc-200">

        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-red-900/30 to-zinc-900/60 rounded-2xl p-6 border border-red-500/30">
          <p className="text-base leading-relaxed text-zinc-100">
            Welcome to <strong className="text-red-400">Insult Chatbot AI</strong> — the internet's most unapologetically funny AI chatbot.
            We built this site because the world has enough polite, bland AI assistants. Sometimes you just want
            something with personality, wit, and a sharp tongue. That's exactly what we deliver — all in good fun.
          </p>
        </div>

        {/* Who We Are */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">👋</span> Who We Are
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-3">
            <p className="leading-relaxed text-zinc-300">
              Insult Chatbot AI is an independent web project created by a developer with a passion for
              conversational AI and comedy. Our team is small but dedicated — we believe technology should
              entertain as much as it informs.
            </p>
            <p className="leading-relaxed text-zinc-300">
              We are not affiliated with any large corporation. This is a passion project built to explore
              the intersection of <strong className="text-zinc-100">artificial intelligence, humor, and human interaction</strong>.
              Every feature on this site has been thoughtfully designed with the user experience in mind.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Our creator background spans software engineering, natural language processing, and a deep love
              of stand-up comedy. That combination is exactly what makes Insult Chatbot AI feel different from
              every other chatbot out there.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">🎯</span> Our Mission
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-3">
            <p className="leading-relaxed text-zinc-300">
              Our mission is simple: <strong className="text-zinc-100">make people laugh</strong>. We believe laughter is one of
              the most powerful tools for human connection. Whether you're bonding with friends, breaking the
              ice at a party, or just need a quick mood boost, a well-timed roast can do wonders.
            </p>
            <p className="leading-relaxed text-zinc-300">
              At the same time, we are committed to ensuring our platform is used <strong className="text-zinc-100">responsibly and ethically</strong>.
              Humor should bring people together, never tear them apart. Everything we build reflects that balance.
            </p>
          </div>
        </section>

        {/* What Is Insult Bot AI */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">🤖</span> What Is Insult Chatbot AI?
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-3">
            <p className="leading-relaxed text-zinc-300">
              Insult Chatbot AI is a <strong className="text-zinc-100">free, browser-based AI chatbot</strong> that specializes in generating
              witty, sarcastic, and funny responses. Unlike traditional AI assistants that prioritize being
              helpful and polite, our bot is designed for one thing: <em>comedy</em>.
            </p>
            <p className="leading-relaxed text-zinc-300">
              You speak to it — it roasts you back. It's the digital equivalent of a comedy roast, available
              24/7, completely free, with no app download or signup required.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {[
                { icon: '🎤', title: 'Voice-Powered', desc: 'Talk directly to the bot using your microphone for a fully hands-free roasting experience.' },
                { icon: '⚡', title: 'Instant Responses', desc: 'Powered by Vercel\'s edge network, responses arrive in milliseconds — no waiting for the punchline.' },
                { icon: '🔒', title: 'No Signup Needed', desc: 'Jump straight in. No account creation, no email address, no subscription fee. Ever.' },
              ].map(f => (
                <div key={f.title} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-semibold text-zinc-50 mb-1">{f.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">⚙️</span> How the Technology Works
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-3">
            <p className="leading-relaxed text-zinc-300">
              Under the hood, Insult Making AI is powered by <strong className="text-zinc-100">Google's Gemini large language model</strong> via
              the Gemini Live API. This state-of-the-art model processes real-time audio input directly from
              your microphone and generates contextually relevant, humor-tuned responses.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Here's a simplified breakdown of the pipeline:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300 ml-2">
              <li><strong className="text-zinc-100">Audio Capture:</strong> Your browser captures microphone input via the Web Audio API at 16kHz.</li>
              <li><strong className="text-zinc-100">Real-Time Streaming:</strong> Audio chunks are streamed directly to the Gemini Live model.</li>
              <li><strong className="text-zinc-100">AI Processing:</strong> The model analyzes speech, understands context, and generates a roast response.</li>
              <li><strong className="text-zinc-100">Audio Playback:</strong> The response is synthesized as speech and played back to you at 24kHz.</li>
            </ol>
            <p className="leading-relaxed text-zinc-300">
              The entire conversation is <strong className="text-zinc-100">ephemeral</strong> — we do not store your audio or conversation
              history on our servers. Privacy is baked into the architecture.
            </p>
          </div>
        </section>

        {/* Content & Safety Policy */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">🛡️</span> Content Policy & Responsible Use
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-3">
            <p className="leading-relaxed text-zinc-300">
              We take responsible AI use seriously. Insult Maker  is calibrated for <strong className="text-zinc-100">comedic banter, not bullying</strong>.
              The underlying model has safety guardrails that prevent genuinely harmful, hateful, or dangerous content.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              {[
                { label: '✅ Allowed', color: 'border-green-700/50 bg-green-900/10', items: ['Friendly roasting between consenting users', 'Playful banter and self-deprecating humor', 'Entertainment and comedy use cases', 'Content creation and social media fun'] },
                { label: '❌ Not Allowed', color: 'border-red-700/50 bg-red-900/10', items: ['Targeting real individuals maliciously', 'Hate speech or discrimination', 'Harassment or cyberbullying', 'Using outputs to harm others'] },
              ].map(g => (
                <div key={g.label} className={`rounded-lg p-4 border ${g.color}`}>
                  <h3 className="font-semibold text-zinc-50 mb-2">{g.label}</h3>
                  <ul className="space-y-1">
                    {g.items.map(i => <li key={i} className="text-xs text-zinc-400">• {i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="leading-relaxed text-zinc-300 text-xs mt-2">
              If you encounter content that violates these guidelines, please report it to us immediately at{' '}
              <a href="mailto:codesmithnazim@gmail.com" className="text-red-400 hover:underline">codesmithnazim@gmail.com</a>.
            </p>
          </div>
        </section>

        {/* Advertising Disclosure */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">📢</span> Advertising Disclosure
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-3">
            <p className="leading-relaxed text-zinc-300">
              Insult Chatbot may display advertisements served by <strong className="text-zinc-100">Google AdSense</strong> and other
              third-party advertising networks. These ads help us keep the service free for all users.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Ads shown on this site are clearly distinguishable from our content. We do not endorse the
              products or services advertised. Third-party ad networks may use cookies and web beacons to
              serve interest-based ads. For more details, see our{' '}
              <Link to="/privacy" className="text-red-400 hover:underline">Privacy Policy</Link> and{' '}
              <Link to="/cookies" className="text-red-400 hover:underline">Cookie Policy</Link>.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-3 flex items-center gap-2">
            <span className="text-red-400">✉️</span> Get In Touch
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
            <p className="leading-relaxed text-zinc-300 mb-4">
              We love hearing from our users. Whether you have a bug report, a feature suggestion, a
              partnership inquiry, or just want to say "your bot roasted me too hard" — we're all ears.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-zinc-300"><strong className="text-zinc-100">General:</strong>{' '}
                  <a href="mailto:codesmithnazim@gmail.com" className="text-red-400 hover:underline">codesmithnazim@gmail.com</a>
                </p>
                <p className="text-zinc-300"><strong className="text-zinc-100">Privacy:</strong>{' '}
                  <a href="mailto:codesmithnazim@gmail.com" className="text-red-400 hover:underline">codesmithnazim@gmail.com</a>
                </p>
                <p className="text-zinc-300"><strong className="text-zinc-100">Website:</strong>{' '}
                  <a href="https://insult-chatbot.vercel.app" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">insult-chatbot.vercel.app</a>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-zinc-300"><strong className="text-zinc-100">Response Time:</strong> Within 24–48 hours</p>
                <p className="text-zinc-300"><strong className="text-zinc-100">Service Type:</strong> Entertainment AI Chatbot</p>
                <p className="text-zinc-300"><strong className="text-zinc-100">Region:</strong> Global (Web-Based)</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-semibold"
              >
                Go to Contact Page →
              </Link>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-xs text-zinc-500 text-center">
          This About page was last updated on{' '}
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          We review and update it regularly to reflect changes to our service, policy, and technology.
        </div>

      </div>
    </PageShell>
  );
};

const PrivacyPage: React.FC = () => (
  <PageShell
    title="Privacy Policy | Insult Chatbot responsible for roast generation"
    description="Comprehensive privacy policy for Insult Chatbot - Learn how we collect, use, and protect your data in compliance with GDPR and CCPA."
    heading="Privacy Policy"
    canonicalUrl="https://insult-chatbot.vercel.app/privacy"
  >
    <div className="max-w-4xl mx-auto space-y-8 text-sm text-zinc-200">
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <p className="text-zinc-300 mb-4">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-zinc-300 mb-4">
          This Privacy Policy describes how Insult Chatbot AI ("we," "our," or "us") collects, uses, and protects your information when you use our website and services. We are committed to protecting your privacy and ensuring compliance with GDPR, CCPA, and other applicable privacy laws.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">1. Information We Collect</h2>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Automatically Collected Information</h3>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>IP address and geolocation data</li>
          <li>Browser type, operating system, and device information</li>
          <li>Pages visited, time spent, and click patterns</li>
          <li>Referring website and search terms</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">User-Provided Information</h3>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Text inputs and chat interactions with our AI</li>
          <li>Voice data (if voice features are used)</li>
          <li>Feedback and support communications</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>To provide and maintain our AI chatbot services</li>
          <li>To improve user experience and service quality</li>
          <li>To analyze usage patterns and optimize performance</li>
          <li>To ensure security and prevent abuse</li>
          <li>To comply with legal obligations</li>
          <li>To communicate with users about service updates</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">3. Google AdSense and Advertising</h2>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-300 mb-3">
            <strong>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
            <li>Alternatively, you can direct users to opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
          </ul>
          <p className="text-zinc-300 mt-3">
            We participate in Google certified ad networks and other third-party vendors who may also use cookies to serve ads on our site. You can visit their websites to opt out of the use of cookies for personalized advertising.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">4. Cookies and Tracking Technologies</h2>
        <p className="text-zinc-300 mb-3">
          We use various types of cookies:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
          <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
          <li><strong>Functional Cookies:</strong> Enhance user experience and remember preferences</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">5. Data Sharing and Disclosure</h2>
        <p className="text-zinc-300 mb-3">
          We may share your information in the following circumstances:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>With Google and other advertising partners for ad serving</li>
          <li>With analytics providers for website optimization</li>
          <li>With service providers who assist in operating our website</li>
          <li>When required by law or to protect our rights</li>
          <li>In connection with a business transfer or merger</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">6. Your Privacy Rights</h2>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">GDPR Rights (EU Residents)</h3>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Right to access your personal data</li>
          <li>Right to rectification of inaccurate data</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
        </ul>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">CCPA Rights (California Residents)</h3>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Right to know what personal information is collected</li>
          <li>Right to delete personal information</li>
          <li>Right to opt-out of sale of personal information</li>
          <li>Right to non-discrimination for exercising privacy rights</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">7. Data Security</h2>
        <p className="text-zinc-300 mb-3">
          We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">8. Children's Privacy</h2>
        <p className="text-zinc-300 mb-3">
          Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take immediate steps to delete the information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">9. Contact Information</h2>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-300 mb-2">
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <p className="text-zinc-300 mb-2">
            <strong>Email:</strong> codesmithnazim@gmail.com
          </p>
          <p className="text-zinc-300">
            <strong>Website:</strong> <a href="/contact" className="text-red-400 hover:underline">Contact Form</a>
          </p>
        </div>
      </section>

      <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 mt-8">
        <p className="text-zinc-300 text-xs">
          This privacy policy is designed to comply with Google AdSense requirements, GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), and other applicable privacy laws. By using our service, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </div>
    </div>
  </PageShell>
);

const TermsPage: React.FC = () => (
  <PageShell
    title="Terms of Use | Insult Bot AI"
    description="Terms of Use for Insult Bot AI - User responsibilities, content guidelines, and service terms for our entertainment AI chatbot."
    heading="Terms of Use"
    canonicalUrl="https://insult-chatbot.vercel.app/terms"
  >
    <div className="max-w-4xl mx-auto space-y-8 text-sm text-zinc-200">
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <p className="text-zinc-300 mb-4">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-zinc-300 mb-4">
          These Terms of Use govern your access to and use of Insult Bot AI ("Service," "we," "our," or "us"). By using our Service, you agree to comply with and be bound by these terms.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">1. Service Description</h2>
        <p className="text-zinc-300 mb-3">
          Insult Bot AI is an entertainment-based artificial intelligence chatbot designed to generate humorous, witty, and sarcastic responses for entertainment purposes only. The Service is provided "as is" without warranties of any kind.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">2. Acceptable Use</h2>
        <p className="text-zinc-300 mb-3">You agree to use our Service responsibly and in accordance with these guidelines:</p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Use the Service for entertainment purposes only</li>
          <li>Do not use the Service to harass, bully, or harm others</li>
          <li>Do not attempt to generate malicious or harmful content</li>
          <li>Do not use the Service for illegal activities</li>
          <li>Do not attempt to bypass our safety filters or systems</li>
          <li>Do not share personal sensitive information with the AI</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">3. Content and Intellectual Property</h2>
        <p className="text-zinc-300 mb-3">
          <strong>Generated Content:</strong> All responses generated by our AI are for entertainment purposes and should not be considered factual advice. You retain ownership of your input prompts, but we retain rights to use anonymized data to improve our services.
        </p>
        <p className="text-zinc-300 mb-3">
          <strong>Service Content:</strong> The Service, including its design, text, graphics, and functionality, is owned by us and protected by intellectual property laws.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">4. User Responsibilities</h2>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>You are responsible for maintaining the confidentiality of your access</li>
          <li>You are responsible for all activities under your access</li>
          <li>You must be at least 13 years old to use this Service</li>
          <li>You agree not to reverse engineer or attempt to extract our source code</li>
          <li>You agree not to use automated bots to access our Service excessively</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">5. Privacy and Data</h2>
        <p className="text-zinc-300 mb-3">
          Your privacy is important to us. Please review our <Link to="/privacy" className="text-red-400 hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
        </p>
        <p className="text-zinc-300 mb-3">
          By using our Service, you consent to the collection and use of information as described in our Privacy Policy, including the use of cookies for advertising and analytics purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">6. Disclaimers and Limitations</h2>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-300 mb-3">
            <strong>Entertainment Purpose Only:</strong> This Service is designed for entertainment and humor. The AI responses are fictional and should not be taken seriously or used for decision-making.
          </p>
          <p className="text-zinc-300 mb-3">
            <strong>No Professional Advice:</strong> The Service does not provide medical, legal, financial, or any other professional advice.
          </p>
          <p className="text-zinc-300 mb-3">
            <strong>Accuracy:</strong> We do not guarantee the accuracy, reliability, or completeness of AI-generated content.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">7. Limitation of Liability</h2>
        <p className="text-zinc-300 mb-3">
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to damages for loss of profits, data, or other intangible losses.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">8. Termination</h2>
        <p className="text-zinc-300 mb-3">
          We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, without prior notice.
        </p>
        <p className="text-zinc-300 mb-3">
          You may stop using the Service at any time. Upon termination, your right to use the Service ceases immediately.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">9. Governing Law</h2>
        <p className="text-zinc-300 mb-3">
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where our service operates, without regard to its conflict of law provisions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">10. Changes to Terms</h2>
        <p className="text-zinc-300 mb-3">
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">11. Contact Information</h2>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-300 mb-2">
            If you have any questions about these Terms of Use, please contact us:
          </p>
          <p className="text-zinc-300 mb-2">
            <strong>Email:</strong> legal@insult-chatbot.vercel.app
          </p>
          <p className="text-zinc-300">
            <strong>Website:</strong> <a href="/contact" className="text-red-400 hover:underline">Contact Form</a>
          </p>
        </div>
      </section>

      <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 mt-8">
        <p className="text-zinc-300 text-xs">
          By using Insult Bot AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Service.
        </p>
      </div>
    </div>
  </PageShell>
);

const ContactPage: React.FC = () => {
  usePageSEO(
    'Contact Us | Insult Bot AI',
    'Get in touch with Insult Bot AI — send us a message, report an issue, or ask a question. We respond within 24–48 hours.',
    'https://insult-chatbot.vercel.app/contact'
  );

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const endpoint = (import.meta as any).env?.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
      setStatus('error');
      setErrorMsg(
        'The contact form is not yet connected. To activate it: (1) Go to formspree.io and create a free account. ' +
        '(2) Create a new form with destination codesmithnazim@gmail.com. ' +
        '(3) Copy your form ID and set VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_ID in the .env file. ' +
        'Alternatively, email us directly at codesmithnazim@gmail.com'
      );
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data?.errors?.[0]?.message || 'Message failed to send. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <PageShell
      title="Contact Us | Insult Bot AI"
      description="Get in touch with Insult Bot AI — send us a message, report an issue, or ask a question. We respond within 24–48 hours."
      heading="Contact Us"
    >
      <div className="max-w-4xl mx-auto space-y-10 text-sm text-zinc-200">

        {/* Intro */}
        <div className="bg-gradient-to-r from-red-900/30 to-zinc-900/60 rounded-2xl p-6 border border-red-500/30">
          <p className="text-base leading-relaxed text-zinc-100">
            Have a question, feedback, or want to report something? Fill in the form below and
            we'll get back to you within <strong className="text-red-400">24–48 hours</strong>.
          </p>
        </div>

        {/* ── Contact Form ── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-5 flex items-center gap-2">
            <span className="text-red-400">✉️</span> Send Us a Message
          </h2>

          {/* Success Banner */}
          {status === 'success' && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-green-900/30 border border-green-600/50 rounded-xl">
              <span className="text-green-400 text-xl mt-0.5">✅</span>
              <div>
                <p className="font-semibold text-green-300">Message sent successfully!</p>
                <p className="text-green-400/80 text-xs mt-1">
                  Thanks for reaching out. We'll reply to your email within 24–48 hours.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {status === 'error' && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-900/30 border border-red-600/50 rounded-xl">
              <span className="text-red-400 text-xl mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold text-red-300">Something went wrong</p>
                <p className="text-red-400/80 text-xs mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-700/60 space-y-5 shadow-xl"
          >
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                placeholder="e.g. Muhammad Nazim"
                value={formData.name}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Your Email <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                placeholder="e.g. you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Tell us your question, feedback, or issue..."
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 text-sm resize-y min-h-[120px]
                           focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="contact-submit-btn"
              disabled={status === 'loading' || status === 'success'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700
                         hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg
                         transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none text-sm"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending…
                </>
              ) : status === 'success' ? (
                <> ✅ Message Sent! </>
              ) : (
                <> 📨 Send Message </>
              )}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              We reply to <strong className="text-zinc-400">codesmithnazim@gmail.com</strong> — check spam if you don't hear back.
            </p>
          </form>
        </section>

        {/* Contact Info Cards */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <span className="text-red-400">📋</span> Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">General Inquiries</h3>
              <p className="text-zinc-300 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:codesmithnazim@gmail.com" className="text-red-400 hover:underline">codesmithnazim@gmail.com</a>
              </p>
              <p className="text-zinc-300 mb-2"><strong>Response Time:</strong> Within 24–48 hours</p>
              <p className="text-zinc-300">For general questions, feedback, or partnership inquiries.</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">Privacy &amp; Legal</h3>
              <p className="text-zinc-300 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:codesmithnazim@gmail.com" className="text-red-400 hover:underline">codesmithnazim@gmail.com</a>
              </p>
              <p className="text-zinc-300">For privacy concerns, data requests, or legal matters.</p>
            </div>
          </div>
        </section>

        {/* Business Info */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <span className="text-red-400">🏢</span> Business Information
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 grid sm:grid-cols-2 gap-3">
            {[
              ['Business Name', 'Insult Bot AI'],
              ['Website', 'insult-chatbot.vercel.app'],
              ['Service Type', 'Entertainment AI Chatbot'],
              ['Operating Region', 'Global (Web-based Service)'],
            ].map(([label, value]) => (
              <p key={label} className="text-zinc-300"><strong className="text-zinc-100">{label}:</strong> {value}</p>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <span className="text-red-400">❓</span> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'How quickly do you respond to inquiries?', a: 'We typically respond within 24–48 hours during business days. Urgent technical issues are prioritized.' },
              { q: 'Do you offer phone support?', a: 'Currently, we only offer email support to ensure we can provide detailed and documented assistance.' },
              { q: 'Can I request data deletion?', a: 'Yes, email us with your data deletion request and we will process it as outlined in our Privacy Policy.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                <h4 className="font-semibold text-zinc-100 mb-2">{q}</h4>
                <p className="text-zinc-300">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center">
          <p className="text-zinc-300">
            We're committed to providing the best entertainment AI experience. Your feedback helps us improve! 🚀
          </p>
        </div>

      </div>
    </PageShell>
  );
};

const CookiePolicyPage: React.FC = () => (
  <PageShell
    title="Cookie Policy | Insult Bot AI"
    description="Cookie Policy for Insult Bot AI - Learn how we use cookies, tracking technologies, and your choices for GDPR compliance."
    heading="Cookie Policy"
    canonicalUrl="https://insult-chatbot.vercel.app/cookies"
  >
    <div className="max-w-4xl mx-auto space-y-8 text-sm text-zinc-200">
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <p className="text-zinc-300 mb-4">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-zinc-300 mb-4">
          This Cookie Policy explains how Insult Bot AI ("we," "our," or "us") uses cookies and similar tracking technologies when you visit our website and use our services. This policy is designed to comply with GDPR, ePrivacy Directive, and other applicable regulations.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">1. What Are Cookies?</h2>
        <p className="text-zinc-300 mb-3">
          Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They allow the website to remember your actions and preferences over time, which enhances your user experience.
        </p>
        <p className="text-zinc-300 mb-3">
          Cookies serve various purposes including authentication, security, personalization, analytics, and advertising. Our use of cookies is essential for providing you with a smooth and personalized experience.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">2. Types of Cookies We Use</h2>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Essential Cookies</h3>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 mb-4">
          <p className="text-zinc-300 mb-2"><strong>Purpose:</strong> Required for basic website functionality</p>
          <p className="text-zinc-300 mb-2"><strong>Examples:</strong> User authentication, security tokens, shopping cart contents</p>
          <p className="text-zinc-300"><strong>Duration:</strong> Session-based or up to 1 year</p>
        </div>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Analytics Cookies</h3>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 mb-4">
          <p className="text-zinc-300 mb-2"><strong>Purpose:</strong> Help us understand how visitors interact with our site</p>
          <p className="text-zinc-300 mb-2"><strong>Examples:</strong> Google Analytics, page views, session duration, bounce rates</p>
          <p className="text-zinc-300"><strong>Duration:</strong> Typically 2 years</p>
        </div>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Advertising Cookies</h3>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 mb-4">
          <p className="text-zinc-300 mb-2"><strong>Purpose:</strong> Used to deliver relevant advertisements</p>
          <p className="text-zinc-300 mb-2"><strong>Examples:</strong> Google AdSense, targeted advertising, ad frequency capping</p>
          <p className="text-zinc-300"><strong>Duration:</strong> Varies by provider, typically 1-2 years</p>
        </div>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Functional Cookies</h3>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-300 mb-2"><strong>Purpose:</strong> Enhance user experience and remember preferences</p>
          <p className="text-zinc-300 mb-2"><strong>Examples:</strong> Language settings, theme preferences, chat history</p>
          <p className="text-zinc-300"><strong>Duration:</strong> Session-based or up to 1 year</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">3. Third-Party Cookies</h2>
        <p className="text-zinc-300 mb-3">
          We use various third-party services that may set their own cookies on your device. These include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li><strong>Google Analytics:</strong> For website traffic analysis and user behavior insights</li>
          <li><strong>Google AdSense:</strong> For serving personalized advertisements</li>
          <li><strong>Google Fonts:</strong> For displaying web fonts across different devices</li>
          <li><strong>Cloudflare:</strong> For security, performance, and CDN services</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">4. Managing Your Cookie Preferences</h2>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Cookie Consent Banner</h3>
        <p className="text-zinc-300 mb-3">
          When you first visit our site, you'll see a cookie consent banner where you can:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Customize your cookie preferences</li>
          <li>Change preferences at any time</li>
        </ul>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Browser Settings</h3>
        <p className="text-zinc-300 mb-3">
          You can control cookies through your browser settings:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li><strong>Chrome:</strong> Settings {'>'} Privacy and security {'>'} Cookies and other site data</li>
          <li><strong>Firefox:</strong> Options {'>'} Privacy & Security {'>'} Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences {'>'} Privacy {'>'} Cookies and website data</li>
          <li><strong>Edge:</strong> Settings {'>'} Privacy, search, and services {'>'} Cookies</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">5. Your Rights Regarding Cookies</h2>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Under GDPR</h3>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Right to be informed about cookie usage</li>
          <li>Right to consent before non-essential cookies are placed</li>
          <li>Right to withdraw consent at any time</li>
          <li>Right to access and delete your data</li>
        </ul>

        <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">Under CCPA</h3>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Right to know what personal information is collected</li>
          <li>Right to opt-out of sale of personal information</li>
          <li>Right to request deletion of personal information</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">6. Cookie Lifespan</h2>
        <p className="text-zinc-300 mb-3">
          Cookies have different lifespans depending on their purpose:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
          <li><strong>Persistent Cookies:</strong> Remain on your device for a set period</li>
          <li><strong>Authentication Cookies:</strong> Typically 24 hours to 30 days</li>
          <li><strong>Analytics Cookies:</strong> Usually 2 years</li>
          <li><strong>Advertising Cookies:</strong> Varies, typically 1-2 years</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">7. Updates to This Policy</h2>
        <p className="text-zinc-300 mb-3">
          We may update this Cookie Policy from time to time to reflect changes in our practices, applicable laws, or regulatory requirements. We will notify you of significant changes by:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
          <li>Posting the updated policy on our website</li>
          <li>Updating the "Last Updated" date</li>
          <li>Displaying a notice on our site for major changes</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-50 mb-4">8. Contact Information</h2>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-300 mb-2">
            If you have any questions about this Cookie Policy or how we use cookies, please contact us:
          </p>
          <p className="text-zinc-300 mb-2">
            <strong>Email:</strong> privacy@insult-chatbot.vercel.app
          </p>
          <p className="text-zinc-300">
            <strong>Website:</strong> <a href="/contact" className="text-red-400 hover:underline">Contact Form</a>
          </p>
        </div>
      </section>

      <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 mt-8">
        <p className="text-zinc-300 text-xs">
          This Cookie Policy is designed to comply with GDPR, ePrivacy Directive, CCPA, and other applicable privacy regulations. By using our service, you acknowledge that you have read and understood this Cookie Policy.
        </p>
      </div>
    </div>
  </PageShell>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <>
        <CookieConsentBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
        </Routes>
      </>
    </BrowserRouter>
  );
};

export default App;