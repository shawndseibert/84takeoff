
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { X, Check, Plus, Zap, ZapOff } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  isAuto: boolean;
  setIsAuto: (val: boolean) => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#ffffff',
];

const ColorDisc = ({ color, onSelect, label }: { color: string, onSelect: (c: string) => void, label: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hsl = useMemo(() => {
    const parts = color.match(/\d+(\.\d+)?/g);
    if (parts && parts.length >= 3) {
      return { h: parseFloat(parts[0]), s: parseFloat(parts[1]), l: parseFloat(parts[2]) };
    }
    return { h: 0, s: 100, l: 50 };
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const sat = (dist / radius) * 100;
          ctx.fillStyle = `hsl(${angle}, ${sat}%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, []);

  const handlePointer = (e: React.PointerEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const radius = canvas.width / 2;
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;
    const dist = Math.min(Math.sqrt(x * x + y * y), radius);
    const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const sat = (dist / radius) * 100;
    onSelect(`hsl(${angle.toFixed(0)}, ${sat.toFixed(0)}%, 50%)`);
  };

  const cursorStyle = {
    left: `${90 + (hsl.s / 100) * 90 * Math.cos(hsl.h * Math.PI / 180)}px`,
    top: `${90 + (hsl.s / 100) * 90 * Math.sin(hsl.h * Math.PI / 180)}px`,
    borderColor: '#fff'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
      <div className="relative">
        <canvas 
          ref={canvasRef} width={180} height={180}
          onMouseDown={(e) => { setIsDragging(true); handlePointer(e); }}
          onMouseMove={(e) => isDragging && handlePointer(e)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="rounded-full shadow-lg cursor-crosshair ring-2 ring-zinc-800"
        />
        <div className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 shadow-xl pointer-events-none" style={cursorStyle} />
      </div>
    </div>
  );
};

const ColorPickerModal: React.FC<Props> = ({ isOpen, onClose, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, isAuto, setIsAuto }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Theme Master</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Pairing Preview */}
          <div className="w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-6 flex flex-col gap-3 shadow-inner">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Style Interaction</span>
               <button 
                onClick={() => setIsAuto(!isAuto)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black transition-all border ${isAuto ? 'bg-zinc-100 text-zinc-950 border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
               >
                 {isAuto ? <Zap size={10} fill="currentColor" /> : <ZapOff size={10} />}
                 {isAuto ? 'AUTO COMPLEMENT' : 'MANUAL MODE'}
               </button>
             </div>
             <div className="flex items-center gap-5">
                <div 
                   className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300"
                   style={{ 
                     backgroundColor: 'var(--accent)',
                     boxShadow: '0 4px 20px -5px color-mix(in srgb, var(--accent), transparent 50%)' 
                   }}
                >
                  <Plus size={20} className="text-white" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                   <span className="font-mono text-xl font-black uppercase tracking-tighter truncate transition-all duration-300" style={{ color: 'var(--accent-comp)' }}>
                      3050 • SH • TMP
                   </span>
                   <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Theme Preview</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-8 w-full">
            <ColorDisc label="Primary Accent" color={primaryColor} onSelect={setPrimaryColor} />
            
            {!isAuto && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <ColorDisc label="Secondary Accent" color={secondaryColor} onSelect={setSecondaryColor} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 w-full my-8 shrink-0">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setPrimaryColor(color)}
                className="group relative aspect-square rounded-xl border border-white/5 transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: color }}
              >
                {primaryColor.toLowerCase().includes(color.toLowerCase()) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                    <Check size={16} className={color === '#ffffff' ? 'text-black' : 'text-white'} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 bg-zinc-950/50 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-zinc-100 text-zinc-950 text-xs font-black rounded-xl hover:bg-white active:scale-[0.98] transition-all tracking-widest shadow-xl"
          >
            CONFIRM THEME
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default ColorPickerModal;
