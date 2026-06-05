import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Sliders, Info, Clock, RefreshCw, Smile, Disc } from 'lucide-react';

import { SimulationConfig, GuestMessage } from './types';
import { ARTISTS_DATA } from './data/artists';

import WebGLCanvas from './components/WebGLCanvas';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import AboutPanel from './components/AboutPanel';
import ArtistPanel from './components/ArtistPanel';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState<'artists' | 'about' | null>(null);
  
  // Custom interactive cursor hover state
  const [isHovering, setIsHovering] = useState(false);

  // Active sound synthesizer volume
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  // Live pop statistics to display in the bottom margin ticker
  const [popCount, setPopCount] = useState(0);
  const [lastPoppedColor, setLastPoppedColor] = useState<string | null>(null);
  const [showColorBanner, setShowColorBanner] = useState(false);

  // UTC Chronometer time state
  const [currentTime, setCurrentTime] = useState('');

  // Local storage for the guest ledger
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([
    {
      id: 'pre-1',
      name: 'Olivia Martinez (Paris, FR)',
      note: 'The metallic refractions on Ryo Sato\'s preset are gorgeous. Tuning the gravity is so satisfying!',
      timestamp: '2026-06-05 01:10'
    },
    {
      id: 'pre-2',
      name: 'Dr. Hugo Vance (Geneva, CH)',
      note: 'A beautiful collision of physics and audio. The frequency sweep pitch scales perfectly based on balloon size.',
      timestamp: '2026-06-05 01:18'
    }
  ]);

  // Current simulation physical variables
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    gravity: 'up',
    speed: 0.8,
    count: 22,
    glossiness: 0.06,
    metalness: 0.12,
    transmission: 0.25,
    colorScheme: 'default'
  });

  // Track if current config matches any artist's preset precisely
  const [activeArtistId, setActiveArtistId] = useState<string | null>(null);

  // Update Clock in UTC
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyArtistPreset = (artistId: string, preset: SimulationConfig) => {
    setSimulationConfig(preset);
    setActiveArtistId(artistId);
  };

  const handleUpdateConfig = (newConfig: Partial<SimulationConfig>) => {
    setSimulationConfig(prev => {
      const updated = { ...prev, ...newConfig };
      // If config deviates from selected artist, reset active identifier selection
      setActiveArtistId(null);
      return updated;
    });
  };

  const triggerPopFeedback = (color: string) => {
    setPopCount(prev => prev + 1);
    setLastPoppedColor(color);
    setShowColorBanner(true);

    // Reset indicator flash banner shortly after
    const timer = setTimeout(() => {
      setShowColorBanner(false);
    }, 1200);

    return () => clearTimeout(timer);
  };

  const handleResetSimulation = () => {
    setSimulationConfig({
      gravity: 'up',
      speed: 0.8,
      count: 22,
      glossiness: 0.06,
      metalness: 0.12,
      transmission: 0.25,
      colorScheme: 'default'
    });
    setActiveArtistId(null);
  };

  const handleAddGuestMessage = (name: string, note: string) => {
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
    
    const newMsg: GuestMessage = {
      id: `usr-${Date.now()}`,
      name,
      note,
      timestamp: stamp
    };

    setGuestMessages(prev => [newMsg, ...prev]);
  };

  return (
    <div className="relative font-sans h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#1A1A1A] select-none">
      
      {/* Intro Preloader screen */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* Main WebGL Three.js Canvas */}
      {isLoaded && (
        <WebGLCanvas 
          config={simulationConfig}
          onHover={setIsHovering}
          onPop={triggerPopFeedback}
          popVolume={isMuted ? 0 : volume}
        />
      )}

      {/* Custom Mouse Cursor */}
      <CustomCursor isHovering={isHovering} />

      {/* Primary UI Layer */}
      {isLoaded && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 pointer-events-none z-10 select-none">
          
          {/* Header Layout */}
          <header className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={handleResetSimulation}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="font-display font-extrabold text-3xl tracking-tighter cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 focus:outline-hidden"
              title="Reset Exhibition Constants"
            >
              ae.
            </button>

            {/* Top Navigation Row */}
            <nav className="flex items-center gap-4 sm:gap-6 font-display font-extrabold text-sm tracking-tight">
              <button
                id="btn-nav-artists"
                onClick={() => {
                  setActivePanel('artists');
                  setIsHovering(false);
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`py-1 hover:opacity-75 cursor-pointer uppercase transition-opacity flex items-center gap-1 focus:outline-hidden ${
                  activePanel === 'artists' ? 'border-b-2 border-[#1A1A1A]' : ''
                }`}
              >
                ARTISTS
              </button>
              <button
                id="btn-nav-about"
                onClick={() => {
                  setActivePanel('about');
                  setIsHovering(false);
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`py-1 hover:opacity-75 cursor-pointer uppercase transition-opacity flex items-center gap-1 focus:outline-hidden ${
                  activePanel === 'about' ? 'border-b-2 border-[#1A1A1A]' : ''
                }`}
              >
                ABOUT & CALIBRATE
              </button>

              <div className="w-px h-5 bg-[#1A1A1A]/10 hidden sm:inline-block" />

              {/* Mute toggle widget */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  setIsHovering(false);
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="p-1.5 hover:bg-black/5 rounded-full transition-colors cursor-pointer focus:outline-hidden"
                title={isMuted ? "Unmute Synthesizer" : "Mute Synthesizer"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </nav>
          </header>

          {/* Central Exhibition Typographical Title */}
          <main className="flex-1 flex flex-col items-center justify-center text-center w-full">
            <h1 className="font-display font-extrabold text-[15vw] md:text-[11vw] leading-[0.85] tracking-tight mix-blend-difference select-none pointer-events-none opacity-[0.92] text-zinc-900 select-none">
              ae<br />
              <span className="text-transparent uppercase" style={{ WebkitTextStroke: '1.5px #1A1A1A' }}>
                Label
              </span>
            </h1>
            <p className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/50 mt-4 leading-relaxed mix-blend-overlay">
              immersive membrane acoustics exhibition
            </p>
          </main>

          {/* Footer margin HUD (Sleek minimalist real indicators) */}
          <footer className="flex flex-col sm:flex-row justify-between items-center md:items-end w-full gap-4 text-[#1A1A1A]/60 sm:pointer-events-auto">
            {/* Left Box: Active Preset tracker */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
              <span className="font-mono text-[9px] tracking-wider uppercase opacity-60">ACTIVE SELECTION STYLE</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-sans font-extrabold text-xs text-[#1A1A1A] uppercase">
                  {activeArtistId 
                    ? ARTISTS_DATA.find(a => a.id === activeArtistId)?.name 
                    : 'CUSTOM CALIBRATED'}
                </span>
                {activeArtistId && (
                  <button
                    onClick={() => handleUpdateConfig({})}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="font-mono text-[8px] tracking-wide text-[#FF3366] hover:underline uppercase cursor-pointer flex items-center gap-0.5 ml-1 select-none"
                    title="Unlock Preset to Custom config"
                  >
                    <RefreshCw size={8} /> UNLOCK
                  </button>
                )}
              </div>
            </div>

            {/* Middle Color Pop visualizer HUD */}
            <div className="h-10 flex items-center justify-center min-w-[200px]">
              <AnimatePresence mode="wait">
                {showColorBanner && lastPoppedColor ? (
                  <motion.div
                    key="pop-ticker"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 px-3 py-1 bg-white border border-[#1A1A1A]/10 rounded-full shadow-xs"
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-black/10 shadow-3xs"
                      style={{ backgroundColor: lastPoppedColor }}
                    />
                    <span className="font-mono text-[9px] tracking-wide uppercase text-[#1A1A1A]">
                      Popped: {lastPoppedColor}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="general-ticker"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[9px] tracking-widest uppercase flex items-center gap-1.5"
                  >
                    <Disc size={10} className="animate-spin text-[#FF3366]" style={{ animationDuration: '6s' }} />
                    POPPED COUNTER: <span className="font-bold text-[#1A1A1A]">{popCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Box: UTC Chronostat & Standard Copyright */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right gap-1">
              <p className="font-sans text-[10px]">&copy; 2026 ae Label. All rights reserved.</p>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Clock size={11} />
                <span className="font-mono text-[9px] font-bold tracking-wider">{currentTime || '00:00:00 UTC'}</span>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* Slide-out Panels Overlay */}
      <AnimatePresence>
        {activePanel === 'artists' && (
          <ArtistPanel
            onClose={() => setActivePanel(null)}
            onApplyPreset={handleApplyArtistPreset}
            activeArtistId={activeArtistId}
            onHoverControl={setIsHovering}
          />
        )}

        {activePanel === 'about' && (
          <AboutPanel
            onClose={() => setActivePanel(null)}
            config={simulationConfig}
            onUpdateConfig={handleUpdateConfig}
            volume={volume}
            onUpdateVolume={setVolume}
            guestMessages={guestMessages}
            onAddGuestMessage={handleAddGuestMessage}
            onHoverControl={setIsHovering}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
