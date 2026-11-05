import React from 'react';
import { Heart, Coffee, Scroll, Music, Settings2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface MobileBottomNavProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenMusic: () => void;
  onOpenCustomize: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onSelectSection,
  onOpenMusic,
  onOpenCustomize,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center justify-around">
        
        {/* Tab 1: Özür */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onSelectSection('apology');
            document.getElementById('apology-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'apology' ? 'text-[#FF5D8F] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeSection === 'apology' ? 'fill-current scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-0.5">Özür</span>
        </button>

        {/* Tab 2: Kahve */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onSelectSection('coffee');
            document.getElementById('coffee-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'coffee' ? 'text-[#6D28D9] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Coffee className={`w-5 h-5 ${activeSection === 'coffee' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-0.5">Kahve</span>
        </button>

        {/* Tab 3: Protokol */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onSelectSection('contract');
            document.getElementById('contract-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'contract' ? 'text-[#6D28D9] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Scroll className={`w-5 h-5 ${activeSection === 'contract' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-0.5">Protokol</span>
        </button>

        {/* Tab 4: Müzik */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onOpenMusic();
          }}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 rounded-xl text-stone-500 hover:text-[#6D28D9] transition-colors cursor-pointer"
        >
          <Music className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Müzik</span>
        </button>

        {/* Tab 5: Özelleştir */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onOpenCustomize();
          }}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 rounded-xl text-stone-500 hover:text-[#6D28D9] transition-colors cursor-pointer"
        >
          <Settings2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Ayarla</span>
        </button>

      </div>
    </div>
  );
};
