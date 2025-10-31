
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Screen } from '../types';

const MagicFeelLogo = () => (
    <svg viewBox="0 0 100 60" className="w-8 h-auto text-yellow-500" fill="currentColor">
        <path d="M50,5 L5,30 L15,30 L15,55 L40,55 L40,40 L60,40 L60,55 L85,55 L85,30 L95,30 Z" stroke="#FBBF24" strokeWidth="2" fillOpacity="0.8"/>
        <path d="M65,55 L65,35 L80,35 L80,55 Z" stroke="#FBBF24" strokeWidth="2" fill="none"/>
        <path d="M45,20 L75,20 L60,10 Z" stroke="#FBBF24" strokeWidth="2" fill="none"/>
    </svg>
);

const DashboardScreen: React.FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  const exteriorRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const DesignCard: React.FC<{
      imgSrc: string,
      title: string,
      description: string,
      scrollRef: React.RefObject<HTMLDivElement>
  }> = ({ imgSrc, title, description, scrollRef }) => (
      <div 
        ref={scrollRef} 
        className="relative w-56 h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
      >
          <img src={imgSrc} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-5">
              <h3 className="font-bold text-lg text-white tracking-wide">{title}</h3>
              <p className="text-xs text-white/80 mt-1">{description}</p>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm z-20 border-b border-gray-200 sticky top-0">
        <div className="w-10 flex justify-start items-center">
          <MagicFeelLogo />
        </div>
        <h1 className="font-semibold text-lg text-slate-800">MagicFeel Studio</h1>
        <div className="relative w-10">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="font-bold text-gray-600">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-30">
              <button onClick={() => { onNavigate('settings'); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i className="fa-solid fa-gear w-6 mr-2"></i> Settings
              </button>
              <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i className="fa-solid fa-right-from-bracket w-6 mr-2"></i> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-700 ease-out ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <h2 className="text-2xl font-bold text-yellow-500 mb-3">Welcome to MagicFeel</h2>
            <p className="text-gray-600 leading-relaxed">
             Welcome to the official app of MagicFeel Studio LLP. We specialize in creating beautiful and functional interior and landscape designs. Have questions? Our AI assistant is here to help.
            </p>
        </div>

        {/* Quick Navigation Buttons */}
        <div className={`flex justify-center space-x-2 transition-all duration-700 ease-out delay-100 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <button onClick={() => scrollToSection(exteriorRef)} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-yellow-50 hover:border-yellow-300 transition-colors">Exterior</button>
            <button onClick={() => scrollToSection(interiorRef)} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-yellow-50 hover:border-yellow-300 transition-colors">Interior</button>
            <button onClick={() => scrollToSection(gardenRef)} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-yellow-50 hover:border-yellow-300 transition-colors">Garden</button>
        </div>

        {/* Design Inspiration Cards */}
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className={`transition-all duration-700 ease-out delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <DesignCard
                  scrollRef={exteriorRef}
                  imgSrc="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop"
                  title="Exterior Design"
                  description="Transform your home's exterior with our expert touch."
                />
            </div>
            <div className={`transition-all duration-700 ease-out delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <DesignCard
                  scrollRef={interiorRef}
                  imgSrc="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                  title="Interior Design"
                  description="Elevate your living spaces with stunning interiors."
                />
            </div>
            <div className={`transition-all duration-700 ease-out delay-400 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <DesignCard
                  scrollRef={gardenRef}
                  imgSrc="https://images.pexels.com/photos/2131614/pexels-photo-2131614.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  title="Garden Design"
                  description="Create your personal oasis with our garden designs."
                />
            </div>
        </div>
        
        <div className={`transition-all duration-700 ease-out delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
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

      <button
        onClick={() => onNavigate('chat')}
        className="absolute bottom-6 right-6 w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        aria-label="Open support chat"
      >
        <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
      </button>
    </div>
  );
};

export default DashboardScreen;
