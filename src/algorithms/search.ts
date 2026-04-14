import { Graph, SearchResult, AlgorithmType } from '../types';
import { haversineDistance } from '../data/cities';
import { MinHeap } from './MinHeap';

function reconstructPath(cameFrom: Map<string, string>, current: string): string[] {
  const path: string[] = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }
  return path;
}

export function dijkstra(graph: Graph, startId: string, endId: string): SearchResult {
  const t0 = performance.now();
  const dist = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const visited: string[] = [];
  const pq = new MinHeap<string>();

  graph.cities.forEach((_, id) => dist.set(id, Infinity));
  dist.set(startId, 0);
  pq.push(startId, 0);

  while (pq.size > 0) {
    const current = pq.pop()!;
    if (visited.includes(current)) continue;
    visited.push(current);

    if (current === endId) break;

    const neighbors = graph.adjacency.get(current) || [];
    for (const { cityId, distance } of neighbors) {
      const newDist = dist.get(current)! + distance;
      if (newDist < dist.get(cityId)!) {
        dist.set(cityId, newDist);
        cameFrom.set(cityId, current);
        pq.push(cityId, newDist);
      }
    }
  }

  const path = cameFrom.has(endId) || startId === endId ? reconstructPath(cameFrom, endId) : [];
  return {
    path,
    visited,
    visitedOrder: visited,
    totalDistance: dist.get(endId) ?? 0,
    executionTime: performance.now() - t0,
    nodesExplored: visited.length,
  };
}

export function astar(graph: Graph, startId: string, endId: string): SearchResult {
  const t0 = performance.now();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const visited: string[] = [];
  const pq = new MinHeap<string>();
  const endCity = graph.cities.get(endId)!;

  graph.cities.forEach((_, id) => {
    gScore.set(id, Infinity);
    fScore.set(id, Infinity);
  });

  gScore.set(startId, 0);
  const startCity = graph.cities.get(startId)!;
  fScore.set(startId, haversineDistance(startCity, endCity));
  pq.push(startId, fScore.get(startId)!);

  while (pq.size > 0) {
    const current = pq.pop()!;
    if (visited.includes(current)) continue;
    visited.push(current);

    if (current === endId) break;

    const neighbors = graph.adjacency.get(current) || [];
    for (const { cityId, distance } of neighbors) {
      const tentativeG = gScore.get(current)! + distance;
      if (tentativeG < gScore.get(cityId)!) {
        cameFrom.set(cityId, current);
        gScore.set(cityId, tentativeG);
        const h = haversineDistance(graph.cities.get(cityId)!, endCity);
        fScore.set(cityId, tentativeG + h);
        pq.push(cityId, fScore.get(cityId)!);
      }
    }
  }

  const path = cameFrom.has(endId) || startId === endId ? reconstructPath(cameFrom, endId) : [];
  return {
    path,
    visited,
    visitedOrder: visited,
    totalDistance: gScore.get(endId) ?? 0,
    executionTime: performance.now() - t0,
    nodesExplored: visited.length,
  };
}

export function bfs(graph: Graph, startId: string, endId: string): SearchResult {
  const t0 = performance.now();
  const visited: string[] = [];
  const cameFrom = new Map<string, string>();
  const queue: string[] = [startId];
  const inQueue = new Set([startId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    if (current === endId) break;

    const neighbors = graph.adjacency.get(current) || [];
    for (const { cityId } of neighbors) {
      if (!inQueue.has(cityId)) {
        inQueue.add(cityId);
        cameFrom.set(cityId, current);
        queue.push(cityId);
      }
    }
  }

  const path = cameFrom.has(endId) || startId === endId ? reconstructPath(cameFrom, endId) : [];
  const totalDist = path.reduce((acc, id, i) => {
    if (i === 0) return 0;
    const prev = path[i - 1];
    const edge = graph.adjacency.get(prev)?.find(e => e.cityId === id);
    return acc + (edge?.distance ?? 0);
  }, 0);

  return {
    path,
    visited,
    visitedOrder: visited,
    totalDistance: totalDist,
    executionTime: performance.now() - t0,
    nodesExplored: visited.length,
  };
}

export function greedy(graph: Graph, startId: string, endId: string): SearchResult {
  const t0 = performance.now();
  const visited: string[] = [];
  const cameFrom = new Map<string, string>();
  const pq = new MinHeap<string>();
  const endCity = graph.cities.get(endId)!;
  const inQueue = new Set([startId]);

  pq.push(startId, haversineDistance(graph.cities.get(startId)!, endCity));

  while (pq.size > 0) {
    const current = pq.pop()!;
    if (visited.includes(current)) continue;
    visited.push(current);

    if (current === endId) break;

    const neighbors = graph.adjacency.get(current) || [];
    for (const { cityId } of neighbors) {
      if (!inQueue.has(cityId)) {
        inQueue.add(cityId);
        cameFrom.set(cityId, current);
        const h = haversineDistance(graph.cities.get(cityId)!, endCity);
        pq.push(cityId, h);
      }
    }
  }

  const path = cameFrom.has(endId) || startId === endId ? reconstructPath(cameFrom, endId) : [];
  const totalDist = path.reduce((acc, id, i) => {
    if (i === 0) return 0;
    const prev = path[i - 1];
    const edge = graph.adjacency.get(prev)?.find(e => e.cityId === id);
    return acc + (edge?.distance ?? 0);
  }, 0);

  return {
    path,
    visited,
    visitedOrder: visited,
    totalDistance: totalDist,
    executionTime: performance.now() - t0,
    nodesExplored: visited.length,
  };
}

export function runAlgorithm(
  type: AlgorithmType,
  graph: Graph,
  start: string,
  end: string
): SearchResult {
  switch (type) {
    case 'dijkstra': return dijkstra(graph, start, end);
    case 'astar':    return astar(graph, start, end);
    case 'bfs':      return bfs(graph, start, end);
    case 'greedy':   return greedy(graph, start, end);
  }
}
