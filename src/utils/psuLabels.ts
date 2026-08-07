import type { CSSProperties } from 'react';

export interface PsuLabelStandard {
  voltage: string;
  current: string;
  power: string;
  labelDescription: string;
  badgeBg: string;
  badgeText: string;
  customStyle?: CSSProperties;
  displayTag: string;
}

export const PSU_LABEL_STANDARDS: PsuLabelStandard[] = [
  {
    voltage: '12V',
    current: '1.5A',
    power: '18W',
    labelDescription: 'Etiqueta VERMELHA com letras AMARELAS',
    badgeBg: 'bg-red-600',
    badgeText: 'text-yellow-300',
    displayTag: '12V – 1.5A',
  },
  {
    voltage: '12V',
    current: '2.0A',
    power: '24W',
    labelDescription: 'Etiqueta VERMELHA com letras BRANCAS',
    badgeBg: 'bg-red-600',
    badgeText: 'text-white',
    displayTag: '12V – 2A',
  },
  {
    voltage: '12V',
    current: '2.5A',
    power: '30W',
    labelDescription: 'Etiqueta VERMELHA com letras AZUIS',
    badgeBg: 'bg-red-600',
    badgeText: 'text-cyan-200',
    customStyle: { color: '#00e5ff' },
    displayTag: '12V – 2.5A',
  },
  {
    voltage: '12V',
    current: '3.0A',
    power: '36W',
    labelDescription: 'Etiqueta VERMELHA com letras PRETAS',
    badgeBg: 'bg-red-600',
    badgeText: 'text-slate-950',
    displayTag: '12V – 3A',
  },
  {
    voltage: '12V',
    current: '3.5A',
    power: '42W',
    labelDescription: 'Etiqueta VERMELHA com letras LARANJAS',
    badgeBg: 'bg-red-600',
    badgeText: 'text-amber-300',
    customStyle: { color: '#ff9900' },
    displayTag: '12V – 3.5A',
  },
  {
    voltage: '12V',
    current: '4.0A',
    power: '48W',
    labelDescription: 'Etiqueta VERMELHA com letras VERDES',
    badgeBg: 'bg-red-600',
    badgeText: 'text-emerald-300',
    customStyle: { color: '#00ff66' },
    displayTag: '12V – 4A',
  },
  {
    voltage: '20V',
    current: '2.5A',
    power: '50W',
    labelDescription: 'Etiqueta AMARELA com letras PRETAS',
    badgeBg: 'bg-yellow-400',
    badgeText: 'text-slate-950',
    displayTag: '20V – 2.5A',
  },
];

/**
 * Returns matching PSU label badge styling based on voltage and current string
 */
export function getPsuLabelInfo(voltageStr: string, currentStr: string) {
  const normV = (voltageStr || '').replace(/[^\d.]/g, '');
  const normC = (currentStr || '').replace(',', '.').replace(/[^\d.]/g, '');

  const vNum = parseFloat(normV);
  const cNum = parseFloat(normC);

  if (vNum === 12) {
    if (Math.abs(cNum - 1.5) < 0.1) return PSU_LABEL_STANDARDS[0]; // Yellow text
    if (Math.abs(cNum - 2.0) < 0.1) return PSU_LABEL_STANDARDS[1]; // White text
    if (Math.abs(cNum - 2.5) < 0.1) return PSU_LABEL_STANDARDS[2]; // Blue text
    if (Math.abs(cNum - 3.0) < 0.1) return PSU_LABEL_STANDARDS[3]; // Black text
    if (Math.abs(cNum - 3.5) < 0.1) return PSU_LABEL_STANDARDS[4]; // Orange text
    if (Math.abs(cNum - 4.0) < 0.1) return PSU_LABEL_STANDARDS[5]; // Green text
  } else if (vNum === 20 && Math.abs(cNum - 2.5) < 0.1) {
    return PSU_LABEL_STANDARDS[6]; // Yellow tag, Black text
  }

  // Fallback default badge
  return {
    voltage: voltageStr,
    current: currentStr,
    power: `${(vNum * cNum || 0).toFixed(0)}W`,
    labelDescription: 'Etiqueta VERMELHA Padrão Claro NET',
    badgeBg: 'bg-red-600',
    badgeText: 'text-white',
    displayTag: `${voltageStr} – ${currentStr}`,
  };
}
