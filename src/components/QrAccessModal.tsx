import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, X, Copy, Check, ExternalLink, Monitor, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface QrAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrAccessModal: React.FC<QrAccessModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use current window location or fallback
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://fenkod.yildizkent.meb';

  const handleCopy = () => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Akıllı Tahta & Cep Telefonu Erişimi
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Yıldızkent Ortaokulu • Karekodu okutarak cep telefonundan oyna
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative p-5 bg-white rounded-3xl shadow-2xl shadow-cyan-500/20 border-4 border-cyan-400/80 flex items-center justify-center">
            <QRCodeSVG
              value={currentUrl}
              size={220}
              level="H"
              includeMargin={false}
              fgColor="#020617"
              bgColor="#ffffff"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-cyan-300 font-bold bg-cyan-950/70 border border-cyan-800/70 px-3.5 py-1.5 rounded-full">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Kamera veya Karekod Okuyucu ile Taratın</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <Monitor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-0.5">Akıllı Tahtada</strong>
              <span className="text-slate-300">
                Sınıfta akıllı tahtada bu ekranı açık bırakın, öğrenciler sıralarından telefonlarıyla katılsın.
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block mb-0.5">Mobil Uyumluluk</strong>
              <span className="text-slate-300">
                Dokunmatik tam ekran ve blok kodlama kontrolleri cep telefonuna tam uyarlanmıştır.
              </span>
            </div>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="w-full bg-transparent text-xs text-slate-300 font-mono focus:outline-none select-all truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer transition shadow"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Linki Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Footer close */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
