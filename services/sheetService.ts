
import { SheetItem } from '../types';

const SHEET_ID = '1vQWOP_30V_Uxa9jT6ss7xdmxHeGgaAxvcT1B_7wbPtL5ZmPg2z9lQIo04VOkZELDePoVg2_r5Ue_sn_';
const GID = '2050396937';
const CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

export async function fetchSheetData(): Promise<SheetItem[]> {
  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();
    
    // Simple CSV parser (assuming comma-separated and potentially quoted strings)
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const items: SheetItem[] = [];

    // Map columns dynamically based on common names
    const colMap = {
      name: headers.findIndex(h => /nome|título|title|item/i.test(h)),
      logo: headers.findIndex(h => /logo|imagem|image|img/i.test(h)),
      rating: headers.findIndex(h => /estrela|rating|nota|pontua/i.test(h)),
      description: headers.findIndex(h => /descri|info/i.test(h)),
      link: headers.findIndex(h => /link|url|site|acess/i.test(h)),
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
        id: `item-${i}`,
        name: row[colMap.name] || 'Sem Nome',
        logo: row[colMap.logo] || 'https://picsum.photos/200',
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
