import { useState, useMemo, useCallback, useRef } from 'react';
import { buildGraph, EDGES } from './data/cities';
import { runAlgorithm } from './algorithms/search';
import { AlgorithmType, SearchResult } from './types';
import GraphCanvas from './components/GraphCanvas';
import Sidebar from './components/Sidebar';
import ComparisonPanel from './components/ComparisonPanel';
import './App.css';

const graph = buildGraph();

export default function App() {
  const [startCity, setStartCity] = useState<string>('SP');
  const [endCity, setEndCity] = useState<string>('MAN');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [animStep, setAnimStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [comparison, setComparison] = useState<Record<AlgorithmType, SearchResult> | null>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cities = useMemo(() => Array.from(graph.cities.values()), []);

  const stopAnimation = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current);
    setIsRunning(false);
  }, []);

  const handleRun = useCallback(() => {
    if (!startCity || !endCity || startCity === endCity) return;
    stopAnimation();
    setComparison(null);
    const res = runAlgorithm(algorithm, graph, startCity, endCity);
    setResult(res);
    setAnimStep(0);
    setIsRunning(true);

    let step = 0;
    const totalSteps = res.visitedOrder.length + res.path.length;
    const tick = () => {
      step++;
      setAnimStep(step);
      if (step < totalSteps) {
        animRef.current = setTimeout(tick, 60);
      } else {
        setIsRunning(false);
      }
    };
    animRef.current = setTimeout(tick, 60);
  }, [startCity, endCity, algorithm, stopAnimation]);

  const handleCompare = useCallback(() => {
    if (!startCity || !endCity || startCity === endCity) return;
    stopAnimation();
    setAnimStep(-1);
    const algos: AlgorithmType[] = ['dijkstra', 'astar', 'bfs', 'greedy'];
    const results = Object.fromEntries(
      algos.map(a => [a, runAlgorithm(a, graph, startCity, endCity)])
    ) as Record<AlgorithmType, SearchResult>;
    setComparison(results);
    setResult(results[algorithm]);
    setAnimStep(9999);
  }, [startCity, endCity, algorithm, stopAnimation]);

  const visibleVisited = useMemo(() => {
    if (!result || animStep < 0) return new Set<string>();
    return new Set(result.visitedOrder.slice(0, animStep));
  }, [result, animStep]);

  const visiblePath = useMemo(() => {
    if (!result || animStep < 0) return [];
    const pathStart = result.visitedOrder.length;
    if (animStep <= pathStart) return [];
    return result.path.slice(0, animStep - pathStart + 1);
  }, [result, animStep]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">PathFinder<span className="logo-br">BR</span></span>
          </div>
          <p className="header-sub">Algoritmos de busca em cidades brasileiras</p>
        </div>
      </header>

      <div className="app-body">
        <Sidebar
          cities={cities}
          startCity={startCity}
          endCity={endCity}
          algorithm={algorithm}
          result={result}
          isRunning={isRunning}
          onStartChange={setStartCity}
          onEndChange={setEndCity}
          onAlgorithmChange={setAlgorithm}
          onRun={handleRun}
          onCompare={handleCompare}
          onStop={stopAnimation}
        />

        <main className="main-area">
          <GraphCanvas
            graph={graph}
            edges={EDGES}
            visited={visibleVisited}
            path={visiblePath}
            startCity={startCity}
            endCity={endCity}
            onCityClick={(id) => {
              if (id === startCity) return;
              if (id === endCity) { setEndCity(''); return; }
              setEndCity(id);
            }}
          />
          {comparison && (
            <ComparisonPanel comparison={comparison} activeAlgo={algorithm} />
          )}
        </main>
      </div>
    </div>
  );
}
