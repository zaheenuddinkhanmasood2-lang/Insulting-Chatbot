import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to prerender
const routes = [
  '/',
  '/blog',
  '/blog/ultimate-insult-chatbot',
  '/blog/web-based-insult-bot',
  '/blog/unleash-inner-comedian-insult-maker',
  '/blog/roast-my-code',
  '/blog/funny-ai-insults-for-friends',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies'
];

// SEO metadata for each route (extracted from your App.tsx usePageSEO)
const routeMetadata = {
  '/': {
    title: 'Insult Chatbot: Free Brutal Insult Generator AI & Insult Maker',
    description: 'Insult Chatbot AI that generates savage roasts, witty comebacks , and brutal burns instantly. Try the free insult chatbot now for hilarious AI‑powered insults.',
    canonical: 'https://insult-chatbot.vercel.app/'
  },
  '/blog': {
    title: 'Insult Chatbot Blog - AI Roast Generator Tips & Entertainment',
    description: 'Read the latest articles about AI insult generators, roast bots, and digital entertainment. Learn how to use InsultBot for maximum fun.',
    canonical: 'https://insult-chatbot.vercel.app/blog'
  },
  '/blog/ultimate-insult-chatbot': {
    title: 'Tired of Boring AI? Meet the Ultimate Insult Chatbot That Actually Has a Personality',
    description: 'Looking for a laugh? Discover the funniest insult bot AI on the web. From witty comebacks to savage roasts, see why this insult chatbot is going viral.',
    canonical: 'https://insult-chatbot.vercel.app/blog/ultimate-insult-chatbot'
  },
  '/blog/web-based-insult-bot': {
    title: 'Insult Bot AI: Why the Funniest Roast Generator is Now on the Web (No App Download Needed)',
    description: 'Skip the App Store. Try the new insult bot AI that runs directly in your browser. Fast, free, and savage. Click to get roasted by the ultimate insult chatbot instantly.',
    canonical: 'https://insult-chatbot.vercel.app/blog/web-based-insult-bot'
  },
  '/blog/unleash-inner-comedian-insult-maker': {
    title: 'Unleash Your Inner Comedian with Our Insult Maker',
    description: 'Create hilarious insults on the fly with our insult maker chatbot! Let the roasting begin with just a few clicks. Try it now!',
    canonical: 'https://insult-chatbot.vercel.app/blog/unleash-inner-comedian-insult-maker'
  },
  '/blog/roast-my-code': {
    title: 'Roast My Code: Get Your Programming Brutally Judged by AI',
    description: 'Let AI roast your code with brutal, funny feedback on bad variable names, spaghetti logic, and copy-pasted Stack Overflow snippets. Free, no signup.',
    canonical: 'https://insult-chatbot.vercel.app/blog/roast-my-code'
  },
  '/blog/funny-ai-insults-for-friends': {
    title: 'Funny AI Insults for Friends: Ultimate Roast Generator Guide',
    description: 'Generate hilarious AI insults for friends with our free roast generator. Perfect for group chats, parties, and playful banter. Try it now!',
    canonical: 'https://insult-chatbot.vercel.app/blog/funny-ai-insults-for-friends'
  },
  '/about': {
    title: 'About InsultBot - Free AI Insult Generator & Roast Maker',
    description: 'Learn about InsultBot, the free AI-powered insult chatbot that generates witty roasts and savage comebacks. Entertainment-focused AI humor.',
    canonical: 'https://insult-chatbot.vercel.app/about'
  },
  '/contact': {
    title: 'Contact InsultBot - Get in Touch',
    description: 'Have questions about InsultBot? Contact us for support, feedback, or inquiries about our AI insult generator and roast maker.',
    canonical: 'https://insult-chatbot.vercel.app/contact'
  },
  '/privacy': {
    title: 'Privacy Policy - InsultBot AI Insult Generator',
    description: 'Read InsultBot\'s privacy policy. Learn how we collect, use, and protect your data when using our free AI insult generator and chatbot.',
    canonical: 'https://insult-chatbot.vercel.app/privacy'
  },
  '/terms': {
    title: 'Terms of Use - InsultBot AI Insult Generator',
    description: 'Read InsultBot\'s terms of use. Understand the rules and guidelines for using our free AI insult generator and chatbot service.',
    canonical: 'https://insult-chatbot.vercel.app/terms'
  },
  '/cookies': {
    title: 'Cookie Policy - InsultBot AI Insult Generator',
    description: 'Read InsultBot\'s cookie policy. Learn how we use cookies to enhance your experience on our AI insult generator and chatbot.',
    canonical: 'https://insult-chatbot.vercel.app/cookies'
  }
};

const distDir = path.join(__dirname, 'dist');

// Read the built index.html
const indexPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Function to inject metadata into HTML
function injectMetadata(html, metadata) {
  let modifiedHtml = html;
  
  // Update title
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${metadata.title}</title>`
  );
  
  // Update meta description
  modifiedHtml = modifiedHtml.replace(
    /<meta name="description" content=".*?"/,
    `<meta name="description" content="${metadata.description}"`
  );
  
  // Update canonical URL
  modifiedHtml = modifiedHtml.replace(
    /<!-- Canonical URL is set dynamically by React based on current route -->/,
    `<link rel="canonical" href="${metadata.canonical}" />`
  );
  
  return modifiedHtml;
}

// Prerender each route
routes.forEach(route => {
  const metadata = routeMetadata[route];
  if (!metadata) {
    console.log(`No metadata found for ${route}, skipping...`);
    return;
  }
  
  const modifiedHtml = injectMetadata(indexHtml, metadata);
  
  // Determine output path
  let outputPath;
  if (route === '/') {
    outputPath = path.join(distDir, 'index.html');
  } else {
    outputPath = path.join(distDir, route.replace(/^\//, ''), 'index.html');
  }
  
  // Create directory if needed
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(outputPath, modifiedHtml);
  console.log(`✓ Prerendered ${route} -> ${outputPath}`);
});

console.log('\n✅ Prerendering complete!');
console.log('📝 Generated static HTML files for all routes with correct SEO metadata.');
