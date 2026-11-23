import { TileBackId } from './types';

export interface TileBackTheme {
  id: TileBackId;
  name: string;
  subtitle: string;
  outerBg: string;
  border: string;
  hoverBorder: string;
  bottomLip: string;
  innerBg: string;
  innerBorder: string;
  patternColor: string;
  accentColor: string;
}

export const TILE_BACK_THEMES: Record<TileBackId, TileBackTheme> = {
  'denim-parlor': {
    id: 'denim-parlor',
    name: 'Parlor Blue',
    subtitle: 'Woven denim-teal & gold diamond',
    outerBg: '#1A4D6E',
    border: '#2D759E',
    hoverBorder: '#6EC1E4',
    bottomLip: '#0E2F44',
    innerBg: '#163F5B',
    innerBorder: 'rgba(78, 160, 200, 0.5)',
    patternColor: '#7AD3F0',
    accentColor: '#FDE68A',
  },
  'classic-wood': {
    id: 'classic-wood',
    name: 'Classic Wood',
    subtitle: 'Carved walnut grain & brass inlay',
    outerBg: '#6B3F21',
    border: '#9C6238',
    hoverBorder: '#E6B17A',
    bottomLip: '#3E2210',
    innerBg: '#573118',
    innerBorder: 'rgba(230, 177, 122, 0.45)',
    patternColor: '#D99B66',
    accentColor: '#FCD34D',
  },
  'royal-velvet': {
    id: 'royal-velvet',
    name: 'Royal Velvet',
    subtitle: 'Deep burgundy plush & gilt crest',
    outerBg: '#5E1B3A',
    border: '#93335E',
    hoverBorder: '#F48FB1',
    bottomLip: '#380E22',
    innerBg: '#4A142D',
    innerBorder: 'rgba(244, 180, 106, 0.45)',
    patternColor: '#E598B8',
    accentColor: '#FDE68A',
  },
  'vintage-slate': {
    id: 'vintage-slate',
    name: 'Vintage Slate',
    subtitle: 'Charcoal stone & silver filigree',
    outerBg: '#334155',
    border: '#526580',
    hoverBorder: '#94A3B8',
    bottomLip: '#1E293B',
    innerBg: '#273446',
    innerBorder: 'rgba(148, 163, 184, 0.45)',
    patternColor: '#94A3B8',
    accentColor: '#E2E8F0',
  },
};

export const TILE_BACK_LIST: TileBackTheme[] = [
  TILE_BACK_THEMES['denim-parlor'],
  TILE_BACK_THEMES['classic-wood'],
  TILE_BACK_THEMES['royal-velvet'],
  TILE_BACK_THEMES['vintage-slate'],
];

export function isValidTileBack(value: string | null | undefined): value is TileBackId {
  return (
    value === 'denim-parlor' ||
    value === 'classic-wood' ||
    value === 'royal-velvet' ||
    value === 'vintage-slate'
  );
}

export function getTileBackTheme(id: TileBackId): TileBackTheme {
  return TILE_BACK_THEMES[id] ?? TILE_BACK_THEMES['denim-parlor'];
}
