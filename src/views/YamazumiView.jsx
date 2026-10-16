import React, { useState } from 'react';
import { YamazumiChart } from '../components/charts/YamazumiChart';
import {
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Edit2,
  X,
  Target
} from 'lucide-react';
import { formatMinutesAndSeconds } from '../utils/leanEngine';

export function YamazumiView({
  posto,
  taktMetrics,
  leanMetrics,
  onNavigate,
  selectedTaskId,
  onSelectTask,
  onUpdateTask
}) {
  const [editingTask, setEditingTask] = useState(null);

  const inspectedTask = (posto.tarefas || []).find(t => t.id === selectedTaskId) || null;

  const handleStartEditInspected = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEditInspected = () => {
    if (editingTask && onUpdateTask) {
      onUpdateTask(editingTask.id, editingTask);
      setEditingTask(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Status & Summary Bar */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="ind-badge ind-badge-blue">Balanceamento de Linha</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Posto: <strong>{posto.nome}</strong> ({posto.descricaoConjunto || posto.nome})
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
              Gráfico Yamazumi Sequencial de Tarefas
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Takt Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} color="var(--analytical-blue)" />
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
                  Takt Time Alvo
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--analytical-blue)' }}>
                  {taktMetrics.taktTimeMin} min
                </span>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

            {/* Ciclo Real */}
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
                Tempo de Ciclo
              </span>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {leanMetrics.cicloTotal} min
              </span>
            </div>

            {/* Status Pill */}
            <span className={`ind-badge ${leanMetrics.isGargalo ? 'ind-badge-nvae' : 'ind-badge-va'}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              {leanMetrics.isGargalo ? (
                <>
                  <AlertTriangle size={13} />
                  <span>Gargalo (+{leanMetrics.folgaOuSobrecargaMin} min)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} />
                  <span>Balanceado ({leanMetrics.folgaOuSobrecargaMin} min de folga)</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Yamazumi Chart + Inspection Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: inspectedTask ? '1fr 340px' : '1fr', gap: '1.25rem', transition: 'grid-template-columns 0.2s ease' }}>
        
        {/* Yamazumi Chart */}
        <div>
          <YamazumiChart
            tarefas={posto.tarefas}
            taktTimeMin={taktMetrics.taktTimeMin}
            onSelectTask={onSelectTask}
            selectedTaskId={selectedTaskId}
            postoNome={posto.nome}
          />
        </div>

        {/* Inspection & Drill-Down Side Panel */}
        {inspectedTask && (
          <div className="ind-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="ind-badge ind-badge-blue">Inspeção Detalhada</span>
              </div>
              <button
                onClick={() => onSelectTask(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                title="Fechar painel de inspeção"
              >
                <X size={16} />
              </button>
            </div>

            {editingTask ? (
              /* Inline Edit Mode */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Descrição</label>
                  <input
                    type="text"
                    value={editingTask.descricao}
                    onChange={(e) => setEditingTask({ ...editingTask, descricao: e.target.value })}
                    className="ind-input"
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Tempo (min)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingTask.tempo}
                      onChange={(e) => setEditingTask({ ...editingTask, tempo: parseFloat(e.target.value) || 0 })}
                      className="ind-input ind-input-mono"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Atividade</label>
                    <select
                      value={editingTask.atividade}
                      onChange={(e) => setEditingTask({ ...editingTask, atividade: e.target.value })}
                      className="ind-select"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    >
                      <option value="VA">VA 🟢</option>
                      <option value="NVA">NVA 🟡</option>
                      <option value="NVAE">NVAE 🔴</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={handleSaveEditInspected} className="ind-btn ind-btn-primary ind-btn-sm" style={{ flex: 1 }}>
                    Salvar Alteração
                  </button>
                  <button onClick={() => setEditingTask(null)} className="ind-btn ind-btn-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* Read-only Inspection Card */
              <>
                <div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Operação Seq #{inspectedTask.seq}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {inspectedTask.descricao}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>TEMPO MEDIDO</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--analytical-blue)' }}>
                      {inspectedTask.tempo} min
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>
                      ({Math.round(inspectedTask.tempo * 60)}s)
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>CONSUMO DO TAKT</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {taktMetrics.taktTimeMin > 0 ? ((inspectedTask.tempo / taktMetrics.taktTimeMin) * 100).toFixed(1) : 0}%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>
                      do tempo alvo
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Classificação Lean:</span>
                    <span className={`ind-badge ind-badge-${inspectedTask.atividade.toLowerCase()}`}>{inspectedTask.atividade}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Especialidade:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{inspectedTask.classificacao}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Distância percorrida:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{inspectedTask.distancia > 0 ? `${inspectedTask.distancia} m` : '0 m'}</span>
                  </div>
                  {inspectedTask.obs && (
                    <div style={{ padding: '0.35rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <strong>Obs:</strong> {inspectedTask.obs}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleStartEditInspected(inspectedTask)}
                    className="ind-btn ind-btn-sm ind-btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Edit2 size={13} />
                    <span>Editar Tempo / Dados Desta Operação</span>
                  </button>

                  <button
                    onClick={() => onNavigate('tasks')}
                    className="ind-btn ind-btn-sm"
                    style={{ width: '100%' }}
                  >
                    <span>Localizar na Tabela Completa</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
