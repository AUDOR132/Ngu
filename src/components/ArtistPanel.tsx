import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { Artist, SimulationConfig } from '../types';
import { ARTISTS_DATA } from '../data/artists';

interface ArtistPanelProps {
  onClose: () => void;
  onApplyPreset: (artistId: string, preset: SimulationConfig) => void;
  activeArtistId: string | null;
  onHoverControl: (isHovering: boolean) => void;
}

export default function ArtistPanel({ onClose, onApplyPreset, activeArtistId, onHoverControl }: ArtistPanelProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist>(
    ARTISTS_DATA.find(a => a.id === activeArtistId) || ARTISTS_DATA[0]
  );
  const [justApplied, setJustApplied] = useState(false);

  const handleApply = () => {
    onApplyPreset(selectedArtist.id, selectedArtist.preset);
    setJustApplied(true);
    setTimeout(() => {
      setJustApplied(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.98 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="w-full max-w-5xl h-[85vh] md:h-[75vh] bg-[#FDFBF7] border border-[#1A1A1A]/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking panel
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#1A1A1A]/10">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] tracking-widest text-[#1A1A1A]/50 uppercase">EXHIBITION GUILD</span>
            <h2 id="artist-panel-header" className="font-display font-extrabold text-2xl tracking-tighter">ARTISTS</h2>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={() => onHoverControl(true)}
            onMouseLeave={() => onHoverControl(false)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Panel Core Content Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation: Artist Selector */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 overflow-y-auto p-4 flex md:flex-col gap-2 shrink-0 select-none">
            {ARTISTS_DATA.map((artist) => {
              const worksCurrentStyle = artist.id === activeArtistId;
              const isSelected = artist.id === selectedArtist.id;
              
              return (
                <button
                  key={artist.id}
                  onClick={() => {
                    setSelectedArtist(artist);
                    setJustApplied(false);
                  }}
                  onMouseEnter={() => onHoverControl(true)}
                  onMouseLeave={() => onHoverControl(false)}
                  className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden flex flex-col cursor-pointer ${
                    isSelected 
                      ? 'bg-[#1A1A1A] text-white' 
                      : 'hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-display font-bold text-sm md:text-base tracking-tight">{artist.name}</span>
                    {worksCurrentStyle && (
                      <span className="font-mono text-[8px] tracking-wider px-1.5 py-0.5 roundedbg-emerald-500/20 text-emerald-600 font-bold uppercase shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className={`font-sans text-[10px] md:text-xs mt-0.5 opacity-60 ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {artist.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Detailed Description and Presets */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Profile Bio */}
              <div>
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#1A1A1A]/40 uppercase block mb-1">BIOGRAPHY</span>
                <p className="font-sans text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed">
                  {selectedArtist.bio}
                </p>
              </div>

              {/* Master Thesis / Quote */}
              <div className="p-4 border-l-2 border-[#1A1A1A] bg-[#1A1A1A]/3 rounded-r-lg">
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#1A1A1A]/40 uppercase block mb-1">ARTISTIC THESIS</span>
                <p className="font-sans text-xs md:text-sm font-medium italic text-[#1A1A1A]/80 leading-relaxed mb-3">
                  {selectedArtist.thesis}
                </p>
                <p className="font-sans font-semibold text-xs text-[#FF3366] tracking-tight">
                  {selectedArtist.quote}
                </p>
              </div>

              {/* Color Scheme Refraction */}
              <div>
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#1A1A1A]/40 uppercase block mb-2">CHROMATIC PALETTE</span>
                <div className="flex items-center gap-3">
                  {selectedArtist.colors.map((c, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-8 h-8 rounded-full border border-black/10 shadow-xs" 
                        style={{ backgroundColor: c }}
                      />
                      <span className="font-mono text-[8px] text-[#1A1A1A]/50">{c}</span>
                    </div>
                  ))}
                  <div className="ml-auto font-mono text-[10px] uppercase text-[#1A1A1A]/60 font-semibold px-2 py-1 bg-black/5 rounded">
                    Scheme: {selectedArtist.preset.colorScheme}
                  </div>
                </div>
              </div>

              {/* Selected Pieces catalog */}
              <div>
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#1A1A1A]/40 uppercase block mb-3">KEY PORTFOLIO PIECES</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedArtist.pieces.map((piece, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#1A1A1A]/5 bg-black/[0.01]">
                      <h4 className="font-display font-extrabold text-sm tracking-tight">{piece.title}</h4>
                      <span className="font-mono text-[9px] text-[#FF3366] block mt-0.5 font-bold uppercase">{piece.medium}</span>
                      <p className="font-sans text-xs text-[#1A1A1A]/70 mt-2 leading-relaxed">
                        {piece.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Presets Action CTA bar */}
            <div className="pt-8 border-t border-[#1A1A1A]/10 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col text-center sm:text-left">
                <span className="font-mono text-[9px] tracking-wider text-[#1A1A1A]/50">DYNAMIC OVERLAY CONTROL</span>
                <p className="font-sans text-xs text-[#1A1A1A]/70 mt-0.5">
                  Update 3D spheres using Elena, Ryo, Saskia, or Amara's spatial algorithms.
                </p>
              </div>

              <button
                onClick={handleApply}
                onMouseEnter={() => onHoverControl(true)}
                onMouseLeave={() => onHoverControl(false)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-sans font-bold text-xs uppercase cursor-pointer transition-all duration-300 shadow-md ${
                  justApplied 
                    ? 'bg-emerald-600 text-white' 
                    : activeArtistId === selectedArtist.id 
                    ? 'bg-[#1A1A1A]/20 text-[#1A1A1A]/60 cursor-default'
                    : 'bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 active:scale-95'
                }`}
                disabled={justApplied || activeArtistId === selectedArtist.id}
              >
                {justApplied ? (
                  <>
                    <Check size={14} className="animate-bounce" />
                    PRESET PROGRAMMED!
                  </>
                ) : activeArtistId === selectedArtist.id ? (
                  <>
                    <Check size={14} />
                    CURRENT ACTIVE PRESET
                  </>
                ) : (
                  'APPLY EXHIBIT PRESET'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
