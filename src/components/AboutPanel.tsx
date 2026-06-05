import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sliders, FileText, Send, Volume2, Plus } from 'lucide-react';
import { SimulationConfig, GuestMessage } from '../types';

interface AboutPanelProps {
  onClose: () => void;
  config: SimulationConfig;
  onUpdateConfig: (newConfig: Partial<SimulationConfig>) => void;
  volume: number;
  onUpdateVolume: (volume: number) => void;
  guestMessages: GuestMessage[];
  onAddGuestMessage: (name: string, note: string) => void;
  onHoverControl: (isHovering: boolean) => void;
}

export default function AboutPanel({
  onClose,
  config,
  onUpdateConfig,
  volume,
  onUpdateVolume,
  guestMessages,
  onAddGuestMessage,
  onHoverControl
}: AboutPanelProps) {
  const [activeTab, setActiveTab] = useState<'manifest' | 'ledger'>('manifest');
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestNote.trim()) {
      setSubmitError('Please complete both fields with beautiful words.');
      return;
    }
    onAddGuestMessage(guestName.trim(), guestNote.trim());
    setGuestName('');
    setGuestNote('');
    setSubmitError('');
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#1A1A1A]/10">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('manifest');
                onHoverControl(true);
              }}
              onMouseEnter={() => onHoverControl(true)}
              onMouseLeave={() => onHoverControl(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-display font-extrabold text-sm tracking-tight transition-all cursor-pointer ${
                activeTab === 'manifest' 
                  ? 'bg-[#1A1A1A] text-white shadow-xs' 
                  : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-black/5'
              }`}
            >
              <Sliders size={14} />
              MANIFEST & CALIBRATOR
            </button>
            <button
              onClick={() => {
                setActiveTab('ledger');
                onHoverControl(true);
              }}
              onMouseEnter={() => onHoverControl(true)}
              onMouseLeave={() => onHoverControl(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-display font-extrabold text-sm tracking-tight transition-all cursor-pointer ${
                activeTab === 'ledger' 
                  ? 'bg-[#1A1A1A] text-white shadow-xs' 
                  : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-black/5'
              }`}
            >
              <FileText size={14} />
              GUEST LEDGER
              {guestMessages.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-[#FF3366] text-white font-mono">
                  {guestMessages.length}
                </span>
              )}
            </button>
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

        {/* Tab content wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'manifest' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
              {/* Left Column: Manifesto Manifesto Text */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#FF3366] block font-bold mb-1">FOUNDED 2026 IN CLOUD RANGES</span>
                  <h3 className="font-display font-extrabold text-3xl tracking-tighter leading-none mb-4">
                    ae Label
                  </h3>
                  <div className="space-y-4 font-sans text-sm text-[#1A1A1A]/80 leading-relaxed max-w-sm">
                    <p>
                      <strong>ae Label</strong> is a multi-disciplinary virtual design studio exploring pneumatic structures, ambient sound, and WebGL physics.
                    </p>
                    <p>
                      We treat the browser screen not as a cold static display, but as a responsive elastic chamber under continuous air flow and pressure variables.
                    </p>
                    <p>
                      Each floating membrane is formulated with synthetic clear coat materials, physical refraction index limits, and unique resonance properties.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#1A1A1A]/10 bg-black/[0.01]">
                  <h4 className="font-mono text-[9px] font-bold tracking-widest text-[#1A1A1A]/40 uppercase mb-2">QUICK CONTROLS</h4>
                  <ul className="text-xs font-sans space-y-1.5 text-[#1A1A1A]/70 leading-relaxed">
                    <li>• <span className="font-medium text-[#1A1A1A]">Left click / Tap</span> to pop membrane balloons and generate customized sound sweeps.</li>
                    <li>• <span className="font-medium text-[#1A1A1A]">Hover / Glide cursor</span> to affect target wind currents.</li>
                    <li>• <span className="font-medium text-[#1A1A1A]">Apply presets</span> via the Artists list to see custom aesthetic setups.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Scene Tweaker / Calibrator */}
              <div className="lg:col-span-7 bg-[#1A1A1A]/3 border border-[#1A1A1A]/5 p-5 md:p-7 rounded-2xl space-y-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-extrabold text-lg tracking-tight mb-1">ATMOSPHERE CALIBRATOR</h4>
                  <p className="font-sans text-xs text-[#1A1A1A]/50 mb-6">
                    Fine-tune the mathematical constants of the active interactive environment.
                  </p>

                  <div className="space-y-4">
                    {/* Gravity selection */}
                    <div>
                      <label className="font-mono text-[10px] tracking-wider text-[#1A1A1A]/50 uppercase block mb-2">GRAVITY ALGORITHM</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['up', 'down', 'drift'] as const).map((g) => (
                          <button
                            key={g}
                            onClick={() => onUpdateConfig({ gravity: g })}
                            onMouseEnter={() => onHoverControl(true)}
                            onMouseLeave={() => onHoverControl(false)}
                            className={`py-2 px-3 rounded-lg text-xs font-display font-bold text-center tracking-tight capitalize transition-all cursor-pointer ${
                              config.gravity === g
                                ? 'bg-[#1A1A1A] text-white shadow-xs'
                                : 'bg-[#EFEDE9] text-[#1A1A1A]/70 hover:bg-[#EFEDE9]/80'
                            }`}
                          >
                            {g === 'drift' ? 'Sideways Drift' : g === 'up' ? 'Ascending Up' : 'Falling Down'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed selection */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-mono text-[10px] tracking-wider text-[#1A1A1A]/50 uppercase">ATMOSPHERIC SPEED</label>
                        <span className="font-mono text-[10px] font-medium">{config.speed.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="2.5"
                        step="0.1"
                        value={config.speed}
                        onChange={(e) => onUpdateConfig({ speed: parseFloat(e.target.value) })}
                        className="w-full accent-[#1A1A1A]"
                      />
                    </div>

                    {/* Count slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-mono text-[10px] tracking-wider text-[#1A1A1A]/50 uppercase">MEMBRANE QUANTITY</label>
                        <span className="font-mono text-[10px] font-medium">{config.count} balloons</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        step="1"
                        value={config.count}
                        onChange={(e) => onUpdateConfig({ count: parseInt(e.target.value) })}
                        className="w-full accent-[#1A1A1A]"
                      />
                    </div>

                    {/* Gloss / Matte (Roughness) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-mono text-[10px] tracking-wider text-[#1A1A1A]/50 uppercase">SURFACE ROUGHNESS (GLOSS)</label>
                        <span className="font-mono text-[10px] font-medium">
                          {config.glossiness <= 0.05 ? 'High Gloss Mirror' : config.glossiness <= 0.20 ? 'Satin Latex' : 'Matte Rubber'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="0.6"
                        step="0.01"
                        value={config.glossiness}
                        onChange={(e) => onUpdateConfig({ glossiness: parseFloat(e.target.value) })}
                        className="w-full accent-[#1A1A1A]"
                      />
                    </div>

                    {/* Translucency (MEMBRANE SHEER) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-mono text-[10px] tracking-wider text-[#1A1A1A]/50 uppercase">MEMBRANE SHEER (GLASSINESS)</label>
                        <span className="font-mono text-[10px] font-medium">
                          {config.transmission === 0 ? 'Liquid Opaque' : config.transmission <= 0.25 ? 'Cloudy Mist' : 'Highly Translucent'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="0.8"
                        step="0.05"
                        value={config.transmission}
                        onChange={(e) => onUpdateConfig({ transmission: parseFloat(e.target.value) })}
                        className="w-full accent-[#1A1A1A]"
                      />
                    </div>

                    {/* Audio Synthesizer Pop sound volume */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-mono text-[10px] tracking-wider text-[#1A1A1A]/50 uppercase flex items-center gap-1.5">
                          <Volume2 size={12} />
                          FM SYNTHESIZER LEVEL
                        </label>
                        <span className="font-mono text-[10px] font-medium">{Math.round(volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => onUpdateVolume(parseFloat(e.target.value))}
                        className="w-full accent-[#FF3366]"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-center text-[#1A1A1A]/40 mt-4 uppercase tracking-widest border-t border-[#1A1A1A]/5 pt-3">
                  STABLE • CURRENT REVERBERATIVE CODE
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
              {/* Left Side: Guest Notes Ledger Input form */}
              <div className="lg:col-span-5 bg-[#EFEDE9]/30 border border-[#1A1A1A]/5 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-extrabold text-xl tracking-tight mb-1">SIGN THE REGISTRY</h4>
                  <p className="font-sans text-xs text-[#1A1A1A]/50 mb-6 leading-relaxed">
                    Leave a mark of your presence. Real ideas, poetic feedback, or virtual greetings are welcome.
                  </p>

                  <form onSubmit={handleSubmitMessage} className="space-y-4">
                    <div>
                      <label htmlFor="guest-name" className="font-mono text-[9px] tracking-widest text-[#1A1A1A]/50 uppercase block mb-1.5">VISITOR SIGNATURE / NAME</label>
                      <input
                        id="guest-name"
                        type="text"
                        maxLength={40}
                        placeholder="e.g. Elena Vance, Curator, Architect"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#1A1A1A]/10 bg-white shadow-xs focus:ring-1 focus:ring-[#1A1A1A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label htmlFor="guest-note" className="font-mono text-[9px] tracking-widest text-[#1A1A1A]/50 uppercase block mb-1.5">GUESTNOTE / MANIFEST MANEUVER</label>
                      <textarea
                        id="guest-note"
                        rows={4}
                        maxLength={220}
                        placeholder="Describe your tactile spatial experience or leave feedback..."
                        value={guestNote}
                        onChange={(e) => setGuestNote(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#1A1A1A]/10 bg-white shadow-xs resize-none focus:ring-1 focus:ring-[#1A1A1A] focus:outline-hidden"
                      />
                    </div>

                    {submitError && (
                      <p className="font-mono text-[10px] font-bold text-[#FF3366]">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      onMouseEnter={() => onHoverControl(true)}
                      onMouseLeave={() => onHoverControl(false)}
                      className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/95 active:scale-95 py-2.5 rounded-lg text-xs font-sans font-bold uppercase cursor-pointer shadow-md transition-all"
                    >
                      <Send size={12} />
                      SIGN LEDGER ENTRY
                    </button>
                  </form>
                </div>

                <div className="font-mono text-[9px] text-[#1A1A1A]/40 text-center uppercase tracking-widest mt-6 pt-3 border-t border-[#1A1A1A]/5">
                  SECURE • WRITTEN TO LOCAL HOST
                </div>
              </div>

              {/* Right Side: Ledger Records Display */}
              <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden">
                <div className="border-b border-[#1A1A1A]/10 pb-3 flex justify-between items-center sm:pr-2 select-none">
                  <div>
                    <h4 className="font-display font-bold text-sm tracking-tight uppercase">REGISTRY TRANSACTIONS</h4>
                    <span className="font-mono text-[9px] text-[#1A1A1A]/40 block uppercase mt-0.5">EXHIBITION CHRONICLE LOGS</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#FF3366] font-bold uppercase">{guestMessages.length} ENTRIES</span>
                </div>

                {/* Scrollable container of notes */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth max-h-[380px] pt-4 select-none">
                  {guestMessages.length === 0 ? (
                    <div className="h-44 flex flex-col items-center justify-center text-center opacity-50 p-4 border border-dashed border-[#1A1A1A]/10 rounded-xl">
                      <span className="font-mono text-xs tracking-wider uppercase mb-1">LEDGER VOID</span>
                      <p className="font-sans text-[11px]">No visitors have signed yet. Act as the catalyst and sign above!</p>
                    </div>
                  ) : (
                    guestMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl border border-[#1A1A1A]/10 bg-white shadow-xs flex flex-col justify-between hover:border-[#1A1A1A]/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <span className="font-display font-extrabold text-[#1A1A1A]/90 text-sm tracking-tight">
                            {msg.name}
                          </span>
                          <span className="font-mono text-[9px] text-[#FF3366] font-bold uppercase tracking-wider bg-[#FF3366]/5 px-2 py-0.5 rounded shrink-0">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#1A1A1A]/72 mt-2 leading-relaxed">
                          "{msg.note}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Ledger footer stamp */}
                <div className="pt-3 border-t border-[#1A1A1A]/10 mt-4 text-right font-mono text-[9px] text-[#1A1A1A]/40 uppercase tracking-widest select-none">
                  LEDCER • RECORD STAMP [UTC]
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
