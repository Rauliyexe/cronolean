import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Download,
  Layers
} from 'lucide-react';
import { parseCSV, downloadCSVFile } from '../utils/csvHelper';

export function CsvImportModal({
  isOpen,
  onClose,
  activePostoNome,
  onImportTasks
}) {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);
  const [targetMode, setTargetMode] = useState('replace'); // 'replace' | 'append' | 'newPosto'
  const [newPostoName, setNewPostoName] = useState('Importado CSV');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setRawText(content);
        processPreview(content);
      }
    };
    reader.readAsText(file);
  };

  const processPreview = (text) => {
    setErrorMsg('');
    try {
      const tasks = parseCSV(text);
      if (tasks.length === 0) {
        setErrorMsg('Nenhuma linha de tarefa válida foi identificada no conteúdo. Verifique se as colunas possuem cabeçalho ou valores preenchidos.');
        setParsedPreview([]);
      } else {
        setParsedPreview(tasks);
      }
    } catch (err) {
      setErrorMsg('Erro ao processar o CSV: ' + err.message);
      setParsedPreview([]);
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setRawText(val);
    if (val.trim()) {
      processPreview(val);
    } else {
      setParsedPreview([]);
      setErrorMsg('');
    }
  };

  const handleConfirm = () => {
    if (parsedPreview.length === 0) return;
    onImportTasks(parsedPreview, targetMode, newPostoName);
    onClose();
  };

  const handleDownloadTemplate = () => {
    const templateContent = [
      'Seq;Descrição da Operação;Tempo;Atividade;Classificação;Distância;Observações',
      '1;Colocar EPIs;0,67;NVA;Movimentação;0;Óculos e luvas',
      '2;Pegar tubo reto no rack;0,67;NVA;Movimentação;2;',
      '3;Soldar olhal;0,67;VA;Solda;0;',
      '4;Posicionar no ferramental;0,50;VA;Montagem;0;',
      '5;Aplicar anti-respingo;2,00;NVA;Solda;0;'
    ].join('\r\n');

    downloadCSVFile('modelo_cronoanalise.csv', templateContent);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary-gradient)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                Importar Planilha CSV
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Carregue dados do Excel/Google Sheets ou cole as linhas diretamente
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: '1.25rem' }}>
          
          {/* File input / Drag area */}
          <div style={{
            border: '2px dashed var(--border-strong)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            background: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <FileSpreadsheet size={32} color="var(--primary-accent)" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                Selecione um arquivo CSV do seu computador
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Compatível com separador vírgula (,) ou ponto e vírgula (;) do Excel
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={14} />
                <span>Escolher Arquivo .CSV</span>
                <input
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Baixar Modelo CSV</span>
              </button>
            </div>
          </div>

          {/* Paste Text Area */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Ou cole o texto do CSV aqui:
            </label>
            <textarea
              rows={4}
              placeholder={`Seq;Descrição da Operação;Tempo;Atividade;Classificação;Distância\n1;Pegar tubo reto no rack;0,67;NVA;Movimentação;2\n2;Soldar olhal;0,67;VA;Solda;0`}
              value={rawText}
              onChange={handleTextChange}
              className="textarea"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.785rem' }}
            />
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div style={{
              background: 'var(--nvae-bg)',
              border: '1px solid var(--nvae-border)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Destination options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Destino dos dados importados:
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-input)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: `1px solid ${targetMode === 'replace' ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}>
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={targetMode === 'replace'}
                  onChange={() => setTargetMode('replace')}
                />
                <span>Substituir tarefas de <strong>{activePostoNome}</strong></span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-input)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: `1px solid ${targetMode === 'append' ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}>
                <input
                  type="radio"
                  name="importMode"
                  value="append"
                  checked={targetMode === 'append'}
                  onChange={() => setTargetMode('append')}
                />
                <span>Adicionar ao final de <strong>{activePostoNome}</strong></span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-input)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: `1px solid ${targetMode === 'newPosto' ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}>
                <input
                  type="radio"
                  name="importMode"
                  value="newPosto"
                  checked={targetMode === 'newPosto'}
                  onChange={() => setTargetMode('newPosto')}
                />
                <span>Criar Novo Subconjunto</span>
              </label>
            </div>

            {targetMode === 'newPosto' && (
              <div style={{ marginTop: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Nome do novo posto / subconjunto"
                  value={newPostoName}
                  onChange={(e) => setNewPostoName(e.target.value)}
                  className="input"
                  style={{ width: '280px' }}
                />
              </div>
            )}
          </div>

          {/* Preview Table */}
          {parsedPreview.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Pré-visualização ({parsedPreview.length} operações reconhecidas):
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
                  ✓ Reconhecido com sucesso
                </span>
              </div>

              <div style={{ maxHeight: '180px', overflowY: 'auto', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.785rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'center' }}>Seq</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Descrição</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Tempo</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Atividade</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Classificação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPreview.slice(0, 10).map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{p.seq}</td>
                        <td style={{ padding: '0.35rem 0.6rem' }}>{p.descricao}</td>
                        <td style={{ padding: '0.35rem 0.6rem', fontFamily: 'var(--font-mono)' }}>{p.tempo} min</td>
                        <td style={{ padding: '0.35rem 0.6rem' }}>
                          <span className={`badge badge-${p.atividade.toLowerCase()}`}>{p.atividade}</span>
                        </td>
                        <td style={{ padding: '0.35rem 0.6rem' }}>{p.classificacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedPreview.length > 10 && (
                  <div style={{ padding: '0.4rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    ... e mais {parsedPreview.length - 10} tarefas.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={parsedPreview.length === 0}
            className="btn btn-primary"
            style={{ opacity: parsedPreview.length === 0 ? 0.5 : 1 }}
          >
            <CheckCircle size={18} />
            <span>Confirmar e Importar {parsedPreview.length} Tarefas</span>
          </button>
        </div>

      </div>
    </div>
  );
}
