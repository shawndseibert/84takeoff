
import React, { useState, useMemo } from 'react';
import { Item, WindowType } from '../types';
import WheelPicker from './WheelPicker';
import { Plus, Shield, Ruler, ChevronRight, ChevronLeft, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Props {
  onAdd: (item: Omit<Item, 'id'>) => void;
  types: string[];
  transoms: string[];
}

const ItemEntry: React.FC<Props> = ({ onAdd, types, transoms }) => {
  // Sensible defaults: 3660 SH (3'0" x 5'0" Single Hung)
  const [qty, setQty] = useState(1);
  const [width, setWidth] = useState(36);
  const [height, setHeight] = useState(60);
  const [type, setType] = useState<string>(types[0] || 'SH');
  const [tempered, setTempered] = useState(false);
  const [drywall, setDrywall] = useState(false);
  const [transom, setTransom] = useState('None');
  const [handing, setHanding] = useState<'LH' | 'RH' | 'NONE'>('NONE');
  const [swing, setSwing] = useState<'IS' | 'OS' | 'NONE'>('NONE');

  const qtys = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);
  const widths = useMemo(() => Array.from({ length: 241 }, (_, i) => i + 4), []);
  const heights = useMemo(() => Array.from({ length: 241 }, (_, i) => i + 4), []);

  const handleAdd = () => {
    onAdd({
      qty, width, height, 
      type: type as WindowType, 
      tempered, drywall, transom,
      handing: type === 'DOOR' ? handing : 'NONE',
      swing: type === 'DOOR' ? swing : 'NONE'
    });
  };

  const isDoor = type === 'DOOR';

  return (
    <div className="flex flex-col p-4 md:p-0 gap-4">
      <div className="flex justify-between items-start gap-2">
        <WheelPicker label="Qty" options={qtys} value={qty} onChange={(val) => setQty(Number(val))} />
        <WheelPicker label="Width" options={widths} value={width} onChange={(val) => setWidth(Number(val))} />
        <WheelPicker label="Height" options={heights} value={height} onChange={(val) => setHeight(Number(val))} />
        
        <div className="flex flex-col items-center gap-2 min-w-[84px]">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Type</span>
          <div className="grid grid-cols-2 gap-1.5 w-full h-32 overflow-y-auto no-scrollbar bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 shadow-inner">
            {types.map(t => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  // Auto-adjust height for doors if needed
                  if (t === 'DOOR' && height < 80) setHeight(80);
                }}
                className={`text-[9px] font-black min-h-[40px] rounded-lg border transition-all flex items-center justify-center px-1 text-center leading-none ${
                  type === t 
                    ? 'text-white border-transparent' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                }`}
                style={type === t ? {
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 0 15px color-mix(in srgb, var(--accent), transparent 50%)'
                } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <WheelPicker label="Transom" options={transoms} value={transom} onChange={(val) => setTransom(String(val))} />
      </div>

      {isDoor && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="flex-1 flex gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setHanding(handing === 'LH' ? 'NONE' : 'LH')}
              className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                handing === 'LH' ? 'text-white' : 'text-zinc-600'
              }`}
              style={handing === 'LH' ? { backgroundColor: 'var(--accent)' } : {}}
            >
              <ChevronLeft size={14} /> LH
            </button>
            <button
              onClick={() => setHanding(handing === 'RH' ? 'NONE' : 'RH')}
              className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                handing === 'RH' ? 'text-white' : 'text-zinc-600'
              }`}
              style={handing === 'RH' ? { backgroundColor: 'var(--accent)' } : {}}
            >
              RH <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex-1 flex gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setSwing(swing === 'IS' ? 'NONE' : 'IS')}
              className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                swing === 'IS' ? 'text-white' : 'text-zinc-600'
              }`}
              style={swing === 'IS' ? { backgroundColor: 'var(--accent)' } : {}}
            >
              <ArrowDownCircle size={14} /> IS
            </button>
            <button
              onClick={() => setSwing(swing === 'OS' ? 'NONE' : 'OS')}
              className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                swing === 'OS' ? 'text-white' : 'text-zinc-600'
              }`}
              style={swing === 'OS' ? { backgroundColor: 'var(--accent)' } : {}}
            >
              OS <ArrowUpCircle size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setTempered(!tempered)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border transition-all ${
              tempered ? 'bg-amber-500 border-amber-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-600'
            }`}
            style={tempered ? {
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            } : {}}
          >
            <Shield size={20} />
            <span className="text-[9px] font-black mt-1">TMP</span>
          </button>
          <button
            onClick={() => setDrywall(!drywall)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border transition-all ${
              drywall ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-600'
            }`}
            style={drywall ? {
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            } : {}}
          >
            <Ruler size={20} />
            <span className="text-[9px] font-black mt-1">DRY</span>
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 active:scale-[0.98] text-white h-14 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 shadow-xl"
          style={{ 
            backgroundColor: 'var(--accent)',
            boxShadow: '0 4px 25px -5px color-mix(in srgb, var(--accent), transparent 40%)'
          }}
        >
          <Plus size={20} strokeWidth={3} />
          ADD {isDoor ? 'DOOR' : 'WINDOW'}
        </button>
      </div>
    </div>
  );
};

export default ItemEntry;
