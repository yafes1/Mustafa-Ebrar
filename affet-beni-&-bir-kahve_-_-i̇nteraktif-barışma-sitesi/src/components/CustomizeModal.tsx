import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Send, Heart, Music } from 'lucide-react';
import { CoupleConfig, SiteMode } from '../types';
import { sound } from '../utils/audio';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CoupleConfig;
  onSaveConfig: (newConfig: CoupleConfig) => void;
  onOpenMusicModal: () => void;
}

const NOTE_PRESETS = [
  {
    label: 'İçten & Duygusal',
    text: 'Sensiz geçen her gün bana senin kıymetini bin kat daha fazla anlattı. Seni kırdığım her an için tüm kalbimle özür dilerim. Gel bütün kırgınlıkları unutup yeniden başlayalım.'
  },
  {
    label: 'Esprili & Tatlı',
    text: 'Biliyorum biraz inatçıyım ama inan bana sensiz hiç çekilmiyorum! Barışırsak sana söz dünyanın en uslu sevgilisi olacağım ve tüm kahveler benden olacak.'
  },
  {
    label: 'Kısa & Net',
    text: 'Seni çok özledim. Hatalarımı anladım ve telafi etmek istiyorum. Bir fincan kahve içip konuşalım mı?'
  }
];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onOpenMusicModal,
}) => {
  const [senderName, setSenderName] = useState(config.senderName);
  const [receiverName, setReceiverName] = useState(config.receiverName);
  const [customNote, setCustomNote] = useState(config.customNote || NOTE_PRESETS[0].text);
  const [mode, setMode] = useState<SiteMode>(config.mode || 'all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentMusic = sound.getCurrentMusic();

  const generateShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    const params = new URLSearchParams();
    params.set('from', senderName.trim() || 'Mustafa');
    params.set('to', receiverName.trim() || 'Ebrar');
    if (customNote.trim()) params.set('note', customNote.trim());
    if (mode !== 'all') params.set('mode', mode);
    if (currentMusic.type && currentMusic.type !== 'sensiz-olmaz') {
      params.set('musicType', currentMusic.type);
    }
    if (currentMusic.type === 'custom-url' && currentMusic.customUrl) {
      params.set('musicUrl', currentMusic.customUrl);
    }
    return `${origin}?${params.toString()}`;
  };

  const handleCopyLink = () => {
    sound.playPop();
    const url = generateShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveAndApply = () => {
    sound.playSuccess();
    onSaveConfig({
      senderName: senderName.trim() || 'Mustafa',
      receiverName: receiverName.trim() || 'Ebrar',
      customNote: customNote.trim(),
      mode,
      musicConfig: currentMusic,
    });
    onClose();
  };

  const shareUrl = generateShareUrl();
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Sana özel bir şey hazırladım, lütfen bir bakar mısın? ❤️✨\n${shareUrl}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-stone-200 overflow-y-auto max-h-[88vh] text-left animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-3 sm:hidden" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FF5D8F]/15 text-[#FF5D8F] rounded-xl">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Arkadaşın İçin Özelleştir</h3>
              <p className="text-xs text-stone-500">İsimleri, notu ve müziği ayarlayarak özel link oluştur</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-4 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Özür Dileyen Kişi (Arkadaşın)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Örn: Mustafa"
                className="w-full bg-[#F5F5F7] border border-stone-200 text-stone-900 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#6D28D9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Gönlü Alınacak Kişi (Sevgilisi)
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Örn: Ebrar"
                className="w-full bg-[#F5F5F7] border border-stone-200 text-stone-900 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#6D28D9] focus:outline-none"
              />
            </div>
          </div>

          {/* Music Quick Setting */}
          <div className="p-3.5 bg-[#6D28D9]/5 rounded-2xl border border-[#6D28D9]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 bg-[#6D28D9]/10 text-[#6D28D9] rounded-xl shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-semibold text-[#6D28D9] uppercase tracking-wider">
                  Arka Plan Müziği
                </div>
                <div className="text-xs font-medium text-stone-800 truncate">
                  {currentMusic.title}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onOpenMusicModal();
              }}
              className="px-3 py-1.5 bg-white hover:bg-[#6D28D9]/10 border border-[#6D28D9]/40 text-[#6D28D9] rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Müziği Değiştir
            </button>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Sayfa Konsepti / Mod
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Tam Paket (Özür + Kahve)' },
                { id: 'apology', label: 'Sadece Özür Sitesi' },
                { id: 'coffee', label: 'Sadece Kahve Teklifi' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setMode(m.id as SiteMode);
                  }}
                  className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    mode === m.id
                      ? 'bg-[#6D28D9] text-white font-semibold shadow-xs border-[#6D28D9]'
                      : 'bg-[#F5F5F7] border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Özel Mektup / Özür Cümlesi
              </label>
              <span className="text-[11px] text-stone-400">Hazır şablonlar aşağıda</span>
            </div>
            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="İçinden gelenleri buraya yazabilirsin..."
              className="w-full bg-[#F5F5F7] border border-stone-200 text-stone-900 text-xs sm:text-sm rounded-xl p-3 focus:ring-2 focus:ring-[#6D28D9] focus:outline-none leading-relaxed"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {NOTE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setCustomNote(preset.text);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-[#FF5D8F]/10 hover:bg-[#FF5D8F]/20 text-stone-800 rounded-lg border border-[#FF5D8F]/30 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Share Link Box */}
          <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-stone-200">
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Oluşturulan Özel Bağlantı Linki
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 truncate font-mono">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#FF5D8F]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playPop()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors text-center"
          >
            <Send className="w-4 h-4 text-[#FF5D8F]" />
            <span>WhatsApp ile Gönder</span>
          </a>

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FF5D8F]" />
            <span>Bu Bilgilerle Sayfayı Güncelle</span>
          </button>
        </div>

      </div>
    </div>
  );
};
