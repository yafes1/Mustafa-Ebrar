import React, { useState } from 'react';
import { Coffee, MapPin, Clock, Cake, Sparkles, Check } from 'lucide-react';
import { CoupleConfig, CoffeePlan } from '../types';
import { RunawayButton } from './RunawayButton';
import { sound } from '../utils/audio';
import coffeeDateImg from '../assets/images/cozy_coffee_date_1793889135745.jpg';

interface CoffeeSectionProps {
  config: CoupleConfig;
  onAcceptCoffee: (plan: CoffeePlan) => void;
}

const DRINKS = [
  { name: 'Köpüklü Türk Kahvesi', desc: '40 yıl hatrı ve fal bakması bizden', icon: '☕' },
  { name: 'Karamel Macchiato', desc: 'Tatlı tatlı buzları eritmelik', icon: '🥛' },
  { name: 'White Chocolate Mocha', desc: 'Sıcacık, tatlı ve yumuşacık bir lezzet', icon: '☕' },
  { name: 'Sıcak Çikolata', desc: 'Marshmallowlu, içimizi ısıtacak türden', icon: '🍫' },
];

const DESSERTS = [
  { name: 'San Sebastian Cheesecake', desc: 'Akışkan ve nefis', icon: '🍰' },
  { name: 'Çilekli Kruvasan', desc: 'Taptaze ve hafif', icon: '🥐' },
  { name: 'Sıcak Çikolatalı Sufle', desc: 'Kızgınlıkları eriten lezzet', icon: '🍮' },
  { name: 'Senin Tatlı Gülüşün', desc: 'En güzel tatlı zaten sensin :)', icon: '✨' },
];

const PLACES = [
  'Bizim her zamanki köşe masamız',
  'Sakin sahil kenarı / deniz havası',
  'Ağaçlar altında sessiz butik kafe',
  'Sen neresi dersen orası',
];

const TIMES = [
  'Bu akşam (hemen şimdi)',
  'Yarın okul/iş çıkışı',
  'Bu hafta sonu doya doya',
  'Sen ne zaman uygunsan',
];

export const CoffeeSection: React.FC<CoffeeSectionProps> = ({ config, onAcceptCoffee }) => {
  const [selectedDrink, setSelectedDrink] = useState(DRINKS[0].name);
  const [selectedDessert, setSelectedDessert] = useState(DESSERTS[0].name);
  const [selectedPlace, setSelectedPlace] = useState(PLACES[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);
  const [dodgeCount, setDodgeCount] = useState(0);

  const handleDodge = (count: number) => {
    setDodgeCount(count);
  };

  const handleConfirm = () => {
    sound.playSuccess();
    onAcceptCoffee({
      drink: selectedDrink,
      dessert: selectedDessert,
      place: selectedPlace,
      time: selectedTime,
      note: 'Kahve buluşması',
    });
  };

  const yesScale = Math.min(1 + dodgeCount * 0.12, 1.7);

  return (
    <section id="coffee-section" className="py-8 sm:py-10 px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6D28D9]/10 text-[#6D28D9] rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Coffee className="w-3.5 h-3.5" />
            <span>Küçük Bir Ateşkes Teklifi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Bir Fincan Kahve İçip Konuşalım mı?
          </h2>

          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Geçmişi konuşmak zorunda bile değiliz. Sadece gözlerinin içine bakıp sıcak bir kahve yudumlamak, sesini duymak istiyorum.
          </p>
        </div>

        {/* Coffee Shop Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-md mb-8 h-48 sm:h-64 border border-stone-100">
          <img
            src={coffeeDateImg}
            alt="Sıcak ve samimi kafe ortamı"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/cozy_coffee_date_1793889135745.jpg';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/75 via-stone-950/20 to-transparent flex items-end p-5">
            <div className="text-white">
              <span className="font-handwriting text-2xl sm:text-3xl font-bold text-[#FF5D8F]">
                "{config.receiverName}, bu masada yerin hazır..."
              </span>
              <p className="text-xs text-stone-200 mt-0.5">
                Sen sadece ne içmek istediğini seç, gerisini bana bırak.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Custom Coffee Date Menu */}
        <div className="space-y-6 mb-8">
          
          {/* Drink Choice without "Sana ne ısmarlayayım?" */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DRINKS.map((item) => {
                const isSelected = selectedDrink === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedDrink(item.name);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[52px] ${
                      isSelected
                        ? 'bg-[#FF5D8F]/10 border-[#FF5D8F] shadow-xs ring-1 ring-[#FF5D8F]'
                        : 'bg-[#F5F5F7]/70 hover:bg-[#F5F5F7] border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-500">{item.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#FF5D8F] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dessert Choice */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5 mb-2.5">
              <Cake className="w-4 h-4 text-[#FF5D8F]" />
              <span>Yanında hangi tatlıyı paylaşalım?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DESSERTS.map((item) => {
                const isSelected = selectedDessert === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedDessert(item.name);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[52px] ${
                      isSelected
                        ? 'bg-[#6D28D9]/10 border-[#6D28D9] shadow-xs ring-1 ring-[#6D28D9]'
                        : 'bg-[#F5F5F7]/70 hover:bg-[#F5F5F7] border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-500">{item.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#6D28D9] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Place & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-[#6D28D9]" />
                <span>Nerede buluşalım?</span>
              </label>
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="w-full bg-[#F5F5F7] border border-stone-200 text-stone-900 text-xs sm:text-sm rounded-xl p-3 focus:ring-2 focus:ring-[#6D28D9] focus:outline-none"
              >
                {PLACES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-[#FF5D8F]" />
                <span>Ne zaman?</span>
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#F5F5F7] border border-stone-200 text-stone-900 text-xs sm:text-sm rounded-xl p-3 focus:ring-2 focus:ring-[#FF5D8F] focus:outline-none"
              >
                {TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Action Decision Area */}
        <div className="text-center pt-5 border-t border-stone-100">
          <p className="text-sm sm:text-base font-bold text-stone-800 mb-5">
            O zaman anlaşalım mı? Kahve hazır, sohbet ikimizden! ☕✨
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 min-h-[90px] relative">
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                transform: `scale(${yesScale})`,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm sm:text-base font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl shadow-lg hover:shadow-[#6D28D9]/30 transition-colors cursor-pointer animate-pulse-gentle z-10 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kahveye Varım! ☕</span>
            </button>

            <RunawayButton onDodge={handleDodge} />
          </div>

          {dodgeCount > 0 && (
            <p className="text-xs text-[#FF5D8F] font-medium mt-4 animate-in fade-in">
              {`Kahveye hayır denmez ki! Kaçmaya çalışma, tatlı da var :) (${dodgeCount}. deneme)`}
            </p>
          )}
        </div>

      </div>
    </section>
  );
};
