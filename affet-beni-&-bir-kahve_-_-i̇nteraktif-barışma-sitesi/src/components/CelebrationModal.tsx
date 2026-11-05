import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Send, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';
import { CoupleConfig, CoffeePlan } from '../types';
import happyCoupleImg from '../assets/images/happy_reconciled_couple_1793889135377.jpg';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CoupleConfig;
  coffeePlan?: CoffeePlan;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  config,
  coffeePlan,
}) => {
  const triggerConfetti = () => {
    sound.playSuccess();
    // Confetti cannon
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ec4899', '#6366f1']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const prepareWhatsAppMessage = () => {
    let msg = `Evet dedim! Barıştık! ❤️ ${config.senderName}, seni affettim.`;
    if (coffeePlan && coffeePlan.drink) {
      msg += ` Kahve planımız: ${coffeePlan.drink} & ${coffeePlan.dessert} (${coffeePlan.place} - ${coffeePlan.time}).`;
    }
    msg += ` Sözünü unutma, kahveler senden! ☕✨`;
    return encodeURIComponent(msg);
  };

  const waLink = `https://api.whatsapp.com/send?text=${prepareWhatsAppMessage()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-rose-100 text-center overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-3 sm:hidden" />
        
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Cuddle cats image */}
        <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-md ring-4 ring-rose-100 mb-5">
          <img
            src={happyCoupleImg}
            alt="Sarılmış mutlu kediler"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/happy_reconciled_couple_1793889135377.jpg';
            }}
          />
          <div className="absolute bottom-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-md animate-bounce">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          Dünyanın En Güzel Kararı! 🎉
        </h2>
        
        <p className="font-handwriting text-2xl text-[#6D28D9] mb-4 font-semibold">
          {config.receiverName} & {config.senderName} yeniden beraber!
        </p>

        <p className="text-stone-600 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Buzlar eridi, küslük bitti. İkiniz de birbiriniz için çok kıymetlisiniz.
          Şimdi bu güzel anı kutlama ve sıcak bir kahveyle taçlandırma vakti!
        </p>

        {/* Selected coffee summary if any */}
        {coffeePlan && coffeePlan.drink && (
          <div className="bg-[#F5F5F7] border border-stone-200 rounded-2xl p-3.5 mb-6 text-xs sm:text-sm text-stone-700 text-left">
            <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
              <span className="text-[#FF5D8F]">☕ Kararlaştırılan Kahve Randevusu</span>
            </div>
            <p className="text-stone-700">
              <span className="font-bold text-stone-900">{coffeePlan.drink}</span> +{' '}
              <span className="font-bold text-stone-900">{coffeePlan.dessert}</span>
            </p>
            <p className="text-stone-500 text-xs mt-0.5">
              Mekan: {coffeePlan.place} · Zaman: {coffeePlan.time}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playPop()}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#FF5D8F]" />
            <span>WhatsApp'tan {config.senderName}'e Müjdeyi Gönder</span>
          </a>

          <div className="flex items-center gap-3 justify-center">
            <button
              type="button"
              onClick={triggerConfetti}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FF5D8F] bg-[#FF5D8F]/10 hover:bg-[#FF5D8F]/20 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5D8F]" />
              <span>Daha Çok Konfeti Patlat!</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Sayfayı İncele</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
