'use client';

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-taupe-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo with pulse animation */}
        <div className="mb-8 animate-pulse">
          <img 
            src="/logo.png" 
            alt="Adorn Steps" 
            className="h-24 md:h-32 w-auto mx-auto object-contain"
          />
        </div>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading text */}
        <p className="text-taupe-600 font-body text-lg">{message}</p>
      </div>
    </div>
  );
}
