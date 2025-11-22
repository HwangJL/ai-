export interface ImageAsset {
  id: string;
  url: string;
  type: 'person' | 'garment' | 'result';
  description?: string;
}

export interface HistoryItem {
  id: string;
  personUrl: string;
  garmentUrl: string;
  resultUrl: string;
  timestamp: number;
}

export enum AppStep {
  PERSON = 1,
  GARMENT = 2,
  RESULT = 3,
}

export const PRESET_PEOPLE: ImageAsset[] = [
  { id: 'p1', url: 'https://picsum.photos/id/64/600/800', type: 'person', description: '模特 A' },
  { id: 'p2', url: 'https://picsum.photos/id/338/600/800', type: 'person', description: '模特 B' },
  { id: 'p3', url: 'https://picsum.photos/id/804/600/800', type: 'person', description: '模特 C' },
  { id: 'p4', url: 'https://picsum.photos/id/1005/600/800', type: 'person', description: '模特 D' },
];

export const PRESET_GARMENTS: ImageAsset[] = [
  { id: 'g1', url: 'https://picsum.photos/id/325/600/800', type: 'garment', description: '休闲夹克' },
  { id: 'g2', url: 'https://picsum.photos/id/445/600/800', type: 'garment', description: '商务衬衫' },
  { id: 'g3', url: 'https://picsum.photos/id/765/600/800', type: 'garment', description: '红色礼服' },
  { id: 'g4', url: 'https://picsum.photos/id/1059/600/800', type: 'garment', description: '印花T恤' },
];