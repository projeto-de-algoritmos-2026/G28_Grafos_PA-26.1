# PathFinder BR 🗺️

Visualizador interativo de algoritmos de busca aplicados a cidades brasileiras.
Construído com React + TypeScript + Vite.

## Funcionalidades

- **4 algoritmos implementados do zero** (sem bibliotecas de grafo):
  - Dijkstra — caminho mais curto com peso
  - A\* (A-estrela) — Dijkstra + heurística haversine
  - BFS — busca em largura
  - Greedy — busca gulosa por heurística
- **Animação passo a passo** mostrando quais cidades foram visitadas
- **Comparação lado a lado** de todos os algoritmos para a mesma rota
- **20 cidades brasileiras** com distâncias reais (km por estrada)
- Mapa interativo SVG com destaque de rotas e nós visitados

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Estrutura

```
src/
  algorithms/
    MinHeap.ts      # Heap mínima para Dijkstra e A*
    search.ts       # Dijkstra, A*, BFS, Greedy
  components/
    GraphCanvas.tsx # SVG do grafo com animação
    Sidebar.tsx     # Painel de controles e resultado
    ComparisonPanel.tsx  # Tabela comparativa
  data/
    cities.ts       # 20 cidades + 37 arestas + haversine
  types/
    index.ts        # Interfaces TypeScript
  App.tsx           # Composição principal
  App.css           # Design system (dark mode)
```

## Conceitos aplicados

| Estrutura / Conceito | Onde |
|---|---|
| Grafo ponderado não-dirigido | `data/cities.ts` |
| Heap mínima (priority queue) | `algorithms/MinHeap.ts` |
| Dijkstra com relaxamento | `algorithms/search.ts` |
| A* com heurística haversine | `algorithms/search.ts` |
| BFS com fila | `algorithms/search.ts` |
| Greedy best-first | `algorithms/search.ts` |
| Reconstrução de caminho | `reconstructPath()` |
| Animação por steps | `App.tsx` + `useState` |

## Próximos passos sugeridos

- [ ] Adicionar pesos variáveis (pedágio, trânsito)
- [ ] Suporte a múltiplos destinos (TSP)
- [ ] Exportar rota como JSON / compartilhar via URL
- [ ] Adicionar mais cidades e rotas
- [ ] Modo "corrida" — todos os algoritmos animados ao mesmo tempo
