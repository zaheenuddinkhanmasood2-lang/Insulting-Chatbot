import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (running in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Detect mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    // Check if user has dismissed the prompt in the last 7 days
    const dismissedAt = localStorage.getItem('install-prompt-dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Check if user has engaged (sent a message)
    const hasEngaged = localStorage.getItem('user-engaged');

    // On mobile, show banner after 5 seconds regardless of engagement
    // On desktop, require engagement first
    if (isMobileDevice) {
      const mobileTimer = setTimeout(() => {
        setShowBanner(true);
      }, 5000);
      return () => clearTimeout(mobileTimer);
    }

    // Desktop: require engagement
    if (!hasEngaged) {
      return;
    }

    // Listen for beforeinstallprompt event (Chrome/Edge on Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show the hint after engagement
    if (isIOSDevice && hasEngaged) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isIOS, isMobile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
    setShowBanner(false);
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-zinc-900 border border-red-500/50 rounded-lg p-4 z-50 shadow-lg shadow-red-500/20">
      <div className="flex items-start gap-3">
        <div className="text-2xl">📱</div>
        <div className="flex-1">
          <h3 className="text-zinc-100 font-semibold mb-1">Install Insult Chatbot</h3>
          {isIOS ? (
            <p className="text-zinc-400 text-sm mb-3">
              Tap the Share button, then "Add to Home Screen" to install.
            </p>
          ) : (
            <p className="text-zinc-400 text-sm mb-3">
              Get quick access to savage roasts on your device.
            </p>
          )}
          <div className="flex gap-2">
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors font-medium"
                aria-label="Install Insult Chatbot app"
              >
                Install
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
              aria-label="Dismiss install prompt"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
