import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';

interface RunawayButtonProps {
  onDodge?: (dodgeCount: number) => void;
  onClickAnyway?: () => void;
}

const PHRASES = [
  'Hayır',
  'Emin misin? 🥺',
  'Bir şans daha versen?',
  'Kediler bile üzüldü ama...',
  'Son kararın mı cidden?',
  'Bak ağlarım ama 😢',
  'Hadi ama lütfeeeen ❤️',
  'Kahveyi ben ısmarlıcam söz!',
  'Beni hiç mi sevmedin?',
  'Bu buton seni seviyor, basma!',
  'Kaçtım ki! 😜',
  'Pes et bence, Evet de!'
];

export const RunawayButton: React.FC<RunawayButtonProps> = ({ onDodge, onClickAnyway }) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dodge = useCallback(() => {
    sound.playBoing();
    // Mobile haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // ignore if not allowed by browser
      }
    }

    setDodgeCount(prev => {
      const next = prev + 1;
      if (onDodge) onDodge(next);
      return next;
    });

    // Mobile responsive bounds: keep it safely within visible boundaries
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxX = isMobile ? 80 : 130;
    const maxY = isMobile ? 60 : 90;
    
    const randomSignX = Math.random() > 0.5 ? 1 : -1;
    const randomSignY = Math.random() > 0.5 ? 1 : -1;
    const nextX = (Math.random() * (maxX - 20) + 20) * randomSignX;
    const nextY = (Math.random() * (maxY - 20) + 20) * randomSignY;

    setPosition({ x: nextX, y: nextY });
  }, [onDodge]);

  // Touch & pointer detection
  const handleMouseEnter = () => {
    dodge();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dodge();
    if (onClickAnyway && dodgeCount > 10) {
      onClickAnyway();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    dodge();
  };

  useEffect(() => {
    return () => setPosition(null);
  }, []);

  const currentPhrase = PHRASES[dodgeCount % PHRASES.length];

  return (
    <div className="relative inline-block select-none touch-manipulation">
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        style={{
          transform: position ? `translate(${position.x}px, ${position.y}px)` : 'none',
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="min-h-[44px] min-w-[44px] px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-700 bg-[#F5F5F7] hover:bg-stone-200 border border-stone-300 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap active:scale-95 touch-manipulation"
      >
        {currentPhrase}
      </button>
    </div>
  );
};
