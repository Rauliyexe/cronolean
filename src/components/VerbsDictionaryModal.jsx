import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  X,
  Search,
  Check
} from 'lucide-react';
import { DEFAULT_VERB_DICTIONARY } from '../data/defaultData';
import { classifyTask } from '../utils/leanEngine';

export function VerbsDictionaryModal({
  isOpen,
  onClose,
  dictionary,
  onUpdateDictionary,
  onResetDictionary
}) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [newVerbo, setNewVerbo] = useState('');
  const [newClass, setNewClass] = useState('Montagem');
  const [newAtividade, setNewAtividade] = useState('VA');

  // Test playground
  const [testPhrase, setTestPhrase] = useState('');

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newVerbo.trim()) return;

    const clean = newVerbo.trim().toLowerCase();
    // Verifica se já existe
    const exists = dictionary.some(d => d.verbo.toLowerCase() === clean);
    if (exists) {
      alert(`O termo "${clean}" já existe no dicionário.`);
      return;
    }

    const updated = [
      { verbo: clean, classificacao: newClass, atividade: newAtividade },
      ...dictionary
    ];
    onUpdateDictionary(updated);

    setNewVerbo('');
  };

  const handleDeleteRule = (verbo) => {
    const updated = dictionary.filter(d => d.verbo.toLowerCase() !== verbo.toLowerCase());
    onUpdateDictionary(updated);
  };

  const filteredRules = dictionary.filter(d =>
    d.verbo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.classificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.atividade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const testResult = testPhrase ? classifyTask(testPhrase, dictionary) : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '780px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                Dicionário Lean & Regras de Auto-Classificação
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Ao digitar uma operação, o sistema detecta os verbos e categoriza automaticamente em VA/NVA/NVAE
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: '1.25rem' }}>
          
          {/* Real-time Test Simulator */}
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              <Sparkles size={14} color="#a855f7" />
              <span>Testador de Reconhecimento em Tempo Real:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Digite qualquer frase (ex: pegar chapa, passar lixa, retrabalhar peça)..."
                value={testPhrase}
                onChange={(e) => setTestPhrase(e.target.value)}
                className="input"
                style={{ fontSize: '0.85rem' }}
              />
              {testResult && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                  <span className={`badge badge-${testResult.atividade.toLowerCase()}`}>
                    {testResult.atividade}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {testResult.classificacao}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add New Rule Form */}
          <form
            onSubmit={handleAddRule}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr auto',
              gap: '0.6rem',
              alignItems: 'center',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px dashed var(--border-strong)',
              background: 'var(--bg-card)'
            }}
          >
            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Verbo / Palavra-Chave
              </label>
              <input
                type="text"
                placeholder="ex: fresar, chanfrar..."
                value={newVerbo}
                onChange={(e) => setNewVerbo(e.target.value)}
                className="input"
                style={{ fontSize: '0.825rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Classificação
              </label>
              <select
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                className="select"
                style={{ fontSize: '0.825rem' }}
              >
                <option value="Solda">Solda</option>
                <option value="Montagem">Montagem</option>
                <option value="Movimentação">Movimentação</option>
                <option value="Acabamento">Acabamento</option>
                <option value="Caminhada">Caminhada</option>
                <option value="Retrabalho">Retrabalho</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Atividade Lean
              </label>
              <select
                value={newAtividade}
                onChange={(e) => setNewAtividade(e.target.value)}
                className="select"
                style={{ fontSize: '0.825rem' }}
              >
                <option value="VA">VA (Valor Agregado)</option>
                <option value="NVA">NVA (Não Agrega)</option>
                <option value="NVAE">NVAE (Desperdício)</option>
              </select>
            </div>

            <div style={{ paddingTop: '1.1rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.55rem 0.85rem' }}>
                <Plus size={15} />
                <span>Adicionar</span>
              </button>
            </div>
          </form>

          {/* Search in Dictionary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Filtrar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm"
                style={{ paddingLeft: '30px' }}
              />
            </div>

            <button
              onClick={() => {
                if (window.confirm('Deseja restaurar as regras padrões da indústria?')) {
                  onResetDictionary();
                }
              }}
              className="btn btn-secondary btn-sm"
              title="Restaurar dicionário padrão"
            >
              <RotateCcw size={13} />
              <span>Restaurar Padrões</span>
            </button>
          </div>

          {/* Dictionary Table */}
          <div style={{ maxHeight: '250px', overflowY: 'auto', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
                  <th style={{ padding: '0.5rem 0.8rem', textAlign: 'left' }}>Verbo / Termo</th>
                  <th style={{ padding: '0.5rem 0.8rem', textAlign: 'left' }}>Classificação</th>
                  <th style={{ padding: '0.5rem 0.8rem', textAlign: 'left' }}>Atividade Lean</th>
                  <th style={{ padding: '0.5rem 0.8rem', textAlign: 'center', width: '60px' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule) => (
                  <tr key={rule.verbo} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.45rem 0.8rem', fontWeight: '700' }}>
                      {rule.verbo}
                    </td>
                    <td style={{ padding: '0.45rem 0.8rem' }}>
                      {rule.classificacao}
                    </td>
                    <td style={{ padding: '0.45rem 0.8rem' }}>
                      <span className={`badge badge-${rule.atividade.toLowerCase()}`}>
                        {rule.atividade}
                      </span>
                    </td>
                    <td style={{ padding: '0.45rem 0.8rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteRule(rule.verbo)}
                        style={{ background: 'none', border: 'none', color: 'var(--nvae-color)', cursor: 'pointer', padding: '3px' }}
                        title="Remover regra"
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

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
}
