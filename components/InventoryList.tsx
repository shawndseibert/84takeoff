
import React from 'react';
import { Item } from '../types.ts';
import { Trash2, Plus, Minus } from 'lucide-react';

interface Props {
  items: Item[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const InventoryList: React.FC<Props> = ({ items, onRemove, onUpdateQty }) => {
  return (
    <div className="flex flex-col p-4 gap-2">
      {items.map((item) => {
        // Architectural code: e.g. 3060
        const sizeCode = `${item.width}${item.height}`;
        
        const typePart = item.type;
        const transomPart = item.transom !== 'None' ? `${item.transom} TR` : '';
        const drywallPart = item.drywall ? 'DRY' : '';
        const temperedPart = item.tempered ? 'TMP' : '';
        const handingPart = (item.type === 'DOOR' && item.handing !== 'NONE') ? item.handing : '';
        const swingPart = (item.type === 'DOOR' && item.swing !== 'NONE') ? item.swing : '';

        // Secondary labels (TMP, DRY, TR)
        const secondaryParts = [
          transomPart,
          drywallPart,
          temperedPart,
          handingPart,
          swingPart
        ].filter(Boolean);

        return (
          <div 
            key={item.id} 
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex items-center justify-between group transition-all hover:border-zinc-700 animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            <div className="flex-1 font-mono flex items-center gap-4 overflow-hidden">
              {/* Compact Quantity Control */}
              <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded border border-zinc-800/50">
                <button 
                  onClick={() => onUpdateQty(item.id, -1)}
                  className="text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
                  disabled={item.qty <= 1}
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span 
                  className="font-black text-xl min-w-[1.2rem] text-center select-none"
                  style={{ color: 'var(--accent)' }}
                >
                  {item.qty}
                </span>
                <button 
                  onClick={() => onUpdateQty(item.id, 1)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>

              <div className="flex flex-col min-w-0">
                {/* Primary Readout: 3060 SH */}
                <div className="flex items-baseline gap-2">
                  <h3 className="text-zinc-100 font-black text-xl tracking-tighter uppercase leading-tight">
                    {sizeCode} <span style={{ color: 'var(--accent-comp)' }} className="ml-1 opacity-90">{typePart}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-zinc-600 bg-zinc-800/30 px-1 rounded border border-zinc-800/50">
                    {item.width}"×{item.height}"
                  </span>
                </div>
                
                {/* Secondary: Specs */}
                {secondaryParts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-1.5 mt-0.5">
                    {secondaryParts.map((part, idx) => (
                      <span 
                        key={idx}
                        className="text-[9px] font-black uppercase tracking-widest text-zinc-500"
                        style={{ color: 'color-mix(in srgb, var(--accent-comp), transparent 30%)' }}
                      >
                        {part}
                        {idx < secondaryParts.length - 1 && <span className="ml-1.5 text-zinc-800">•</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => onRemove(item.id)}
              className="p-2 text-zinc-700 hover:text-red-500 transition-colors ml-2 shrink-0 hover:bg-red-500/5 rounded-md"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryList;
