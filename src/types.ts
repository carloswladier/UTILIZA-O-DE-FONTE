export interface PowerSupply {
  id: string;
  model: string;
  partNumber: string;
  manufacturer: string;
  sapCode: string;
  notes?: string;
  isAlternative?: boolean;
  requiresPowerCable?: boolean;
}

export type TerminalCategory = 
  | 'Decodificador Digital' 
  | 'Cable Modem' 
  | 'eMTA' 
  | 'ONT / Fibra' 
  | 'Extensor Wi-Fi MESH' 
  | 'Cabo de Força';

export interface Terminal {
  id: string;
  name: string;
  category: TerminalCategory;
  voltage: string;
  current: string;
  power: string;
  connector: string;
  powerSupplies: PowerSupply[];
  imagePlaceholderNote?: string;
}

export interface SearchFilter {
  query: string;
  category: string;
  voltage: string;
  searchType: 'terminal' | 'fonte' | 'sap';
}
