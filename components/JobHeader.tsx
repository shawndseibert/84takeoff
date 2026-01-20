
import React from 'react';
import { JobInfo } from '../types';
import { MapPin, Box, DoorOpen } from 'lucide-react';

interface Props {
  info: JobInfo;
  setInfo: React.Dispatch<React.SetStateAction<JobInfo>>;
}

const JobHeader: React.FC<Props> = ({ info, setInfo }) => {
  const glowStyle = {
    color: 'var(--accent)',
    textShadow: '0 0 10px color-mix(in srgb, var(--accent), transparent 60%), 0 0 2px color-mix(in srgb, var(--accent), transparent 20%)',
    fontWeight: 700
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="relative flex items-center">
        <MapPin size={14} className="absolute left-3 text-zinc-600" />
        <input
          type="text"
          placeholder="Project Address / Lot"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700"
          style={info.address ? glowStyle : {}}
          value={info.address}
          onChange={(e) => setInfo(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative flex items-center">
          <Box size={14} className="absolute left-3 text-zinc-600" />
          <input
            type="text"
            placeholder="Window Specs"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-[11px] focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700"
            style={info.windowSpec ? glowStyle : {}}
            value={info.windowSpec}
            onChange={(e) => setInfo(prev => ({ ...prev, windowSpec: e.target.value }))}
          />
        </div>
        <div className="relative flex items-center">
          <DoorOpen size={14} className="absolute left-3 text-zinc-600" />
          <input
            type="text"
            placeholder="Door Specs"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-[11px] focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700"
            style={info.doorSpec ? glowStyle : {}}
            value={info.doorSpec}
            onChange={(e) => setInfo(prev => ({ ...prev, doorSpec: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
