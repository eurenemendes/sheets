
export interface SheetItem {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description: string;
  link: string;
  category?: string;
  raw: Record<string, string>;
}

export interface HeaderMap {
  name: string;
  logo: string;
  rating: string;
  description: string;
  link: string;
}

export enum StarColor {
  EXCELLENT = 'text-yellow-400',
  GOOD = 'text-green-500',
  AVERAGE = 'text-blue-500',
  FAIR = 'text-orange-500',
  POOR = 'text-red-500'
}
