import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [stage, setStage] = useState<'animating' | 'ready' | 'fading'>('animating');

  useEffect(() => {
    // Elegant timing sequence mimicking fine art gallery introduction
    const timerReady = setTimeout(() => {
      setStage('ready');
    }, 2200);

    return () => {
      clearTimeout(timerReady);
    };
  }, []);

  const handleStart = () => {
    setStage('fading');
    // Allow fade animation to complete before unmounting
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <AnimatePresence>
      {stage !== 'fading' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFBF7]"
        >
          <div className="relative flex flex-col items-center max-w-md px-6 text-center select-none">
            {/* Animated Logo */}
            <div className="flex items-end justify-center h-28 font-display font-extrabold text-7xl md:text-8xl tracking-tighter text-[#1A1A1A]">
              <motion.span
                initial={{ y: 50, opacity: 0, rotate: -15 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="inline-block"
              >
                a
              </motion.span>
              <motion.span
                initial={{ y: 50, opacity: 0, rotate: 15 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
                className="inline-block"
              >
                e
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
                className="inline-block text-[#FF3366] ml-px"
              >
                .
              </motion.span>
            </div>

            {/* Subtle Gallery Loader State or Prompt */}
            <div className="mt-8 overflow-hidden h-12">
              {stage === 'animating' ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="font-mono text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase"
                >
                  CALIBRATING ATMOSPHERE...
                </motion.div>
              ) : (
                <motion.button
                  id="btn-start-exhibition"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="font-sans font-bold text-xs tracking-[0.15em] text-[#1A1A1A] bg-[#1A1A1A] text-white px-6 py-3 rounded-full uppercase cursor-pointer hover:bg-opacity-90 active:scale-95 transition-all shadow-md focus:outline-hidden"
                >
                  ENTER EXHIBITION
                </motion.button>
              )}
            </div>

            {/* Fine print */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-[-140px] w-80 text-center font-sans text-[10px] leading-relaxed tracking-wider text-[#1A1A1A]"
            >
              SOUND RECOMMENDED • CLICK TO INTERACT<br />
              POWERED BY WEBGL & THREE.JS
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
