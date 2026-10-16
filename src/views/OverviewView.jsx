import React from 'react';
import {
  Clock,
  Target,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { WorkstationComparisonChart } from '../components/charts/WorkstationComparisonChart';
import { formatMinutesAndSeconds, generateSmartAlerts } from '../utils/leanEngine';

export function OverviewView({
  posto,
  subconjuntos = [],
  taktMetrics,
  leanMetrics,
  onNavigate,
  onSelectPosto
}) {
  const alerts = generateSmartAlerts(posto, leanMetrics, taktMetrics);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Station Overview Banner */}
      <div className="ind-card" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #12161A 0%, #181D22 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="ind-badge ind-badge-blue">Posto Ativo</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                PA: {posto.codigoPA || '3609000'} • Subconjunto: {posto.codigoSubconjunto || '3609007'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
              {posto.descricaoConjunto || posto.nome}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Engenharia de Métodos • {posto.tarefas.length} operações cadastradas • Cronometrista: {posto.cronometristaNome || 'Eng. Métodos'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigate('stopwatch')}
              className="ind-btn ind-btn-primary"
            >
              <span>Iniciar Cronometragem</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('yamazumi')}
              className="ind-btn"
            >
              <span>Ver Yamazumi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Master KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* KPI 1: Tempo de Ciclo */}
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Tempo de Ciclo Real
            </span>
            <Clock size={16} color="var(--text-secondary)" />
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {leanMetrics.cicloTotal}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>min</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
              ({formatMinutesAndSeconds(leanMetrics.cicloTotal)})
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: leanMetrics.isGargalo ? 'var(--nvae-color)' : 'var(--va-color)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {leanMetrics.isGargalo ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
            <span>{leanMetrics.isGargalo ? `${leanMetrics.folgaOuSobrecargaMin} min acima do Takt` : `${leanMetrics.folgaOuSobrecargaMin} min de folga produtiva`}</span>
          </div>
        </div>

        {/* KPI 2: Takt Time */}
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Takt Time Alvo
            </span>
            <Target size={16} color="var(--analytical-blue)" />
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--analytical-blue)' }}>
              {taktMetrics.taktTimeMin}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--analytical-blue)' }}>min/pç</span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Demanda: <strong>{posto.demandaDiaria} pçs/dia</strong> • Disp: <strong>{taktMetrics.tempoDisponivelHoras} h</strong>
          </div>
        </div>

        {/* KPI 3: Eficiência Lean */}
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Eficiência Lean (% VA)
            </span>
            <Zap size={16} color="var(--va-color)" />
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--va-color)' }}>
              {leanMetrics.pctVa}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--va-color)' }}>VA</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
              Meta: &gt; 50%
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Trabalho que agrega valor: <strong>{leanMetrics.vaTempo} min</strong> de {leanMetrics.cicloTotal} min
          </div>
        </div>

        {/* KPI 4: Desperdício NVAE */}
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Desperdício NVAE
            </span>
            <TrendingDown size={16} color={leanMetrics.nvaeTempo > 0 ? 'var(--nvae-color)' : 'var(--text-muted)'} />
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: leanMetrics.nvaeTempo > 0 ? 'var(--nvae-color)' : 'var(--text-primary)' }}>
              {leanMetrics.nvaeTempo}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>min</span>
            <span className={`ind-badge ${leanMetrics.nvaeTempo > 0 ? 'ind-badge-nvae' : 'ind-badge-va'}`} style={{ marginLeft: 'auto' }}>
              {leanMetrics.pctNvae}%
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {leanMetrics.nvaeTempo > 0 ? 'Atividades para eliminação imediata' : 'Nenhum desperdício registrado'}
          </div>
        </div>

      </div>

      {/* Smart Alerts Engine */}
      {alerts.length > 0 && (
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <ShieldAlert size={16} color="var(--analytical-blue)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Diagnóstico Automático da Engenharia ({alerts.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  background: alert.severity === 'critical' ? 'var(--nvae-bg)' : 'var(--bg-input)',
                  border: `1px solid ${alert.severity === 'critical' ? 'var(--nvae-border)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                {alert.severity === 'critical' ? (
                  <AlertTriangle size={18} color="var(--nvae-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={18} color="var(--nva-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: '700', color: alert.severity === 'critical' ? '#FF858D' : 'var(--text-primary)' }}>
                    {alert.titulo}
                  </div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {alert.descricao}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--analytical-blue)', marginTop: '4px', fontStyle: 'italic' }}>
                    💡 Recomendação Lean: {alert.actionHint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Station Line Balance Comparison */}
      <WorkstationComparisonChart
        subconjuntos={subconjuntos}
        activePostoId={posto.id}
        onSelectPosto={onSelectPosto}
      />

    </div>
  );
}
