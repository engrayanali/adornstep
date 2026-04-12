'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice) => {
    localStorage.setItem('cookie-consent', choice);
    setIsVisible(false);
    
    if (choice === 'accept') {
      // Initialize your Analytics/Facebook Pixel here if you have them
      console.log('Cookies accepted');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          🍪 Cookie Settings
        </h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          We use cookies to enhance your shopping experience and analyze our traffic. 
          By clicking "Accept", you consent to our use of cookies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleChoice('accept')}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={() => handleChoice('decline')}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}