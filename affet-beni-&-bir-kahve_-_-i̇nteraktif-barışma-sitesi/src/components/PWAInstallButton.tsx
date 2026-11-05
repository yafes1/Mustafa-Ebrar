import React, { useState } from 'react';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone on mobile, hide the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    sound.playPop();
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General instructions modal
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#FF5D8F]" />
        <span>Telefona Yükle</span>
      </button>

      {/* Mobile Install Guide Sheet / Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-left animate-in slide-in-from-bottom-5 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FF5D8F]/15 text-[#FF5D8F] rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Telefona Uygulama Olarak Ekle</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600 mb-5">
              <div className="flex items-start gap-2.5 p-2.5 bg-[#F5F5F7] rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>
                  {isIOS
                    ? 'Safari alt çubuğundaki '
                    : 'Tarayıcınızın menüsündeki (üç nokta veya) '}
                  <strong className="text-stone-800">Paylaş</strong> simgesine dokunun.
                </span>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#F5F5F7] rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>
                  Açılan menüyü aşağı kaydırıp <strong className="text-stone-800">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                </span>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#F5F5F7] rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>
                  Sağ üst köşedeki <strong className="text-stone-800">Ekle</strong> butonuna basarak telefonunuzun ana ekranından tek dokunuşla açın!
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
};
