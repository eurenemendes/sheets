
import { SheetItem } from '../types';

const SHEET_ID = '1vQWOP_30V_Uxa9jT6ss7xdmxHeGgaAxvcT1B_7wbPtL5ZmPg2z9lQIo04VOkZELDePoVg2_r5Ue_sn_';
const CSV_BASE_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-${SHEET_ID}/pub?single=true&output=csv`;

export async function fetchSheetData(gid: string = '2050396937'): Promise<SheetItem[]> {
  try {
    const response = await fetch(`${CSV_BASE_URL}&gid=${gid}`);
    const text = await response.text();
    
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const items: SheetItem[] = [];

    // Map columns dynamically based on common names
    const colMap = {
      name: headers.findIndex(h => /nome|título|title|item|empresa/i.test(h)),
      logo: headers.findIndex(h => /logo|imagem|image|img/i.test(h)),
      rating: headers.findIndex(h => /estrela|rating|nota|pontua/i.test(h)),
      description: headers.findIndex(h => /descri|info|detalhe/i.test(h)),
      link: headers.findIndex(h => /link|url|site|acess|whatsapp|contato/i.test(h)),
    };

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const row = parseCSVLine(lines[i]);
      
      const rawData: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rawData[h] = row[idx] || '';
      });

      const ratingVal = parseFloat(row[colMap.rating]) || 0;

      items.push({
        id: `item-${gid}-${i}`,
        name: row[colMap.name] || 'Sem Nome',
        logo: row[colMap.logo] || `https://ui-avatars.com/api/?name=${encodeURIComponent(row[colMap.name] || 'Item')}&background=random`,
        rating: ratingVal,
        description: row[colMap.description] || '',
        link: row[colMap.link] || '#',
        raw: rawData
      });
    }

    return items;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result.map(s => s.replace(/^"|"$/g, ''));
}
