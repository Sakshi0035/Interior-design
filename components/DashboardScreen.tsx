

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Screen } from '../types';
import TourGuide from './TourGuide';

const MagicFeelLogo = () => (
    <svg viewBox="0 0 100 60" className="w-8 h-auto text-yellow-500" fill="currentColor">
        <path d="M50,5 L5,30 L15,30 L15,55 L40,55 L40,40 L60,40 L60,55 L85,55 L85,30 L95,30 Z" stroke="#FBBF24" strokeWidth="2" fillOpacity="0.8"/>
        <path d="M65,55 L65,35 L80,35 L80,55 Z" stroke="#FBBF24" strokeWidth="2" fill="none"/>
        <path d="M45,20 L75,20 L60,10 Z" stroke="#FBBF24" strokeWidth="2" fill="none"/>
    </svg>
);

const HalloweenAnimation = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <i className="fa-solid fa-ghost text-gray-200/50 absolute text-5xl animate-ghost-drift-1" style={{ animationDelay: '0s' }}></i>
        <i className="fa-solid fa-ghost text-gray-200/40 absolute text-3xl animate-ghost-drift-2" style={{ animationDelay: '5s' }}></i>
        <i className="fa-solid fa-ghost text-gray-200/60 absolute text-4xl animate-ghost-drift-3" style={{ animationDelay: '10s' }}></i>
        <i className="fa-solid fa-ghost text-gray-200/30 absolute text-2xl animate-ghost-drift-2" style={{ animationDelay: '12s', animationDirection: 'reverse' }}></i>
    </div>
);

const tourSteps = [
  {
    targetSelector: '#welcome-card',
    title: 'Welcome to MagicFeels!',
    content: "This is your dashboard. Let's take a quick tour of the features available in the app.",
    position: 'bottom',
  },
  {
    targetSelector: '#carousel-showcase',
    title: 'Our Designs',
    content: 'Swipe through our portfolio of beautiful interior and landscape designs for inspiration.',
    position: 'bottom',
  },
  {
    targetSelector: '#contact-info',
    title: 'Contact Our Designer',
    content: 'Here you can find direct contact information for our founder, Yoggita Singh, to schedule a consultation.',
    position: 'top',
  },
  {
    targetSelector: '#chat-button',
    title: 'AI Support Assistant',
    content: 'Have a question? Tap the ghost icon to chat with our friendly AI assistant, MagicFeels!',
    position: 'top',
  },
  {
    targetSelector: '#profile-menu-button',
    title: 'Your Account',
    content: 'Tap here to access your account settings or to log out of the application.',
    position: 'bottom',
  },
];


const DashboardScreen: React.FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const autoplayTimeoutRef = useRef<number | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const carouselItems = [
    { type: 'video', src: 'https://cdn.pixabay.com/video/2022/03/10/111135-688035685_large.mp4' },
    { type: 'video', src: 'https://cdn.pixabay.com/video/2020/09/10/49028-457383911_large.mp4' },
    { type: 'image', src: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Chic living room interior' },
    { type: 'image', src: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Lush garden with patio' },
    { type: 'image', src: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Modern house exterior' },
    { type: 'image', src: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Stylish kitchen interior detail' },
    { type: 'image', src: 'https://images.pexels.com/photos/2227832/pexels-photo-2227832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'House exterior with a swimming pool' },
  ];

  const stopAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayTimeoutRef.current = window.setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % carouselItems.length);
    }, 6000);
  }, [carouselItems.length, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeIndex, startAutoplay]);

  useEffect(() => {
    // Pause any videos that might be playing from a previous slide.
    carouselContainerRef.current?.querySelectorAll('video').forEach(video => {
        if (!video.paused) {
            video.pause();
            video.currentTime = 0; // Reset video to the beginning
        }
    });

    const activeItem = carouselItems[activeIndex];
    if (activeItem.type === 'video') {
        const slidesContainer = carouselContainerRef.current?.children[0];
        if (slidesContainer && slidesContainer.children[activeIndex]) {
            const videoElement = slidesContainer.children[activeIndex].querySelector('video');
            if (videoElement) {
                // The play() method returns a promise. We catch potential errors.
                const playPromise = videoElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // We gracefully handle the 'AbortError'. This error is expected when a
                        // user navigates quickly through the carousel, interrupting the video's
                        // play request with a pause request. It's not a true error state.
                        if (error.name !== 'AbortError') {
                            console.error("Video play failed:", error);
                        }
                    });
                }
            }
        }
    }
  }, [activeIndex, carouselItems]);

  const handleUserInteraction = (newIndex: number) => {
    stopAutoplay();
    setActiveIndex(newIndex);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchStartX.current - touchEndX.current > threshold) {
      handleUserInteraction((activeIndex + 1) % carouselItems.length);
    } else if (touchEndX.current - touchStartX.current > threshold) {
      handleUserInteraction((activeIndex - 1 + carouselItems.length) % carouselItems.length);
    }
  };

  const handleStartTour = () => {
    setMenuOpen(false);
    setTourStep(0);
    setShowTour(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      <HalloweenAnimation />
      {showTour && (
        <TourGuide
          steps={tourSteps}
          stepIndex={tourStep}
          onNext={() => setTourStep(s => s + 1)}
          onPrev={() => setTourStep(s => s - 1)}
          onClose={() => setShowTour(false)}
        />
      )}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm z-20 border-b border-gray-200 sticky top-0">
        <div style={{ flex: '1 0 0' }} className="flex justify-start">
            <MagicFeelLogo />
        </div>
        <h1 className="font-semibold text-lg text-slate-800">MagicFeels</h1>
        <div style={{ flex: '1 0 0' }} className="flex justify-end items-center space-x-2">
            <button onClick={handleStartTour} className="w-10 h-10 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Start app tour">
              <i className="fa-solid fa-question-circle text-xl"></i>
            </button>
            <div className="relative">
              <button id="profile-menu-button" onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-bold text-gray-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-30 animate-pop-in origin-top-right">
                  <button onClick={() => { onNavigate('settings'); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fa-solid fa-gear w-6 mr-2"></i> Settings
                  </button>
                  <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fa-solid fa-right-from-bracket w-6 mr-2"></i> Logout
                  </button>
                </div>
              )}
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10">
        <div id="welcome-card" style={{ animationDelay: '100ms' }} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center animate-fade-in-up">
            <h2 className="text-2xl font-bold text-yellow-500 mb-3 animate-pulse-glow">Welcome to MagicFeels</h2>
            <p className="text-gray-600 leading-relaxed">
             Welcome to the official app of MagicFeel Studio LLP. We specialize in creating beautiful and functional interior and landscape designs. Have questions? Our AI assistant is here to help.
            </p>
        </div>

        {/* Carousel Showcase */}
        <div id="carousel-showcase" style={{ animationDelay: '200ms' }} className="animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-700 mb-3 px-2">Our Designs</h3>
            <div 
              ref={carouselContainerRef}
              className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 aspect-video"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="flex-shrink-0 w-full h-full bg-black">
                    {item.type === 'video' ? (
                      <video 
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        {/* Using the <source> tag is more robust for cross-browser compatibility
                            and can help prevent "no supported source" errors. */}
                        <source src={item.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img 
                        src={item.src} 
                        alt={item.alt}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                 {carouselItems.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => handleUserInteraction(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${activeIndex === index ? 'bg-yellow-500 ring-2 ring-white/50' : 'bg-white/60 hover:bg-white'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                 ))}
              </div>
            </div>
        </div>
        
        <div id="contact-info" style={{ animationDelay: '400ms' }} className="animate-fade-in-up">
           <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="text-center mb-4">
                <p className="font-bold text-xl text-slate-800">Yoggita Singh</p>
                <p className="text-sm text-gray-500">Founder & Director, Premium Interior & Landscape Designer's</p>
              </div>
              
              <div className="text-sm space-y-3">
                 <a href="tel:+91901103067" className="flex items-center p-2 bg-gray-100 rounded-lg">
                  <i className="fa-solid fa-phone w-6 text-center text-gray-500 mr-2"></i>
                  <span className="text-gray-700">+91 901103067</span>
                </a>
                <a href="mailto:yogitanawle2007@gmail.com" className="flex items-center p-2 bg-gray-100 rounded-lg">
                  <i className="fa-solid fa-envelope w-6 text-center text-gray-500 mr-2"></i>
                  <span className="text-gray-700">yogitanawle2007@gmail.com</span>
                </a>
                 <div className="flex items-start p-2 bg-gray-100 rounded-lg">
                  <i className="fa-solid fa-location-dot w-6 mt-1 text-center text-gray-500 mr-2"></i>
                  <div>
                    <span className="font-semibold text-gray-700">Global Secretariat</span>
                    <p className="text-gray-600">201, Akash Ganga complex, Besides Rio Restaurant, Gujarat College Road, Ellis Bridge, Ahmedabad - 380006</p>
                  </div>
                </div>
                <a href="https://www.asianafrican.org" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-gray-100 rounded-lg">
                  <i className="fa-solid fa-globe w-6 text-center text-gray-500 mr-2"></i>
                  <span className="text-gray-700">www.asianafrican.org</span>
                </a>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;