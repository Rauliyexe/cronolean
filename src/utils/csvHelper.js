/**
 * Utilitário de Importação e Exportação de CSV para Cronoanálise
 */

export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  // Remove BOM se presente
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const rawLines = cleanText.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (rawLines.length === 0) return [];

  // Detecta delimitador (, ou ;)
  const firstLine = rawLines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';

  // Função para quebrar linha respeitando aspas
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // pula aspas escapadas
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parsedRows = rawLines.map(parseLine);
  if (parsedRows.length === 0) return [];

  // Tenta encontrar a linha de cabeçalho
  let headerIndex = -1;
  let colMap = {
    seq: -1,
    descricao: -1,
    tempo: -1,
    atividade: -1,
    classificacao: -1,
    distancia: -1,
    obs: -1
  };

  for (let i = 0; i < Math.min(parsedRows.length, 10); i++) {
    const row = parsedRows[i].map(c => c.toLowerCase());
    const hasDescricao = row.some(c => c.includes('descri') || c.includes('opera') || c.includes('tarefa'));
    const hasTempo = row.some(c => c.includes('tempo') || c.includes('minut') || c.includes('segundo'));

    if (hasDescricao || hasTempo) {
      headerIndex = i;
      row.forEach((col, idx) => {
        if (col.includes('seq') || col === 'nº' || col === '#') colMap.seq = idx;
        else if (col.includes('descri') || col.includes('opera') || col.includes('tarefa') || col.includes('elemento')) colMap.descricao = idx;
        else if (col.includes('tempo') || col.includes('duracao')) colMap.tempo = idx;
        else if (col.includes('ativid') || col === 'va/nva' || col === 'va' || col === 'tipo lean') colMap.atividade = idx;
        else if (col.includes('classif') || col.includes('categoria') || col.includes('operacao')) colMap.classificacao = idx;
        else if (col.includes('dist') || col.includes('metro')) colMap.distancia = idx;
        else if (col.includes('obs') || col.includes('nota')) colMap.obs = idx;
      });
      break;
    }
  }

  // Se não achou cabeçalho claro, assume ordem padrão
  const dataRows = headerIndex >= 0 ? parsedRows.slice(headerIndex + 1) : parsedRows;

  const tarefas = [];
  dataRows.forEach((row, idx) => {
    // Pula linhas totalmente vazias
    if (row.every(cell => !cell || cell === '""')) return;

    let seq = idx + 1;
    let descricao = '';
    let tempo = 0;
    let atividade = 'VA';
    let classificacao = 'Montagem';
    let distancia = 0;
    let obs = '';

    if (headerIndex >= 0 && colMap.descricao >= 0) {
      if (colMap.seq >= 0 && row[colMap.seq]) seq = parseInt(row[colMap.seq]) || seq;
      descricao = row[colMap.descricao] || '';
      
      const tempoStr = (row[colMap.tempo] || '').replace(',', '.').replace(/[^\d.]/g, '');
      tempo = parseFloat(tempoStr) || 0;

      if (colMap.atividade >= 0 && row[colMap.atividade]) {
        const atv = row[colMap.atividade].toUpperCase();
        if (atv.includes('NVAE')) atividade = 'NVAE';
        else if (atv.includes('NVA')) atividade = 'NVA';
        else if (atv.includes('VA')) atividade = 'VA';
      }

      if (colMap.classificacao >= 0 && row[colMap.classificacao]) {
        classificacao = row[colMap.classificacao];
      }

      if (colMap.distancia >= 0 && row[colMap.distancia]) {
        distancia = parseFloat(row[colMap.distancia].replace(',', '.')) || 0;
      }

      if (colMap.obs >= 0 && row[colMap.obs]) {
        obs = row[colMap.obs];
      }
    } else {
      // Mapeamento posicional comum
      seq = parseInt(row[0]) || seq;
      descricao = row[1] || `Tarefa ${seq}`;
      const tempoStr = (row[2] || '').replace(',', '.').replace(/[^\d.]/g, '');
      tempo = parseFloat(tempoStr) || 0;
      if (row[3]) {
        const atv = row[3].toUpperCase();
        if (atv.includes('NVAE')) atividade = 'NVAE';
        else if (atv.includes('NVA')) atividade = 'NVA';
        else atividade = 'VA';
      }
      if (row[4]) classificacao = row[4];
      if (row[5]) distancia = parseFloat(row[5].replace(',', '.')) || 0;
      if (row[6]) obs = row[6];
    }

    if (descricao) {
      tarefas.push({
        id: `imp-${Date.now()}-${idx}`,
        seq,
        descricao,
        tempo: Number(tempo.toFixed(2)),
        atividade,
        classificacao: classificacao || 'Montagem',
        distancia,
        obs
      });
    }
  });

  return tarefas;
}

export function exportToCSV(posto) {
  const headers = [
    'Seq',
    'Descrição da Operação',
    'Tempo (min decimal)',
    'Atividade (VA/NVA/NVAE)',
    'Classificação',
    'Distância (m)',
    'Observações'
  ];

  const lines = [];

  // Metadados no topo
  lines.push(`"TRABALHO PADRÃO - ESTUDO DAS TAREFAS ELEMENTARES"`);
  lines.push(`"Subconjunto";"${posto.nome || ''}";"Código PA";"${posto.codigoPA || ''}";"Código Subconjunto";"${posto.codigoSubconjunto || ''}"`);
  lines.push(`"Demanda Diária";"${posto.demandaDiaria || 0}";"Horas Trabalhadas";"${posto.horasTrabalhadas || 0}";"Paradas (min)";"${posto.paradasProgramadasMin || 0}"`);
  lines.push(`"Cronometrista";"${posto.cronometristaNome || ''}";"Operador";"${posto.operadorNome || ''}";"Data";"${posto.dataEstudo || ''}"`);
  lines.push(''); // Linha vazia
  lines.push(headers.map(h => `"${h}"`).join(';'));

  posto.tarefas.forEach(t => {
    const row = [
      t.seq,
      (t.descricao || '').replace(/"/g, '""'),
      (t.tempo.toString() || '0').replace('.', ','),
      t.atividade,
      t.classificacao,
      (t.distancia || 0).toString().replace('.', ','),
      (t.obs || '').replace(/"/g, '""')
    ];
    lines.push(row.map(val => `"${val}"`).join(';'));
  });

  return lines.join('\r\n');
}

export function downloadCSVFile(filename, csvContent) {
  // UTF-8 BOM para garantir acentos corretos no Excel brasileiro
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
