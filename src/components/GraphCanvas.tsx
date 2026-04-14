import { useMemo } from 'react';
import { Graph, Edge } from '../types';
import { City } from '../types';

interface Props {
  graph: Graph;
  edges: Edge[];
  visited: Set<string>;
  path: string[];
  startCity: string;
  endCity: string;
  onCityClick: (id: string) => void;
}

export default function GraphCanvas({ graph, edges, visited, path, startCity, endCity, onCityClick }: Props) {
  const pathSet = useMemo(() => new Set(path), [path]);

  const pathEdges = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
      set.add(`${path[i]}-${path[i + 1]}`);
      set.add(`${path[i + 1]}-${path[i]}`);
    }
    return set;
  }, [path]);

  const cities = useMemo(() => Array.from(graph.cities.values()), [graph]);

  function getCityState(id: string) {
    if (id === startCity) return 'start';
    if (id === endCity) return 'end';
    if (pathSet.has(id)) return 'path';
    if (visited.has(id)) return 'visited';
    return 'idle';
  }

  function getEdgeState(from: string, to: string) {
    const key = `${from}-${to}`;
    if (pathEdges.has(key)) return 'path';
    if (visited.has(from) && visited.has(to)) return 'visited';
    return 'idle';
  }

  return (
    <div className="canvas-wrapper">
      <svg viewBox="0 0 780 580" className="graph-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-path">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-node">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(edge => {
          const from = graph.cities.get(edge.from)!;
          const to = graph.cities.get(edge.to)!;
          const state = getEdgeState(edge.from, edge.to);
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                className={`edge edge--${state}`}
                filter={state === 'path' ? 'url(#glow-path)' : undefined}
              />
              {state === 'path' && (
                <text x={mx} y={my - 5} className="edge-label" textAnchor="middle">
                  {edge.distance}km
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {cities.map(city => {
          const state = getCityState(city.id);
          return (
            <g
              key={city.id}
              className={`city-node city-node--${state}`}
              onClick={() => onCityClick(city.id)}
              filter={state === 'start' || state === 'end' || state === 'path' ? 'url(#glow-node)' : undefined}
            >
              <circle cx={city.x} cy={city.y} r={state === 'idle' ? 8 : 10} className="city-circle" />
              <circle cx={city.x} cy={city.y} r={4} className="city-inner" />
              <text x={city.x} y={city.y - 16} textAnchor="middle" className="city-label">
                {city.name}
              </text>
              <text x={city.x} y={city.y - 6} textAnchor="middle" className="city-state-label">
                {city.state}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="canvas-hint">Clique em uma cidade para definir o destino</p>
    </div>
  );
}
