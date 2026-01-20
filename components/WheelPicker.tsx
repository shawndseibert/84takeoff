
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';

interface Props<T> {
  options: T[];
  value: T;
  onChange: (val: T) => void;
  label?: string;
}

const WheelPicker = <T extends string | number,>({ options, value, onChange, label }: Props<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInternalScrolling, setIsInternalScrolling] = useState(false);
  const [localActiveIndex, setLocalActiveIndex] = useState(-1);
  const scrollTimeout = useRef<number | null>(null);
  const lastWheelTime = useRef<number>(0);

  const ITEM_HEIGHT = 40;
  const CENTER_PADDING = 44;

  const getIndex = useCallback((val: T) => {
    return options.findIndex(opt => String(opt) === String(val));
  }, [options]);

  useEffect(() => {
    if (!isInternalScrolling) {
      const index = getIndex(value);
      setLocalActiveIndex(index);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: index * ITEM_HEIGHT,
          behavior: 'auto'
        });
      }
    }
  }, [value, isInternalScrolling, getIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsInternalScrolling(true);
    const scrollTop = scrollRef.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    if (index !== localActiveIndex && index >= 0 && index < options.length) {
      setLocalActiveIndex(index);
    }
    if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    scrollTimeout.current = window.setTimeout(() => {
      if (scrollRef.current) {
        const finalScrollTop = scrollRef.current.scrollTop;
        const finalIndex = Math.round(finalScrollTop / ITEM_HEIGHT);
        if (finalIndex >= 0 && finalIndex < options.length) {
          const newValue = options[finalIndex];
          if (String(newValue) !== String(value)) onChange(newValue);
          scrollRef.current.scrollTo({ top: finalIndex * ITEM_HEIGHT, behavior: 'smooth' });
        }
      }
      setTimeout(() => setIsInternalScrolling(false), 150);
    }, 100);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastWheelTime.current < 80) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const currentIndex = localActiveIndex !== -1 ? localActiveIndex : getIndex(value);
    const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction));

    if (nextIndex !== currentIndex) {
      lastWheelTime.current = now;
      setIsInternalScrolling(true);
      setLocalActiveIndex(nextIndex);
      onChange(options[nextIndex]);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: nextIndex * ITEM_HEIGHT, behavior: 'smooth' });
      }
      setTimeout(() => setIsInternalScrolling(false), 200);
    }
  };

  const nudgeUp = () => {
    const currentIndex = getIndex(value);
    if (currentIndex < options.length - 1) onChange(options[currentIndex + 1]);
  };

  const nudgeDown = () => {
    const currentIndex = getIndex(value);
    if (currentIndex > 0) onChange(options[currentIndex - 1]);
  };

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      {label && (
        <span className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-[0.2em] select-none text-center">
          {label}
        </span>
      )}
      <div 
        className="relative w-full max-w-[84px] h-32 overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner group"
        onWheel={handleWheel}
      >
        {/* Discrete nudge buttons on the left - slightly visible by default */}
        <div className="absolute left-0 top-0 bottom-0 w-6 z-40 flex flex-col pointer-events-none group-hover:pointer-events-auto opacity-20 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); nudgeDown(); }}
            className="flex-1 border-r border-zinc-800 bg-zinc-900/10 hover:bg-zinc-800/40 transition-colors flex items-center justify-center text-zinc-600 hover:text-white"
            title="Nudge Up"
          >
            <Minus size={10} strokeWidth={4} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nudgeUp(); }}
            className="flex-1 border-r border-t border-zinc-800 bg-zinc-900/10 hover:bg-zinc-800/40 transition-colors flex items-center justify-center text-zinc-600 hover:text-white"
            title="Nudge Down"
          >
            <Plus size={10} strokeWidth={4} />
          </button>
        </div>

        {/* Selection highlight overlay */}
        <div className="absolute inset-x-0 top-[44px] h-10 pointer-events-none z-0 border-y border-zinc-700/20 bg-white/[0.02]" />

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-smooth relative z-20"
          style={{ paddingTop: `${CENTER_PADDING}px`, paddingBottom: `${CENTER_PADDING}px` }}
        >
          {options.map((opt, i) => {
            const isActive = i === localActiveIndex;
            return (
              <div 
                key={i} 
                onClick={() => {
                  onChange(opt);
                  setLocalActiveIndex(i);
                  scrollRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                }}
                className={`h-[40px] flex items-center justify-center snap-center cursor-pointer transition-all duration-300 select-none tabular-nums ${
                  isActive ? 'font-black text-2xl opacity-100 z-50' : 'text-zinc-600 text-sm font-medium opacity-30 z-10'
                }`}
                style={isActive ? { color: 'var(--accent)', textShadow: '0 0 10px color-mix(in srgb, var(--accent), transparent 60%)' } : {}}
              >
                {opt}
              </div>
            );
          })}
        </div>
        
        {/* Gradient overlays for "wheel" effect */}
        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none z-30 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-30 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>
    </div>
  );
};

export default WheelPicker;
