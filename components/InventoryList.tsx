
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
    <div className="flex flex-col p-3 gap-1.5">
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
            className="bg-zinc-900/60 border border-zinc-800/60 rounded-md px-3 py-1.5 flex items-center justify-between group transition-all hover:border-zinc-700 animate-in fade-in duration-150"
          >
            <div className="flex-1 font-mono flex items-center gap-4 overflow-hidden">
              {/* Ultra-compact Quantity Control */}
              <div className="flex items-center gap-1.5 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800/40 shrink-0">
                <button 
                  onClick={() => onUpdateQty(item.id, -1)}
                  className="text-zinc-600 hover:text-white transition-colors disabled:opacity-0 p-0.5"
                  disabled={item.qty <= 1}
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span 
                  className="font-black text-lg min-w-[1rem] text-center select-none"
                  style={{ color: 'var(--accent)' }}
                >
                  {item.qty}
                </span>
                <button 
                  onClick={() => onUpdateQty(item.id, 1)}
                  className="text-zinc-600 hover:text-white transition-colors p-0.5"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>

              <div className="flex flex-col min-w-0">
                {/* Primary Readout: 3060 SH */}
                <div className="flex items-baseline gap-2">
                  <h3 className="text-zinc-100 font-bold text-lg tracking-tight uppercase leading-none">
                    {sizeCode} <span style={{ color: 'var(--accent-comp)' }} className="opacity-90">{typePart}</span>
                  </h3>
                  <span className="text-[9px] font-medium text-zinc-500 bg-zinc-800/20 px-1 rounded border border-zinc-800/30 whitespace-nowrap">
                    {item.width}"×{item.height}"
                  </span>
                </div>
                
                {/* Secondary Specs Row */}
                {secondaryParts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-1.5 mt-0.5 leading-none">
                    {secondaryParts.map((part, idx) => (
                      <span 
                        key={idx}
                        className="text-[8px] font-black uppercase tracking-widest"
                        style={{ color: 'color-mix(in srgb, var(--accent-comp), transparent 40%)' }}
                      >
                        {part}
                        {idx < secondaryParts.length - 1 && <span className="ml-1 text-zinc-800">•</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => onRemove(item.id)}
              className="p-1.5 text-zinc-700 hover:text-red-500 transition-colors ml-2 shrink-0 hover:bg-red-500/5 rounded"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryList;
