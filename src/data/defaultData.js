/**
 * DICIONÁRIO DE MOVIMENTOS INDUSTRIAIS & BASE DE DADOS LEAN
 * Categorias A até J completas com regras compostas, prioridades e sinônimos.
 */

export const DEFAULT_COMPLEMENTS_CATALOG = [
  { id: 'c1', termo: 'Tubo', categoria: 'Componente' },
  { id: 'c2', termo: 'Tubo reto', categoria: 'Componente' },
  { id: 'c3', termo: 'Tubo curvado', categoria: 'Componente' },
  { id: 'c4', termo: 'Olhal', categoria: 'Componente' },
  { id: 'c5', termo: 'Link', categoria: 'Componente' },
  { id: 'c6', termo: 'Grampo', categoria: 'Fixação' },
  { id: 'c7', termo: 'Ferramental', categoria: 'Dispositivo' },
  { id: 'c8', termo: 'Gabarito', categoria: 'Dispositivo' },
  { id: 'c9', termo: 'Dispositivo', categoria: 'Dispositivo' },
  { id: 'c10', termo: 'Rack', categoria: 'Armazenamento' },
  { id: 'c11', termo: 'Bancada', categoria: 'Área' },
  { id: 'c12', termo: 'Conjunto', categoria: 'Componente' },
  { id: 'c13', termo: 'Chapa', categoria: 'Componente' },
  { id: 'c14', termo: 'EPIs', categoria: 'Segurança' },
  { id: 'c15', termo: 'Checklist', categoria: 'Qualidade' },
  { id: 'c16', termo: 'Antirrespingo', categoria: 'Insumo' },
  { id: 'c17', termo: 'Bocal', categoria: 'Equipamento' },
  { id: 'c18', termo: 'Ponte rolante', categoria: 'Equipamento' },
  { id: 'c19', termo: 'Rebarba', categoria: 'Acabamento' },
  { id: 'c20', termo: 'Solda', categoria: 'Processo' }
];

export const DEFAULT_FREQUENT_ACTIONS = [
  { label: 'PEGAR', verbo: 'Pegar', classDefault: 'Movimentação', atvDefault: 'NVA', abrev: 'MOV' },
  { label: 'POSICIONAR', verbo: 'Posicionar', classDefault: 'Montagem', atvDefault: 'VA', abrev: 'MNT' },
  { label: 'SOLDAR', verbo: 'Soldar', classDefault: 'Solda', atvDefault: 'VA', abrev: 'SLD' },
  { label: 'PONTEAR', verbo: 'Pontear', classDefault: 'Solda', atvDefault: 'VA', abrev: 'SLD' },
  { label: 'GIRAR', verbo: 'Girar', classDefault: 'Operação de Dispositivo', atvDefault: 'NVA', abrev: 'DISP' },
  { label: 'APERTAR', verbo: 'Apertar', classDefault: 'Montagem', atvDefault: 'VA', abrev: 'MNT' },
  { label: 'APLICAR', verbo: 'Aplicar', classDefault: 'Preparação', atvDefault: 'NVA', abrev: 'PRP' },
  { label: 'LIMPAR', verbo: 'Limpar', classDefault: 'Acabamento', atvDefault: 'NVA', abrev: 'ACB' },
  { label: 'ACABAR', verbo: 'Dar acabamento', classDefault: 'Acabamento', atvDefault: 'VA', abrev: 'ACB' },
  { label: 'INSPECIONAR', verbo: 'Inspecionar', classDefault: 'Inspeção', atvDefault: 'NVA', abrev: 'INSP' },
  { label: 'TRANSPORTAR', verbo: 'Transportar', classDefault: 'Movimentação', atvDefault: 'NVA', abrev: 'MOV' },
  { label: 'RETRABALHAR', verbo: 'Retrabalhar', classDefault: 'Retrabalho', atvDefault: 'NVAE', abrev: 'RET' }
];

export const CONTEXTUAL_COMPLEMENTS_MAP = {
  PEGAR: [
    { termo: 'tubo reto no rack', label: 'Tubo reto no rack' },
    { termo: 'tubo curvado no rack', label: 'Tubo curvado no rack' },
    { termo: 'peças no rack', label: 'Peças no rack' },
    { termo: 'grampo', label: 'Grampo' },
    { termo: 'chapa', label: 'Chapa' },
    { termo: 'parafuso', label: 'Parafuso' },
    { termo: 'ponte rolante', label: 'Ponte rolante' },
    { termo: 'EPIs', label: 'EPIs' },
    { termo: 'ferramenta', label: 'Ferramenta' }
  ],
  POSICIONAR: [
    { termo: 'no ferramental', label: 'No ferramental' },
    { termo: 'tubo no ferramental', label: 'Tubo no ferramental' },
    { termo: 'no gabarito', label: 'No gabarito' },
    { termo: 'peças boss na chapelona', label: 'Boss na chapelona' },
    { termo: 'e apertar grampos', label: 'E apertar grampos' },
    { termo: 'na bancada', label: 'Na bancada' },
    { termo: 'conjunto', label: 'Conjunto' }
  ],
  SOLDAR: [
    { termo: 'olhal', label: 'Olhal' },
    { termo: 'link', label: 'Link' },
    { termo: 'conjunto', label: 'Conjunto' },
    { termo: 'tubo', label: 'Tubo' },
    { termo: 'suporte', label: 'Suporte' },
    { termo: 'grampo', label: 'Grampo' },
    { termo: 'cordão contínuo', label: 'Cordão contínuo' }
  ],
  PONTEAR: [
    { termo: 'conjunto', label: 'Conjunto' },
    { termo: 'olhal', label: 'Olhal' },
    { termo: 'link', label: 'Link' },
    { termo: 'no gabarito', label: 'No gabarito' },
    { termo: 'peças', label: 'Peças' }
  ],
  GIRAR: [
    { termo: 'dispositivo', label: 'Dispositivo' },
    { termo: 'ferramental', label: 'Ferramental' },
    { termo: 'gabarito', label: 'Gabarito' },
    { termo: 'dispositivo e soldar', label: 'Dispositivo e soldar' },
    { termo: 'conjunto 180°', label: 'Conjunto 180°' }
  ],
  APERTAR: [
    { termo: 'grampo', label: 'Grampo' },
    { termo: 'grampos do ferramental', label: 'Grampos do ferramental' },
    { termo: 'trava mecânica', label: 'Trava mecânica' },
    { termo: 'parafuso M10', label: 'Parafuso M10' }
  ],
  APLICAR: [
    { termo: 'antirrespingo', label: 'Antirrespingo' },
    { termo: 'anti-respingo na tocha', label: 'Anti-respingo na tocha' },
    { termo: 'desengraxante', label: 'Desengraxante' },
    { termo: 'revestimento protetor', label: 'Revestimento' }
  ],
  LIMPAR: [
    { termo: 'bocal', label: 'Bocal da tocha' },
    { termo: 'solda', label: 'Solda' },
    { termo: 'superfície', label: 'Superfície' },
    { termo: 'bancada', label: 'Bancada' }
  ],
  ACABAR: [
    { termo: 'com escova', label: 'Com escova de aço' },
    { termo: 'respingos com espátula', label: 'Respingos c/ espátula' },
    { termo: 'rebarba', label: 'Rebarba' },
    { termo: 'esmerilhar solda', label: 'Esmerilhar solda' },
    { termo: 'lixar superfície', label: 'Lixar' }
  ],
  INSPECIONAR: [
    { termo: 'checklist', label: 'Preencher checklist' },
    { termo: 'solda', label: 'Solda visualmente' },
    { termo: 'medida com trena', label: 'Medida com trena' },
    { termo: 'conjunto no gabarito', label: 'Conjunto no gabarito' },
    { termo: 'primeira peça', label: 'Primeira peça (liberação)' }
  ],
  TRANSPORTAR: [
    { termo: 'conjunto para bancada', label: 'Para bancada' },
    { termo: 'com ponte rolante', label: 'Com ponte rolante' },
    { termo: 'para inspeção', label: 'Para inspeção' },
    { termo: 'para próximo posto', label: 'Para próximo posto' },
    { termo: 'para o rack', label: 'Para o rack' }
  ],
  RETRABALHAR: [
    { termo: 'solda', label: 'Corrigir solda' },
    { termo: 'solda com trinca', label: 'Solda c/ trinca' },
    { termo: 'defeito de penetração', label: 'Defeito de solda' },
    { termo: 'posicionamento incorreto', label: 'Posicionamento incorreto' },
    { termo: 'desempenar peça', label: 'Desempenar peça' }
  ]
};

export const DEFAULT_VERB_DICTIONARY = [
  // =========================================================================
  // PRIORIDADE 1: EXCEÇÕES & RETRABALHO (Prevalece sobre qualquer verbo base!)
  // =========================================================================
  {
    id: 'r-ret-1',
    verbo: 'corrigir solda',
    sinonimos: ['refazer solda', 'reparar solda', 'repassar solda defeituosa'],
    classificacao: 'Retrabalho',
    atividade: 'NVAE',
    abreviatura: 'RET',
    prioridade: 1,
    exemplo: 'Corrigir solda com trinca no olhal',
    observacao: 'Correção de solda é NVAE (desperdício por falha).'
  },
  {
    id: 'r-ret-2',
    verbo: 'remover defeito',
    sinonimos: ['corrigir posicionamento incorreto', 'reparar peça', 'ajustar defeito', 'refazer acabamento'],
    classificacao: 'Retrabalho',
    atividade: 'NVAE',
    abreviatura: 'RET',
    prioridade: 1,
    exemplo: 'Remover defeito de penetração',
    observacao: 'Eliminar defeitos decorrentes de falhas de processo.'
  },
  {
    id: 'r-ret-3',
    verbo: 'retrabalhar',
    sinonimos: ['refazer', 'reparar', 'recuperar', 'desempenar', 'descartar', 'retrabalho'],
    classificacao: 'Retrabalho',
    atividade: 'NVAE',
    abreviatura: 'RET',
    prioridade: 1,
    exemplo: 'Retrabalhar conjunto fora de esquadro',
    observacao: 'Trabalho refeito por não conformidade.'
  },
  {
    id: 'r-cmp-1',
    verbo: 'girar dispositivo e soldar',
    sinonimos: ['girar e soldar', 'posicionar e soldar'],
    classificacao: 'Solda',
    atividade: 'VA',
    abreviatura: 'SLD',
    prioridade: 1,
    exemplo: 'Girar dispositivo e soldar olhal',
    observacao: 'Expressão composta com operação final de solda (VA).'
  },
  {
    id: 'r-cmp-2',
    verbo: 'pegar ponte rolante',
    sinonimos: ['operar ponte rolante', 'acionar talha', 'pegar talha'],
    classificacao: 'Operação de Equipamento',
    atividade: 'NVA',
    abreviatura: 'EQP',
    prioridade: 1,
    exemplo: 'Pegar ponte rolante para içamento',
    observacao: 'Manuseio de equipamento de movimentação pesada.'
  },

  // =========================================================================
  // CATEGORIA A: PEGAR, BUSCAR E ABASTECER
  // =========================================================================
  {
    id: 'r-a-1',
    verbo: 'pegar tubo reto no rack',
    sinonimos: ['pegar tubo reto', 'buscar tubo reto no rack'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Pegar tubo reto no rack',
    observacao: 'Movimentação de matéria-prima até a bancada/ferramental.'
  },
  {
    id: 'r-a-2',
    verbo: 'pegar tubo curvado no rack',
    sinonimos: ['pegar tubo curvado', 'buscar tubo curvado'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Pegar tubo curvado no rack',
    observacao: 'Movimentação de peças curvadas.'
  },
  {
    id: 'r-a-3',
    verbo: 'pegar peças no rack',
    sinonimos: ['pegar pecas no rack', 'pegar peca no rack', 'buscar pecas no rack', 'retirar pecas do rack'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Pegar peças no rack',
    observacao: 'Busca repetitiva de componentes em prateleira/rack.'
  },
  {
    id: 'r-a-4',
    verbo: 'pegar no rack',
    sinonimos: ['retirar do rack', 'retirar da caixa', 'buscar no rack', 'tirar do rack'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Pegar chapas no rack',
    observacao: 'Coleta de itens em depósito do posto.'
  },
  {
    id: 'r-a-5',
    verbo: 'abastecer posto',
    sinonimos: ['reabastecer', 'abastecer bancada', 'buscar material', 'alimentar linha'],
    classificacao: 'Abastecimento',
    atividade: 'NVA',
    abreviatura: 'ABAS',
    prioridade: 2,
    exemplo: 'Abastecer posto com tubos',
    observacao: 'Logística interna do posto de trabalho.'
  },
  {
    id: 'r-a-6',
    verbo: 'pegar',
    sinonimos: ['apanhar', 'buscar', 'retirar', 'coletar', 'separar', 'selecionar', 'alcançar', 'pegar peça', 'pegar tubo', 'pegar chapa', 'pegar grampo', 'pegar parafuso', 'buscar ferramenta'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 3,
    exemplo: 'Pegar parafuso M10',
    observacao: 'Verbo geral de apanhe ou busca.'
  },

  // =========================================================================
  // CATEGORIA B: POSICIONAR E MONTAR
  // =========================================================================
  {
    id: 'r-b-1',
    verbo: 'posicionar no ferramental e apertar grampos',
    sinonimos: ['posicionar e apertar grampos', 'posicionar no ferramental e grampear', 'encaixar e apertar grampo'],
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    prioridade: 1,
    exemplo: 'Posicionar no ferramental e apertar grampos',
    observacao: 'Operação de montagem e fixação com grampos.'
  },
  {
    id: 'r-b-2',
    verbo: 'posicionar tubo no ferramental',
    sinonimos: ['posicionar tubo no gabarito', 'encaixar tubo no ferramental', 'colocar tubo no ferramental'],
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    prioridade: 2,
    exemplo: 'Posicionar tubo no ferramental',
    observacao: 'Montagem e assentamento do tubo no gabarito.'
  },
  {
    id: 'r-b-3',
    verbo: 'posicionar peças boss na chapelona',
    sinonimos: ['posicionar pecas com chapelona', 'posicionar pecas boss', 'guiar pela chapelona'],
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    prioridade: 2,
    exemplo: 'Posicionar peças boss na chapelona',
    observacao: 'Montagem guiada por gabarito tipo chapelona.'
  },
  {
    id: 'r-b-4',
    verbo: 'posicionar no ferramental',
    sinonimos: ['posicionar no dispositivo', 'posicionar no gabarito', 'colocar no suporte', 'colocar no ferramental', 'assentar no ferramental'],
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    prioridade: 2,
    exemplo: 'Posicionar conjunto no ferramental',
    observacao: 'Fixação/alinhamento de componentes para operação.'
  },
  {
    id: 'r-b-5',
    verbo: 'apertar grampo',
    sinonimos: ['fechar grampo', 'travar grampo', 'prender peca', 'travar conjunto', 'apertar grampos'],
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    prioridade: 2,
    exemplo: 'Apertar grampo pneumático',
    observacao: 'Fixação de subconjuntos para sustentação mecânica.'
  },
  {
    id: 'r-b-6',
    verbo: 'posicionar',
    sinonimos: ['colocar', 'encaixar', 'inserir', 'introduzir', 'apoiar', 'alinhar', 'ajustar', 'orientar', 'centralizar', 'encostar', 'fixar', 'montar', 'pré-montar', 'acoplar', 'unir', 'pre-montar'],
    classificacao: 'Montagem',
    atividade: 'VA',
    abreviatura: 'MNT',
    prioridade: 3,
    exemplo: 'Posicionar parafuso no furo',
    observacao: 'Verbo base de montagem e transformação.'
  },

  // =========================================================================
  // CATEGORIA C: SOLDAGEM E PONTEAMENTO
  // =========================================================================
  {
    id: 'r-c-1',
    verbo: 'soldar olhal',
    sinonimos: ['solda olhal', 'aplicar solda no olhal'],
    classificacao: 'Solda',
    atividade: 'VA',
    abreviatura: 'SLD',
    prioridade: 2,
    exemplo: 'Soldar olhal direito',
    observacao: 'Soldagem estrutural de olhal com adição de metal.'
  },
  {
    id: 'r-c-2',
    verbo: 'soldar link',
    sinonimos: ['soldar links', 'solda link', 'soldar articulador'],
    classificacao: 'Solda',
    atividade: 'VA',
    abreviatura: 'SLD',
    prioridade: 2,
    exemplo: 'Soldar link superior',
    observacao: 'União por solda do tirante/link.'
  },
  {
    id: 'r-c-3',
    verbo: 'soldar conjunto',
    sinonimos: ['soldar subconjunto', 'solda completa do conjunto', 'finalizar solda', 'completar solda'],
    classificacao: 'Solda',
    atividade: 'VA',
    abreviatura: 'SLD',
    prioridade: 2,
    exemplo: 'Soldar conjunto da lateral',
    observacao: 'Soldagem de fechamento do subconjunto.'
  },
  {
    id: 'r-c-4',
    verbo: 'pontear conjunto',
    sinonimos: ['pontear estrutura', 'dar ponto', 'aplicar ponto', 'fazer ponto', 'pontear pecas'],
    classificacao: 'Solda',
    atividade: 'VA',
    abreviatura: 'SLD',
    prioridade: 2,
    exemplo: 'Pontear conjunto no gabarito',
    observacao: 'Solda a ponto para travamento geométrico.'
  },
  {
    id: 'r-c-5',
    verbo: 'soldar',
    sinonimos: ['solda', 'pontear', 'ponteiar', 'ponteamento', 'cordao de solda', 'passar cordao', 'soldagem'],
    classificacao: 'Solda',
    atividade: 'VA',
    abreviatura: 'SLD',
    prioridade: 3,
    exemplo: 'Soldar cordão contínuo',
    observacao: 'Processo principal de fusão/união que transforma o produto.'
  },

  // =========================================================================
  // CATEGORIA D: MOVIMENTAR, GIRAR E TRANSPORTAR
  // =========================================================================
  {
    id: 'r-d-1',
    verbo: 'girar dispositivo',
    sinonimos: ['girar ferramental', 'rotacionar dispositivo', 'virar dispositivo', 'girar posicionador'],
    classificacao: 'Operação de Dispositivo',
    atividade: 'NVA',
    abreviatura: 'DISP',
    prioridade: 2,
    exemplo: 'Girar dispositivo 180 graus',
    observacao: 'Reposicionamento angular do ferramental para acesso a novos pontos de solda.'
  },
  {
    id: 'r-d-2',
    verbo: 'içar conjunto',
    sinonimos: ['icar conjunto', 'icar chapa', 'içar chapa e levar no ferramental', 'içar conjunto da lateral'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Içar conjunto da lateral com talha',
    observacao: 'Movimentação aérea por guincho/ponte/talha.'
  },
  {
    id: 'r-d-3',
    verbo: 'transportar para inspeção',
    sinonimos: ['levar ao proximo posto', 'colocar na bancada', 'retirar da bancada', 'transferir peca'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Transportar para inspeção de qualidade',
    observacao: 'Transferência de subconjunto entre postos contíguos.'
  },
  {
    id: 'r-d-4',
    verbo: 'movimentar',
    sinonimos: ['mover', 'deslocar', 'transportar', 'levar', 'trazer', 'transferir', 'virar', 'girar', 'rotacionar', 'inverter', 'reposicionar', 'mudar de posicao', 'mudar de lado'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 3,
    exemplo: 'Virar chapa de lado',
    observacao: 'Manuseio manual ou semimecanizado sem agregação de valor.'
  },

  // =========================================================================
  // CATEGORIA E: APLICAR, PREPARAR E PROTEGER
  // =========================================================================
  {
    id: 'r-e-1',
    verbo: 'aplicar antirrespingo',
    sinonimos: ['aplicar anti-respingo', 'aplicar anti respingo', 'passar antirrespingo', 'borrifar antirrespingo', 'pulverizar antirrespingo'],
    classificacao: 'Preparação',
    atividade: 'NVA',
    abreviatura: 'PRP',
    prioridade: 2,
    exemplo: 'Aplicar antirrespingo na junta',
    observacao: 'Aplicação de fluido protetor para evitar aderência de respingos de solda.'
  },
  {
    id: 'r-e-2',
    verbo: 'preparar superfície',
    sinonimos: ['desengraxar peca', 'limpar superficie para solda', 'preparar ferramenta', 'preparar dispositivo'],
    classificacao: 'Preparação',
    atividade: 'NVA',
    abreviatura: 'PRP',
    prioridade: 2,
    exemplo: 'Preparar superfície chanfrada',
    observacao: 'Precondição necessária exigida pelo procedimento de fabricação.'
  },
  {
    id: 'r-e-3',
    verbo: 'aplicar',
    sinonimos: ['pulverizar', 'borrifar', 'passar', 'espalhar', 'lubrificar', 'preparar', 'aplicar produto', 'aplicar revestimento'],
    classificacao: 'Preparação',
    atividade: 'NVA',
    abreviatura: 'PRP',
    prioridade: 3,
    exemplo: 'Aplicar fluido na rosca',
    observacao: 'Aplicação de insumos auxiliares.'
  },

  // =========================================================================
  // CATEGORIA F: ACABAR E LIMPAR
  // =========================================================================
  {
    id: 'r-f-1',
    verbo: 'limpar bocal',
    sinonimos: ['limpar bocal da tocha', 'limpar consumiveis', 'limpar tocha de solda'],
    classificacao: 'Acabamento',
    atividade: 'NVA',
    abreviatura: 'ACB',
    prioridade: 2,
    exemplo: 'Limpar bocal com escareador',
    observacao: 'Manutenção de rotina da tocha de solda MIG/MAG.'
  },
  {
    id: 'r-f-2',
    verbo: 'remover respingos',
    sinonimos: ['tirar respingos com espatula', 'retirar rebarba', 'rebarbar peca', 'remover respingo'],
    classificacao: 'Acabamento',
    atividade: 'NVA',
    abreviatura: 'ACB',
    prioridade: 2,
    exemplo: 'Remover respingos com espátula',
    observacao: 'Remoção de escória/respingos após soldagem.'
  },
  {
    id: 'r-f-3',
    verbo: 'dar acabamento com escova',
    sinonimos: ['escovar solda', 'esmerilhar cordao', 'lixar peca', 'desbastar solda'],
    classificacao: 'Acabamento',
    atividade: 'VA',
    abreviatura: 'ACB',
    prioridade: 2,
    exemplo: 'Dar acabamento com escova de aço',
    observacao: 'Tratamento superficial mecânico conforme especificação técnica.'
  },
  {
    id: 'r-f-4',
    verbo: 'acabar',
    sinonimos: ['dar acabamento', 'desbastar', 'esmerilhar', 'lixar', 'escovar', 'raspar', 'rebarbar', 'limpar peca', 'limpar solda', 'polir', 'escova', 'lixa', 'esmeril'],
    classificacao: 'Acabamento',
    atividade: 'VA',
    abreviatura: 'ACB',
    prioridade: 3,
    exemplo: 'Lixar rebarba da furação',
    observacao: 'Acabamento mecânico padrão de fábrica.'
  },

  // =========================================================================
  // CATEGORIA G: INSPECIONAR E VERIFICAR
  // =========================================================================
  {
    id: 'r-g-1',
    verbo: 'preencher checklist',
    sinonimos: ['preencher check list', 'registrar inspecao', 'preencher ficha de processo', 'assinar folha de inspecao'],
    classificacao: 'Inspeção',
    atividade: 'NVA',
    abreviatura: 'INSP',
    prioridade: 2,
    exemplo: 'Preencher checklist da primeira peça',
    observacao: 'Registro formal da qualidade e rastreabilidade.'
  },
  {
    id: 'r-g-2',
    verbo: 'verificar solda',
    sinonimos: ['inspecionar cordao', 'conferir medida', 'inspecionar conjunto', 'controlar qualidade', 'checar gabarito'],
    classificacao: 'Inspeção',
    atividade: 'NVA',
    abreviatura: 'INSP',
    prioridade: 2,
    exemplo: 'Verificar solda visualmente',
    observacao: 'Inspeção dimensional ou visual de processo.'
  },
  {
    id: 'r-g-3',
    verbo: 'inspecionar',
    sinonimos: ['verificar', 'conferir', 'medir', 'checar', 'testar', 'validar', 'examinar'],
    classificacao: 'Inspeção',
    atividade: 'NVA',
    abreviatura: 'INSP',
    prioridade: 3,
    exemplo: 'Medir com paquímetro',
    observacao: 'Aferição técnica necessária conforme plano de controle.'
  },

  // =========================================================================
  // CATEGORIA I: CAMINHAR E ALCANÇAR
  // =========================================================================
  {
    id: 'r-i-1',
    verbo: 'ir ao rack',
    sinonimos: ['ir ate o rack', 'ir a bancada', 'ir buscar ferramenta', 'buscar ferramenta no armario'],
    classificacao: 'Caminhada',
    atividade: 'NVA',
    abreviatura: 'CAM',
    prioridade: 2,
    exemplo: 'Ir ao rack de tubos',
    observacao: 'Deslocamento a pé do operador dentro da célula.'
  },
  {
    id: 'r-i-2',
    verbo: 'caminhar',
    sinonimos: ['andar', 'deslocar-se', 'ir ate', 'voltar', 'contornar dispositivo', 'alcançar peca', 'esticar braco', 'abaixar para pegar'],
    classificacao: 'Caminhada',
    atividade: 'NVA',
    abreviatura: 'CAM',
    prioridade: 3,
    exemplo: 'Deslocar-se até o outro lado do gabarito',
    observacao: 'Caminhada e movimentos corporais sem valor agregado.'
  },

  // =========================================================================
  // CATEGORIA J: GIRAR, APERTAR E OPERAR DISPOSITIVOS
  // =========================================================================
  {
    id: 'r-j-1',
    verbo: 'soltar grampos',
    sinonimos: ['abrir grampos', 'destravar grampos', 'soltar grampo', 'abrir grampo', 'liberar grampos'],
    classificacao: 'Operação de Dispositivo',
    atividade: 'NVA',
    abreviatura: 'DISP',
    prioridade: 2,
    exemplo: 'Soltar grampos para desmoldagem',
    observacao: 'Abertura de travas mecânicas ou pneumáticas.'
  },
  {
    id: 'r-j-2',
    verbo: 'acionar dispositivo',
    sinonimos: ['desacionar', 'ligar', 'desligar', 'posicionar dispositivo', 'liberar peca', 'travar dispositivo'],
    classificacao: 'Operação de Dispositivo',
    atividade: 'NVA',
    abreviatura: 'DISP',
    prioridade: 2,
    exemplo: 'Acionar trava hidráulica',
    observacao: 'Comando de automações e atuadores do gabarito.'
  },

  // Colocar EPIs
  {
    id: 'r-epi',
    verbo: 'colocar epis',
    sinonimos: ['colocar epi', 'vestir avental', 'colocar luvas', 'colocar oculos'],
    classificacao: 'Movimentação',
    atividade: 'NVA',
    abreviatura: 'MOV',
    prioridade: 2,
    exemplo: 'Colocar EPIs antes de iniciar solda',
    observacao: 'Preparação de segurança e ergonomia do operador.'
  }
];

export const INITIAL_SUBCONJUNTOS = [
  {
    id: 'lateral-dir',
    nome: 'LateralDir',
    descricaoConjunto: 'Lateral LD',
    codigoPA: '3609000',
    codigoSubconjunto: '3609007',
    demandaDiaria: 12,
    horasTrabalhadas: 8.8,
    minutosTrabalhados: 528,
    paradasProgramadasMin: 40,
    tempoDisponivelHoras: 8.13,
    numTurnos: 1,
    totalOperadores: 1,
    cronometristaNome: 'Eng. Métodos',
    cronometristaCargo: 'Analista Lean',
    operadorNome: 'Operador Solda',
    operadorCargo: 'Soldador Especialista',
    dataEstudo: new Date().toISOString().split('T')[0],
    revisao: '01',
    tarefas: [
      { id: '1', seq: 1, descricao: 'Colocar EPIs', tempo: 0.67, atividade: 'NVA', classificacao: 'Movimentação', distancia: 0, obs: 'Óculos, luvas e avental' },
      { id: '2', seq: 2, descricao: 'Pegar tubo reto no rack', tempo: 0.67, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: '3', seq: 3, descricao: 'Soldar olhal', tempo: 0.67, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '4', seq: 4, descricao: 'Pegar tubo curvado no rack', tempo: 1.10, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: '5', seq: 5, descricao: 'Soldar link', tempo: 1.17, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '6', seq: 6, descricao: 'Soldar olhal', tempo: 0.50, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '7', seq: 7, descricao: 'Posicionar tubo no ferramental', tempo: 0.50, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: '8', seq: 8, descricao: 'Pegar peças no rack', tempo: 0.98, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: '9', seq: 9, descricao: 'Soldar link', tempo: 0.67, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '10', seq: 10, descricao: 'Posicionar no ferramental', tempo: 0.42, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: '11', seq: 11, descricao: 'Pegar peças no rack', tempo: 0.83, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: '12', seq: 12, descricao: 'Posicionar no ferramental e apertar grampos', tempo: 0.83, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: '13', seq: 13, descricao: 'Pegar paralama e posicionar no ferramental', tempo: 1.17, atividade: 'VA', classificacao: 'Montagem', distancia: 1, obs: '' },
      { id: '14', seq: 14, descricao: 'Pontear', tempo: 0.33, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '15', seq: 15, descricao: 'Posicionar tubo', tempo: 0.50, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: '16', seq: 16, descricao: 'Pegar peça mão e posicionar no ferramental', tempo: 0.67, atividade: 'VA', classificacao: 'Montagem', distancia: 1, obs: '' },
      { id: '17', seq: 17, descricao: 'Pontear', tempo: 0.20, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '18', seq: 18, descricao: 'Aplicar anti-respingo', tempo: 2.00, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: 'Proteção para soldagem' },
      { id: '19', seq: 19, descricao: 'Soldar', tempo: 0.17, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '20', seq: 20, descricao: 'Girar dispositivo', tempo: 2.32, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '21', seq: 21, descricao: 'Soldar', tempo: 0.15, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '22', seq: 22, descricao: 'Girar dispositivo', tempo: 0.50, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '23', seq: 23, descricao: 'Pegar peças no rack e posicionar no ferramental', tempo: 1.13, atividade: 'VA', classificacao: 'Montagem', distancia: 1.5, obs: '' },
      { id: '24', seq: 24, descricao: 'Pontear', tempo: 0.50, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '25', seq: 25, descricao: 'Pegar peça mão interno e posicionar no ferramental', tempo: 0.17, atividade: 'VA', classificacao: 'Montagem', distancia: 1, obs: '' },
      { id: '26', seq: 26, descricao: 'Aplicar anti-respingo', tempo: 2.15, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: '' },
      { id: '27', seq: 27, descricao: 'Soldar', tempo: 0.20, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '28', seq: 28, descricao: 'Girar ferramental', tempo: 0.50, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '29', seq: 29, descricao: 'Pegar peças no rack', tempo: 0.42, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: '30', seq: 30, descricao: 'Posicionar no ferramental', tempo: 1.17, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: '31', seq: 31, descricao: 'Pontear', tempo: 0.13, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '32', seq: 32, descricao: 'Aplicar anti-respingo', tempo: 2.37, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: '' },
      { id: '33', seq: 33, descricao: 'Soldar', tempo: 0.13, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '34', seq: 34, descricao: 'Girar dispositivo', tempo: 2.12, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '35', seq: 35, descricao: 'Soldar', tempo: 0.17, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '36', seq: 36, descricao: 'Girar dispositivo', tempo: 2.20, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '37', seq: 37, descricao: 'Soldar', tempo: 0.12, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '38', seq: 38, descricao: 'Girar dispositivo', tempo: 2.42, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '39', seq: 39, descricao: 'Soldar', tempo: 0.12, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '40', seq: 40, descricao: 'Pegar peças no rack e posicionar no ferramental', tempo: 1.03, atividade: 'VA', classificacao: 'Montagem', distancia: 1.5, obs: '' },
      { id: '41', seq: 41, descricao: 'Pontear', tempo: 0.12, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '42', seq: 42, descricao: 'Aplicar anti-respingo', tempo: 2.53, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: '' },
      { id: '43', seq: 43, descricao: 'Soldar', tempo: 0.17, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: '44', seq: 44, descricao: 'Girar dispositivo', tempo: 1.00, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '45', seq: 45, descricao: 'Soltar grampos', tempo: 0.58, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: '46', seq: 46, descricao: 'Pegar ponte rolante', tempo: 0.70, atividade: 'NVA', classificacao: 'Operação de Equipamento', distancia: 3, obs: '' },
      { id: '47', seq: 47, descricao: 'Içar conjunto da lateral', tempo: 1.13, atividade: 'NVA', classificacao: 'Movimentação', distancia: 4, obs: '' }
    ]
  },
  {
    id: 'piso',
    nome: 'Piso',
    descricaoConjunto: 'Piso',
    codigoPA: '3609000',
    codigoSubconjunto: '3609007',
    demandaDiaria: 12,
    horasTrabalhadas: 8.8,
    minutosTrabalhados: 528,
    paradasProgramadasMin: 40,
    tempoDisponivelHoras: 8.13,
    numTurnos: 1,
    totalOperadores: 1,
    cronometristaNome: 'Eng. Métodos',
    cronometristaCargo: 'Analista Lean',
    operadorNome: 'Operador Solda',
    operadorCargo: 'Soldador Montador',
    dataEstudo: new Date().toISOString().split('T')[0],
    revisao: '01',
    tarefas: [
      { id: 'p1', seq: 1, descricao: 'Pegar parte e ir no rack', tempo: 1.00, atividade: 'NVA', classificacao: 'Movimentação', distancia: 3, obs: '' },
      { id: 'p2', seq: 2, descricao: 'Içar chapa e levar no ferramental', tempo: 2.23, atividade: 'NVA', classificacao: 'Movimentação', distancia: 4, obs: '' },
      { id: 'p3', seq: 3, descricao: 'Posicionar no ferramental', tempo: 0.67, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'p4', seq: 4, descricao: 'Retirar corrente', tempo: 0.37, atividade: 'NVA', classificacao: 'Movimentação', distancia: 0, obs: '' },
      { id: 'p5', seq: 5, descricao: 'Pegar peças no rack', tempo: 0.77, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: 'p6', seq: 6, descricao: 'Posicionar no dispositivo', tempo: 3.63, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'p7', seq: 7, descricao: 'Posicionar peças boss na chapelona', tempo: 1.10, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'p8', seq: 8, descricao: 'Pegar peças no rack', tempo: 0.30, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: 'p9', seq: 9, descricao: 'Posicionar peças com a chapelona', tempo: 1.17, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'p10', seq: 10, descricao: 'Colocar EPIs', tempo: 1.40, atividade: 'NVA', classificacao: 'Movimentação', distancia: 0, obs: '' },
      { id: 'p11', seq: 11, descricao: 'Aplicar anti-respingo', tempo: 0.33, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: '' },
      { id: 'p12', seq: 12, descricao: 'Posicionar para soldar', tempo: 0.52, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p13', seq: 13, descricao: 'Pontear conjunto', tempo: 3.83, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p14', seq: 14, descricao: 'Limpar bocal', tempo: 0.30, atividade: 'NVA', classificacao: 'Acabamento', distancia: 0, obs: '' },
      { id: 'p15', seq: 15, descricao: 'Pontear conjunto', tempo: 3.33, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p16', seq: 16, descricao: 'Pontear conjunto', tempo: 2.33, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p17', seq: 17, descricao: 'Pontear conjunto', tempo: 2.00, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p18', seq: 18, descricao: 'Limpar consumíveis', tempo: 0.20, atividade: 'NVA', classificacao: 'Acabamento', distancia: 0, obs: '' },
      { id: 'p19', seq: 19, descricao: 'Soldar conjunto', tempo: 5.67, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p20', seq: 20, descricao: 'Limpar bocal', tempo: 0.30, atividade: 'NVA', classificacao: 'Acabamento', distancia: 0, obs: '' },
      { id: 'p21', seq: 21, descricao: 'Aplicar anti-respingo', tempo: 0.13, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: '' },
      { id: 'p22', seq: 22, descricao: 'Soldar conjunto', tempo: 0.60, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'p23', seq: 23, descricao: 'Pegar peça', tempo: 0.35, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: 'p24', seq: 24, descricao: 'Posicionar no ferramental', tempo: 1.92, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'p25', seq: 25, descricao: 'Pegar peça', tempo: 0.48, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: 'p26', seq: 26, descricao: 'Posicionar no ferramental', tempo: 0.32, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' }
    ]
  },
  {
    id: 'frente',
    nome: 'Frente',
    descricaoConjunto: 'Frente',
    codigoPA: '3609000',
    codigoSubconjunto: '3609007',
    demandaDiaria: 12,
    horasTrabalhadas: 8.8,
    minutosTrabalhados: 528,
    paradasProgramadasMin: 40,
    tempoDisponivelHoras: 8.13,
    numTurnos: 1,
    totalOperadores: 1,
    cronometristaNome: 'Eng. Métodos',
    cronometristaCargo: 'Analista Lean',
    operadorNome: 'Operador Montagem',
    operadorCargo: 'Montador',
    dataEstudo: new Date().toISOString().split('T')[0],
    revisao: '01',
    tarefas: [
      { id: 'f1', seq: 1, descricao: 'Colocar EPIs', tempo: 0.53, atividade: 'NVA', classificacao: 'Movimentação', distancia: 0, obs: '' },
      { id: 'f2', seq: 2, descricao: 'Girar ferramental', tempo: 0.20, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: 'f3', seq: 3, descricao: 'Pegar peças na prateleira', tempo: 0.42, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: 'f4', seq: 4, descricao: 'Posicionar peças no ferramental', tempo: 1.00, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f5', seq: 5, descricao: 'Pegar peças na prateleira', tempo: 0.58, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: 'f6', seq: 6, descricao: 'Posicionar peças com chapelona na bancada', tempo: 0.85, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f7', seq: 7, descricao: 'Regular maquina', tempo: 0.35, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: 'f8', seq: 8, descricao: 'Pontear', tempo: 0.45, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'f9', seq: 9, descricao: 'Posicionar no ferramental', tempo: 0.75, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f10', seq: 10, descricao: 'Posicionar peças com chapelona na bancada', tempo: 0.85, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f11', seq: 11, descricao: 'Pontear', tempo: 1.30, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'f12', seq: 12, descricao: 'Posicionar no ferramental', tempo: 0.67, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f13', seq: 13, descricao: 'Pegar peças no rack', tempo: 0.37, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: 'f14', seq: 14, descricao: 'Colocar no ferramental', tempo: 1.43, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f15', seq: 15, descricao: 'Posicionar no dispositivo', tempo: 0.83, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f16', seq: 16, descricao: 'Posicionar peças guiada pelas chapelonas', tempo: 0.63, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f17', seq: 17, descricao: 'Pontear', tempo: 1.00, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'f18', seq: 18, descricao: 'Posicionar no ferramental', tempo: 1.13, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'f19', seq: 19, descricao: 'Pontear conjunto', tempo: 1.43, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'f20', seq: 20, descricao: 'Dar acabamento', tempo: 0.63, atividade: 'VA', classificacao: 'Acabamento', distancia: 0, obs: '' }
    ]
  },
  {
    id: 'lateral-esq',
    nome: 'LateralEsq',
    descricaoConjunto: 'Lateral LE',
    codigoPA: '3609000',
    codigoSubconjunto: '3609007',
    demandaDiaria: 12,
    horasTrabalhadas: 8.8,
    minutosTrabalhados: 528,
    paradasProgramadasMin: 40,
    tempoDisponivelHoras: 8.13,
    numTurnos: 1,
    totalOperadores: 1,
    cronometristaNome: 'Eng. Métodos',
    cronometristaCargo: 'Analista Lean',
    operadorNome: 'Operador Solda',
    operadorCargo: 'Soldador Montador',
    dataEstudo: new Date().toISOString().split('T')[0],
    revisao: '01',
    tarefas: [
      { id: 'le1', seq: 1, descricao: 'Colocar EPIs', tempo: 0.67, atividade: 'NVA', classificacao: 'Movimentação', distancia: 0, obs: '' },
      { id: 'le2', seq: 2, descricao: 'Pegar tubo reto no rack', tempo: 0.98, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: 'le3', seq: 3, descricao: 'Soldar olhal', tempo: 1.55, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le4', seq: 4, descricao: 'Pegar tubo curvado no rack', tempo: 0.97, atividade: 'NVA', classificacao: 'Movimentação', distancia: 2, obs: '' },
      { id: 'le5', seq: 5, descricao: 'Soldar links', tempo: 1.38, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le6', seq: 6, descricao: 'Soldar olhal', tempo: 1.17, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le7', seq: 7, descricao: 'Posicionar tubo no ferramental', tempo: 0.77, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'le8', seq: 8, descricao: 'Pegar peças no rack', tempo: 0.65, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: 'le9', seq: 9, descricao: 'Soldar links', tempo: 1.33, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le10', seq: 10, descricao: 'Posicionar no ferramental', tempo: 0.67, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'le11', seq: 11, descricao: 'Pegar peças no rack', tempo: 0.52, atividade: 'NVA', classificacao: 'Movimentação', distancia: 1.5, obs: '' },
      { id: 'le12', seq: 12, descricao: 'Posicionar no ferramental e apertar grampos', tempo: 0.83, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'le13', seq: 13, descricao: 'Pegar paralama e posicionar no ferramental', tempo: 0.83, atividade: 'VA', classificacao: 'Montagem', distancia: 1, obs: '' },
      { id: 'le14', seq: 14, descricao: 'Pontear', tempo: 1.17, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le15', seq: 15, descricao: 'Posicionar tubo', tempo: 0.55, atividade: 'VA', classificacao: 'Montagem', distancia: 0, obs: '' },
      { id: 'le16', seq: 16, descricao: 'Pegar peça mão e posicionar no ferramental', tempo: 0.67, atividade: 'VA', classificacao: 'Montagem', distancia: 1, obs: '' },
      { id: 'le17', seq: 17, descricao: 'Pontear', tempo: 0.67, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le18', seq: 18, descricao: 'Aplicar anti-respingo', tempo: 0.20, atividade: 'NVA', classificacao: 'Preparação', distancia: 0, obs: '' },
      { id: 'le19', seq: 19, descricao: 'Soldar', tempo: 2.20, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' },
      { id: 'le20', seq: 20, descricao: 'Girar dispositivo', tempo: 0.17, atividade: 'NVA', classificacao: 'Operação de Dispositivo', distancia: 0, obs: '' },
      { id: 'le21', seq: 21, descricao: 'Soldar', tempo: 2.32, atividade: 'VA', classificacao: 'Solda', distancia: 0, obs: '' }
    ]
  }
];
