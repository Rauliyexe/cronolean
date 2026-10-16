import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Wand2,
  AlertTriangle,
  Layers,
  GraduationCap,
  ArrowRight,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { DEFAULT_VERB_DICTIONARY, DEFAULT_COMPLEMENTS_CATALOG } from '../data/defaultData';
import { classifyTask } from '../utils/leanEngine';

export function DictionaryView({
  dictionary = [],
  onUpdateDictionary,
  onResetDictionary,
  onAutoClassifyAll,
  postoNome = '',
  complementsCatalog = DEFAULT_COMPLEMENTS_CATALOG,
  onUpdateComplementsCatalog
}) {
  const [activeTab, setActiveTab] = useState('regras'); // 'regras' | 'complementos' | 'aprendizado'
  const [searchTerm, setSearchTerm] = useState('');
  const [testPhrase, setTestPhrase] = useState('Pegar tubo reto no rack e posicionar no ferramental');

  // Add rule state
  const [newVerbo, setNewVerbo] = useState('');
  const [newSinonimos, setNewSinonimos] = useState('');
  const [newClass, setNewClass] = useState('Montagem');
  const [newAtividade, setNewAtividade] = useState('VA');
  const [newAbreviatura, setNewAbreviatura] = useState('MNT');
  const [newPrioridade, setNewPrioridade] = useState(2);
  const [newExemplo, setNewExemplo] = useState('');
  const [newObs, setNewObs] = useState('');

  // Add complement state
  const [newCompTermo, setNewCompTermo] = useState('');
  const [newCompCat, setNewCompCat] = useState('Componente');

  // Manual Overrides Log (Operational Learning)
  const [manualOverrides, setManualOverrides] = useState([
    { id: 'mo-1', texto: 'Apertar parafuso estrutural', sugestaoOriginal: 'NVA', escolhaUsuario: 'VA', classe: 'Montagem', count: 4 },
    { id: 'mo-2', texto: 'Verificar alinhamento do chassi', sugestaoOriginal: 'VA', escolhaUsuario: 'NVA', classe: 'Inspeção', count: 3 }
  ]);

  const testResult = testPhrase ? classifyTask(testPhrase, dictionary) : null;

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newVerbo.trim()) return;

    const clean = newVerbo.trim().toLowerCase();
    const exists = dictionary.some(d => d.verbo.toLowerCase() === clean);
    if (exists) {
      alert(`O termo "${clean}" já existe no dicionário. Edite ou remova a regra existente primeiro.`);
      return;
    }

    const sinArray = newSinonimos
      ? newSinonimos.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const newRule = {
      id: `rule-${Date.now()}`,
      verbo: clean,
      sinonimos: sinArray,
      classificacao: newClass,
      atividade: newAtividade,
      abreviatura: newAbreviatura.trim().toUpperCase() || newClass.substring(0, 3).toUpperCase(),
      prioridade: Number(newPrioridade) || 2,
      exemplo: newExemplo.trim(),
      observacao: newObs.trim()
    };

    onUpdateDictionary([newRule, ...dictionary]);

    setNewVerbo('');
    setNewSinonimos('');
    setNewExemplo('');
    setNewObs('');
  };

  const handleDeleteRule = (verbo) => {
    if (!window.confirm(`Excluir a regra "${verbo}" do dicionário?`)) return;
    const updated = dictionary.filter(d => d.verbo.toLowerCase() !== verbo.toLowerCase());
    onUpdateDictionary(updated);
  };

  // Add complement
  const handleAddComplement = (e) => {
    e.preventDefault();
    if (!newCompTermo.trim()) return;
    const newComp = {
      id: `c-${Date.now()}`,
      termo: newCompTermo.trim(),
      categoria: newCompCat
    };
    if (onUpdateComplementsCatalog) {
      onUpdateComplementsCatalog([...complementsCatalog, newComp]);
    }
    setNewCompTermo('');
  };

  const handleDeleteComplement = (id) => {
    if (onUpdateComplementsCatalog) {
      onUpdateComplementsCatalog(complementsCatalog.filter(c => c.id !== id));
    }
  };

  // Promote manual override to permanent rule
  const handlePromoteOverride = (item) => {
    const newRule = {
      id: `rule-prom-${Date.now()}`,
      verbo: item.texto.toLowerCase(),
      sinonimos: [],
      classificacao: item.classe,
      atividade: item.escolhaUsuario,
      abreviatura: item.classe.substring(0, 3).toUpperCase(),
      prioridade: 1, // Exceção de alta prioridade
      exemplo: item.texto,
      observacao: `Promovido do aprendizado operacional (${item.count} ocorrências)`
    };

    onUpdateDictionary([newRule, ...dictionary]);
    setManualOverrides(prev => prev.filter(o => o.id !== item.id));
    alert(`Regra permanente criada com sucesso para "${item.texto}"!`);
  };

  const filteredRules = dictionary.filter(d =>
    d.verbo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.classificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.atividade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.sinonimos && d.sinonimos.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={16} color="var(--analytical-blue)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Dicionário de Movimentos Industriais &amp; Aprendizado
              </h2>
            </div>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Base semântica determinística para reconhecimento instantâneo de operações no chão de fábrica
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onAutoClassifyAll}
              className="ind-btn ind-btn-primary ind-btn-sm"
              title="Aplica as regras do dicionário em todas as operações do posto ativo"
            >
              <Wand2 size={14} />
              <span>Reclassificar Posto "{postoNome}"</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('regras')}
            className={`ind-btn ind-btn-sm ${activeTab === 'regras' ? 'ind-btn-primary' : ''}`}
          >
            <BookOpen size={13} />
            <span>Regras do Dicionário ({dictionary.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('complementos')}
            className={`ind-btn ind-btn-sm ${activeTab === 'complementos' ? 'ind-btn-primary' : ''}`}
          >
            <Layers size={13} />
            <span>Catálogo de Complementos ({complementsCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('aprendizado')}
            className={`ind-btn ind-btn-sm ${activeTab === 'aprendizado' ? 'ind-btn-primary' : ''}`}
          >
            <GraduationCap size={13} />
            <span>Aprendizado Operacional ({manualOverrides.length})</span>
          </button>
        </div>
      </div>

      {/* Real-time Interactive Testing Sandbox */}
      <div className="ind-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #12161A 0%, #161C22 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <Sparkles size={16} color="var(--analytical-blue)" />
          <h3 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simulador de Reconhecimento em Tempo Real
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Digite qualquer operação industrial (ex: Pegar tubo reto no rack, Girar dispositivo e soldar, Corrigir solda)..."
            value={testPhrase}
            onChange={(e) => setTestPhrase(e.target.value)}
            className="ind-input"
            style={{ width: '100%', fontSize: '0.95rem', padding: '0.75rem' }}
          />

          {testResult && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>EXPRESSÃO IDENTIFICADA</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--analytical-blue)' }}>
                  {testResult.matchedVerb ? `"${testResult.matchedVerb}"` : '—'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>
                  {testResult.ruleSource}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CLASSIFICAÇÃO LEAN</span>
                <span className={`ind-badge ind-badge-${testResult.atividade.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}>
                  {testResult.atividade}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CATEGORIA OPERACIONAL</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {testResult.classificacao} ({testResult.abreviatura})
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TIPO DE REGRA</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: testResult.score >= 90 ? 'var(--va-color)' : 'var(--text-secondary)' }}>
                  {testResult.scoreLabel} (Score: {testResult.score})
                </span>
              </div>
            </div>
          )}

          {testResult?.allDetectedMotions?.length > 1 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--analytical-blue)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Multi-movimentos detectados:</span>
              <strong>{testResult.allDetectedMotions.join(' • ')}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content: Regras do Dicionário */}
      {activeTab === 'regras' && (
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          
          {/* Add Rule Form */}
          <form
            onSubmit={handleAddRule}
            style={{
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              + Cadastrar Nova Regra ou Expressão Composta
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.8fr) minmax(180px, 1.5fr) 140px 110px 100px 110px', gap: '0.65rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Verbo / Expressão</label>
                <input
                  type="text"
                  placeholder="ex: posicionar no gabarito"
                  value={newVerbo}
                  onChange={(e) => setNewVerbo(e.target.value)}
                  className="ind-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Sinônimos (separados por vírgula)</label>
                <input
                  type="text"
                  placeholder="ex: assentar, colocar no gabarito"
                  value={newSinonimos}
                  onChange={(e) => setNewSinonimos(e.target.value)}
                  className="ind-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Categoria</label>
                <select value={newClass} onChange={(e) => setNewClass(e.target.value)} className="ind-select" style={{ width: '100%' }}>
                  <option value="Solda">Solda</option>
                  <option value="Montagem">Montagem</option>
                  <option value="Movimentação">Movimentação</option>
                  <option value="Operação de Dispositivo">Operação de Dispositivo</option>
                  <option value="Preparação">Preparação</option>
                  <option value="Acabamento">Acabamento</option>
                  <option value="Inspeção">Inspeção</option>
                  <option value="Caminhada">Caminhada</option>
                  <option value="Retrabalho">Retrabalho</option>
                  <option value="Abastecimento">Abastecimento</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Atividade</label>
                <select value={newAtividade} onChange={(e) => setNewAtividade(e.target.value)} className="ind-select" style={{ width: '100%' }}>
                  <option value="VA">VA 🟢</option>
                  <option value="NVA">NVA 🟡</option>
                  <option value="NVAE">NVAE 🔴</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Prioridade</label>
                <select value={newPrioridade} onChange={(e) => setNewPrioridade(parseInt(e.target.value))} className="ind-select" style={{ width: '100%' }}>
                  <option value={1}>1 - Alta</option>
                  <option value={2}>2 - Média</option>
                  <option value={3}>3 - Geral</option>
                </select>
              </div>

              <button type="submit" className="ind-btn ind-btn-primary" style={{ height: '36px' }}>
                <Plus size={14} />
                <span>Salvar</span>
              </button>
            </div>
          </form>

          {/* Search bar & Reset */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Pesquisar verbo ou sinônimo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ind-input"
                style={{ width: '100%', paddingLeft: '32px' }}
              />
            </div>

            <button
              onClick={() => {
                if (window.confirm('Restaurar dicionário completo para os padrões da indústria?')) {
                  onResetDictionary();
                }
              }}
              className="ind-btn ind-btn-sm"
              title="Restaurar padrões industriais originais"
            >
              <RotateCcw size={13} />
              <span>Restaurar Padrões ({DEFAULT_VERB_DICTIONARY.length} regras)</span>
            </button>
          </div>

          {/* Rules Table */}
          <div className="ind-table-wrapper" style={{ maxHeight: '420px' }}>
            <table className="ind-table">
              <thead>
                <tr>
                  <th>Verbo / Expressão</th>
                  <th>Sinônimos Cadastrados</th>
                  <th>Categoria Operacional</th>
                  <th>Atividade Lean</th>
                  <th>Prio.</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map(rule => (
                  <tr key={rule.id || rule.verbo}>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      "{rule.verbo}"
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rule.sinonimos?.length > 0 ? rule.sinonimos.join(', ') : '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {rule.classificacao}
                    </td>
                    <td>
                      <span className={`ind-badge ind-badge-${rule.atividade.toLowerCase()}`}>
                        {rule.atividade}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: '0.75rem', color: rule.prioridade === 1 ? 'var(--nvae-color)' : 'var(--text-muted)' }}>
                      {rule.prioridade === 1 ? 'Alta (1)' : rule.prioridade === 2 ? 'Média (2)' : 'Geral (3)'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteRule(rule.verbo)}
                        style={{ background: 'none', border: 'none', color: 'var(--nvae-color)', cursor: 'pointer', padding: '3px' }}
                        title="Excluir regra"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab Content: Catálogo de Complementos */}
      {activeTab === 'complementos' && (
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Catálogo de Complementos Contextuais (Speed Pad)
            </h3>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
              Estes complementos aparecem na tela de cronometragem para montagem rápida de frases (ex: Verbo "PEGAR" + Complemento "TUBO RETO")
            </p>
          </div>

          {/* Add complement form */}
          <form
            onSubmit={handleAddComplement}
            style={{
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'end',
              marginBottom: '1rem'
            }}
          >
            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Nome do Complemento</label>
              <input
                type="text"
                placeholder="ex: Chapelona, Tirante, Bucha..."
                value={newCompTermo}
                onChange={(e) => setNewCompTermo(e.target.value)}
                className="ind-input"
                style={{ width: '240px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Categoria</label>
              <select value={newCompCat} onChange={(e) => setNewCompCat(e.target.value)} className="ind-select">
                <option value="Componente">Componente</option>
                <option value="Fixação">Fixação</option>
                <option value="Dispositivo">Dispositivo</option>
                <option value="Armazenamento">Armazenamento</option>
                <option value="Segurança">Segurança</option>
                <option value="Qualidade">Qualidade</option>
                <option value="Equipamento">Equipamento</option>
              </select>
            </div>

            <button type="submit" className="ind-btn ind-btn-primary ind-btn-sm" style={{ height: '34px' }}>
              <Plus size={14} />
              <span>Adicionar Complemento</span>
            </button>
          </form>

          {/* Complements Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {complementsCatalog.map(comp => (
              <div
                key={comp.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{comp.termo}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{comp.categoria}</div>
                </div>

                <button
                  onClick={() => handleDeleteComplement(comp.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                  title="Remover complemento"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Aprendizado Operacional */}
      {activeTab === 'aprendizado' && (
        <div className="ind-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Aprendizado Operacional — Correções Manuais Registradas
            </h3>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
              Operações que o cronoanalista alterou manualmente durante a coleta. Você pode promovê-las a regras permanentes com 1 clique.
            </p>
          </div>

          <div className="ind-table-wrapper">
            <table className="ind-table">
              <thead>
                <tr>
                  <th>Operação / Expressão</th>
                  <th>Sugestão Automática</th>
                  <th>Escolha Real do Usuário</th>
                  <th>Categoria</th>
                  <th>Ocorrências</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {manualOverrides.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                      Nenhuma discrepância ou correção manual pendente de revisão.
                    </td>
                  </tr>
                ) : (
                  manualOverrides.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '700' }}>"{item.texto}"</td>
                      <td>
                        <span className={`ind-badge ind-badge-${item.sugestaoOriginal.toLowerCase()}`}>
                          {item.sugestaoOriginal}
                        </span>
                      </td>
                      <td>
                        <span className={`ind-badge ind-badge-${item.escolhaUsuario.toLowerCase()}`} style={{ fontWeight: '800' }}>
                          {item.escolhaUsuario} ✓
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.classe}</td>
                      <td className="mono" style={{ color: 'var(--analytical-blue)', fontWeight: '700' }}>{item.count}x</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handlePromoteOverride(item)}
                          className="ind-btn ind-btn-primary ind-btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                        >
                          <CheckCircle2 size={12} />
                          <span>Promover a Regra</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
