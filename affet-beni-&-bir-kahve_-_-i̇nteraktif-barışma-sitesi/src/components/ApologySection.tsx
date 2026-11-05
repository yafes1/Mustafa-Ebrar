import React, { useState } from 'react';
import { Heart, Mail, Sparkles, Flame } from 'lucide-react';
import { CoupleConfig } from '../types';
import { RunawayButton } from './RunawayButton';
import { sound } from '../utils/audio';
import cuteCatImg from '../assets/images/cute_cat_apology_1793889134968.jpg';

interface ApologySectionProps {
  config: CoupleConfig;
  onAccept: () => void;
}

export const ApologySection: React.FC<ApologySectionProps> = ({ config, onAccept }) => {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);

  const handleDodge = (count: number) => {
    setDodgeCount(count);
  };

  // Grow "Evet" button smoothly as "Hayır" dodges
  const yesScale = Math.min(1 + dodgeCount * 0.12, 1.7);
  // Calculate warmth percentage (25% to 100%)
  const warmth = Math.min(25 + dodgeCount * 15, 100);

  const defaultNote = config.customNote || `Sensiz geçen her gün bana senin değerini bir kez daha hatırlattı. Aradaki kırgınlıkların ikimizden de büyük olmadığını biliyorum. Seni kırdıysam, istemeden üzdüysem tüm kalbimle özür dilerim. Eski güzel günlerimize dönmek, seninle yeniden doya doya gülmek istiyorum.`;

  return (
    <section id="apology-section" className="py-8 sm:py-10 px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200">
        
        {/* Main Apology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
          {/* Kitten Visual */}
          <div className="relative group max-w-[280px] sm:max-w-none mx-auto w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 aspect-square">
              <img
                src={cuteCatImg}
                alt="Özür dileyen sevimli kedi"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/cute_cat_apology_1793889134968.jpg';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs sm:text-sm font-medium text-center bg-stone-900/60 backdrop-blur-xs py-1.5 px-3 rounded-xl">
                <span>🥺 "Lütfen beni dinle, çok üzgünüm..."</span>
              </div>
            </div>
          </div>

          {/* Sincere Letter Card */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 text-[#6D28D9] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5D8F]" />
              <span>Kalpten Gelen Bir Mesaj</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight">
              Sevgili <span className="text-[#FF5D8F] underline decoration-[#6D28D9] decoration-wavy underline-offset-4">{config.receiverName}</span>, Beni Affeder Misin?
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Geçmişteki tartışmalar ya da yanlış anlaşılmalar aramıza soğukluk sokmuş olabilir. 
              Ama seni kırdığım için gerçekten pişmanım.
            </p>

            {/* Interactive Envelope / Letter */}
            <div className="bg-[#F5F5F7] border border-stone-200 rounded-2xl p-4 transition-all">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setIsLetterOpen(!isLetterOpen);
                }}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-stone-800 cursor-pointer min-h-[38px]"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#6D28D9]" />
                  <span>{isLetterOpen ? 'Mektubu Kapat' : 'Sana Yazdığım Özel Mektubu Oku'}</span>
                </span>
                <span className="text-xs text-[#6D28D9] font-semibold underline">
                  {isLetterOpen ? 'Gizle' : 'Aç'}
                </span>
              </button>

              {isLetterOpen && (
                <div className="mt-3 pt-3 border-t border-stone-200 animate-in fade-in duration-200">
                  <p className="font-handwriting text-xl text-stone-800 leading-relaxed">
                    "{defaultNote}"
                  </p>
                  <p className="text-right text-xs text-stone-500 mt-2 font-medium">
                    — {config.senderName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reasons to Reconcile Cards */}
        <div className="mb-10">
          <h3 className="text-center text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Neden Yeniden Bir Şans Vermelisin?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                title: 'Birlikte Gülüşlerimiz',
                desc: 'Seni kahkahalarla güldürdüğüm o anları hiçbir şeye değişmem.',
                icon: '❤️'
              },
              {
                title: 'Hatalarımı Anladım',
                desc: 'Gurur yapmıyorum; seni üzdüğüm her anın farkındayım ve telafi etmek istiyorum.',
                icon: '🌱'
              },
              {
                title: 'Birlikte Daha Güzeliz',
                desc: 'Ayrı kaldığımızda ikimiz de eksik hissediyoruz, bunu biliyorsun.',
                icon: '✨'
              },
              {
                title: 'Verilen Sözler',
                desc: 'Beraber gitmediğimiz o sokaklar ve içmediğimiz kahveler bizi bekliyor.',
                icon: '☕'
              }
            ].map((reason, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#F5F5F7]/80 hover:bg-[#6D28D9]/5 border border-stone-200 rounded-2xl transition-colors text-left flex items-start gap-3"
              >
                <span className="text-xl shrink-0 mt-0.5">{reason.icon}</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">{reason.title}</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ice Melter / Warmth progress indicator - PLACED AT THE BOTTOM */}
        <div className="mb-8 bg-[#F5F5F7] border border-stone-200 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2 text-stone-700">
            <span className="flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${warmth > 60 ? 'text-[#FF5D8F] fill-[#FF5D8F]' : 'text-[#6D28D9]'}`} />
              <span className="font-semibold">Buz Eritme Göstergesi</span>
            </span>
            <span className="text-[#6D28D9] font-bold">%{warmth} Isındı</span>
          </div>
          <div className="w-full h-3 bg-stone-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#6D28D9] via-[#FF5D8F] to-[#FF5D8F] transition-all duration-300 rounded-full"
              style={{ width: `${warmth}%` }}
            />
          </div>
          <p className="text-xs text-stone-500 mt-2 text-center">
            {warmth < 50
              ? 'Hala biraz serin... Ama kalpler yumuşamaya başladı.'
              : warmth < 90
              ? 'Buzlar hızla eriyor! Barışmaya çok az kaldı.'
              : 'Tamamen ısındı! Artık sarılma ve affetme vakti.'}
          </p>
        </div>

        {/* The Decisive Question & Buttons */}
        <div className="text-center pt-4 border-t border-stone-100">
          <p className="text-base sm:text-lg font-bold text-stone-800 mb-6">
            Peki... Birbirimize tertemiz yeni bir sayfa açalım mı? 🥺
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 min-h-[90px] relative">
            {/* The YES button that pulses and grows */}
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAccept();
              }}
              style={{
                transform: `scale(${yesScale})`,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm sm:text-base font-semibold text-white bg-[#FF5D8F] hover:bg-[#e54876] rounded-xl shadow-lg hover:shadow-[#FF5D8F]/30 transition-colors cursor-pointer animate-pulse-gentle z-10 min-h-[48px]"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Evet, Affettim! ❤️</span>
            </button>

            {/* The RUNAWAY NO button */}
            <RunawayButton onDodge={handleDodge} />
          </div>

          {dodgeCount > 0 && (
            <p className="text-xs text-[#FF5D8F] font-medium mt-4 animate-in fade-in">
              {dodgeCount >= 3
                ? `Gördün mü? "Hayır" butonu bile seninle küs kalmak istemiyor! (${dodgeCount}. deneme)`
                : `"Hayır"a tıklamaya çalıştın ama nafile!`}
            </p>
          )}
        </div>

      </div>
    </section>
  );
};
