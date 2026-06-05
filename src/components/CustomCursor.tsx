import { useEffect, useState } from 'react';

interface CustomCursorProps {
  isHovering: boolean;
}

export default function CustomCursor({ isHovering }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.addEventListener('mouseleave', handleMouseLeave);
      document.body.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      id="custom-cursor"
      className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-50 transition-all duration-150 ease-out"
      style={{
        transform: `translate3d(${position.x - (isHovering ? 24 : 16)}px, ${position.y - (isHovering ? 24 : 16)}px, 0)`,
        width: isHovering ? '48px' : '32px',
        height: isHovering ? '48px' : '32px',
        border: '1.5px solid #1A1A1A',
        backgroundColor: isHovering ? 'rgba(26, 26, 26, 0.08)' : 'transparent',
        scale: isClicking ? 0.75 : 1,
      }}
    >
      <div 
        className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full transition-transform duration-200"
        style={{
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
          backgroundColor: isHovering ? '#FF3366' : '#1A1A1A'
        }}
      />
    </div>
  );
}
