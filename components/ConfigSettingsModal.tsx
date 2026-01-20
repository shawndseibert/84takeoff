
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  types: string[];
  setTypes: (types: string[]) => void;
  transoms: string[];
  setTransoms: (transoms: string[]) => void;
}

const ConfigSettingsModal: React.FC<Props> = ({ isOpen, onClose, types, setTypes, transoms, setTransoms }) => {
  const [newType, setNewType] = useState('');
  const [newTransom, setNewTransom] = useState('');

  if (!isOpen) return null;

  const handleAddType = () => {
    const val = newType.trim().toUpperCase();
    if (val && !types.includes(val)) {
      setTypes([...types, val]);
      setNewType('');
    }
  };

  const handleAddTransom = () => {
    const val = newTransom.trim();
    if (val && !transoms.includes(val)) {
      setTransoms([...transoms, val]);
      setNewTransom('');
    }
  };

  const removeType = (t: string) => {
    if (t === 'DOOR') return; 
    setTypes(types.filter(item => item !== t));
  };

  const removeTransom = (t: string) => {
    if (t === 'None') return;
    setTransoms(transoms.filter(item => item !== t));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Configurator Options</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar space-y-8">
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Window / Door Types</h4>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g. SLIDER"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 placeholder:text-zinc-800"
                onKeyDown={(e) => { if(e.key === 'Enter') handleAddType(); }}
              />
              <button onClick={handleAddType} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors">
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <div key={t} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg group">
                  <span className="text-[10px] font-bold text-zinc-400">{t}</span>
                  {t !== 'DOOR' && (
                    <button onClick={() => removeType(t)} className="text-zinc-700 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Transom Options</h4>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newTransom}
                onChange={(e) => setNewTransom(e.target.value)}
                placeholder="e.g. 1-6"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 placeholder:text-zinc-800"
                onKeyDown={(e) => { if(e.key === 'Enter') handleAddTransom(); }}
              />
              <button onClick={handleAddTransom} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors">
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {transoms.map(t => (
                <div key={t} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <span className="text-[10px] font-bold text-zinc-400">{t}</span>
                  {t !== 'None' && (
                    <button onClick={() => removeTransom(t)} className="text-zinc-700 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-5 bg-zinc-950/50 shrink-0 border-t border-zinc-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-zinc-100 text-zinc-950 text-xs font-black rounded-xl hover:bg-white active:scale-[0.98] transition-all tracking-widest shadow-xl"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigSettingsModal;
