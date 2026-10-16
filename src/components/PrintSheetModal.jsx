import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { calculateTaktMetrics, calculateLeanMetrics } from '../utils/leanEngine';

export function PrintSheetModal({
  isOpen,
  onClose,
  posto
}) {
  if (!isOpen || !posto) return null;

  const taktMetrics = calculateTaktMetrics(posto);
  const leanMetrics = calculateLeanMetrics(posto.tarefas, taktMetrics.taktTimeMin);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '1000px', maxHeight: '95vh' }}>
        
        {/* Modal Controls (Not printed) */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={20} color="var(--primary-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
              Folha de Instrução de Trabalho Padrão (FIS)
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} />
              <span>Imprimir / Salvar como PDF</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="modal-body print-area" style={{ background: '#ffffff', color: '#111827', padding: '1.5rem', fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.3' }}>
          
          {/* Company & Standard Work Header */}
          <div style={{ border: '2px solid #000', marginBottom: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 140px', alignItems: 'center', borderBottom: '1px solid #000' }}>
              <div style={{ padding: '6px', background: '#eab308', color: '#000', fontWeight: '900', fontSize: '16px', textAlign: 'center', letterSpacing: '1px' }}>
                Quicke
                <div style={{ fontSize: '7px', fontWeight: '400', letterSpacing: '0' }}>JOST Agriculture & Construction</div>
              </div>
              <div style={{ padding: '6px', textAlign: 'center', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>
                TRABALHO PADRÃO - ESTUDO DAS TAREFAS ELEMENTARES
              </div>
              <div style={{ padding: '6px', fontSize: '9px', textAlign: 'center', borderLeft: '1px solid #000' }}>
                <div>Rev: <strong>{posto.revisao || '01'}</strong></div>
                <div>Data: <strong>{posto.dataEstudo || 'XX/XX/XXXX'}</strong></div>
              </div>
            </div>

            {/* Sub-header grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid #000', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ padding: '4px', borderRight: '1px solid #000' }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>Código do PA</span>
                <strong>{posto.codigoPA || '—'}</strong>
              </div>
              <div style={{ padding: '4px', borderRight: '1px solid #000' }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>Código Subconjunto</span>
                <strong>{posto.codigoSubconjunto || '—'}</strong>
              </div>
              <div style={{ padding: '4px', borderRight: '1px solid #000' }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>Descrição Conjunto</span>
                <strong>{posto.descricaoConjunto || posto.nome}</strong>
              </div>
              <div style={{ padding: '4px', borderRight: '1px solid #000' }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>Demanda Diária</span>
                <strong>{posto.demandaDiaria} pçs</strong>
              </div>
              <div style={{ padding: '4px' }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>Takt Time</span>
                <strong style={{ color: '#0284c7' }}>{taktMetrics.taktTimeMin} min</strong>
              </div>
            </div>

            {/* Shift & Personnel data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '4px 8px', fontSize: '10px' }}>
              <div>
                Cronometrista: <strong>{posto.cronometristaNome || '—'}</strong> ({posto.cronometristaCargo || '—'})
              </div>
              <div>
                Operador: <strong>{posto.operadorNome || '—'}</strong> ({posto.operadorCargo || '—'})
              </div>
              <div style={{ textAlign: 'right' }}>
                Tempo Disponível: <strong>{taktMetrics.tempoDisponivelHoras} h</strong> | Turnos: <strong>{posto.numTurnos}</strong>
              </div>
            </div>
          </div>

          {/* Lean Indicators Summary Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', gap: '8px', marginBottom: '10px' }}>
            
            {/* Estratificação VA/NVA */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '9px' }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ padding: '3px', border: '1px solid #000', textAlign: 'left' }}>Atividade</th>
                  <th style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>Tempo</th>
                  <th style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>% Ciclo</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#dcfce7' }}>
                  <td style={{ padding: '3px', border: '1px solid #000' }}>VA (Valor Agregado)</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{leanMetrics.vaTempo} min</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{leanMetrics.pctVa}%</td>
                </tr>
                <tr style={{ background: '#fef3c7' }}>
                  <td style={{ padding: '3px', border: '1px solid #000' }}>NVA (S/ Valor Agregado)</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{leanMetrics.nvaTempo} min</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{leanMetrics.pctNva}%</td>
                </tr>
                <tr style={{ background: leanMetrics.nvaeTempo > 0 ? '#fee2e2' : '#ffffff' }}>
                  <td style={{ padding: '3px', border: '1px solid #000' }}>NVAE (Eliminar Operação)</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{leanMetrics.nvaeTempo} min</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{leanMetrics.pctNvae}%</td>
                </tr>
                <tr style={{ fontWeight: 'bold', background: '#f1f5f9' }}>
                  <td style={{ padding: '3px', border: '1px solid #000' }}>Ciclo Total</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{leanMetrics.cicloTotal} min</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>100%</td>
                </tr>
              </tbody>
            </table>

            {/* Operações Breakdown */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '9px' }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ padding: '3px', border: '1px solid #000', textAlign: 'left' }}>Operação</th>
                  <th style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>Tempo</th>
                  <th style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>% Representatividade</th>
                </tr>
              </thead>
              <tbody>
                {leanMetrics.operacoesList.map(op => (
                  <tr key={op.nome}>
                    <td style={{ padding: '3px', border: '1px solid #000' }}>{op.nome}</td>
                    <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{op.tempo} min</td>
                    <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right' }}>{op.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Balance Status */}
            <div style={{
              border: '1px solid #000',
              padding: '6px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: leanMetrics.isGargalo ? '#fee2e2' : '#f0fdf4'
            }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Status de Balanceamento
              </div>
              <div style={{ fontSize: '13px', fontWeight: '900', margin: '4px 0', color: leanMetrics.isGargalo ? '#b91c1c' : '#15803d' }}>
                {leanMetrics.isGargalo ? 'GARGALO' : 'BALANCEADO'}
              </div>
              <div style={{ fontSize: '9px' }}>
                {leanMetrics.isGargalo
                  ? `Ultrapassa Takt em ${leanMetrics.folgaOuSobrecargaMin} min`
                  : `Folga de ${leanMetrics.folgaOuSobrecargaMin} min`}
              </div>
            </div>

          </div>

          {/* Tasks Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '9px' }}>
            <thead>
              <tr style={{ background: '#e2e8f0' }}>
                <th style={{ padding: '3px', border: '1px solid #000', width: '25px', textAlign: 'center' }}>Seq</th>
                <th style={{ padding: '3px 6px', border: '1px solid #000', textAlign: 'left' }}>Descrição da Operação</th>
                <th style={{ padding: '3px', border: '1px solid #000', width: '55px', textAlign: 'right' }}>Tempo</th>
                <th style={{ padding: '3px', border: '1px solid #000', width: '45px', textAlign: 'center' }}>Ativ.</th>
                <th style={{ padding: '3px', border: '1px solid #000', width: '85px', textAlign: 'left' }}>Classificação</th>
                <th style={{ padding: '3px', border: '1px solid #000', width: '35px', textAlign: 'center' }}>Dist.</th>
                <th style={{ padding: '3px 6px', border: '1px solid #000', textAlign: 'left' }}>Observações</th>
              </tr>
            </thead>
            <tbody>
              {posto.tarefas.map((t) => (
                <tr key={t.id} style={{ background: t.atividade === 'VA' ? '#ffffff' : t.atividade === 'NVAE' ? '#fff1f2' : '#fefce8' }}>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>{t.seq}</td>
                  <td style={{ padding: '3px 6px', border: '1px solid #000' }}>{t.descricao}</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{t.tempo.toFixed(2)}</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>{t.atividade}</td>
                  <td style={{ padding: '3px', border: '1px solid #000' }}>{t.classificacao}</td>
                  <td style={{ padding: '3px', border: '1px solid #000', textAlign: 'center' }}>{t.distancia > 0 ? `${t.distancia}m` : ''}</td>
                  <td style={{ padding: '3px 6px', border: '1px solid #000', color: '#4b5563' }}>{t.obs || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures Footer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontSize: '9px' }}>
                Assinatura do Cronometrista / Métodos
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontSize: '9px' }}>
                Assinatura do Operador / Líder
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontSize: '9px' }}>
                Aprovação da Engenharia Industrial
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
