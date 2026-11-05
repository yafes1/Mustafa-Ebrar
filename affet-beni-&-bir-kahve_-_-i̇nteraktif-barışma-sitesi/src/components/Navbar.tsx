import React, { useState, useEffect } from 'react';
import { Heart, Music } from 'lucide-react';
import { sound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenCustomize?: () => void;
  onOpenMusic: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMusic, activeSection }) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(sound.isMusicPlaying());
  const [musicTitle, setMusicTitle] = useState(sound.getCurrentMusic().title);

  useEffect(() => {
    const unsub = sound.subscribe(() => {
      setIsPlayingMusic(sound.isMusicPlaying());
      setMusicTitle(sound.getCurrentMusic().title);
    });
    return unsub;
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-base sm:text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 group min-h-[44px]"
        >
          <span className="p-1 sm:p-1.5 bg-[#FF5D8F]/15 text-[#FF5D8F] rounded-lg group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-current" />
          </span>
          <span className="truncate max-w-[170px] sm:max-w-none">Affet Beni & Bir Kahve?</span>
        </a>

        {/* Zone 2: 4-5 clean single-line nav links (desktop only) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#apology-section"
            className={`hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'apology' ? 'text-[#6D28D9] font-bold' : ''
            }`}
          >
            Özür Notu
          </a>
          <a
            href="#coffee-section"
            className={`hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'coffee' ? 'text-[#6D28D9] font-bold' : ''
            }`}
          >
            Kahve Teklifi
          </a>
          <a
            href="#contract-section"
            className={`hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'contract' ? 'text-[#6D28D9] font-bold' : ''
            }`}
          >
            Aşk Protokolü
          </a>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onOpenMusic();
            }}
            className="inline-flex items-center gap-1.5 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs bg-[#F5F5F7] hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200"
          >
            <Music className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span className="max-w-[130px] truncate">
              {isPlayingMusic ? `Müzik: ${musicTitle}` : 'Müziği Değiştir'}
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <PWAInstallButton />
        </div>

      </div>
    </header>
  );
};
