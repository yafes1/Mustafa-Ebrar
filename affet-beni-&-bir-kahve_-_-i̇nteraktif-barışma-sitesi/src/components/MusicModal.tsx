import React, { useState, useEffect, useRef } from 'react';
import { X, Music, Volume2, Upload, Play, Pause, Check, Disc } from 'lucide-react';
import { sound } from '../utils/audio';
import { MusicConfig, MusicType } from '../types';

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMusic: (music: MusicConfig) => void;
}

const PRESET_TRACKS: Array<{ type: MusicType; title: string; subtitle: string; icon: string; customUrl?: string }> = [
  {
    type: 'sensiz-olmaz',
    title: 'Sensiz Olmaz ❤️ (Önerilen)',
    subtitle: '"Ah olmaz olmaz, sensiz olmaz..." (Mustafa & Ebrar İçin Özel Şarkı)',
    icon: '🎵',
    customUrl: '/assets/aistudio/videoplayback_40b8365a.mp3',
  },
  {
    type: 'synth-piano',
    title: 'Akustik Romantik Melodi',
    subtitle: 'Sıcak piyano akorları, kalpleri yumuşatan atmosfer',
    icon: '🎹'
  },
  {
    type: 'music-box',
    title: 'Nostaljik Aşk Müzik Kutusu',
    subtitle: 'Masum, narin ve duygusal melodi çanları',
    icon: '✨'
  },
  {
    type: 'synth-lofi',
    title: 'Yumuşak Lofi Kafe Tınıları',
    subtitle: 'Sakin, huzurlu, kahve içerken konuşmalık',
    icon: '☕'
  }
];

export const MusicModal: React.FC<MusicModalProps> = ({ isOpen, onClose, onSaveMusic }) => {
  const [currentConfig, setCurrentConfig] = useState<MusicConfig>(sound.getCurrentMusic());
  const [isPlaying, setIsPlaying] = useState<boolean>(sound.isMusicPlaying());
  const [volume, setVolume] = useState<number>(sound.getVolume());
  const [customUrlInput, setCustomUrlInput] = useState<string>(currentConfig.customUrl || '');
  const [uploadedFileName, setUploadedFileName] = useState<string>(currentConfig.fileName || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with sound engine
  useEffect(() => {
    const unsub = sound.subscribe(() => {
      setIsPlaying(sound.isMusicPlaying());
      setCurrentConfig(sound.getCurrentMusic());
      setVolume(sound.getVolume());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_TRACKS[0]) => {
    sound.playPop();
    const newConfig: MusicConfig = {
      type: preset.type,
      title: preset.title,
      customUrl: preset.customUrl,
    };
    setCurrentConfig(newConfig);
    sound.setMusic(newConfig, true);
    onSaveMusic(newConfig);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playPop();
    const objectUrl = URL.createObjectURL(file);
    const newConfig: MusicConfig = {
      type: 'custom-file',
      title: file.name.replace(/\.[^/.]+$/, ''),
      customUrl: objectUrl,
      fileName: file.name,
    };
    setUploadedFileName(file.name);
    setCurrentConfig(newConfig);
    sound.setMusic(newConfig, true);
    onSaveMusic(newConfig);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    sound.playPop();
    const newConfig: MusicConfig = {
      type: 'custom-url',
      title: 'Özel Şarkı Bağlantısı',
      customUrl: customUrlInput.trim(),
    };
    setCurrentConfig(newConfig);
    sound.setMusic(newConfig, true);
    onSaveMusic(newConfig);
  };

  const handleTogglePlay = () => {
    sound.playPop();
    sound.toggleBgm();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-stone-200 overflow-y-auto max-h-[88vh] text-left animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-3 sm:hidden" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#FF5D8F]/15 text-[#FF5D8F] rounded-xl">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Arka Plan Müziğini Değiştir</h3>
              <p className="text-xs text-stone-500">Hazır melodilerden seç veya kendi özel şarkınızı yükle</p>
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

        {/* Current Playing Bar */}
        <div className="my-5 p-4 bg-[#F5F5F7] rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-10 h-10 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
            <div className="truncate">
              <div className="text-[11px] font-bold text-[#FF5D8F] uppercase tracking-wider">
                {isPlaying ? 'Şu An Çalıyor' : 'Durduruldu'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                {currentConfig.title}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`p-2.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="mb-6 px-1">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Ses Seviyesi</span>
            </span>
            <span className="font-mono text-stone-400">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-[#6D28D9] cursor-pointer"
          />
        </div>

        {/* Option 1: Built-in presets */}
        <div className="space-y-4 mb-6">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            1. Hazır Romantik Melodiler
          </label>
          <div className="space-y-2">
            {PRESET_TRACKS.map((preset) => {
              const isSelected = currentConfig.type === preset.type;
              return (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[50px] ${
                    isSelected
                      ? 'bg-[#6D28D9]/10 border-[#6D28D9] shadow-xs ring-1 ring-[#6D28D9]'
                      : 'bg-[#F5F5F7] hover:bg-stone-200 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{preset.icon}</span>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-stone-800">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-stone-500">{preset.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#6D28D9] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Option 2: Upload MP3 */}
        <div className="space-y-3 mb-6 pt-4 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            2. Kendi Şarkınızı Yükleyin (Cihazınızdan MP3)
          </label>
          <p className="text-xs text-stone-500">
            Arkadaşının sevgilisiyle olan özel şarkısını doğrudan telefonundan veya bilgisayarından seçebilirsin.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2.5 p-3.5 bg-[#FF5D8F]/10 hover:bg-[#FF5D8F]/20 border border-dashed border-[#FF5D8F]/40 text-stone-900 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer min-h-[48px]"
          >
            <Upload className="w-4 h-4 text-[#FF5D8F]" />
            <span>
              {uploadedFileName ? `Yüklendi: ${uploadedFileName}` : '📁 Cihazından Şarkı / MP3 Seç'}
            </span>
          </button>
        </div>

        {/* Option 3: External URL Link */}
        <div className="space-y-2 pt-4 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            3. Veya Şarkı Bağlantısı (Ses / MP3 Linki) Yapıştır
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://.../sarki.mp3"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="flex-1 bg-[#F5F5F7] border border-stone-200 text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#6D28D9] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-3.5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0"
            >
              Uygula
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-6 border-t border-stone-100 mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            Tamam, Kaydet
          </button>
        </div>

      </div>
    </div>
  );
};
