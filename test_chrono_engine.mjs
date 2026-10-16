import { DEFAULT_VERB_DICTIONARY, DEFAULT_COMPLEMENTS_CATALOG, DEFAULT_FREQUENT_ACTIONS, INITIAL_SUBCONJUNTOS } from './src/data/defaultData.js';
import { classifyTask, normalizeText } from './src/utils/leanEngine.js';

console.log('=== TESTE DO MOTOR DE CLASSIFICAÇÃO INDUSTRIAL ===\n');

// 1. Total subconjuntos e operações
console.log(`Subconjuntos carregados: ${INITIAL_SUBCONJUNTOS.length}`);
const totalOps = INITIAL_SUBCONJUNTOS.reduce((acc, s) => acc + s.tarefas.length, 0);
console.log(`Total de operações de fábrica: ${totalOps} (Esperado: 114)`);
if (totalOps !== 114) {
  console.error(`ERRO: Total de operações ${totalOps} diferente de 114!`);
  process.exit(1);
}

// 2. Testes de casos de teste específicos solicitados pelo usuário
// Nota: classificacao = Categoria operacional (Solda, Montagem, Movimentação, Retrabalho, etc.)
//       atividade = Classificação Lean (VA, NVA, NVAE)
const testCases = [
  {
    input: 'Pegar tubo reto no rack',
    expectedCategoria: 'Movimentação',
    expectedLean: 'NVA'
  },
  {
    input: 'Pegar tubo curvado no rack',
    expectedCategoria: 'Movimentação',
    expectedLean: 'NVA'
  },
  {
    input: 'Pegar peças no rack',
    expectedCategoria: 'Movimentação',
    expectedLean: 'NVA'
  },
  {
    input: 'Posicionar tubo no ferramental',
    expectedCategoria: 'Montagem',
    expectedLean: 'VA'
  },
  {
    input: 'Pegar paralama e posicionar no ferramental',
    expectedCategoria: 'Montagem',
    expectedLean: 'VA'
  },
  {
    input: 'Girar dispositivo',
    expectedCategoria: 'Operação de Dispositivo',
    expectedLean: 'NVA'
  },
  {
    input: 'Soldar olhal',
    expectedCategoria: 'Solda',
    expectedLean: 'VA'
  },
  {
    input: 'Aplicar antirrespingo',
    expectedCategoria: 'Preparação',
    expectedLean: 'NVA'
  },
  {
    input: 'Dar acabamento com escova',
    expectedCategoria: 'Acabamento',
    expectedLean: 'VA'
  },
  {
    input: 'Tirar respingos com espátula',
    expectedCategoria: 'Acabamento',
    expectedLean: 'NVA'
  },
  {
    input: 'Preencher checklist',
    expectedCategoria: 'Inspeção',
    expectedLean: 'NVA'
  },
  {
    input: 'Girar dispositivo e soldar',
    expectedCategoria: 'Solda',
    expectedLean: 'VA',
    multiMotionExpected: true
  },
  {
    input: 'Pegar ponte rolante',
    expectedCategoria: 'Operação de Equipamento',
    expectedLean: 'NVA'
  },
  {
    // Regra crítica: "corrigir solda" DEVE ser Retrabalho NVAE, NÃO Solda VA!
    input: 'corrigir solda',
    expectedCategoria: 'Retrabalho',
    expectedLean: 'NVAE'
  },
  {
    input: 'refazer solda',
    expectedCategoria: 'Retrabalho',
    expectedLean: 'NVAE'
  },
  {
    input: 'remover defeito',
    expectedCategoria: 'Retrabalho',
    expectedLean: 'NVAE'
  },
  {
    input: 'inspecionar',
    expectedCategoria: 'Inspeção',
    expectedLean: 'NVA'
  },
  {
    input: 'caminhar',
    expectedCategoria: 'Caminhada',
    expectedLean: 'NVA'
  }
];

let failures = 0;
testCases.forEach((tc, idx) => {
  const result = classifyTask(tc.input, DEFAULT_VERB_DICTIONARY);
  let passed = true;
  if (tc.expectedCategoria && result.classificacao !== tc.expectedCategoria) {
    passed = false;
  }
  if (tc.expectedLean && result.atividade !== tc.expectedLean) {
    passed = false;
  }
  if (tc.multiMotionExpected && (!result.allDetectedMotions || result.allDetectedMotions.length < 2)) {
    passed = false;
  }

  if (passed) {
    console.log(`[PASS] "${tc.input}" -> Cat: ${result.classificacao} | Lean: ${result.atividade} | Regra: ${result.ruleSource} (${result.scoreLabel})`);
    if (result.allDetectedMotions && result.allDetectedMotions.length > 1) {
      console.log(`       Multi-movimentos detectados: ${result.allDetectedMotions.join(' + ')}`);
    }
  } else {
    console.error(`[FAIL] "${tc.input}" -> Obtido: Cat=${result.classificacao}, Lean=${result.atividade} | Esperado: Cat=${tc.expectedCategoria}, Lean=${tc.expectedLean}`);
    failures++;
  }
});

console.log('\n3. Teste de Catálogo de Ações e Complementos:');
console.log(`Botões rápidos no Speed Pad: ${DEFAULT_FREQUENT_ACTIONS.length}`);
console.log(`Complementos industriais pré-cadastrados: ${DEFAULT_COMPLEMENTS_CATALOG.length}`);

// Teste de todas as 114 operações originais do CSV para verificar estabilidade
console.log('\n4. Testando classificação em lote nas 114 operações de fábrica:');
let autoClassifiedCount = 0;
INITIAL_SUBCONJUNTOS.forEach(posto => {
  posto.tarefas.forEach(t => {
    const res = classifyTask(t.descricao, DEFAULT_VERB_DICTIONARY);
    if (res && res.classificacao && res.atividade) {
      autoClassifiedCount++;
    }
  });
});
console.log(`Operações classificadas com sucesso: ${autoClassifiedCount} / 114`);

if (failures === 0 && autoClassifiedCount === 114) {
  console.log('\n>>> TODOS OS TESTES PASSARAM COM SUCESSO! 100% DE CONFORMIDADE.');
} else {
  console.error(`\n>>> ${failures} TESTES FALHARAM.`);
  process.exit(1);
}
