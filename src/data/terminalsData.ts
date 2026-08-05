import { Terminal } from '../types';

export const TERMINALS_DATA: Terminal[] = [
  // --- 5V ---
  {
    id: 'dci106',
    name: 'DCI106',
    category: 'Decodificador Digital',
    voltage: '5V',
    current: '1,2A',
    power: '6W',
    connector: '4.0 x 1.7 mm',
    powerSupplies: [
      { id: 'ps-1', model: 'MU06-B050120-D1', partNumber: '3672616A', manufacturer: 'LEADER ELETRONICS INC.', sapCode: '22026278' },
      { id: 'ps-2', model: 'WAB011', partNumber: '3672616A', manufacturer: 'AC BEL', sapCode: '22026278' }
    ]
  },

  // --- 9V ---
  {
    id: 'dcm425',
    name: 'DCM425',
    category: 'Cable Modem',
    voltage: '9V',
    current: '0,8A',
    power: '7W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-3', model: 'AD-0980L', partNumber: 'N/A', manufacturer: 'OEM ELETRONICS', sapCode: '22026268' },
      { id: 'ps-4', model: '410908RO3CT', partNumber: 'N/A', manufacturer: 'LEADER ELETRONICS INC.', sapCode: '22026268' },
      { id: 'ps-5', model: 'DV-0980S-B20', partNumber: 'N/A', manufacturer: 'DVE', sapCode: '22026268' }
    ]
  },
  {
    id: 'dci1000',
    name: 'DCI1000',
    category: 'Decodificador Digital',
    voltage: '9V',
    current: '1A',
    power: '9W',
    connector: '5.5 x 2.1 mm / 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-6', model: 'VFC0901000010', partNumber: 'N/A', manufacturer: 'THOMSON', sapCode: '22026275' },
      { id: 'ps-7', model: 'VF00901000012', partNumber: 'N/A', manufacturer: 'THOMSON', sapCode: '22026275' },
      { id: 'ps-8', model: 'GSCV1000S009V015', partNumber: 'N/A', manufacturer: 'GSP', sapCode: '22026275' },
      { id: 'ps-9', model: 'VFC0901000008', partNumber: 'N/A', manufacturer: 'THOMSON', sapCode: '22026275' },
      { id: 'ps-10', model: 'SPL110F10-A/34', partNumber: 'N/A', manufacturer: 'ABLE ELETRÔNICA LTDA.', sapCode: '22026275' },
      { id: 'ps-11', model: 'P010WH0903', partNumber: '01222LF', manufacturer: 'PIE LTDA.', sapCode: '22026275' },
      { id: 'ps-12', model: 'WAB015', partNumber: 'N/A', manufacturer: 'AC BEL', sapCode: '22026275' },
      { id: 'ps-13', model: 'P010WA0903', partNumber: '01221LF', manufacturer: 'PIE', sapCode: '22026292' }
    ]
  },

  // --- 12V 0.5A ---
  {
    id: 'zte-f600v9',
    name: 'GPON ZTE F600V9',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '0,5A',
    power: '6W',
    connector: 'Padrão DC',
    powerSupplies: [
      { id: 'ps-14', model: 'Verificar no físico quando recebido', partNumber: 'RS1200500-C55-123BGD', manufacturer: 'Aguardando fabricante', sapCode: 'SEM cadastro SAP', notes: 'Verificar no equipamento físico quando recebido' }
    ]
  },

  // --- 12V 0.75A ---
  {
    id: 'sb5100-sb6120-sbv5122',
    name: 'SB5100 / SB6120 / SBV5122',
    category: 'Cable Modem',
    voltage: '12V',
    current: '0,75A',
    power: '9W',
    connector: 'Macho ajustável 5.5mm x 2.5mm / 5.5mm x 2.1mm',
    powerSupplies: [
      { id: 'ps-15', model: 'NU12-6120075-I3', partNumber: '568905-001', manufacturer: 'LEADER ELETRONICS INC.', sapCode: '22026269' },
      { id: 'ps-16', model: 'PA-1090-1', partNumber: '505959-001-99', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22026269' },
      { id: 'ps-17', model: 'ADP-15ZB', partNumber: 'N/A', manufacturer: 'DELTA ELECTRONICS INC', sapCode: '22026269' }
    ]
  },

  // --- 12V 1A ---
  {
    id: 'dpc2100-tc7110-sbv5122',
    name: 'DPC2100 / TC7110 / SBV5122',
    category: 'Cable Modem',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm / Macho ajustável 5.5x2.5 & 5.5x2.1',
    powerSupplies: [
      { id: 'ps-18', model: 'MU12-B120100-C5', partNumber: 'N/A', manufacturer: 'I.T.E', sapCode: '22026283' },
      { id: 'ps-19', model: 'MU18-D120150-D1', partNumber: 'N/A', manufacturer: 'LEADER', sapCode: '22026283' },
      { id: 'ps-20', model: 'T120100-2C1', partNumber: 'N/A', manufacturer: 'TP-LINK TECHNOLOGY', sapCode: '22026283' },
      { id: 'ps-21', model: 'EADP-12HB A', partNumber: 'N/A', manufacturer: 'DELTA ELETRONICS INC.', sapCode: '22026283' },
      { id: 'ps-22', model: '3A122DU12', partNumber: 'N/A', manufacturer: 'ENG ELETRIC CO. LTD.', sapCode: '22026283' },
      { id: 'ps-23', model: 'ADP-12SB', partNumber: '3902A946', manufacturer: 'DELTA ELETRONICS INC.', sapCode: '22026283' },
      { id: 'ps-24', model: 'MU12-21120-PCES', partNumber: 'N/A', manufacturer: 'LEADER ELETRONICS INC.', sapCode: '22026283' },
      { id: 'ps-25', model: 'SYS1381-1212-W2B', partNumber: 'G401138112312', manufacturer: 'SUNNY COMPUTER TECHNOLOGY', sapCode: '22026283' },
      { id: 'ps-26', model: '3A-125DA12', partNumber: 'N/A', manufacturer: 'ENG ELETRONIC', sapCode: '22026283' },
      { id: 'ps-27', model: 'TF-008-9', partNumber: 'N/A', manufacturer: 'ABLEGRID', sapCode: '22026270', notes: 'Específico para DPC2100' }
    ]
  },
  {
    id: 'dpc2203',
    name: 'DPC2203',
    category: 'eMTA',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-28', model: 'SPS-06C12-1(B)', partNumber: 'E231564', manufacturer: 'GRE ELETRONICS', sapCode: '22026273' },
      { id: 'ps-29', model: 'NBS15C120100HB', partNumber: '236-0127010', manufacturer: 'NETBIT', sapCode: '22026273' },
      { id: 'ps-30', model: '3A-154DA12', partNumber: 'N/A', manufacturer: 'ENG ELETRIC CO. LTD.', sapCode: '22026273' },
      { id: 'ps-31', model: 'YXK-1210', partNumber: 'N/A', manufacturer: 'NETBIT', sapCode: '22026273' },
      { id: 'ps-32', model: 'AD-121ANDT', partNumber: 'E87287', manufacturer: 'OEM ELETRONICS', sapCode: '22026273' }
    ]
  },
  {
    id: 'dhg544',
    name: 'DHG544',
    category: 'Cable Modem',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm / 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-33', model: 'AMS9-1201000FX2', partNumber: 'N/A', manufacturer: 'AMIGO ELETRONIC', sapCode: '22026277' },
      { id: 'ps-34', model: 'MU12-G120100-D1', partNumber: 'N/A', manufacturer: 'LEADER ELETRONICS INC.', sapCode: '22026277' }
    ]
  },
  {
    id: 'ont-b-610',
    name: 'TERMINAL ONT B 610',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-35', model: 'MU12-2120100-A1 - DC ADPTR 12VDC 1A ITE', partNumber: 'HW-120-100D0D', manufacturer: 'TOPOW', sapCode: '10012446' }
    ]
  },
  {
    id: 'h196a',
    name: 'ZTE WIFI5 ZXHN H196A MESH',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-36', model: 'H196A MEIC MN012E-B120100', partNumber: 'N/A', manufacturer: 'MEIC', sapCode: '22065923' },
      { id: 'ps-37', model: 'H196A MEIC RD1201000-C55-35BGD', partNumber: 'RD1202500-C55-168BG', manufacturer: 'MEIC', sapCode: '22065924' },
      { id: 'ps-38', model: 'H196A MEIC MN012E-B120100', partNumber: 'N/A', manufacturer: 'MEIC', sapCode: '22065923' }
    ]
  },
  {
    id: 'h3601p',
    name: 'ZTE TERMINAL EXTENSOR WIFI6 MESH H3601P',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-39', model: 'H3601P MN012H B120100', partNumber: 'N/A', manufacturer: 'MEIC', sapCode: '22065927' },
      { id: 'ps-40', model: 'ADS-18FQ 12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' }
    ]
  },
  {
    id: 'z1320',
    name: 'TERMINAL MESH EXTENSOR WIFI 6 Z1320',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '1A',
    power: '12W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-41', model: 'MN012E-B120100', partNumber: 'N/A', manufacturer: 'MEIC', sapCode: '22065923' }
    ]
  },

  // --- 12V 1.25A ---
  {
    id: 'sbv5121',
    name: 'SBV5121',
    category: 'eMTA',
    voltage: '12V',
    current: '1,25A',
    power: '15W',
    connector: 'Plug Quadrado (8 Pinos)',
    powerSupplies: [
      { id: 'ps-42', model: 'NU20-5120125-I3', partNumber: 'NU20-51120-3Y1F', manufacturer: 'LEADER ELETRONICS INC.', sapCode: '22026272' },
      { id: 'ps-43', model: 'ADP-15ZB (Plug Quadrado)', partNumber: 'N/A', manufacturer: 'DELTA ELETRONICS INC.', sapCode: '22026272', notes: 'Plug especial quadrado 8 pinos' }
    ]
  },

  // --- 12V 1.5A ---
  {
    id: 'thdc4',
    name: 'THDC4',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-44', model: 'HKA01812015 IW', partNumber: '37824250', manufacturer: 'HUNTKEY', sapCode: '77058360' },
      { id: 'ps-45', model: 'HKA01812015 IW', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062574' }
    ]
  },
  {
    id: 'dcr7121-dcr2231',
    name: 'DCR7121 / DCR2231',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-46', model: 'P018WL1201', partNumber: 'N/A', manufacturer: 'PIE LTDA.', sapCode: '22026276' },
      { id: 'ps-47', model: 'T018WH1225', partNumber: 'N/A', manufacturer: 'PIE LTDA.', sapCode: '22026276' }
    ]
  },
  {
    id: 'hg100r-l4',
    name: 'HG100R-L4',
    category: 'Cable Modem',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-48', model: 'PA-1180-7UD2', partNumber: 'LT1215WWBR1B', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22058239' },
      { id: 'ps-49', model: 'S09B18', partNumber: 'SC1215WWBR1B', manufacturer: 'SALCOMP', sapCode: '22026289', notes: 'Outro SAP cadastrado: 22058335' }
    ]
  },
  {
    id: 'svg1202-svg6582',
    name: 'SVG1202 / SVG6582',
    category: 'eMTA',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-50', model: 'WA-18J12FB', partNumber: 'N/A', manufacturer: 'ASIAN POWER DEVICES INC', sapCode: '22026282' },
      { id: 'ps-51', model: 'VT1200150H1', partNumber: 'N/A', manufacturer: 'VISIONTEC', sapCode: '22026282', notes: 'Outro SAP registrado: 22064468' }
    ]
  },
  {
    id: 'dci713-dci738',
    name: 'DCI713 / DCI738',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-52', model: 'WAA004', partNumber: '36841990', manufacturer: 'AC BEL', sapCode: '22026297' },
      { id: 'ps-53', model: 'P018WL1201', partNumber: 'N/A', manufacturer: 'PIE LTDA.', sapCode: '22026276' }
    ]
  },
  {
    id: 'hhdc2',
    name: 'HHDC2',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-54', model: 'ADS-18FQ-12C12018PBR', partNumber: '901809355300201C / HN1215WWBR6B', manufacturer: 'FLEX INDUSTRIES', sapCode: '22059734' },
      { id: 'ps-55', model: 'PA-1180-7UD2', partNumber: 'LT1215WWBR1B', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22058239' },
      { id: 'ps-56', model: 'ADS-18FQ-12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' }
    ]
  },
  {
    id: 's4kw3-s4kcw3',
    name: '4K UHD IP S4KW3 / S4KCW3',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-57', model: 'MSG-V1500WR120-018I1', partNumber: '191600845-XX', manufacturer: 'MOSO', sapCode: '22062068' },
      { id: 'ps-58', model: 'S4KCW3 ADS 18FQA 1212018EPBR', partNumber: '191603333-01', manufacturer: 'HONOR', sapCode: '22065661' },
      { id: 'ps-59', model: 'MSG-V1500WR120-018I1-BR', partNumber: '191698791-XX', manufacturer: 'Sagemcom / MOSO (Fab. Brasil)', sapCode: '22062068' },
      { id: 'ps-60', model: 'ADS-18FQ 12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' },
      { id: 'ps-61', model: 'ADS-18FQA 1212018EPBR', partNumber: '191691718', manufacturer: 'MOSO / FLEX', sapCode: '22062069' },
      { id: 'ps-62', model: 'Fontes alternativas autorizadas', partNumber: 'Engenharia Claro', manufacturer: 'Diversos', sapCode: '22026297 / 22026276 / 22026289 / 22026282 / 22058335', isAlternative: true }
    ]
  },
  {
    id: 'hg100r-l2',
    name: 'HG100R-L2',
    category: 'Cable Modem',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-63', model: 'S09B18', partNumber: 'SC1215WWBR1A', manufacturer: 'SALCOMP', sapCode: '22026287', notes: 'Outro SAP registrado: 22058336' },
      { id: 'ps-64', model: 'PA-1180-7UD1', partNumber: 'LT1215WWBR1A', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22026287' }
    ]
  },
  {
    id: 'nokia-41001574-41001578',
    name: '41001574 / 41001578 (Nokia)',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-65', model: 'RD1201500-C55-1530G', partNumber: 'Preta/Branca', manufacturer: 'SHENZHEN', sapCode: '22067380' },
      { id: 'ps-66', model: 'UES18LV-120150SPA', partNumber: 'N/A', manufacturer: 'DONGGUAN', sapCode: '22067381' },
      { id: 'ps-67', model: 'RD1201500-C55-198OG', partNumber: 'N/A', manufacturer: 'SHENZHEN', sapCode: '22067382' }
    ]
  },
  {
    id: 'zte-41001590-f6600p',
    name: '41001590 / 41001591 / F6600P (ZTE)',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-68', model: 'MN018G-B120150', partNumber: 'N/A', manufacturer: 'MEIC/XIAMEN', sapCode: '22067411' },
      { id: 'ps-69', model: 'MN018G-B120150-M', partNumber: 'N/A', manufacturer: 'FLEX/MEIC', sapCode: '22067412' },
      { id: 'ps-70', model: 'KL-WF120150-C1', partNumber: 'N/A', manufacturer: 'MEIC', sapCode: '22067413' },
      { id: 'ps-71', model: 'RD1201500-C55-198BG', partNumber: 'N/A', manufacturer: 'Shenzen/MEIC', sapCode: '22067414' },
      { id: 'ps-72', model: 'RD1201500 233BG', partNumber: 'N/A', manufacturer: 'Shenzen', sapCode: '22068486' },
      { id: 'ps-73', model: 'ADS18FQ12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' }
    ]
  },
  {
    id: 'terminal-41001564',
    name: '41001564',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-74', model: 'F18W16-120150SPAE', partNumber: 'F18W16-120150SPAE', manufacturer: 'LITEON', sapCode: '22066302', notes: 'SAP alternativo: 22065296' }
    ]
  },
  {
    id: 'ap5541',
    name: 'TERMINAL EXTENSOR WIFI MESH AP5541',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-75', model: 'F18L10-120150SPAE', partNumber: 'N/A', manufacturer: 'FRECOM', sapCode: '22065609' }
    ]
  },
  {
    id: 'h3621p',
    name: 'TERMINAL EXTENSOR WIFI6 MESH H3621P',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-76', model: 'RD1201500-233BG', partNumber: 'N/A', manufacturer: 'Shenzhen', sapCode: '22068486' },
      { id: 'ps-77', model: 'MN018Q-E120150', partNumber: 'N/A', manufacturer: 'Shenzhen', sapCode: '22067416' }
    ]
  },
  {
    id: 's4kcw5',
    name: 'DECODER CARDLESS 4K UHD S4KCW5 (Cabo IP)',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-78', model: 'MSG-V1500WR120-018I1', partNumber: '191698791-XX', manufacturer: 'MOSO', sapCode: '22062068' },
      { id: 'ps-79', model: 'FONTE ALIME S4KCW3 ADS 18FQA 1212018EPBR', partNumber: '191603333-01', manufacturer: 'HONOR', sapCode: '22065661' },
      { id: 'ps-80', model: 'ADS-18FQ 12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' },
      { id: 'ps-81', model: 'V30V1500R120 018U1', partNumber: 'N/A', manufacturer: 'MOSO', sapCode: '22068436' },
      { id: 'ps-82', model: 'ADS-18FQA 1212018EPBR', partNumber: '191681718', manufacturer: 'MOSO', sapCode: '22062069' }
    ]
  },
  {
    id: 'k4kcw5',
    name: 'DECODER CARDLESS 4K UHD K4KCW5 (Cabo e IP)',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-83', model: 'FONTE ALIMENT 12V 1.5A F18W16 120150SPAE', partNumber: 'N/A', manufacturer: 'LITE ON', sapCode: '22065296', notes: 'Outro SAP: 22066302' },
      { id: 'ps-84', model: 'FONTE ALIM 12V 1.5A ADS18FQ12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' }
    ]
  },
  {
    id: 's4kw5',
    name: 'DECODER 4K UHD FULL IP S4KW5',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-85', model: 'ADS-18FQB-12 12018EPBR', partNumber: '1917699-XX', manufacturer: 'FLEX', sapCode: '22068618' },
      { id: 'ps-86', model: 'V30-V1500R120-018U1-BR', partNumber: 'N/A', manufacturer: 'FLEX', sapCode: '22068436' },
      { id: 'ps-87', model: 'NBS24N120150VB', partNumber: 'N/A', manufacturer: 'SAGEMCOM', sapCode: '22068622' }
    ]
  },
  {
    id: 'z4kcw6-z4kw6',
    name: 'DECODER 4K UHD FULL IP Z4KCW6 / Z4KW6',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-88', model: 'MN024P-B120150', partNumber: 'N/A', manufacturer: 'XIAMEN CASTEC', sapCode: '22068625' },
      { id: 'ps-89', model: 'ADS-18FQ 12C12018EPBR', partNumber: 'N/A', manufacturer: 'SHENZHEN HONOR', sapCode: '22062575' },
      { id: 'ps-90', model: 'ADS-18FQ 12C12018EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062575' }
    ]
  },
  {
    id: 'ar2180t',
    name: 'TERMINAL EXTENSOR WIFI5 MESH AR2180T',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '1,5A',
    power: '18W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-91', model: 'FONTE ALIMENT 12V 1.5A F18W16 120150SPAE', partNumber: 'N/A', manufacturer: 'LITE ON', sapCode: '22065296' }
    ]
  },

  // --- 12V 1.67A ---
  {
    id: 'decoder-4682dvb',
    name: '4682DVB',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '1,67A',
    power: '20W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-92', model: 'PA-1250-4SA1', partNumber: '4039473', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22026280' }
    ]
  },

  // --- 12V 2A ---
  {
    id: 's4kw1-s4kw2',
    name: 'S4KW1 / S4KW2',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-93', model: 'MSP-C2000IC12.0-24F-BR', partNumber: '191411222-XX', manufacturer: 'FLEX INDUSTRIES', sapCode: '22059732' },
      { id: 'ps-94', model: 'MSP-C2000IC12.0-24F-BR', partNumber: '191299069-XX', manufacturer: 'NETBIT', sapCode: '22058688' },
      { id: 'ps-95', model: 'MSP-C2000IC12.0-24F-BR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062580' },
      { id: 'ps-96', model: 'NBSE24120200HB', partNumber: '191268564 / 191268564-B', manufacturer: 'NETBIT', sapCode: '22026288' },
      { id: 'ps-97', model: 'MSP C2000IC12 024FT BR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062943' }
    ]
  },
  {
    id: 'dwg874-tc7300',
    name: 'DWG874 / TC7300 / TC7300B0',
    category: 'eMTA',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-98', model: 'SYS1428-2412-W2B', partNumber: 'G401142824057', manufacturer: 'SUNNY COMPUTER TECHNOLOGY', sapCode: '22026284' },
      { id: 'ps-99', model: 'WAC003', partNumber: '37093070', manufacturer: 'AC BEL', sapCode: '22026284' },
      { id: 'ps-100', model: 'ADS-24S-12', partNumber: 'N/A', manufacturer: 'SHENZHEN HONOR', sapCode: '22026284' }
    ]
  },
  {
    id: 'fast3284',
    name: 'FAST3284',
    category: 'Cable Modem',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-101', model: 'NBSE24120200HB', partNumber: '191230841-S', manufacturer: 'NETBIT', sapCode: '22026290' }
    ]
  },
  {
    id: 'hg8245-nac-imp',
    name: 'HG8245 Nac e Imp',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-102', model: 'HW-120200E5W', partNumber: 'N/A', manufacturer: 'HUAWEI', sapCode: '22060286', notes: 'Outros SAPs: 22058610 / 22061610' },
      { id: 'ps-103', model: 'HKA02412020-IX', partNumber: 'N/A', manufacturer: 'HUNTKEY', sapCode: '22061756' }
    ]
  },
  {
    id: 'hg8245v5',
    name: 'HG8245V5',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-104', model: 'HKA02412020-IX', partNumber: 'N/A', manufacturer: 'HUNTKEY', sapCode: '22059797', notes: 'Outro SAP: 22059798' }
    ]
  },
  {
    id: 'tcg2232',
    name: 'TCG2232',
    category: 'eMTA',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-105', model: 'ADS-24FUA-12Y 12024EPBR', partNumber: '6307427AI7', manufacturer: 'SHENZHEN', sapCode: '22066258' },
      { id: 'ps-106', model: 'Somente fabricante AC BEL', partNumber: 'N/A', manufacturer: 'AC BEL', sapCode: '22026284', isAlternative: true },
      { id: 'ps-107', model: 'MSP C2000IC12 024FT BR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062943', isAlternative: true }
    ]
  },
  {
    id: 'tcg2236',
    name: 'TCG2236',
    category: 'eMTA',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-108', model: 'ADS-30FT-12Y 1203EPBR 01', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22066309' }
    ]
  },
  {
    id: 'fast3184',
    name: 'FAST3184',
    category: 'Cable Modem',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-109', model: 'S030SM1200250', partNumber: '191178195-XX', manufacturer: 'NETBIT', sapCode: '22026288' },
      { id: 'ps-110', model: 'KSAS0251200200HB', partNumber: '191126977', manufacturer: 'NETBIT', sapCode: '22026288' },
      { id: 'ps-111', model: 'NBSE24120200HB', partNumber: '191268564 / 191268564-B', manufacturer: 'NETBIT', sapCode: '22026288' },
      { id: 'ps-112', model: 'S024SD1200200', partNumber: 'N/A', manufacturer: 'NETBIT', sapCode: '22026288' }
    ]
  },
  {
    id: 'zxhn-f680-v5',
    name: 'ZXHN F680 V5',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-113', model: 'RD1202000-C55-154BG', partNumber: 'Homologada F680 em 24/07/23', manufacturer: 'SHENZHEN', sapCode: '22065406' },
      { id: 'ps-114', model: 'FONTE EMTA WIFI 12V 2.0A', partNumber: 'N/A', manufacturer: 'HUAWEI / ZTE', sapCode: '22026284' },
      { id: 'ps-115', model: 'FONTE ALIM 24W 110 220V 12V 37093070 MAN', partNumber: 'N/A', manufacturer: 'MANAUS', sapCode: '22062500' }
    ]
  },
  {
    id: 'hg8245-6t-v2',
    name: 'HG8245 6T V2',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-116', model: 'HKA2412020-IX', partNumber: 'N/A', manufacturer: 'HUNTKEY', sapCode: '22061756', notes: 'Outro SAP: 22065380' },
      { id: 'ps-117', model: 'HW-120200E5W', partNumber: 'Obs: Mesma fonte do HUAWEI Q2', manufacturer: 'HUAWEI', sapCode: '22058610', notes: 'Outro SAP: 22061610' },
      { id: 'ps-118', model: 'Fontes Certificadas Anatel (06/JUN/23)', partNumber: 'Anatel', manufacturer: 'Diversos', sapCode: '22058688 / 22059732 / 22062580 / 22059734 / 22062575 / 22058360 / 22062943', isAlternative: true }
    ]
  },
  {
    id: 'f6645p',
    name: 'TERMINAL GPON ONT WIFI F6645P ZTE',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-119', model: 'PSF6645P - MN024F-B120200', partNumber: 'PSF6645P', manufacturer: 'MEIC', sapCode: '22065922' },
      { id: 'ps-120', model: 'PSF6645P - MN024F B120200', partNumber: 'PSF6645P', manufacturer: 'Flex', sapCode: '22065922' }
    ]
  },
  {
    id: 'g-2426g-a',
    name: 'NOKIA GPON G-2426G-A',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-121', model: 'Power Adapter', partNumber: 'N/A', manufacturer: 'NOKIA / DONGGUAN', sapCode: 'Sem SAP' }
    ]
  },
  {
    id: 'fast5676',
    name: 'FAST5676',
    category: 'Cable Modem',
    voltage: '12V',
    current: '2A',
    power: '24W',
    connector: '5.5 x 2.1 mm',
    powerSupplies: [
      { id: 'ps-122', model: 'FONTE AC DC MSG V2000WR120 024E0 BR', partNumber: '191601876-XX', manufacturer: 'MOSO', sapCode: '22067376' },
      { id: 'ps-123', model: 'FONTE NBS24N120200VB AH4', partNumber: 'N/A', manufacturer: 'NETBIT', sapCode: '22067377' }
    ]
  },

  // --- 12V 2.5A ---
  {
    id: 'hnb100-hga12r-hgb10r',
    name: 'HNB100 / HGA12R / HGB10R',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-124', model: 'MSA C2500IC12.030WBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062573' },
      { id: 'ps-125', model: 'PA-1300-19UD', partNumber: 'LT1225WWBR1A', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22058614' },
      { id: 'ps-126', model: 'ADP-50BR', partNumber: 'DT1240WIC81A', manufacturer: 'DELTA ELECTRONICS INC', sapCode: '22057705' }
    ]
  },
  {
    id: 'tc7337-dci804',
    name: 'TC7337 / DCI804',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-127', model: 'WAG005', partNumber: '37469470', manufacturer: 'AC BEL LTDA', sapCode: '22056543' },
      { id: 'ps-128', model: 'WAA011', partNumber: 'N/A', manufacturer: 'AC BEL LTDA', sapCode: '22056543' },
      { id: 'ps-129', model: 'MSA C2500IC12.030WBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062573' }
    ]
  },
  {
    id: 'cga2231clb',
    name: 'CGA2231CLB',
    category: 'eMTA',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-130', model: 'WAG005 ID AD8G2', partNumber: '37469470', manufacturer: 'AC BEL LTDA', sapCode: '22056543', notes: 'Outro SAP registrado: 22063354' }
    ]
  },
  {
    id: 'tg1692',
    name: 'TG1692',
    category: 'eMTA',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-131', model: 'NBS36E120250HB', partNumber: 'AREP05626', manufacturer: 'NETBIT', sapCode: '22026293' },
      { id: 'ps-132', model: 'PA-1300-02R1', partNumber: 'AREP05626', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22026293' },
      { id: 'ps-133', model: 'MSA C2500IC12.030WBR', partNumber: 'S9508-Z0/1170010008', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062573' }
    ]
  },
  {
    id: 'hdc7411-dxc5000-c6500',
    name: 'HDC7411 / DXC5000 / C6500',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 3.2 mm',
    powerSupplies: [
      { id: 'ps-134', model: 'PA-1300-4PA1', partNumber: '236-0306000', manufacturer: 'LITE ON TECHNOLOGY', sapCode: '22026279', notes: 'Outro SAP: 22056426' },
      { id: 'ps-135', model: 'WAA017', partNumber: 'N/A', manufacturer: 'AC BEL LTDA.', sapCode: '22026279', notes: 'Outro SAP: 22056426' },
      { id: 'ps-136', model: 'CUW301225-H', partNumber: 'N/A', manufacturer: 'AMPOWER TEK', sapCode: '22026279', notes: 'Outro SAP: 22056426' },
      { id: 'ps-137', model: 'ADP-50BR', partNumber: 'DT1240WIC81A', manufacturer: 'DELTA ELECTRONICS INC', sapCode: '22057705', notes: 'Específico para DXC5000' },
      { id: 'ps-138', model: 'NBS36C120250HB', partNumber: 'N/A', manufacturer: 'NETBIT', sapCode: '22026279', notes: 'Específico para HDC7411' }
    ]
  },
  {
    id: 'dgci362-fast3486',
    name: 'DGCI362 / FAST3486 / DGCI363',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 3.2 mm / 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-139', model: 'NBS30E120250HB', partNumber: '191285151', manufacturer: 'NETBIT', sapCode: '22058284', notes: 'Outro SAP: 22060313' },
      { id: 'ps-140', model: 'MSA C2500IC12.030WBR', partNumber: '191413565-XX', manufacturer: 'NETBIT', sapCode: '22059733', notes: 'Outro SAP: 22058639' },
      { id: 'ps-141', model: 'MSA C2500IC12.030WBR', partNumber: '191411152-XX', manufacturer: 'NETBIT', sapCode: '22059733', notes: 'Outro SAP: 22058639' },
      { id: 'ps-142', model: 'MSA C2500IC12.030WBR', partNumber: 'S9508-Z0/1170010008', manufacturer: 'FLEX INDUSTRIES', sapCode: '22059733', notes: 'Outro SAP: 22062573' }
    ]
  },
  {
    id: 'fga2230',
    name: 'FGA2230',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-143', model: 'ADS-30FT-12Y 12030EPBR', partNumber: '6250274A', manufacturer: 'SHENZHEN HONOR', sapCode: '22060285', notes: 'Outro SAP: 22062090' }
    ]
  },
  {
    id: 'hp610',
    name: 'HP610',
    category: 'eMTA',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-144', model: 'NBS30G120250VB', partNumber: 'NB1225WWBR6A', manufacturer: 'NETBIT', sapCode: '22060288', notes: 'Outro SAP: 22062555' },
      { id: 'ps-145', model: 'NBS30G120250VB', partNumber: 'AREP05854', manufacturer: 'Universal Eletron', sapCode: '22060288' },
      { id: 'ps-146', model: 'FONTE ALIM 12V 2.5A DT1225WWBR', partNumber: 'N/A', manufacturer: 'DELTA', sapCode: '22066009' }
    ]
  },
  {
    id: 'tg3442',
    name: 'TG3442',
    category: 'eMTA',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-147', model: 'NBS30G120250VB', partNumber: 'AREP05854', manufacturer: 'UNIVERSAL ELECTRONICS', sapCode: '22062078' },
      { id: 'ps-148', model: 'NBS30G120250VB', partNumber: 'N/A', manufacturer: 'NETBIT', sapCode: '22062555' },
      { id: 'ps-149', model: 'NBS30G120250VB', partNumber: 'AREP05854', manufacturer: 'UNIVERSAL ELECTRONICS', sapCode: '22065064' }
    ]
  },
  {
    id: 's4kcw4s',
    name: 'S4KCW4S',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: 'Pino Interno 5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-150', model: 'NBS36L120250VB', partNumber: '191689565-XX', manufacturer: 'NetBit', sapCode: '22066564' },
      { id: 'ps-151', model: 'NBS36L120250VB', partNumber: 'N/A', manufacturer: 'NETBIT', sapCode: '22068004' },
      { id: 'ps-152', model: 'NBS36L120250VB AH429', partNumber: 'N/A', manufacturer: 'Flex', sapCode: '22068062' }
    ]
  },
  {
    id: 'gpon-f689',
    name: 'Gpon F689',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '2,5A',
    power: '30W',
    connector: '5.5 x 2.5 mm',
    powerSupplies: [
      { id: 'ps-153', model: 'RD1202500-C55-168BG / MN0309-B120250', partNumber: 'MN0309-B120250', manufacturer: 'SHENZHEN', sapCode: '22065926' },
      { id: 'ps-154', model: 'MN0309-B120250-BR', partNumber: 'N/A', manufacturer: 'FLEX', sapCode: '22065926' },
      { id: 'ps-155', model: 'MN0309-B120250', partNumber: 'N/A', manufacturer: 'Xiamen', sapCode: '22065926' }
    ]
  },

  // --- 12V 3.0A ---
  {
    id: 'cga4233-tc3102',
    name: 'CGA4233 / TC3102',
    category: 'eMTA',
    voltage: '12V',
    current: '3,0A',
    power: '36W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-156', model: 'ADS-36FKJ-12 12036EPBR', partNumber: '6261488A', manufacturer: 'SHENZHEN HONOR', sapCode: '22060284', notes: 'Outro SAP: 22066257' },
      { id: 'ps-157', model: 'ADS-36FKJ-12 12036EPBR', partNumber: '6261488A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062071', notes: 'Outros SAPs: 22062576 / 22062601' },
      { id: 'ps-158', model: 'ADS-36FKJ-12 12036EPBR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22066260' }
    ]
  },
  {
    id: 'tc3106',
    name: 'TC3106',
    category: 'eMTA',
    voltage: '12V',
    current: '3,0A',
    power: '36W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-159', model: 'ADS-36FKJ-12 12036EPBR', partNumber: '6261488A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062576' },
      { id: 'ps-160', model: 'ADS-36FKJ-12', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062071', notes: 'Outros SAPs: 22066260 / 22062601' },
      { id: 'ps-161', model: 'ADS-36FKJ-12 12036EPBR 01', partNumber: '6261488A', manufacturer: 'SHENZHEN HONOR', sapCode: '22060284' }
    ]
  },
  {
    id: 'pg2449',
    name: 'PG2449',
    category: 'Cable Modem',
    voltage: '12V',
    current: '3,0A',
    power: '36W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-162', model: 'S042-1A120300HB', partNumber: 'N/A', manufacturer: 'Mass Power', sapCode: '22066303' },
      { id: 'ps-163', model: 'ADS-36FKJ 1212026EPBR', partNumber: '6261488AL0', manufacturer: 'FLEX', sapCode: '22062071', notes: 'Outro SAP: 22062576' }
    ]
  },
  {
    id: 'wifi6-f8648p',
    name: 'WIFI6 F8648P',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '3,0A',
    power: '36W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-164', model: 'RD1203000-C55-195BG', partNumber: 'N/A', manufacturer: 'Shenzhen', sapCode: 'Aguardando SAP' },
      { id: 'ps-165', model: 'S042-1A120300HB', partNumber: 'N/A', manufacturer: 'MASS POWER', sapCode: '22066303' }
    ]
  },
  {
    id: 'fwa-gx3000',
    name: 'FWA GX3000 (Intelbras 5G)',
    category: 'ONT / Fibra',
    voltage: '12V',
    current: '3,0A',
    power: '36W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-166', model: 'TPQ 229C120300AW01', partNumber: 'N/A', manufacturer: 'TIANYIN', sapCode: 'Aguardando SAP' }
    ]
  },

  // --- 12V 3.33A ---
  {
    id: 'cg3000-cg3600t',
    name: 'CG3000 / CG3600T',
    category: 'eMTA',
    voltage: '12V',
    current: '3,33A',
    power: '40W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-167', model: 'MSA-C3330IS12.0-40X-BR', partNumber: 'N/A', manufacturer: 'KAON', sapCode: '22060290' },
      { id: 'ps-168', model: 'MSA-C3330IS12.0-40X', partNumber: 'N/A', manufacturer: 'MOSO', sapCode: '22068437' },
      { id: 'ps-169', model: 'MSA-C3330IS12.0-40X-BR', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062578' },
      { id: 'ps-170', model: 'MSA-C3330IS12.0-40X-BR', partNumber: '1210-00361', manufacturer: 'KAON', sapCode: '22063029' }
    ]
  },

  // --- 12V 3.5A ---
  {
    id: 'ch8568',
    name: 'CH8568',
    category: 'eMTA',
    voltage: '12V',
    current: '3,5A',
    power: '42W',
    connector: '5.5mm x 2.1mm',
    powerSupplies: [
      { id: 'ps-171', model: 'F42L1-120350SPAE', partNumber: '01570610300R', manufacturer: 'FRECOM ELECTRONICS', sapCode: '22060289' },
      { id: 'ps-172', model: 'F42L1-120350SPAE', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062577' }
    ]
  },
  {
    id: 'fast3895-fast3896',
    name: 'FAST3895 / FAST3896',
    category: 'eMTA',
    voltage: '12V',
    current: '3,5A',
    power: '42W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-173', model: 'MSG-H3-AGWR120-042A0-BR / MSG-H3500WR120-042A0-BR', partNumber: '191591509-XX', manufacturer: 'MOSO', sapCode: '22060652' },
      { id: 'ps-174', model: 'ADS-42FKJ-12 12042EPBR', partNumber: '191591517-XX', manufacturer: 'SHENZHEN HONOR', sapCode: '22060653' },
      { id: 'ps-175', model: 'NBS42E120350VB', partNumber: '191590982-XX', manufacturer: 'NETBIT', sapCode: '22060654' },
      { id: 'ps-176', model: 'MSG-H3-AGWR120-042A0-BR', partNumber: '191591509-XX', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062579' },
      { id: 'ps-177', model: 'MSG-H3-AGWR120-042A0-BR', partNumber: '191591509-XX', manufacturer: 'SAGEMCOM', sapCode: '22063233' }
    ]
  },
  {
    id: 'hi3120',
    name: 'HI3120',
    category: 'eMTA',
    voltage: '12V',
    current: '3,5A',
    power: '42W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-178', model: 'F42L1-120350SPAE', partNumber: 'N/A', manufacturer: 'FRECOM', sapCode: '22065622' },
      { id: 'ps-179', model: 'F42L1-120350SPAE', partNumber: 'N/A', manufacturer: 'TELLESCOM', sapCode: '22062077' },
      { id: 'ps-180', model: 'F42L1-120350SPAE', partNumber: 'N/A', manufacturer: 'FLEX INDUSTRIES', sapCode: '22062577', notes: 'Outro SAP: 22060289' }
    ]
  },
  {
    id: 'wifi7-mesh-380ba',
    name: 'WIFI7 MESH 380BA',
    category: 'Extensor Wi-Fi MESH',
    voltage: '12V',
    current: '3,5A',
    power: '42W',
    connector: '5.5mm x 2.5mm',
    powerSupplies: [
      { id: 'ps-181', model: 'FONTE ALIM 12V 3.5A MSGH3500WR12004 2A0BR', partNumber: 'N/A', manufacturer: 'SAGEMCOM / MOSO', sapCode: '22062579' }
    ]
  },

  // --- 12V 3.8A ---
  {
    id: 'fast3890',
    name: 'FAST3890',
    category: 'eMTA',
    voltage: '12V',
    current: '3,8A',
    power: '46W',
    connector: '5.5mm x 2.5mm (+ Cabo de Força)',
    powerSupplies: [
      { id: 'ps-182', model: 'NBS42C120380M2', partNumber: '191376501', manufacturer: 'NETBIT', sapCode: '22058355', requiresPowerCable: true, notes: 'Requer cabo de força separado (22026096 / 22026099)' }
    ]
  },

  // --- 12V 4A ---
  {
    id: 'hnb200',
    name: 'HNB200',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '4A',
    power: '48W',
    connector: '6.5 x 3.0 mm (+ Cabo de Força)',
    powerSupplies: [
      { id: 'ps-183', model: 'ADP-50BR A', partNumber: 'DT1240WIC81A', manufacturer: 'DELTA ELECTRONICS INC', sapCode: '22056502', requiresPowerCable: true, notes: 'Requer cabo de força separado (22026096)' }
    ]
  },
  {
    id: 'dmc7001',
    name: 'DMC7001',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '4A',
    power: '48W',
    connector: '6.5 x 3.0 mm (+ Cabo de Força)',
    powerSupplies: [
      { id: 'ps-184', model: 'CUD481240-N', partNumber: 'N/A', manufacturer: 'AMPOWER TEK', sapCode: '22056455', requiresPowerCable: true },
      { id: 'ps-185', model: 'ADD013', partNumber: 'N/A', manufacturer: 'AC BEL', sapCode: '22056455', requiresPowerCable: true }
    ]
  },
  {
    id: 'dci938',
    name: 'DCI938',
    category: 'Decodificador Digital',
    voltage: '12V',
    current: '4A',
    power: '48W',
    connector: '6.5 x 3.0 mm (+ Cabo de Força)',
    powerSupplies: [
      { id: 'ps-186', model: 'ADD008-AD0G2', partNumber: '37218440', manufacturer: 'AC BEL', sapCode: '22056461', requiresPowerCable: true }
    ]
  },
  {
    id: 'hgj310',
    name: 'HGJ310',
    category: 'eMTA',
    voltage: '12V',
    current: '4A',
    power: '48W',
    connector: '6.5 x 3.0 mm (+ Cabo de Força)',
    powerSupplies: [
      { id: 'ps-187', model: 'ADS-48PI-12N-2 12048E', partNumber: '1240WIC86N_A', manufacturer: 'SHENZHEN HONOR', sapCode: '22060287', requiresPowerCable: true },
      { id: 'ps-188', model: 'ADS-48PI-12N-2 12048E', partNumber: 'N/A', manufacturer: 'Flex Industries', sapCode: '22062556', requiresPowerCable: true },
      { id: 'ps-189', model: 'Verificado junto a Humax Manaus', partNumber: 'Humax Manaus', manufacturer: 'NETBIB', sapCode: '22062556', requiresPowerCable: true }
    ]
  },

  // --- 14V 1.7A ---
  {
    id: 'svg1501',
    name: 'SVG1501',
    category: 'eMTA',
    voltage: '14V',
    current: '1,7A',
    power: '24W',
    connector: 'Macho ajustável 5.5x2.5mm / 5.5x2.1mm',
    powerSupplies: [
      { id: 'ps-190', model: 'NU24-2140170-I3', partNumber: 'N/A', manufacturer: 'LEADER ELECTRONICS', sapCode: 'S/CÓDIGO' }
    ]
  },

  // --- 15V 1A ---
  {
    id: 'dpc2434',
    name: 'DPC2434',
    category: 'Cable Modem',
    voltage: '15V',
    current: '1A',
    power: '15W',
    connector: '4.0 x 1.7 mm',
    powerSupplies: [
      { id: 'ps-191', model: '3A-152DU15', partNumber: 'N/A', manufacturer: 'ENG ELECTRIC CO', sapCode: '22026271' },
      { id: 'ps-192', model: 'SPS-06C15-1B', partNumber: 'N/A', manufacturer: 'GRE', sapCode: '22026271' }
    ]
  },

  // --- 15V 1.5A ---
  {
    id: 'dpc3928-dpc3925',
    name: 'DPC3928 / DPC3925',
    category: 'eMTA',
    voltage: '15V',
    current: '1,5A',
    power: '22W',
    connector: '4.8 x 1.7 mm',
    powerSupplies: [
      { id: 'ps-193', model: '3A-232WT15', partNumber: 'N/A', manufacturer: 'ENG ELETRIC CO. LTD.', sapCode: '22026285' },
      { id: 'ps-194', model: 'DA-23A15', partNumber: 'N/A', manufacturer: 'ASIAN POWER DEVICES INC.', sapCode: '22026285' },
      { id: 'ps-195', model: 'WAD014', partNumber: 'N/A', manufacturer: 'ACBEL', sapCode: '22026285' },
      { id: 'ps-196', model: '3A-231DA15', partNumber: 'N/A', manufacturer: 'ENG ELETRIC CO. LTD.', sapCode: '22026285' },
      { id: 'ps-197', model: 'ADS0202-U150150', partNumber: 'N/A', manufacturer: 'OEM ELETRONICS', sapCode: '22026285' }
    ]
  },

  // --- 15V 1.6A ---
  {
    id: 'dwg850',
    name: 'DWG850',
    category: 'eMTA',
    voltage: '15V',
    current: '1,6A',
    power: '24W',
    connector: '4.8 x 1.7 mm',
    powerSupplies: [
      { id: 'ps-198', model: 'EXA0606XC', partNumber: 'N/A', manufacturer: 'ENERTRONIX CO. LTD.', sapCode: '22026281' },
      { id: 'ps-199', model: 'SYS1557-2415', partNumber: 'G401155724001', manufacturer: 'SUNNY COMPUTER', sapCode: '22026281' }
    ]
  },

  // --- CABOS DE FORÇA ---
  {
    id: 'cabos-de-forca',
    name: 'Cabos de Força (DCR3101 / TG862 e Outros)',
    category: 'Cabo de Força',
    voltage: '115-240V',
    current: '2,5A',
    power: 'AC Direct',
    connector: 'Plug Bipolar / Tripolar Padrão Novo (2P+T)',
    powerSupplies: [
      { id: 'ps-200', model: 'CABO FORCA 250V 2.5A 2MT', partNumber: '2.5A 2MT', manufacturer: 'Padronizado Claro', sapCode: '22026096' },
      { id: 'ps-201', model: 'CABO FORCA PP 2 X 0.75MM X 2MT', partNumber: '0.75MM X 2MT', manufacturer: 'Padronizado Claro', sapCode: '22026099' },
      { id: 'ps-202', model: 'CABO FORCA 2P+T PADRAO NOVO', partNumber: 'NBR 14136', manufacturer: 'Padronizado Claro', sapCode: '22026102' },
      { id: 'ps-203', model: 'CABO FORCA P/ FONTE EMTA S.A', partNumber: 'EMTA S.A', manufacturer: 'Padronizado Claro', sapCode: '22026105' }
    ]
  }
];
