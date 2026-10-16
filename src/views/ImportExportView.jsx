import React, { useState } from 'react';
import {
  Upload,
  Download,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  FileText,
  Layers
} from 'lucide-react';
import { parseCSV, exportToCSV, downloadCSVFile } from '../utils/csvHelper';
import { PrintSheetModal } from '../components/PrintSheetModal';

export function ImportExportView({
  posto,
  onImportTasks,
  activePostoNome
}) {
  const [rawText, setRawText] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);
  const [targetMode, setTargetMode] = useState('replace'); // 'replace' | 'append' | 'newPosto'
  const [newPostoName, setNewPostoName] = useState('Novo Subconjunto');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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
        setErrorMsg('Nenhuma linha de tarefa válida foi identificada no arquivo.');
        setParsedPreview([]);
      } else {
        setParsedPreview(tasks);
      }
    } catch (err) {
      setErrorMsg('Erro ao processar CSV: ' + err.message);
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

  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;
    onImportTasks(parsedPreview, targetMode, newPostoName);
    setRawText('');
    setParsedPreview([]);
    alert(`${parsedPreview.length} operações importadas com sucesso!`);
  };

  const handleExportCsv = () => {
    const csvData = exportToCSV(posto);
    const filename = `cronoanalise_${(posto.nome || 'posto').toLowerCase().replace(/\s+/g, '_')}.csv`;
    downloadCSVFile(filename, csvData);
  };

  const handleDownloadTemplate = () => {
    const templateContent = [
      'Seq;Descrição da Operação;Tempo;Atividade;Classificação;Distância;Observações',
      '1;Colocar EPIs;0,67;NVA;Movimentação;0;Óculos e luvas',
      '2;Pegar tubo reto no rack;0,67;NVA;Movimentação;2;',
      '3;Soldar olhal;0,67;VA;Solda;0;',
      '4;Posicionar no ferramental;0,50;VA;Montagem;0;',
      '5;Aplicar antirrespingo;2,00;NVA;Solda;0;'
    ].join('\r\n');

    downloadCSVFile('modelo_cronoanalise.csv', templateContent);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSpreadsheet size={16} color="var(--analytical-blue)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Importação, Exportação & Emissão da FIS
              </h2>
            </div>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Integração bidirecional com planilhas Excel / CSV e impressão da Folha de Instrução Padrão industrial
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleExportCsv} className="ind-btn ind-btn-primary ind-btn-sm">
              <Download size={14} />
              <span>Exportar CSV (Excel)</span>
            </button>
            <button onClick={() => setIsPrintModalOpen(true)} className="ind-btn ind-btn-sm">
              <Printer size={14} />
              <span>Visualizar FIS (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: CSV Importer & FIS Document Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
        
        {/* CSV Import Card */}
        <div className="ind-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Importar Planilha Externa (.CSV)
            </h3>
            <button onClick={handleDownloadTemplate} className="ind-btn ind-btn-sm" style={{ fontSize: '0.72rem' }}>
              <Download size={12} />
              <span>Baixar Modelo CSV</span>
            </button>
          </div>

          {/* Drag & drop upload area */}
          <div style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
            background: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FileSpreadsheet size={28} color="var(--analytical-blue)" />
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              Arraste seu arquivo CSV ou selecione no computador
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Suporte a delimitador vírgula (,) e ponto e vírgula (;) do Excel
            </div>

            <label className="ind-btn ind-btn-primary ind-btn-sm" style={{ cursor: 'pointer', marginTop: '0.25rem' }}>
              <Upload size={13} />
              <span>Escolher Arquivo .csv</span>
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Paste CSV Text */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Ou cole as linhas de texto CSV aqui:
            </label>
            <textarea
              rows={3}
              placeholder="Seq;Descrição;Tempo;Atividade;Classificação..."
              value={rawText}
              onChange={handleTextChange}
              className="ind-textarea"
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.785rem' }}
            />
          </div>

          {errorMsg && (
            <div style={{ background: 'var(--nvae-bg)', border: '1px solid var(--nvae-border)', color: 'var(--nvae-color)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.785rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Destination options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Destino da importação:</span>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', background: 'var(--bg-input)', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input type="radio" name="destMode" checked={targetMode === 'replace'} onChange={() => setTargetMode('replace')} />
                <span>Substituir posto "{posto.nome}"</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', background: 'var(--bg-input)', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input type="radio" name="destMode" checked={targetMode === 'append'} onChange={() => setTargetMode('append')} />
                <span>Adicionar ao final</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', background: 'var(--bg-input)', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input type="radio" name="destMode" checked={targetMode === 'newPosto'} onChange={() => setTargetMode('newPosto')} />
                <span>Criar novo posto</span>
              </label>
            </div>

            {targetMode === 'newPosto' && (
              <input
                type="text"
                placeholder="Nome do novo subconjunto"
                value={newPostoName}
                onChange={(e) => setNewPostoName(e.target.value)}
                className="ind-input"
                style={{ marginTop: '0.25rem', width: '220px' }}
              />
            )}
          </div>

          <button
            onClick={handleConfirmImport}
            disabled={parsedPreview.length === 0}
            className="ind-btn ind-btn-primary"
            style={{ opacity: parsedPreview.length === 0 ? 0.5 : 1, marginTop: 'auto' }}
          >
            <CheckCircle2 size={16} />
            <span>Confirmar e Importar {parsedPreview.length} Operações</span>
          </button>
        </div>

        {/* FIS Document Presentation Card */}
        <div className="ind-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Folha de Instrução Padrão (FIS)
            </h3>
            <span className="ind-badge ind-badge-va">Pronta para A4</span>
          </div>

          <div style={{
            background: '#ffffff',
            color: '#111827',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            border: '1px solid #ddd',
            fontSize: '10px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{ border: '2px solid #000', padding: '4px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
                <strong style={{ background: '#eab308', padding: '2px 6px', fontSize: '12px' }}>Quicke / JOST</strong>
                <strong style={{ fontSize: '11px' }}>TRABALHO PADRÃO - ESTUDO DAS TAREFAS ELEMENTARES</strong>
                <span>Rev: {posto.revisao || '01'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3px', fontSize: '9px' }}>
                <span>Subconjunto: <strong>{posto.nome}</strong></span>
                <span>Código PA: <strong>{posto.codigoPA || '3609000'}</strong></span>
                <span>Demanda: <strong>{posto.demandaDiaria} pçs</strong></span>
              </div>
            </div>

            <div style={{ fontSize: '9px', color: '#555', fontStyle: 'italic', marginBottom: '8px' }}>
              Inclui tabela completa de operações, tempos decimais, classificação Lean (VA/NVA/NVAE), resumo de indicadores e campos para aprovação formal.
            </div>

            <div style={{ borderTop: '1px solid #ccc', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
              <span>Cronometrista: {posto.cronometristaNome || 'Eng. Métodos'}</span>
              <span>Operador: {posto.operadorNome || 'Operador'}</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="ind-btn ind-btn-primary"
              style={{ width: '100%' }}
            >
              <Printer size={16} />
              <span>Visualizar e Imprimir FIS (A4)</span>
            </button>
          </div>
        </div>

      </div>

      <PrintSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        posto={posto}
      />

    </div>
  );
}
