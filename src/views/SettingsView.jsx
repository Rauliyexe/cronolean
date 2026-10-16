import React from 'react';
import {
  Settings,
  Target,
  Clock,
  RotateCcw,
  Download,
  Upload,
  Info,
  CheckCircle2
} from 'lucide-react';
import { calculateTaktMetrics } from '../utils/leanEngine';

export function SettingsView({
  posto,
  onUpdateMeta,
  onResetAllData
}) {
  const taktMetrics = calculateTaktMetrics(posto);

  const handleChange = (field, value) => {
    onUpdateMeta({
      ...posto,
      [field]: value
    });
  };

  const handleExportBackup = () => {
    const dataStr = localStorage.getItem('cronolean_subconjuntos') || '[]';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_cronolean_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px' }}>
      
      {/* Settings Header */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={18} color="var(--analytical-blue)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Parâmetros de Produção & Cálculo do Takt Time
          </h2>
        </div>
        <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Configurações que regem os cálculos de capacidade e balanceamento para o posto "{posto.nome}"
        </p>
      </div>

      {/* Production Parameters Card */}
      <div className="ind-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Variáveis Operacionais do Posto
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Demanda Diária (peças/dia)
            </label>
            <input
              type="number"
              min="1"
              value={posto.demandaDiaria || 12}
              onChange={(e) => handleChange('demandaDiaria', Math.max(1, parseInt(e.target.value) || 1))}
              className="ind-input ind-input-mono"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
              Volume contratado ou programado por dia
            </span>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Horas Trabalhadas por Turno
            </label>
            <input
              type="number"
              step="0.1"
              value={posto.horasTrabalhadas || 8.8}
              onChange={(e) => handleChange('horasTrabalhadas', parseFloat(e.target.value) || 8.8)}
              className="ind-input ind-input-mono"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
              ex: 8,8 horas = 528 minutos brutos
            </span>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Paradas Programadas por Turno (min)
            </label>
            <input
              type="number"
              value={posto.paradasProgramadasMin || 40}
              onChange={(e) => handleChange('paradasProgramadasMin', parseInt(e.target.value) || 0)}
              className="ind-input ind-input-mono"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
              Café, 5S, reuniões de DDS (descontadas do tempo bruto)
            </span>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Número de Turnos
            </label>
            <input
              type="number"
              min="1"
              value={posto.numTurnos || 1}
              onChange={(e) => handleChange('numTurnos', Math.max(1, parseInt(e.target.value) || 1))}
              className="ind-input ind-input-mono"
              style={{ width: '100%' }}
            />
          </div>

        </div>
      </div>

      {/* Visual Takt Time Mathematical Formula */}
      <div className="ind-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #12161A 0%, #161C22 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Target size={16} color="var(--analytical-blue)" />
          <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Equação do Takt Time em Tempo Real
          </h3>
        </div>

        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textAlign: 'center' }}>
            Takt Time = (Tempo Líquido Disponível) ÷ (Demanda Diária)
          </div>

          <div style={{
            fontSize: '1.3rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            color: 'var(--analytical-blue)',
            textAlign: 'center'
          }}>
            ({taktMetrics.tempoLiquidoMin} minutos) ÷ ({posto.demandaDiaria} peças) = <span style={{ color: '#FFFFFF', textDecoration: 'underline' }}>{taktMetrics.taktTimeMin} min/peça</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Cada peça deve sair deste posto a cada <strong>{taktMetrics.taktTimeMin} minutos</strong> ({taktMetrics.taktTimeSec} segundos) para atender ao ritmo do cliente.
          </div>
        </div>
      </div>

      {/* Backup and Data Reset */}
      <div className="ind-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Backup & Segurança dos Dados
        </h3>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportBackup} className="ind-btn ind-btn-primary ind-btn-sm">
            <Download size={14} />
            <span>Baixar Backup Completo (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja restaurar as 114 operações e postos originais de fábrica?')) {
                onResetAllData();
              }
            }}
            className="ind-btn ind-btn-danger ind-btn-sm"
          >
            <RotateCcw size={14} />
            <span>Restaurar Dados Originais de Fábrica (114 operações)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
