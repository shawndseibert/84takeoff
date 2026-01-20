
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Download, Trash2, Plus, Minus, MapPin, Box
} from 'lucide-react';

// --- Types ---
interface Item {
  id: string;
  qty: number;
  width: number;
  height: number;
  type: string;
  tempered: boolean;
  drywall: boolean;
  transom: string;
  handing: 'LH' | 'RH' | 'NONE';
  swing: 'IS' | 'OS' | 'NONE';
}

interface JobInfo {
  address: string;
  windowSpec: string;
  doorSpec: string;
}

// --- Components ---

const WheelPicker = <T extends string | number,>({ options, value, onChange, label }: { options: T[], value: T, onChange: (val: T) => void, label?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInternalScrolling, setIsInternalScrolling] = useState(false);
  const [localActiveIndex, setLocalActiveIndex] = useState(-1);
  const scrollTimeout = useRef<number | null>(null);
  const ITEM_HEIGHT = 40;
  const CENTER_PADDING = 44;

  const getIndex = useCallback((val: T) => options.findIndex(opt => String(opt) === String(val)), [options]);

  useEffect(() => {
    if (!isInternalScrolling) {
      const index = getIndex(value);
      setLocalActiveIndex(index);
      scrollRef.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'auto' });
    }
  }, [value, isInternalScrolling, getIndex]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setIsInternalScrolling(true);
    const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
    if (index !== localActiveIndex && index >= 0 && index < options.length) setLocalActiveIndex(index);
    if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    scrollTimeout.current = window.setTimeout(() => {
      if (scrollRef.current) {
        const finalIndex = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
        if (finalIndex >= 0 && finalIndex < options.length) {
          const newValue = options[finalIndex];
          if (String(newValue) !== String(value)) onChange(newValue);
          scrollRef.current.scrollTo({ top: finalIndex * ITEM_HEIGHT, behavior: 'smooth' });
        }
      }
      setTimeout(() => setIsInternalScrolling(false), 150);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      {label && <span className="text-[9px] text-zinc-500 font-bold mb-1.5 uppercase tracking-widest">{label}</span>}
      <div className="relative w-full h-32 overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner group">
        <div className="absolute inset-x-0 top-[44px] h-10 pointer-events-none z-0 border-y border-zinc-700/20 bg-white/[0.02]" />
        <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory relative z-20" style={{ paddingTop: `${CENTER_PADDING}px`, paddingBottom: `${CENTER_PADDING}px` }}>
          {options.map((opt, i) => (
            <div key={i} onClick={() => onChange(opt)} className={`h-[40px] flex items-center justify-center snap-center cursor-pointer transition-all duration-300 tabular-nums ${i === localActiveIndex ? 'font-black text-xl opacity-100' : 'text-zinc-600 text-xs font-medium opacity-30'}`} style={i === localActiveIndex ? { color: 'var(--accent)' } : {}}>
              {opt}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none z-30 bg-gradient-to-b from-zinc-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-30 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>
    </div>
  );
};

const ItemEntryForm = ({ onAdd, accentColor }: { onAdd: (item: Omit<Item, 'id'>) => void, accentColor: string }) => {
  const [qty, setQty] = useState(1);
  const [width, setWidth] = useState(36);
  const [height, setHeight] = useState(60);
  const [type, setType] = useState('SH');
  const [transom, setTransom] = useState('None');
  const [tempered, setTempered] = useState(false);
  const [drywall, setDrywall] = useState(false);

  const qtys = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20], []);
  const widths = useMemo(() => [24, 30, 32, 36, 48, 60, 72], []);
  const heights = useMemo(() => [36, 48, 60, 72, 80, 96], []);
  const transoms = useMemo(() => ['None', "1'", "1'2\"", "1'4\"", "1'6\"", "2'"], []);
  const types = ['SH', 'DH', 'FIXED', 'DOOR'];

  const handleAdd = () => {
    onAdd({
      qty, width, height, type, tempered, drywall, transom,
      handing: 'NONE',
      swing: 'NONE'
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5">
        <WheelPicker label="Qty" options={qtys} value={qty} onChange={(v) => setQty(Number(v))} />
        <WheelPicker label="W" options={widths} value={width} onChange={(v) => setWidth(Number(v))} />
        <WheelPicker label="H" options={heights} value={height} onChange={(v) => setHeight(Number(v))} />
        <WheelPicker label="TR" options={transoms} value={transom} onChange={(v) => setTransom(String(v))} />
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Type</span>
        <div className="grid grid-cols-4 gap-1.5">
          {types.map(t => (
            <button 
              key={t} 
              onClick={() => setType(t)} 
              className={`text-[10px] font-black py-2.5 rounded-lg border transition-all ${type === t ? 'text-white border-transparent' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
              style={type === t ? { backgroundColor: accentColor } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setTempered(!tempered)} 
          className={`flex-1 py-3 rounded-xl font-black text-[10px] border transition-all ${tempered ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/20' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
        >
          TEMPERED
        </button>
        <button 
          onClick={() => setDrywall(!drywall)} 
          className={`flex-1 py-3 rounded-xl font-black text-[10px] border transition-all ${drywall ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
        >
          DRYWALL
        </button>
      </div>
      <button 
        onClick={handleAdd} 
        className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xl"
      >
        <Plus size={20} strokeWidth={3} /> ADD TO LIST
      </button>
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [accentColor, setAccentColor] = useState('#d6001c');
  const [jobInfo, setJobInfo] = useState<JobInfo>({ address: '', windowSpec: '', doorSpec: '' });

  const addItem = (item: Omit<Item, 'id'>) => {
    setItems([{ id: crypto.randomUUID(), ...item } as Item, ...items]);
  };

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const exportCSV = () => {
    const headers = ["Qty", "Code", "Type", "W", "H", "Transom", "Tempered", "Drywall"];
    const rows = items.map(item => [
      item.qty,
      `${item.width}${item.height}`,
      item.type,
      item.width,
      item.height,
      item.transom,
      item.tempered ? 'YES' : 'NO',
      item.drywall ? 'YES' : 'NO'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `84_takeoff_${jobInfo.address || 'export'}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 overflow-hidden text-zinc-100" style={{ '--accent': accentColor, '--accent-comp': '#00f2ff' } as any}>
      
      {/* Sidebar */}
      <aside className="w-full md:w-[360px] lg:w-[400px] border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-6 shrink-0 bg-zinc-900/20 backdrop-blur-3xl z-30">
        <div className="flex justify-between items-center">
          <h1 className="font-black text-2xl tracking-tighter uppercase leading-none">84<span className="text-zinc-600 font-light ml-1">Takeoff</span></h1>
          <button onClick={exportCSV} className="md:hidden p-2 bg-zinc-800 rounded-lg text-zinc-400"><Download size={18} /></button>
        </div>
        
        <div className="space-y-2.5">
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-600 transition-colors" placeholder="Job Address" value={jobInfo.address} onChange={e => setJobInfo({...jobInfo, address: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600 transition-colors" placeholder="Window Spec" value={jobInfo.windowSpec} onChange={e => setJobInfo({...jobInfo, windowSpec: e.target.value})} />
            <input className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600 transition-colors" placeholder="Door Spec" value={jobInfo.doorSpec} onChange={e => setJobInfo({...jobInfo, doorSpec: e.target.value})} />
          </div>
        </div>

        <div className="hidden md:block">
          <ItemEntryForm onAdd={addItem} accentColor={accentColor} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        <div className="sticky top-0 z-20 bg-zinc-950/60 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-zinc-800/40">
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Inventory</span>
             <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold">{items.length}</span>
           </div>
           <button onClick={exportCSV} className="hidden md:flex items-center gap-2 bg-zinc-100 text-zinc-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-white active:scale-95">
             <Download size={14} /> EXPORT CSV
           </button>
        </div>

        <div className="flex-1 flex flex-col p-4 md:p-6 gap-2 pb-72 md:pb-6">
          {items.map(item => (
            <div key={item.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between group hover:border-zinc-700 transition-all animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1.5 rounded-lg border border-zinc-800">
                  <button onClick={() => updateQty(item.id, -1)} className="text-zinc-600 hover:text-white" disabled={item.qty <= 1}><Minus size={14} /></button>
                  <span className="font-black text-2xl min-w-[1.2rem] text-center" style={{ color: 'var(--accent)' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="text-zinc-600 hover:text-white"><Plus size={14} /></button>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-2xl uppercase tracking-tighter leading-none">
                      {item.width}{item.height}
                      {item.transom !== 'None' && <span className="text-zinc-500 text-lg font-light ml-1">+{item.transom}</span>}
                      <span className="opacity-80 ml-2" style={{ color: 'var(--accent-comp)' }}>{item.type}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-zinc-600">{item.width}"×{item.height}"</span>
                    {item.transom !== 'None' && <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-1.5 rounded leading-tight">TRANSOM</span>}
                    {item.tempered && <span className="text-[9px] font-black text-amber-500 tracking-widest bg-amber-500/10 px-1.5 rounded leading-tight">TMP</span>}
                    {item.drywall && <span className="text-[9px] font-black text-emerald-500 tracking-widest bg-emerald-500/10 px-1.5 rounded leading-tight">DRY</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-zinc-800 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/5"><Trash2 size={20} /></button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-32">
              <Box size={64} className="mb-4" strokeWidth={1} />
              <span className="font-black text-4xl uppercase italic select-none">No Items</span>
            </div>
          )}
        </div>

        {/* Mobile Entry Form */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 p-4 shadow-2xl z-40 pb-safe">
           <ItemEntryForm onAdd={addItem} accentColor={accentColor} />
        </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
