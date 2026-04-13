export interface City {
  id: string;
  name: string;
  state: string;
  x: number; // SVG coordinate
  y: number;
  lat: number;
  lng: number;
}

export interface Edge {
  from: string;
  to: string;
  distance: number; // km
}

export interface Graph {
  cities: Map<string, City>;
  adjacency: Map<string, { cityId: string; distance: number }[]>;
}

export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs' | 'greedy';

export interface SearchResult {
  path: string[];
  visited: string[];
  visitedOrder: string[];
  totalDistance: number;
  executionTime: number;
  nodesExplored: number;
}

export interface AlgorithmStep {
  visited: Set<string>;
  current: string;
  frontier: Set<string>;
  path: string[];
}
