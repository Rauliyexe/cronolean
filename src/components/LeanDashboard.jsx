import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Flame,
  CheckCircle,
  AlertCircle,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { formatMinutesAndSeconds } from '../utils/leanEngine';

export function LeanDashboard({ leanMetrics, taktMetrics }) {
  const [activeTab, setActiveTab] = useState('resumo'); // 'resumo' | 'yamazumi' | 'operacoes'

  const {
    cicloTotal,
    vaTempo,
    nvaTempo,
    nvaeTempo,
    pctVa,
    pctNva,
    pctNvae,
    operacoesList,
    distTotal,
    isGargalo,
    folgaOuSobrecargaMin,
    yamazumiTasks
  } = leanMetrics;

  const taktMin = taktMetrics.taktTimeMin;

  const opColors = {
    Solda: 'var(--op-solda)',
    Montagem: 'var(--op-montagem)',
    Movimentação: 'var(--op-movimentacao)',
    Caminhada: 'var(--op-caminhada)',
    Acabamento: 'var(--op-acabamento)',
    Retrabalho: 'var(--op-retrabalho)',
    Outro: '#64748b'
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header & Tab switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TrendingUp size={20} color="var(--primary-accent)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
            Indicadores Lean & Yamazumi
          </h3>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('resumo')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'resumo' ? 'var(--primary-accent)' : 'transparent',
              color: activeTab === 'resumo' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '0.35rem 0.75rem'
            }}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('yamazumi')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'yamazumi' ? 'var(--primary-accent)' : 'transparent',
              color: activeTab === 'yamazumi' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '0.35rem 0.75rem'
            }}
          >
            Gráfico Yamazumi
          </button>
          <button
            onClick={() => setActiveTab('operacoes')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'operacoes' ? 'var(--primary-accent)' : 'transparent',
              color: activeTab === 'operacoes' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '0.35rem 0.75rem'
            }}
          >
            Operações
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* Tempo de Ciclo */}
        <div style={{
          background: 'var(--bg-input)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Tempo de Ciclo Total
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
              {cicloTotal}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>min</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
              ({formatMinutesAndSeconds(cicloTotal)})
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: isGargalo ? 'var(--nvae-color)' : 'var(--va-color)', marginTop: '0.25rem', fontWeight: '600' }}>
            {isGargalo ? `⚠️ ${folgaOuSobrecargaMin} min acima do Takt` : `✓ ${folgaOuSobrecargaMin} min dentro do Takt`}
          </div>
        </div>

        {/* VA (Valor Agregado) */}
        <div style={{
          background: 'var(--va-bg)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--va-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--va-color)', fontWeight: '700', textTransform: 'uppercase' }}>
              Valor Agregado (VA)
            </span>
            <span className="badge badge-va">{pctVa}%</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--va-color)' }}>
              {vaTempo}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--va-color)' }}>min</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Trabalho que transforma o produto
          </div>
        </div>

        {/* NVA (Sem Valor Agregado) */}
        <div style={{
          background: 'var(--nva-bg)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--nva-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--nva-color)', fontWeight: '700', textTransform: 'uppercase' }}>
              S/ Valor Agregado (NVA)
            </span>
            <span className="badge badge-nva">{pctNva}%</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--nva-color)' }}>
              {nvaTempo}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--nva-color)' }}>min</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Operação necessária (movimento/ajuste)
          </div>
        </div>

        {/* NVAE (Desperdício) */}
        <div style={{
          background: nvaeTempo > 0 ? 'var(--nvae-bg)' : 'var(--bg-input)',
          padding: '1rem',
          borderRadius: '12px',
          border: `1px solid ${nvaeTempo > 0 ? 'var(--nvae-border)' : 'var(--border-subtle)'}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: nvaeTempo > 0 ? 'var(--nvae-color)' : 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Eliminar (NVAE)
            </span>
            <span className="badge badge-nvae">{pctNvae}%</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: nvaeTempo > 0 ? 'var(--nvae-color)' : 'var(--text-main)' }}>
              {nvaeTempo}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>min</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {nvaeTempo > 0 ? 'Desperdício e retrabalho a eliminar' : 'Nenhum desperdício registrado'}
          </div>
        </div>

      </div>

      {/* Tab Content: Resumo (Barra Estratificada + Representatividade) */}
      {activeTab === 'resumo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Segmented Lean Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              <span>Estratificação Lean (VA x NVA x NVAE)</span>
              <span>Total: {cicloTotal} min (100%)</span>
            </div>
            
            <div style={{ height: '24px', width: '100%', background: 'var(--bg-input)', borderRadius: '8px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-subtle)' }}>
              {pctVa > 0 && (
                <div
                  style={{ width: `${pctVa}%`, background: 'var(--va-color)', transition: 'width 0.4s ease' }}
                  title={`VA: ${vaTempo} min (${pctVa}%)`}
                />
              )}
              {pctNva > 0 && (
                <div
                  style={{ width: `${pctNva}%`, background: 'var(--nva-color)', transition: 'width 0.4s ease' }}
                  title={`NVA: ${nvaTempo} min (${pctNva}%)`}
                />
              )}
              {pctNvae > 0 && (
                <div
                  style={{ width: `${pctNvae}%`, background: 'var(--nvae-color)', transition: 'width 0.4s ease' }}
                  title={`NVAE: ${nvaeTempo} min (${pctNvae}%)`}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--va-color)' }} />
                <span>VA: <strong>{vaTempo} min</strong> ({pctVa}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--nva-color)' }} />
                <span>NVA: <strong>{nvaTempo} min</strong> ({pctNva}%)</span>
              </div>
              {nvaeTempo > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--nvae-color)' }} />
                  <span>NVAE: <strong>{nvaeTempo} min</strong> ({pctNvae}%)</span>
                </div>
              )}
              {distTotal > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                  <Compass size={13} color="var(--primary-accent)" />
                  <span>Distância total: <strong>{distTotal} m</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Operations Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', paddingTop: '0.5rem' }}>
            {operacoesList.map(op => (
              <div
                key={op.nome}
                style={{
                  background: 'var(--bg-input)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${opColors[op.nome] || '#64748b'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {op.nome}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    {op.tempo} <span style={{ fontSize: '0.7rem', fontWeight: '400' }}>min</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: opColors[op.nome] }}>
                    {op.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab Content: Yamazumi Chart */}
      {activeTab === 'yamazumi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>
              <strong>Gráfico Yamazumi Sequencial</strong>: Empilhamento de cada tarefa do ciclo contra o Takt Time ({taktMin} min).
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '2px', background: '#ef4444' }} />
                <span>Linha Takt Time ({taktMin} min)</span>
              </span>
            </div>
          </div>

          {/* Chart Container */}
          <div style={{
            position: 'relative',
            background: 'var(--bg-input)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            overflowX: 'auto'
          }}>
            {/* Takt threshold line indicator */}
            {taktMin > 0 && (
              <div style={{
                marginBottom: '0.75rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                background: isGargalo ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isGargalo ? '#f87171' : '#34d399',
                fontSize: '0.785rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Zap size={15} />
                <span>
                  {isGargalo
                    ? `Atenção: O ciclo (${cicloTotal} min) ultrapassa o Takt Time (${taktMin} min) em ${folgaOuSobrecargaMin} min. Reduza tarefas NVA para balancear a linha!`
                    : `Linha equilibrada! O ciclo (${cicloTotal} min) opera confortavelmente abaixo do Takt Time (${taktMin} min) com ${folgaOuSobrecargaMin} min de folga.`}
                </span>
              </div>
            )}

            {/* Visual Task Bar Stack */}
            <div style={{ display: 'flex', height: '56px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              {yamazumiTasks.map((t) => {
                const widthPct = cicloTotal > 0 ? (t.tempo / cicloTotal) * 100 : 0;
                const isVa = t.atividade === 'VA';
                const isNvae = t.atividade === 'NVAE';
                const bg = isNvae ? 'var(--nvae-color)' : isVa ? 'var(--va-color)' : 'var(--nva-color)';

                return (
                  <div
                    key={t.id}
                    style={{
                      width: `${Math.max(widthPct, 0.5)}%`,
                      height: '100%',
                      background: bg,
                      borderRight: '1px solid rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                      position: 'relative'
                    }}
                    title={`Seq #${t.seq}: ${t.descricao} | ${t.tempo} min | ${t.atividade} (${t.classificacao})`}
                  />
                );
              })}
            </div>

            {/* Sequence Elements mini legend / table */}
            <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.785rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.35rem' }}>#</th>
                    <th style={{ padding: '0.35rem' }}>Descrição da Tarefa</th>
                    <th style={{ padding: '0.35rem' }}>Tempo</th>
                    <th style={{ padding: '0.35rem' }}>Acumulado</th>
                    <th style={{ padding: '0.35rem' }}>Tipo</th>
                    <th style={{ padding: '0.35rem' }}>Operação</th>
                  </tr>
                </thead>
                <tbody>
                  {yamazumiTasks.map(t => (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: t.ultrapassaTakt ? 'rgba(239, 68, 68, 0.08)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '0.35rem', fontFamily: 'var(--font-mono)' }}>{t.seq}</td>
                      <td style={{ padding: '0.35rem' }}>{t.descricao}</td>
                      <td style={{ padding: '0.35rem', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{t.tempo} min</td>
                      <td style={{ padding: '0.35rem', fontFamily: 'var(--font-mono)', color: t.ultrapassaTakt ? '#f87171' : 'var(--text-muted)' }}>
                        {t.end} min {t.ultrapassaTakt && '⚠️'}
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <span className={`badge badge-${t.atividade.toLowerCase()}`}>{t.atividade}</span>
                      </td>
                      <td style={{ padding: '0.35rem' }}>{t.classificacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content: Operações (Detailed breakdown) */}
      {activeTab === 'operacoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Distribuição do tempo de ciclo entre as especialidades operacionais:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {operacoesList.map(op => (
              <div key={op.nome} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: opColors[op.nome] || '#64748b' }} />
                    <span>{op.nome}</span>
                  </div>
                  <span>{op.tempo} min ({op.pct}%)</span>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${op.pct}%`,
                      background: opColors[op.nome] || '#64748b',
                      borderRadius: '5px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
