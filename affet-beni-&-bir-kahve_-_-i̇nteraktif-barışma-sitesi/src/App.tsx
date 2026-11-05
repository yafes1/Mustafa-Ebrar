import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ApologySection } from './components/ApologySection';
import { CoffeeSection } from './components/CoffeeSection';
import { PeaceContract } from './components/PeaceContract';
import { CelebrationModal } from './components/CelebrationModal';
import { CustomizeModal } from './components/CustomizeModal';
import { MusicModal } from './components/MusicModal';
import { CoupleConfig, CoffeePlan, MusicConfig, MusicType } from './types';
import { Heart, MessageCircleHeart, Music, Disc, Sparkles } from 'lucide-react';
import { sound } from './utils/audio';
import mustafaEbrarImg from './assets/images/mustafa_ebrar.jpeg';

export default function App() {
  const [config, setConfig] = useState<CoupleConfig>({
    senderName: 'Mustafa',
    receiverName: 'Ebrar',
    customNote: '',
    mode: 'all',
  });

  const [activeSection, setActiveSection] = useState<string>('apology');
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [selectedCoffeePlan, setSelectedCoffeePlan] = useState<CoffeePlan | undefined>();
  const [isMusicPlaying, setIsMusicPlaying] = useState(sound.isMusicPlaying());
  const [currentMusicTitle, setCurrentMusicTitle] = useState(sound.getCurrentMusic().title);

  // Subscribe to sound engine state
  useEffect(() => {
    const unsub = sound.subscribe(() => {
      setIsMusicPlaying(sound.isMusicPlaying());
      setCurrentMusicTitle(sound.getCurrentMusic().title);
    });
    return unsub;
  }, []);

  // Start music on first user interaction (touch or click anywhere on screen)
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!sound.isMusicPlaying()) {
        sound.startBgm();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  // Parse query parameters on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get('from');
      const toParam = params.get('to');
      const noteParam = params.get('note');
      const modeParam = params.get('mode') as 'all' | 'apology' | 'coffee' | 'contract';
      const musicTypeParam = params.get('musicType') as MusicType;
      const musicUrlParam = params.get('musicUrl');

      if (fromParam || toParam || noteParam || modeParam) {
        setConfig(prev => ({
          ...prev,
          senderName: fromParam || prev.senderName,
          receiverName: toParam || prev.receiverName,
          customNote: noteParam || prev.customNote,
          mode: modeParam || prev.mode,
        }));
      }

      if (musicTypeParam) {
        const getTitle = (t: MusicType) => {
          switch (t) {
            case 'sensiz-olmaz': return 'Sensiz Olmaz ❤️';
            case 'custom-url': return 'Özel Şarkı';
            case 'music-box': return 'Nostaljik Müzik Kutusu';
            case 'synth-lofi': return 'Lofi Kafe Melodisi';
            default: return 'Akustik Romantik Melodi';
          }
        };
        const musicCfg: MusicConfig = {
          type: musicTypeParam,
          title: getTitle(musicTypeParam),
          customUrl: musicUrlParam || (musicTypeParam === 'sensiz-olmaz' ? '/assets/aistudio/videoplayback_40b8365a.mp3' : undefined),
        };
        sound.setMusic(musicCfg, false);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    setIsCelebrationOpen(true);
  };

  const handleAcceptCoffee = (plan: CoffeePlan) => {
    setSelectedCoffeePlan(plan);
    setIsCelebrationOpen(true);
  };

  const handleSaveMusic = (music: MusicConfig) => {
    setConfig(prev => ({ ...prev, musicConfig: music }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-stone-900 antialiased selection:bg-[#6D28D9] selection:text-white">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onOpenMusic={() => setIsMusicModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-28 md:pb-16">
        
        {/* Hero Section */}
        <div className="pt-6 sm:pt-10 pb-6 px-4 max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6D28D9]/10 text-[#6D28D9] rounded-full text-xs font-semibold uppercase tracking-wider mb-3 animate-in fade-in duration-300">
            <MessageCircleHeart className="w-3.5 h-3.5 text-[#FF5D8F]" />
            <span>Özel Bir Barışma Mesajı</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-2 sm:mb-3">
            {config.receiverName}, Sana Çok Önemli Bir Şey Söyleyeceğim...
          </h1>

          <p className="font-handwriting text-2xl sm:text-3xl text-[#FF5D8F] mb-6 font-semibold">
            {config.senderName}'den tüm samimiyetiyle gelen bir çağrı ❤️
          </p>

          {/* Quick Concept Tabs (Desktop & Tablet) */}
          <div className="hidden sm:inline-flex p-1.5 bg-stone-300/40 rounded-2xl gap-1 max-w-md mx-auto shadow-inner text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setActiveSection('apology');
                document.getElementById('apology-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'apology' ? 'bg-[#6D28D9] text-white shadow-sm font-semibold' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              1. Özür Dileme
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setActiveSection('coffee');
                document.getElementById('coffee-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'coffee' ? 'bg-[#6D28D9] text-white shadow-sm font-semibold' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              2. Kahve Randevusu
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setActiveSection('contract');
                document.getElementById('contract-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'contract' ? 'bg-[#6D28D9] text-white shadow-sm font-semibold' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              3. Aşk Protokolü
            </button>
          </div>

          {/* Quick Audio Setting */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsMusicModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#6D28D9] bg-white hover:bg-[#6D28D9]/10 border border-[#6D28D9]/40 px-4 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer min-h-[36px]"
            >
              <Music className="w-3.5 h-3.5 text-[#FF5D8F]" />
              <span>Müzik: {currentMusicTitle}</span>
            </button>
          </div>

        </div>

        {/* Section 1: The Apology Experience */}
        {(config.mode === 'all' || config.mode === 'apology') && (
          <ApologySection
            config={config}
            onAccept={handleAcceptAll}
          />
        )}

        {/* Section 2: The Coffee Date Invitation */}
        {(config.mode === 'all' || config.mode === 'coffee') && (
          <CoffeeSection
            config={config}
            onAcceptCoffee={handleAcceptCoffee}
          />
        )}

        {/* Section 3: The Peace Treaty / Contract */}
        {(config.mode === 'all' || config.mode === 'contract') && (
          <PeaceContract
            config={config}
            onSign={handleAcceptAll}
          />
        )}

        {/* Mustafa & Ebrar Special Memory Photo Card (Placed at the very end) */}
        <section className="py-8 sm:py-12 px-4 max-w-lg mx-auto text-center">
          <div className="relative inline-block w-full max-w-sm mx-auto p-4 sm:p-5 bg-white rounded-3xl shadow-xl border border-stone-200 transition-all hover:shadow-2xl">
            {/* Soft decorative gradient glow */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FF5D8F]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#6D28D9]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative overflow-hidden rounded-2xl mx-auto shadow-md w-full max-w-lg bg-stone-100 ring-2 ring-[#FF5D8F]/30">
              <img
                src={mustafaEbrarImg}
                alt="Mustafa ve Ebrar"
                className="w-full h-auto object-cover object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/mustafa_ebrar_photo.jpeg';
                }}
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#FF5D8F] p-2 rounded-full shadow-md animate-bounce">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>

            <div className="pt-5 pb-2 px-1 text-center">
              <p className="font-handwriting text-2xl sm:text-3xl font-bold text-[#6D28D9] leading-snug">
                "Sen bana çok sıkı sarılmıştın şimdi sıra bende...."
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5D8F]/10 text-[#FF5D8F] rounded-full text-xs font-semibold mt-3">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{config.senderName} ❤️ {config.receiverName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sweet Bottom Encouragement */}
        <div className="py-6 px-4 max-w-xl mx-auto text-center">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-xs">
            <Heart className="w-5 h-5 fill-current animate-pulse-gentle" />
          </div>
          <h4 className="text-base font-bold text-stone-800">
            "Aşkta gurur olmaz, affetmek büyüklüktür."
          </h4>
          <p className="text-xs text-stone-500 mt-1">
            Giden zaman geri gelmez ama kırılan kalpler sıcacık bir sarılmayla tamir edilebilir.
          </p>
        </div>

      </main>

      {/* Floating Music Quick Bar */}
      {/* On desktop: bottom-4 right-4. On mobile: bottom-[74px] right-3 so it floats cleanly above bottom nav */}
      <div className="fixed bottom-[74px] md:bottom-4 right-3 md:right-4 z-30">
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg rounded-2xl p-1.5 sm:px-3 sm:py-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              sound.toggleBgm();
            }}
            className="w-8 h-8 rounded-xl bg-[#6D28D9] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#5B21B6] transition-colors shrink-0"
            title={isMusicPlaying ? 'Müziği Durdur' : 'Müziği Çal'}
          >
            <Disc className={`w-4 h-4 ${isMusicPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setIsMusicModalOpen(true);
            }}
            className="text-left cursor-pointer hover:opacity-80 transition-opacity truncate max-w-[110px] sm:max-w-[180px]"
          >
            <div className="text-[10px] text-[#FF5D8F] font-bold uppercase tracking-wider">
              {isMusicPlaying ? 'Çalıyor 🎵' : 'Müzik Kapalı'}
            </div>
            <div className="text-xs font-semibold text-stone-800 truncate">
              {currentMusicTitle}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setIsMusicModalOpen(true);
            }}
            className="text-[11px] text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Değiştir
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 px-4 text-center text-xs text-stone-500 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {config.senderName} ❤️ {config.receiverName} — Barışma ve Mutluluk Platformu
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsCustomizeOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[36px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5D8F]" />
              <span>İsimleri & Linki Ayarla</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsCustomizeOpen(true);
              }}
              className="text-stone-700 hover:text-stone-900 font-medium underline cursor-pointer py-1.5 px-2"
            >
              Kendi Çiftin İçin Link Oluştur
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Thumb Navigation Bar (only visible on mobile screens) */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        onOpenMusic={() => setIsMusicModalOpen(true)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
      />

      {/* Celebration Modal with Confetti & WhatsApp sender */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        config={config}
        coffeePlan={selectedCoffeePlan}
      />

      {/* Customize Link Generator Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
        onOpenMusicModal={() => {
          setIsCustomizeOpen(false);
          setIsMusicModalOpen(true);
        }}
      />

      {/* Music Selector & MP3 Uploader Modal */}
      <MusicModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        onSaveMusic={handleSaveMusic}
      />

    </div>
  );
}
