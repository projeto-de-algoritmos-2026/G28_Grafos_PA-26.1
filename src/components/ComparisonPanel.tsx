import { AlgorithmType, SearchResult } from '../types';

const LABELS: Record<AlgorithmType, string> = {
  dijkstra: 'Dijkstra',
  astar: 'A*',
  bfs: 'BFS',
  greedy: 'Gulosa',
};

interface Props {
  comparison: Record<AlgorithmType, SearchResult>;
  activeAlgo: AlgorithmType;
}

export default function ComparisonPanel({ comparison, activeAlgo }: Props) {
  const algos = Object.keys(comparison) as AlgorithmType[];
  const minDist = Math.min(...algos.map(a => comparison[a].totalDistance));
  const minNodes = Math.min(...algos.map(a => comparison[a].nodesExplored));

  return (
    <div className="comparison-panel">
      <h3 className="comparison-title">Comparação de algoritmos</h3>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Algoritmo</th>
            <th>Distância</th>
            <th>Nós visitados</th>
            <th>Tempo</th>
            <th>Caminho ótimo?</th>
          </tr>
        </thead>
        <tbody>
          {algos.map(a => {
            const r = comparison[a];
            const isActive = a === activeAlgo;
            return (
              <tr key={a} className={isActive ? 'comparison-row--active' : ''}>
                <td><strong>{LABELS[a]}</strong></td>
                <td className={r.totalDistance === minDist ? 'cell--best' : ''}>
                  {r.totalDistance.toLocaleString('pt-BR')} km
                </td>
                <td className={r.nodesExplored === minNodes ? 'cell--best' : ''}>
                  {r.nodesExplored}
                </td>
                <td>{r.executionTime.toFixed(3)} ms</td>
                <td>{a === 'dijkstra' || a === 'astar' ? '✓ Sim' : '✗ Não garantido'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="comparison-hint">Verde = melhor valor na coluna</p>
    </div>
  );
}
