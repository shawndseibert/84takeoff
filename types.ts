
export interface Item {
  id: string;
  qty: number;
  width: number; // inches
  height: number; // inches
  type: string;   // Dynamic window/door type
  tempered: boolean;
  drywall: boolean;
  transom: string; // e.g., "None", "1'", "1'6""
  handing?: 'LH' | 'RH' | 'NONE'; // Door specific
  swing?: 'IS' | 'OS' | 'NONE';   // Door specific
}

export interface JobInfo {
  address: string;
  windowSpec: string; // Make/Model/Color
  doorSpec: string;   // Make/Model/Color
}

export type WindowType = string;
