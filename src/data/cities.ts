import { City, Edge, Graph } from '../types';

export const CITIES: City[] = [
  { id: 'SP',  name: 'São Paulo',       state: 'SP', x: 420, y: 420, lat: -23.55, lng: -46.63 },
  { id: 'RJ',  name: 'Rio de Janeiro',  state: 'RJ', x: 530, y: 390, lat: -22.90, lng: -43.17 },
  { id: 'BH',  name: 'Belo Horizonte',  state: 'MG', x: 470, y: 320, lat: -19.92, lng: -43.93 },
  { id: 'BSB', name: 'Brasília',        state: 'DF', x: 420, y: 230, lat: -15.78, lng: -47.93 },
  { id: 'SSA', name: 'Salvador',        state: 'BA', x: 600, y: 240, lat: -12.97, lng: -38.50 },
  { id: 'FOR', name: 'Fortaleza',       state: 'CE', x: 620, y: 130, lat: -3.72,  lng: -38.54 },
  { id: 'REC', name: 'Recife',          state: 'PE', x: 680, y: 190, lat: -8.05,  lng: -34.88 },
  { id: 'MAN', name: 'Manaus',          state: 'AM', x: 180, y: 150, lat: -3.10,  lng: -60.02 },
  { id: 'BEL', name: 'Belém',           state: 'PA', x: 430, y: 120, lat: -1.46,  lng: -48.50 },
  { id: 'POA', name: 'Porto Alegre',    state: 'RS', x: 350, y: 530, lat: -30.03, lng: -51.23 },
  { id: 'CWB', name: 'Curitiba',        state: 'PR', x: 390, y: 480, lat: -25.43, lng: -49.27 },
  { id: 'FLN', name: 'Florianópolis',   state: 'SC', x: 380, y: 510, lat: -27.60, lng: -48.55 },
  { id: 'GYN', name: 'Goiânia',         state: 'GO', x: 380, y: 270, lat: -16.68, lng: -49.25 },
  { id: 'CGR', name: 'Campo Grande',    state: 'MS', x: 300, y: 360, lat: -20.47, lng: -54.62 },
  { id: 'CGB', name: 'Cuiabá',          state: 'MT', x: 240, y: 290, lat: -15.60, lng: -56.10 },
  { id: 'THE', name: 'Teresina',        state: 'PI', x: 560, y: 160, lat: -5.09,  lng: -42.80 },
  { id: 'MCZ', name: 'Maceió',          state: 'AL', x: 660, y: 230, lat: -9.67,  lng: -35.74 },
  { id: 'VIX', name: 'Vitória',         state: 'ES', x: 560, y: 350, lat: -20.32, lng: -40.34 },
  { id: 'NAT', name: 'Natal',           state: 'RN', x: 700, y: 155, lat: -5.79,  lng: -35.21 },
  { id: 'SLZ', name: 'São Luís',        state: 'MA', x: 530, y: 140, lat: -2.53,  lng: -44.30 },
];

export const EDGES: Edge[] = [
  { from: 'SP',  to: 'RJ',  distance: 429 },
  { from: 'SP',  to: 'BH',  distance: 586 },
  { from: 'SP',  to: 'CWB', distance: 408 },
  { from: 'SP',  to: 'CGR', distance: 1014 },
  { from: 'RJ',  to: 'BH',  distance: 434 },
  { from: 'RJ',  to: 'VIX', distance: 524 },
  { from: 'BH',  to: 'BSB', distance: 716 },
  { from: 'BH',  to: 'VIX', distance: 524 },
  { from: 'BH',  to: 'SSA', distance: 1372 },
  { from: 'BSB', to: 'GYN', distance: 209 },
  { from: 'BSB', to: 'SSA', distance: 1449 },
  { from: 'BSB', to: 'THE', distance: 1491 },
  { from: 'BSB', to: 'BEL', distance: 2120 },
  { from: 'SSA', to: 'REC', distance: 839 },
  { from: 'SSA', to: 'MCZ', distance: 648 },
  { from: 'SSA', to: 'FOR', distance: 1198 },
  { from: 'FOR', to: 'REC', distance: 538 },
  { from: 'FOR', to: 'THE', distance: 634 },
  { from: 'FOR', to: 'NAT', distance: 537 },
  { from: 'REC', to: 'MCZ', distance: 285 },
  { from: 'REC', to: 'NAT', distance: 300 },
  { from: 'MAN', to: 'BEL', distance: 1293 },
  { from: 'MAN', to: 'CGB', distance: 1438 },
  { from: 'BEL', to: 'SLZ', distance: 800 },
  { from: 'BEL', to: 'THE', distance: 1562 },
  { from: 'POA', to: 'FLN', distance: 476 },
  { from: 'POA', to: 'CWB', distance: 728 },
  { from: 'CWB', to: 'FLN', distance: 300 },
  { from: 'CWB', to: 'CGR', distance: 995 },
  { from: 'GYN', to: 'CGB', distance: 891 },
  { from: 'GYN', to: 'CGR', distance: 937 },
  { from: 'CGR', to: 'CGB', distance: 694 },
  { from: 'THE', to: 'SLZ', distance: 447 },
  { from: 'THE', to: 'MCZ', distance: 1053 },
  { from: 'MCZ', to: 'REC', distance: 285 },
  { from: 'NAT', to: 'SLZ', distance: 1082 },
  { from: 'VIX', to: 'SSA', distance: 1152 },
];

export function buildGraph(): Graph {
  const cities = new Map<string, City>();
  const adjacency = new Map<string, { cityId: string; distance: number }[]>();

  CITIES.forEach(city => {
    cities.set(city.id, city);
    adjacency.set(city.id, []);
  });

  EDGES.forEach(edge => {
    adjacency.get(edge.from)!.push({ cityId: edge.to, distance: edge.distance });
    adjacency.get(edge.to)!.push({ cityId: edge.from, distance: edge.distance });
  });

  return { cities, adjacency };
}

export function haversineDistance(a: City, b: City): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const c = 2 * Math.asin(
    Math.sqrt(sinDLat * sinDLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinDLng * sinDLng)
  );
  return R * c;
}
