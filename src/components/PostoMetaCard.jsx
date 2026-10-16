import React, { useState } from 'react';
import {
  Settings2,
  Clock,
  Target,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { calculateTaktMetrics, calculateLeanMetrics } from '../utils/leanEngine';

export function PostoMetaCard({ posto, onUpdateMeta }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const taktMetrics = calculateTaktMetrics(posto);
  const leanMetrics = calculateLeanMetrics(posto.tarefas, taktMetrics.taktTimeMin);

  const handleChange = (field, value) => {
    onUpdateMeta({
      ...posto,
      [field]: value
    });
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
      
      {/* Top Bar: Key Identifiers + Takt vs Cycle Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Left: Identification Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
              Subconjunto / Posto
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
              {posto.descricaoConjunto || posto.nome}
            </h2>
          </div>

          <div style={{ height: '32px', width: '1px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>CÓDIGO DO PA</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                {posto.codigoPA || '—'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>CÓD. SUBCONJUNTO</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                {posto.codigoSubconjunto || '—'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>DEMANDA DIÁRIA</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#38bdf8' }}>
                {posto.demandaDiaria} pçs/dia
              </span>
            </div>
          </div>
        </div>

        {/* Right: Takt Time vs Cycle Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          
          {/* Takt Time Indicator */}
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Target size={22} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Takt Time Calculado
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                {taktMetrics.taktTimeMin} <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>min/pç</span>
              </div>
            </div>
          </div>

          {/* Balance Status Badge */}
          <div style={{
            background: leanMetrics.isGargalo ? 'var(--nvae-bg)' : 'var(--va-bg)',
            border: `1px solid ${leanMetrics.isGargalo ? 'var(--nvae-border)' : 'var(--va-border)'}`,
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            {leanMetrics.isGargalo ? (
              <AlertTriangle size={20} color="var(--nvae-color)" />
            ) : (
              <CheckCircle2 size={20} color="var(--va-color)" />
            )}
            <div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: leanMetrics.isGargalo ? 'var(--nvae-color)' : 'var(--va-color)'
              }}>
                {leanMetrics.isGargalo ? 'Gargalo / Sobrecarga' : 'Posto Balanceado'}
              </div>
              <div style={{ fontSize: '0.825rem', fontWeight: '600' }}>
                {leanMetrics.isGargalo
                  ? `Excede Takt em ${leanMetrics.folgaOuSobrecargaMin} min`
                  : `Folga de ${leanMetrics.folgaOuSobrecargaMin} min`}
              </div>
            </div>
          </div>

          {/* Toggle Expand Details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 0.75rem' }}
          >
            <Settings2 size={15} />
            <span>{isExpanded ? 'Ocultar Parâmetros' : 'Editar Parâmetros'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

        </div>

      </div>

      {/* Expanded Parameters Form */}
      {isExpanded && (
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Descrição do Conjunto
            </label>
            <input
              type="text"
              value={posto.descricaoConjunto || ''}
              onChange={(e) => handleChange('descricaoConjunto', e.target.value)}
              className="input"
              placeholder="ex: Lateral LD"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Código PA
            </label>
            <input
              type="text"
              value={posto.codigoPA || ''}
              onChange={(e) => handleChange('codigoPA', e.target.value)}
              className="input"
              placeholder="ex: 3609000"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Código Subconjunto
            </label>
            <input
              type="text"
              value={posto.codigoSubconjunto || ''}
              onChange={(e) => handleChange('codigoSubconjunto', e.target.value)}
              className="input"
              placeholder="ex: 3609007"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Demanda Diária (peças)
            </label>
            <input
              type="number"
              min="1"
              value={posto.demandaDiaria || 1}
              onChange={(e) => handleChange('demandaDiaria', Math.max(1, parseInt(e.target.value) || 1))}
              className="input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Horas Trabalhadas/Turno
            </label>
            <input
              type="number"
              step="0.1"
              value={posto.horasTrabalhadas || 8.8}
              onChange={(e) => handleChange('horasTrabalhadas', parseFloat(e.target.value) || 8.8)}
              className="input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Paradas Programadas (min)
            </label>
            <input
              type="number"
              value={posto.paradasProgramadasMin || 40}
              onChange={(e) => handleChange('paradasProgramadasMin', parseInt(e.target.value) || 0)}
              className="input"
              placeholder="Café, 5S, almoço"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Número de Turnos
            </label>
            <input
              type="number"
              min="1"
              value={posto.numTurnos || 1}
              onChange={(e) => handleChange('numTurnos', parseInt(e.target.value) || 1)}
              className="input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Total de Operadores
            </label>
            <input
              type="number"
              min="1"
              value={posto.totalOperadores || 1}
              onChange={(e) => handleChange('totalOperadores', parseInt(e.target.value) || 1)}
              className="input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Cronometrista (Nome / Cargo)
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                value={posto.cronometristaNome || ''}
                onChange={(e) => handleChange('cronometristaNome', e.target.value)}
                className="input"
                placeholder="Nome"
              />
              <input
                type="text"
                value={posto.cronometristaCargo || ''}
                onChange={(e) => handleChange('cronometristaCargo', e.target.value)}
                className="input"
                placeholder="Cargo"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Operador (Nome / Cargo)
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                value={posto.operadorNome || ''}
                onChange={(e) => handleChange('operadorNome', e.target.value)}
                className="input"
                placeholder="Nome"
              />
              <input
                type="text"
                value={posto.operadorCargo || ''}
                onChange={(e) => handleChange('operadorCargo', e.target.value)}
                className="input"
                placeholder="Cargo"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
