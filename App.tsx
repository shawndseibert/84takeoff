
import React, { useState, useMemo } from 'react';
import { Item, JobInfo } from './types.ts';
import JobHeader from './components/JobHeader.tsx';
import InventoryList from './components/InventoryList.tsx';
import ItemEntry from './components/ItemEntry.tsx';
import ColorPickerModal from './components/ColorPickerModal.tsx';
import ConfigSettingsModal from './components/ConfigSettingsModal.tsx';
import { Download, Trash2, Plus, Palette, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [accentColor, setAccentColor] = useState('#d6001c'); 
  const [manualComplement, setManualComplement] = useState('hsl(180, 100%, 65%)');
  const [isAutoComplement, setIsAutoComplement] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [windowTypes, setWindowTypes] = useState<string[]>(['SH', 'DH', 'FIXED', 'DOOR']);
  const [transomOptions, setTransomOptions] = useState<string[]>(['None', "1'", "1'2\"", "1'4\"", "1'6\"", "1'8\"", "2'"]);

  const [jobInfo, setJobInfo] = useState<JobInfo>({
    address: '',
    windowSpec: '',
    doorSpec: ''
  });

  const autoComplementaryColor = useMemo(() => {
    let h = 0, s = 0.5, l = 0.5;
    if (accentColor.startsWith('#')) {
      const hex = accentColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
    } else if (accentColor.startsWith('hsl')) {
      const parts = accentColor.match(/\d+(\.\d+)?/g);
      if (parts && parts.length >= 3) {
        h = parseFloat(parts[0]) / 360;
        s = parseFloat(parts[1]) / 100;
        l = parseFloat(parts[2]) / 100;
      }
    }
    const compH = (h * 360 + 180) % 360;
    const compS = Math.max(s * 100, 80); 
    const compL = Math.max(l * 100, 65); 
    return `hsl(${compH.toFixed(0)}, ${compS.toFixed(0)}%, ${compL.toFixed(0)}%)`;
  }, [accentColor]);

  const finalComplement = isAutoComplement ? autoComplementaryColor : manualComplement;

  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setItems(prev => [newItem, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItemQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const clearAll = () => {
    if (window.confirm("Clear all items?")) setItems([]);
  };

  const exportCSV = () => {
    const headers = ["Address", "Window Spec", "Door Spec", "Qty", "Width", "Height", "Type", "Tempered", "Drywall", "Transom"];
    const rows = items.map(item => [
      jobInfo.address,
      jobInfo.windowSpec,
      jobInfo.doorSpec,
      item.qty,
      `${item.width}"`,
      `${item.height}"`,
      item.type,
      item.tempered ? "YES" : "NO",
      item.drywall ? "YES" : "NO",
      item.transom
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `84_takeoff_${jobInfo.address || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="flex flex-col md:flex-row h-screen bg-zinc-950 transition-colors duration-500 overflow-hidden"
      style={{ 
        '--accent': accentColor,
        '--accent-comp': finalComplement
      } as React.CSSProperties}
    >
      <aside className="w-full md:w-[400px] lg:w-[450px] shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/40 backdrop-blur-xl z-30">
        <div className="p-4 md:p-6 pb-2 md:pb-6 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-6 hidden md:flex">
             <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden shrink-0" style={{ backgroundColor: '#d6001c' }}>
                  <span className="text-white font-black text-xl leading-none select-none tracking-tighter">84</span>
                </div>
                <h1 className="font-extrabold tracking-tight text-xl uppercase">84<span className="text-zinc-500 font-light ml-1">Takeoff</span></h1>
             </div>
             <div className="flex gap-1">
               <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors" title="Configuration Options">
                 <Settings size={18} />
               </button>
               <button onClick={() => setIsPickerOpen(true)} className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors" title="Theme Settings">
                 <Palette size={18} style={{ color: isPickerOpen ? 'var(--accent)' : 'inherit' }} />
               </button>
             </div>
          </div>

          <JobHeader info={jobInfo} setInfo={setJobInfo} />
          
          <div className="hidden md:block mt-8">
            <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Item Details</h2>
            <ItemEntry onAdd={addItem} types={windowTypes} transoms={transomOptions} />
          </div>

          <div className="flex md:hidden justify-between items-center mt-3">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center border border-white" style={{ backgroundColor: '#d6001c' }}>
                  <span className="text-white font-black text-[10px]">84</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{items.length} Items</span>
             </div>
             <div className="flex gap-1 items-center">
               <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-zinc-600 hover:text-zinc-300"><Settings size={16} /></button>
               <button onClick={() => setIsPickerOpen(true)} className="p-2 text-zinc-600 hover:text-zinc-300"><Palette size={16} /></button>
               <button onClick={exportCSV} className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all border border-red-900/50 text-red-500" style={{ backgroundColor: 'color-mix(in srgb, var(--accent), transparent 90%)' }}>
                 <Download size={12} /> EXPORT
               </button>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">
        <div className="hidden md:flex items-center justify-between p-6 pb-2 shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Inventory List</span>
             <span className="bg-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 rounded-md font-black uppercase">{items.length} Entries</span>
          </div>
          <div className="flex gap-3">
             <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
               <Trash2 size={14} /> Clear All
             </button>
             <button onClick={exportCSV} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-xl active:scale-95 border-b-2 border-red-900" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
               <Download size={14} /> DOWNLOAD CSV
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 md:pb-6">
          <InventoryList items={items} onRemove={removeItem} onUpdateQty={updateItemQty} />
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700 p-8 text-center opacity-30">
              <Plus size={48} className="mb-4" />
              <p className="text-sm font-medium italic">Ready for takeoff...</p>
            </div>
          )}
        </div>

        <div className="md:hidden absolute bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 z-40 pb-safe shadow-2xl">
          <ItemEntry onAdd={addItem} types={windowTypes} transoms={transomOptions} />
        </div>
      </main>

      <ColorPickerModal 
        isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} 
        primaryColor={accentColor} setPrimaryColor={setAccentColor}
        secondaryColor={manualComplement} setSecondaryColor={setManualComplement}
        isAuto={isAutoComplement} setIsAuto={setIsAutoComplement}
      />

      <ConfigSettingsModal
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        types={windowTypes} setTypes={setWindowTypes}
        transoms={transomOptions} setTransoms={setTransomOptions}
      />
    </div>
  );
};

export default App;
