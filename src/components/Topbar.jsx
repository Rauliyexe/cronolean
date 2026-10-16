import React from 'react';
import {
  Timer,
  Printer,
  Wand2,
  Layers,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Menu
} from 'lucide-react';

export function Topbar({
  activeView,
  subconjuntos = [],
  activePostoId,
  onSelectPosto,
  onOpenStopwatch,
  onOpenPrint,
  onAutoClassifyAll,
  taktMetrics,
  leanMetrics,
  onToggleSidebar
}) {
  const activePosto = subconjuntos.find(s => s.id === activePostoId) || subconjuntos[0];

  const viewTitles = {
    overview: 'Painel Executivo de Engenharia',
    stopwatch: 'Cronometragem & Coleta em Linha',
    tasks: 'Gestão de Postos & Operações',
    yamazumi: 'Balanceamento Yamazumi & Takt Time',
    analytics: 'Análise Lean & Pareto Industrial',
    dictionary: 'Dicionário de Verbos & Classificação',
    importexport: 'Importação CSV & Emissão de FIS',
    settings: 'Parâmetros de Produção'
  };

  return (
    <header className="contextual-topbar">
      {/* Left: View breadcrumbs & Mobile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="ind-btn ind-btn-sm mobile-menu-btn"
          style={{ padding: '0.4rem', border: '1px solid var(--border-medium)', background: 'var(--bg-input)' }}
          title="Abrir Menu de Navegação"
        >
          <Menu size={17} color="var(--analytical-blue)" />
        </button>

        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Módulo Ativo
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>{viewTitles[activeView] || 'CronoLean'}</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 0.25rem' }} />

        {/* Station Quick Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Posto:</span>
          <select
            value={activePostoId}
            onChange={(e) => onSelectPosto(e.target.value)}
            className="ind-select"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.825rem', fontWeight: '700', color: 'var(--analytical-blue)' }}
          >
            {subconjuntos.map(s => (
              <option key={s.id} value={s.id}>
                {s.nome} ({s.descricaoConjunto || s.nome}) — {s.tarefas.length} ops
              </option>
            ))}
          </select>

          {/* Quick status pill */}
          <span className={`ind-badge ${leanMetrics.isGargalo ? 'ind-badge-nvae' : 'ind-badge-va'}`} style={{ fontSize: '0.7rem' }}>
            {leanMetrics.isGargalo ? (
              <>
                <AlertTriangle size={12} />
                <span>Gargalo (+{leanMetrics.folgaOuSobrecargaMin}m)</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} />
                <span>Folga ({leanMetrics.folgaOuSobrecargaMin}m)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={onOpenStopwatch}
          className="ind-btn ind-btn-primary ind-btn-sm"
          title="Abrir Cronômetro de Fábrica em tela cheia"
        >
          <Timer size={14} />
          <span>Coleta Rápida</span>
        </button>

        <button
          onClick={onAutoClassifyAll}
          className="ind-btn ind-btn-sm"
          title="Re-classificar todas as operações com o Dicionário Industrial"
        >
          <Wand2 size={13} color="var(--nva-color)" />
          <span className="no-mobile">Classificar Tudo</span>
        </button>

        <button
          onClick={onOpenPrint}
          className="ind-btn ind-btn-sm"
          title="Visualizar e Imprimir FIS A4"
        >
          <Printer size={13} />
          <span className="no-mobile">FIS (A4)</span>
        </button>
      </div>
    </header>
  );
}
