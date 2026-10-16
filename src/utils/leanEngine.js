import { DEFAULT_VERB_DICTIONARY } from '../data/defaultData.js';

/**
 * Normaliza texto removendo acentos, pontuações redundantes e múltiplos espaços
 */
export function normalizeText(text = '') {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
    .replace(/[-_]/g, ' ')           // converte hífens e underlines em espaço (ex: anti-respingo -> anti respingo)
    .replace(/\s+/g, ' ')            // remove espaços duplicados
    .trim();
}

/**
 * MOTOR DETERMINÍSTICO DE CLASSIFICAÇÃO DE MOVIMENTOS INDUSTRIAIS
 * 
 * Ordem rigorosa de reconhecimento:
 * 1. Expressões exatas e específicas com exceção de prioridade (Prioridade 1, ex: "corrigir solda" -> Retrabalho)
 * 2. Expressões compostas (Prioridade 2, ex: "pegar tubo reto no rack", "posicionar no ferramental")
 * 3. Verbos e palavras-chave (Prioridade 3)
 * 4. Sinônimos cadastrados
 * 5. Detecção de multi-movimento
 * 6. Fallback analítico
 */
export function classifyTask(descricao = '', customDictionary = null) {
  const dictionary = customDictionary || DEFAULT_VERB_DICTIONARY;
  if (!descricao || typeof descricao !== 'string') {
    return {
      classificacao: 'Montagem',
      atividade: 'VA',
      abreviatura: 'MNT',
      matchedVerb: null,
      score: 0,
      scoreLabel: 'Não avaliado',
      ruleSource: 'Entrada vazia',
      allDetectedMotions: [],
      isAmbiguous: false
    };
  }

  const normalizedInput = normalizeText(descricao);

  // Ordena o dicionário por prioridade (1 = mais prioritária/específica, 3 = geral)
  const sortedDict = [...dictionary].sort((a, b) => (a.prioridade || 2) - (b.prioridade || 2));

  let primaryMatch = null;
  const detectedMotions = [];

  // FASE 1: Verificação de Expressões e Regras Prioritárias
  for (const item of sortedDict) {
    const normVerb = normalizeText(item.verbo);
    
    // Verifica se a frase contém o verbo/expressão exata
    const regex = new RegExp(`(^|\\b)${normVerb}(\\b|$)`, 'i');
    const hasVerbMatch = regex.test(normalizedInput);

    // Verifica sinônimos
    let hasSynonymMatch = false;
    let matchedSynonym = null;
    if (!hasVerbMatch && Array.isArray(item.sinonimos)) {
      for (const syn of item.sinonimos) {
        const normSyn = normalizeText(syn);
        const synRegex = new RegExp(`(^|\\b)${normSyn}(\\b|$)`, 'i');
        if (synRegex.test(normalizedInput)) {
          hasSynonymMatch = true;
          matchedSynonym = syn;
          break;
        }
      }
    }

    if (hasVerbMatch || hasSynonymMatch) {
      const matchScore = item.prioridade === 1 ? 100 : item.prioridade === 2 ? 90 : hasSynonymMatch ? 80 : 85;
      const motionInfo = {
        item,
        score: matchScore,
        source: hasVerbMatch ? `Regra: "${item.verbo}"` : `Sinônimo: "${matchedSynonym}"`,
        verbo: item.verbo
      };

      detectedMotions.push(motionInfo);

      if (!primaryMatch) {
        primaryMatch = motionInfo;
      }
    }
  }

  // FASE 2: Se encontrou regra no dicionário
  if (primaryMatch) {
    const item = primaryMatch.item;
    const isAmbiguous = detectedMotions.length > 1 && 
      detectedMotions.some(m => m.item.classificacao !== item.classificacao);

    return {
      classificacao: item.classificacao,
      atividade: item.atividade,
      abreviatura: item.abreviatura || item.classificacao.substring(0, 3).toUpperCase(),
      matchedVerb: primaryMatch.verbo,
      score: primaryMatch.score,
      scoreLabel: primaryMatch.score === 100 ? 'Exato (Prioridade 1)' : primaryMatch.score >= 90 ? 'Composto (Prioridade 2)' : 'Padrão (Prioridade 3)',
      ruleSource: primaryMatch.source,
      allDetectedMotions: detectedMotions.map(m => `${m.item.verbo} (${m.item.classificacao} / ${m.item.atividade})`),
      isAmbiguous,
      observacao: item.observacao || ''
    };
  }

  // FASE 3: Fallbacks determinísticos por raízes industriais caso não cadastrado
  if (normalizedInput.includes('retrabalh') || normalizedInput.includes('repar') || normalizedInput.includes('corrig') || normalizedInput.includes('refazer')) {
    return {
      classificacao: 'Retrabalho',
      atividade: 'NVAE',
      abreviatura: 'RET',
      matchedVerb: 'retrabalhar',
      score: 75,
      scoreLabel: 'Raiz analítica',
      ruleSource: 'Raiz: retrabalh*',
      allDetectedMotions: ['Retrabalho (NVAE)'],
      isAmbiguous: false
    };
  }
  if (normalizedInput.includes('sold') || normalizedInput.includes('pont')) {
    return {
      classificacao: 'Solda',
      atividade: 'VA',
      abreviatura: 'SLD',
      matchedVerb: 'soldar',
      score: 70,
      scoreLabel: 'Raiz analítica',
      ruleSource: 'Raiz: sold*',
      allDetectedMotions: ['Solda (VA)'],
      isAmbiguous: false
    };
  }
  if (normalizedInput.includes('pegar') || normalizedInput.includes('levar') || normalizedInput.includes('rack') || normalizedInput.includes('icar')) {
    return {
      classificacao: 'Movimentação',
      atividade: 'NVA',
      abreviatura: 'MOV',
      matchedVerb: 'pegar',
      score: 70,
      scoreLabel: 'Raiz analítica',
      ruleSource: 'Raiz: mov*',
      allDetectedMotions: ['Movimentação (NVA)'],
      isAmbiguous: false
    };
  }
  if (normalizedInput.includes('lixa') || normalizedInput.includes('escov') || normalizedInput.includes('respingo')) {
    return {
      classificacao: 'Acabamento',
      atividade: 'NVA',
      abreviatura: 'ACB',
      matchedVerb: 'acabamento',
      score: 65,
      scoreLabel: 'Raiz analítica',
      ruleSource: 'Raiz: acab*',
      allDetectedMotions: ['Acabamento (NVA)'],
      isAmbiguous: false
    };
  }

  // Padrão com aviso de ambiguidade
  return {
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    matchedVerb: null,
    score: 50,
    scoreLabel: 'Classificação Padrão',
    ruleSource: 'Sugestão inicial (Revisão recomendada)',
    allDetectedMotions: [],
    isAmbiguous: true
  };
}

/**
 * Calcula o Takt Time e tempos de disponibilidade com rigor matemático
 */
export function calculateTaktMetrics(posto) {
  const horasTrabalhadas = Number(posto?.horasTrabalhadas) || 8.8;
  const paradasMin = Number(posto?.paradasProgramadasMin) || 40;
  const turnos = Number(posto?.numTurnos) || 1;
  const demanda = Number(posto?.demandaDiaria) || 1;

  const tempoBrutoMin = horasTrabalhadas * 60 * turnos;
  const tempoLiquidoMin = Math.max(0, tempoBrutoMin - (paradasMin * turnos));
  const tempoDisponivelHoras = tempoLiquidoMin / 60;

  const taktTimeMin = demanda > 0 ? tempoLiquidoMin / demanda : 0;

  return {
    tempoBrutoMin,
    tempoLiquidoMin,
    tempoDisponivelHoras: Number(tempoDisponivelHoras.toFixed(2)),
    taktTimeMin: Number(taktTimeMin.toFixed(2)),
    taktTimeSec: Math.round(taktTimeMin * 60)
  };
}

/**
 * Consolida todas as métricas Lean de um subconjunto
 */
export function calculateLeanMetrics(tarefas = [], taktTimeMin = 0) {
  let vaTempo = 0;
  let nvaTempo = 0;
  let nvaeTempo = 0;

  const operacoes = {
    Solda: 0,
    Montagem: 0,
    Movimentação: 0,
    'Operação de Dispositivo': 0,
    Preparação: 0,
    Acabamento: 0,
    Inspeção: 0,
    Caminhada: 0,
    Retrabalho: 0,
    Abastecimento: 0,
    'Operação de Equipamento': 0,
    Outro: 0
  };

  let distTotal = 0;

  tarefas.forEach(t => {
    const tempo = Number(t.tempo) || 0;
    const dist = Number(t.distancia) || 0;
    distTotal += dist;

    // Lean classification
    if (t.atividade === 'VA') vaTempo += tempo;
    else if (t.atividade === 'NVAE') nvaeTempo += tempo;
    else nvaTempo += tempo; // NVA padrão

    // Operação
    if (operacoes[t.classificacao] !== undefined) {
      operacoes[t.classificacao] += tempo;
    } else {
      operacoes.Outro += tempo;
    }
  });

  const cicloTotal = vaTempo + nvaTempo + nvaeTempo;

  const pctVa = cicloTotal > 0 ? (vaTempo / cicloTotal) * 100 : 0;
  const pctNva = cicloTotal > 0 ? (nvaTempo / cicloTotal) * 100 : 0;
  const pctNvae = cicloTotal > 0 ? (nvaeTempo / cicloTotal) * 100 : 0;

  // Representatividade das Operações
  const operacoesList = Object.keys(operacoes).map(op => {
    const tempo = operacoes[op];
    const pct = cicloTotal > 0 ? (tempo / cicloTotal) * 100 : 0;
    return {
      nome: op,
      tempo: Number(tempo.toFixed(2)),
      pct: Number(pct.toFixed(1))
    };
  }).filter(op => op.tempo > 0 || ['Solda', 'Montagem', 'Movimentação', 'Acabamento', 'Operação de Dispositivo', 'Preparação'].includes(op.nome));

  // Comparação com Takt Time
  const diferencaTakt = taktTimeMin > 0 ? cicloTotal - taktTimeMin : 0;
  const isGargalo = taktTimeMin > 0 && cicloTotal > taktTimeMin;
  const folgaOuSobrecargaMin = Math.abs(diferencaTakt);

  // Yamazumi data
  let acumulado = 0;
  const yamazumiTasks = tarefas.map((t, idx) => {
    const start = acumulado;
    acumulado += Number(t.tempo) || 0;
    return {
      ...t,
      idx: idx + 1,
      start: Number(start.toFixed(2)),
      end: Number(acumulado.toFixed(2)),
      ultrapassaTakt: taktTimeMin > 0 && acumulado > taktTimeMin
    };
  });

  return {
    cicloTotal: Number(cicloTotal.toFixed(2)),
    vaTempo: Number(vaTempo.toFixed(2)),
    nvaTempo: Number(nvaTempo.toFixed(2)),
    nvaeTempo: Number(nvaeTempo.toFixed(2)),
    pctVa: Number(pctVa.toFixed(1)),
    pctNva: Number(pctNva.toFixed(1)),
    pctNvae: Number(pctNvae.toFixed(1)),
    operacoesList,
    distTotal: Number(distTotal.toFixed(1)),
    isGargalo,
    diferencaTakt: Number(diferencaTakt.toFixed(2)),
    folgaOuSobrecargaMin: Number(folgaOuSobrecargaMin.toFixed(2)),
    eficienciaLean: Number(pctVa.toFixed(1)),
    yamazumiTasks
  };
}

/**
 * Cálculo de Análise de Pareto das operações
 */
export function calculateParetoData(tarefas = []) {
  if (!tarefas || tarefas.length === 0) return [];

  const sorted = [...tarefas]
    .map(t => ({ ...t, tempo: Number(t.tempo) || 0 }))
    .sort((a, b) => b.tempo - a.tempo);

  const totalTempo = sorted.reduce((acc, t) => acc + t.tempo, 0);

  let accumulatedTime = 0;
  return sorted.map((task, index) => {
    accumulatedTime += task.tempo;
    const cumPct = totalTempo > 0 ? (accumulatedTime / totalTempo) * 100 : 0;
    const taskPct = totalTempo > 0 ? (task.tempo / totalTempo) * 100 : 0;
    return {
      id: task.id,
      seq: task.seq,
      descricao: task.descricao,
      tempo: Number(task.tempo.toFixed(2)),
      atividade: task.atividade,
      classificacao: task.classificacao,
      pctOfTotal: Number(taskPct.toFixed(1)),
      cumulativePct: Number(cumPct.toFixed(1)),
      rank: index + 1,
      isVitalFew: cumPct <= 80 || (index > 0 && sorted[index - 1] && cumPct - taskPct < 80)
    };
  });
}

/**
 * Comparação analítica consolidada entre todos os subconjuntos da linha
 */
export function calculateMultiStationComparison(subconjuntos = []) {
  return subconjuntos.map(posto => {
    const takt = calculateTaktMetrics(posto);
    const lean = calculateLeanMetrics(posto.tarefas, takt.taktTimeMin);
    return {
      id: posto.id,
      nome: posto.nome,
      codigoPA: posto.codigoPA,
      numTarefas: posto.tarefas.length,
      cicloTotal: lean.cicloTotal,
      taktTime: takt.taktTimeMin,
      vaTempo: lean.vaTempo,
      nvaTempo: lean.nvaTempo,
      nvaeTempo: lean.nvaeTempo,
      pctVa: lean.pctVa,
      pctNva: lean.pctNva,
      pctNvae: lean.pctNvae,
      isGargalo: lean.isGargalo,
      folgaOuGargalo: lean.folgaOuSobrecargaMin,
      eficiencia: lean.eficienciaLean
    };
  });
}

/**
 * Gerador de Alertas Industriais Inteligentes baseado em regras Lean reais
 */
export function generateSmartAlerts(posto, leanMetrics, taktMetrics) {
  const alerts = [];

  if (leanMetrics.isGargalo) {
    alerts.push({
      id: 'alert-gargalo',
      severity: 'critical',
      titulo: 'Gargalo Crítico de Balanceamento',
      descricao: `O ciclo (${leanMetrics.cicloTotal} min) ultrapassa o Takt Time (${taktMetrics.taktTimeMin} min) em ${leanMetrics.folgaOuSobrecargaMin} min. Risco direto ao cumprimento da demanda diária de ${posto.demandaDiaria} pçs.`,
      actionHint: 'Priorize kaizens nas operações de movimentação e ajuste de ferramental.'
    });
  }

  if (leanMetrics.pctVa < 40 && leanMetrics.cicloTotal > 0) {
    alerts.push({
      id: 'alert-va-low',
      severity: 'warning',
      titulo: 'Baixo Índice de Valor Agregado',
      descricao: `Apenas ${leanMetrics.pctVa}% do tempo do operador é trabalho de transformação (VA). ${leanMetrics.pctNva}% do tempo é consumido por movimentações e preparações.`,
      actionHint: 'Aproxime racks de componentes do posto para reduzir o tempo de movimentação.'
    });
  }

  if (leanMetrics.nvaeTempo > 0) {
    alerts.push({
      id: 'alert-nvae',
      severity: 'warning',
      titulo: 'Desperdício Puro Detectado (NVAE)',
      descricao: `${leanMetrics.nvaeTempo} min de atividades classificadas como NVAE (retrabalhos ou descartes) registradas no ciclo.`,
      actionHint: 'Elimine a causa raiz de retrabalho para zerar este tempo.'
    });
  }

  const heavyTasks = (posto.tarefas || []).filter(t => (t.tempo / (leanMetrics.cicloTotal || 1)) > 0.15 && t.tempo > 1.5);
  if (heavyTasks.length > 0) {
    alerts.push({
      id: 'alert-heavy-task',
      severity: 'info',
      titulo: `Operações Concentradoras (${heavyTasks.length})`,
      descricao: `Operações como "${heavyTasks[0].descricao}" (${heavyTasks[0].tempo} min) consomem mais de 15% do tempo de todo o ciclo individualmente.`,
      actionHint: 'Avalie automação ou divisão em dois postos para balancear o fluxo.'
    });
  }

  return alerts;
}

/**
 * Utilitários de conversão e formatação de tempo
 */
export function formatMinutesAndSeconds(decimalMinutes) {
  if (isNaN(decimalMinutes) || decimalMinutes === null) return '0:00';
  const totalSeconds = Math.round(decimalMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

export function formatStopwatchTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}

export function msToDecimalMinutes(ms) {
  return Number((ms / 60000).toFixed(2));
}
