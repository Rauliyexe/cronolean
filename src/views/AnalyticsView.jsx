import React from 'react';
import { ParetoChart } from '../components/charts/ParetoChart';
import { WorkstationComparisonChart } from '../components/charts/WorkstationComparisonChart';
import { LeanCompositionChart } from '../components/charts/LeanCompositionChart';
import { TrendingUp, Layers, Compass } from 'lucide-react';

export function AnalyticsView({
  posto,
  subconjuntos = [],
  leanMetrics,
  onSelectTask,
  selectedTaskId,
  onSelectPosto
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Analytics Top Bar */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} color="var(--analytical-blue)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Análise Lean Industrial & Curva de Pareto
              </h2>
            </div>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Diagnóstico aprofundado de tempos, concentração de esforço e balanceamento da linha de produção
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span className="ind-badge ind-badge-blue">
              Total da Linha: 4 Subconjuntos • 114 Operações
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Pareto Chart + Category Composition */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.25rem' }}>
        
        {/* Pareto Chart for Current Post */}
        <ParetoChart
          tarefas={posto.tarefas}
          onSelectTask={onSelectTask}
          selectedTaskId={selectedTaskId}
          postoNome={posto.nome}
        />

        {/* Operational Categories Breakdown */}
        <LeanCompositionChart
          operacoesList={leanMetrics.operacoesList}
          selectedCategory={null}
          onSelectCategory={() => {}}
        />

      </div>

      {/* Cross-Station Comparison Chart */}
      <WorkstationComparisonChart
        subconjuntos={subconjuntos}
        activePostoId={posto.id}
        onSelectPosto={onSelectPosto}
      />

    </div>
  );
}
