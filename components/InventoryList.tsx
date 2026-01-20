
import React from 'react';
import { Item } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  items: Item[];
  onRemove: (id: string) => void;
}

const formatSizeCode = (width: number, height: number): string => {
  const wFt = Math.floor(width / 12);
  const wIn = width % 12;
  const hFt = Math.floor(height / 12);
  const hIn = height % 12;
  return `${wFt}${wIn}${hFt}${hIn}`;
};

const InventoryList: React.FC<Props> = ({ items, onRemove }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 p-4 gap-4">
      {items.map((item) => {
        const sizeCode = formatSizeCode(item.width, item.height);
        const typePart = item.type;
        const transomPart = item.transom !== 'None' ? `${item.transom} TR` : '';
        const drywallPart = item.drywall ? 'DRY' : '';
        const temperedPart = item.tempered ? 'TMP' : '';
        const handingPart = (item.type === 'DOOR' && item.handing !== 'NONE') ? item.handing : '';
        const swingPart = (item.type === 'DOOR' && item.swing !== 'NONE') ? item.swing : '';

        const labelParts = [
          sizeCode,
          typePart,
          transomPart,
          drywallPart,
          temperedPart,
          handingPart,
          swingPart
        ].filter(Boolean);

        return (
          <div 
            key={item.id} 
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between group transition-all hover:border-zinc-700 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex-1 font-mono flex items-center gap-5 overflow-hidden">
              <span 
                className="font-black text-3xl min-w-[1.5rem] transition-colors duration-300"
                style={{ color: 'var(--accent)' }}
              >
                {item.qty}
              </span>
              <span className="flex-1 uppercase font-bold text-lg flex flex-wrap gap-y-1 items-center tracking-tighter truncate">
                {labelParts.map((part, idx) => (
                  <React.Fragment key={idx}>
                    <span 
                      className="transition-colors duration-300 whitespace-nowrap"
                      style={{ color: 'var(--accent-comp)' }}
                    >
                      {part}
                    </span>
                    {idx < labelParts.length - 1 && (
                      <span className="mx-2 text-zinc-800 font-normal opacity-40 select-none">•</span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </div>
            
            <button 
              onClick={() => onRemove(item.id)}
              className="p-2 text-zinc-700 hover:text-red-500 transition-colors ml-4 shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={22} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryList;
