import React, { useState } from 'react';
import { Scroll, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { CoupleConfig } from '../types';
import { sound } from '../utils/audio';

interface PeaceContractProps {
  config: CoupleConfig;
  onSign: () => void;
}

const DEFAULT_CLAUSES = [
  { id: '1', text: 'Gereksiz yere trip atmak ve iletişimi koparmak yasaktır. Bir sorun varsa oturup konuşulacaktır.' },
  { id: '2', text: 'Kızgınlık anında bile birbirimize kırıcı sözler söylenmeyecektir.' },
  { id: '3', text: 'Haftada en az 1 kez baş başa kahve içilecek ve dertleşilecektir.' },
  { id: '4', text: 'Günün sonunda ne olursa olsun sarılınacak ve sevgi hatırlanacaktır.' },
];

export const PeaceContract: React.FC<PeaceContractProps> = ({ config, onSign }) => {
  const [signed, setSigned] = useState(false);
  const [checkedClauses, setCheckedClauses] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
  });

  const toggleClause = (id: string) => {
    sound.playPop();
    setCheckedClauses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSign = () => {
    sound.playSuccess();
    setSigned(true);
    onSign();
  };

  return (
    <section id="contract-section" className="py-8 sm:py-10 px-4 max-w-4xl mx-auto">
      <div className="relative bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200 overflow-hidden">
        
        {/* Top badge */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2 text-stone-700">
            <Scroll className="w-5 h-5 text-[#FF5D8F]" />
            <span className="text-xs uppercase tracking-widest font-bold text-stone-500">
              Resmi Olmayan Ama Çok Samimi Belge
            </span>
          </div>
          <span className="text-xs text-stone-400 font-mono">No: {new Date().getFullYear()}-AŞK-01</span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Barışma & Ateşkes Protokolü
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Taraflar: <span className="font-semibold text-[#6D28D9]">{config.senderName}</span> ve{' '}
            <span className="font-semibold text-[#6D28D9]">{config.receiverName}</span>
          </p>
        </div>

        {/* Clauses List (Madde 1 to 4) */}
        <div className="space-y-3 mb-8">
          {DEFAULT_CLAUSES.map((clause, index) => {
            const isChecked = checkedClauses[clause.id];
            return (
              <div
                key={clause.id}
                onClick={() => toggleClause(clause.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none min-h-[52px] ${
                  isChecked
                    ? 'bg-[#6D28D9]/5 border-[#6D28D9]/30'
                    : 'bg-[#F5F5F7] border-stone-200 opacity-60'
                }`}
              >
                <div className={`mt-0.5 rounded-full p-0.5 ${isChecked ? 'text-[#6D28D9]' : 'text-stone-300'}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800 mb-0.5">
                    Madde {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {clause.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Signature Area */}
        <div className="bg-[#F5F5F7] rounded-2xl p-4 sm:p-6 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-stone-500">Bu protokolü kabul ederek geleceğe gülümsemeyi taahhüt edersiniz.</p>
            <p className="font-handwriting text-xl text-stone-800 mt-1">
              "Kırgınlıklar unutulsun, sevgi kazansın."
            </p>
          </div>

          <div className="flex items-center gap-3">
            {signed ? (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5D8F]/15 text-[#FF5D8F] rounded-xl font-bold border-2 border-dashed border-[#FF5D8F] rotate-[-2deg] shadow-xs">
                <Heart className="w-4 h-4 fill-current text-[#FF5D8F]" />
                <span className="font-handwriting text-xl">Mühürlendi & Onaylandı ❤️</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSign}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF5D8F]" />
                <span>Maddeleri Kabul Ediyorum & İmzala</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
