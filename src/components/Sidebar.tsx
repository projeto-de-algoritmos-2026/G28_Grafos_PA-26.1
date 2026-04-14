import { City, AlgorithmType, SearchResult } from '../types';

const ALGO_INFO: Record<AlgorithmType, { label: string; desc: string; complexity: string; optimal: boolean }> = {
  dijkstra: {
    label: 'Dijkstra',
    desc: 'Explora por custo acumulado. Garante o menor caminho em grafos ponderados.',
    complexity: 'O((V + E) log V)',
    optimal: true,
  },
  astar: {
    label: 'A* (A-estrela)',
    desc: 'Dijkstra + heurística (distância em linha reta). Mais eficiente em prática.',
    complexity: 'O(E log V)',
    optimal: true,
  },
  bfs: {
    label: 'BFS',
    desc: 'Busca em largura. Garante o menor caminho em grafos sem peso.',
    complexity: 'O(V + E)',
    optimal: false,
  },
  greedy: {
    label: 'Gulosa',
    desc: 'Só usa a heurística, sem considerar o custo real. Rápida, mas não ótima.',
    complexity: 'O(E log V)',
    optimal: false,
  },
};

interface Props {
  cities: City[];
  startCity: string;
  endCity: string;
  algorithm: AlgorithmType;
  result: SearchResult | null;
  isRunning: boolean;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  onAlgorithmChange: (a: AlgorithmType) => void;
  onRun: () => void;
  onCompare: () => void;
  onStop: () => void;
}

export default function Sidebar({
  cities, startCity, endCity, algorithm, result, isRunning,
  onStartChange, onEndChange, onAlgorithmChange, onRun, onCompare, onStop,
}: Props) {
  const sorted = [...cities].sort((a, b) => a.name.localeCompare(b.name));
  const info = ALGO_INFO[algorithm];

  return (
    <aside className="sidebar">
      <section className="sidebar-section">
        <h2 className="sidebar-title">Rota</h2>
        <div className="field">
          <label>Origem</label>
          <select value={startCity} onChange={e => onStartChange(e.target.value)}>
            {sorted.map(c => <option key={c.id} value={c.id}>{c.name} — {c.state}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Destino</label>
          <select value={endCity} onChange={e => onEndChange(e.target.value)}>
            {sorted.map(c => <option key={c.id} value={c.id}>{c.name} — {c.state}</option>)}
          </select>
        </div>
      </section>

      <section className="sidebar-section">
        <h2 className="sidebar-title">Algoritmo</h2>
        <div className="algo-grid">
          {(Object.keys(ALGO_INFO) as AlgorithmType[]).map(a => (
            <button
              key={a}
              className={`algo-btn ${algorithm === a ? 'algo-btn--active' : ''}`}
              onClick={() => onAlgorithmChange(a)}
            >
              {ALGO_INFO[a].label}
            </button>
          ))}
        </div>
        <div className="algo-info">
          <p className="algo-desc">{info.desc}</p>
          <div className="algo-meta">
            <span className="badge">{info.complexity}</span>
            <span className={`badge ${info.optimal ? 'badge--green' : 'badge--amber'}`}>
              {info.optimal ? '✓ Ótimo' : '✗ Não ótimo'}
            </span>
          </div>
        </div>
      </section>

      <section className="sidebar-section sidebar-actions">
        <button
          className="btn btn--primary"
          onClick={isRunning ? onStop : onRun}
          disabled={!startCity || !endCity || startCity === endCity}
        >
          {isRunning ? '⏹ Parar' : '▶ Executar'}
        </button>
        <button
          className="btn btn--secondary"
          onClick={onCompare}
          disabled={isRunning || !startCity || !endCity || startCity === endCity}
        >
          ⇄ Comparar todos
        </button>
      </section>

      {result && (
        <section className="sidebar-section">
          <h2 className="sidebar-title">Resultado</h2>
          <div className="result-grid">
            <div className="result-stat">
              <span className="result-value">{result.totalDistance.toLocaleString('pt-BR')} km</span>
              <span className="result-label">distância total</span>
            </div>
            <div className="result-stat">
              <span className="result-value">{result.nodesExplored}</span>
              <span className="result-label">cidades visitadas</span>
            </div>
            <div className="result-stat">
              <span className="result-value">{result.path.length}</span>
              <span className="result-label">cidades no caminho</span>
            </div>
            <div className="result-stat">
              <span className="result-value">{result.executionTime.toFixed(2)} ms</span>
              <span className="result-label">tempo de execução</span>
            </div>
          </div>
          {result.path.length > 0 && (
            <div className="path-list">
              <p className="path-list-title">Caminho encontrado:</p>
              <p className="path-list-cities">{result.path.join(' → ')}</p>
            </div>
          )}
        </section>
      )}
    </aside>
  );
}
